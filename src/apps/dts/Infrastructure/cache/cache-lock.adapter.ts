import { Injectable } from "@nestjs/common";

@Injectable()
export class CacheLockService {
    private locks = new Map<string, number>();

    acquire(key: string, ttlMs: number): boolean {
        const now = Date.now();

        // Si existe y aún no expira → es duplicado
        if (this.locks.has(key) && this.locks.get(key)! > now) {
            return false;
        }

        // Crear lock nuevo
        this.locks.set(key, now + ttlMs);
        return true;
    }

    release(key: string): void {
        this.locks.delete(key);
    }
}