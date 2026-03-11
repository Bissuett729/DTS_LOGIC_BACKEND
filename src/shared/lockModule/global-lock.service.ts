import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class GlobalLockService {
    private readonly locks = new Set<string>();

    acquire(key: string): boolean {
        if (this.locks.has(key)) return false;
        this.locks.add(key);
        return true;
    }

    release(key: string): void {
        this.locks.delete(key);
    }

    async withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
        if (!this.acquire(key)) {
            throw new ConflictException(`Process already running for key: ${key}`);
        }

        try {
            return await fn();
        } finally {
            this.release(key);
        }
    }
}