import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import type { Env } from '../config/env.schema';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private connected = false;

  constructor(private readonly config: ConfigService<Env, true>) {
    super();
  }

  async onModuleInit(): Promise<void> {
    const url = this.config.get('DATABASE_URL', { infer: true });
    if (!url) {
      this.logger.warn('DATABASE_URL not set — Prisma/PostgreSQL disabled (MongoDB is primary)');
      return;
    }
    try {
      await this.$connect();
      this.connected = true;
      this.logger.log('PostgreSQL connected via Prisma');
    } catch (error) {
      this.logger.warn(
        `PostgreSQL unavailable — continuing with MongoDB only (${error instanceof Error ? error.message : 'error'})`,
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.connected) {
      await this.$disconnect();
    }
  }

  async ping(): Promise<void> {
    if (!this.connected) {
      throw new Error('PostgreSQL not connected');
    }
    await this.$queryRaw`SELECT 1`;
  }

  isConnected(): boolean {
    return this.connected;
  }
}
