import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import Redis from 'ioredis';
import { Connection } from 'mongoose';
import type { Env } from '../config/env.schema';
import { PrismaService } from '../prisma/prisma.service';

export type HealthComponent = {
  status: 'up' | 'down' | 'skipped';
  latencyMs?: number;
  error?: string;
};

@Injectable()
export class HealthService implements OnModuleDestroy {
  private redis: Redis | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService<Env, true>,
    @InjectConnection() private readonly mongo: Connection,
  ) {}

  private getRedis(): Redis | null {
    const url = this.config.get('REDIS_URL', { infer: true });
    if (!url) return null;
    if (!this.redis) {
      this.redis = new Redis(url, {
        maxRetriesPerRequest: 1,
        connectTimeout: 2000,
        lazyConnect: true,
      });
    }
    return this.redis;
  }

  async getLiveness() {
    return {
      status: 'ok',
      service: 'mediconnect-api',
      timestamp: new Date().toISOString(),
    };
  }

  async getReadiness(): Promise<{
    status: 'ready' | 'degraded';
    checks: Record<string, HealthComponent>;
  }> {
    const checks: Record<string, HealthComponent> = {
      mongodb: await this.checkMongo(),
      postgres: await this.checkPostgres(),
      redis: await this.checkRedis(),
    };

    const requiredUp = checks.mongodb.status === 'up';
    return {
      status: requiredUp ? 'ready' : 'degraded',
      checks,
    };
  }

  private async checkMongo(): Promise<HealthComponent> {
    const start = Date.now();
    try {
      const state = this.mongo.readyState;
      if (state !== 1) {
        return { status: 'down', error: `Mongo connection state=${state}` };
      }
      await this.mongo.db?.admin().ping();
      return { status: 'up', latencyMs: Date.now() - start };
    } catch (error) {
      return {
        status: 'down',
        error: error instanceof Error ? error.message : 'MongoDB unreachable',
      };
    }
  }

  private async checkPostgres(): Promise<HealthComponent> {
    if (!this.config.get('DATABASE_URL', { infer: true })) {
      return { status: 'skipped' };
    }
    const start = Date.now();
    try {
      await this.prisma.ping();
      return { status: 'up', latencyMs: Date.now() - start };
    } catch (error) {
      return {
        status: 'down',
        error: error instanceof Error ? error.message : 'PostgreSQL unreachable',
      };
    }
  }

  private async checkRedis(): Promise<HealthComponent> {
    const client = this.getRedis();
    if (!client) return { status: 'skipped' };
    const start = Date.now();
    try {
      if (client.status !== 'ready') {
        await client.connect();
      }
      await client.ping();
      return { status: 'up', latencyMs: Date.now() - start };
    } catch (error) {
      return {
        status: 'down',
        error: error instanceof Error ? error.message : 'Redis unreachable',
      };
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
    }
  }
}
