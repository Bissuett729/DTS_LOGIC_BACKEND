import { Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CachingMemoryAdapter {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

    async setCache(key: string, value: any, ttl?: number): Promise<void> {
        await this.cacheManager.set(
            key,
            value,
            ttl
        );
    }

    async getCache<T = any>(key: string): Promise<T | null> {
        return (await this.cacheManager.get(key)) ?? null;
    }

    async deleteCache(key: string): Promise<void> {
        await this.cacheManager.del(key);
    }
}