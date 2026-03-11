import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { DatabaseModule } from './lib/storage/mongoose/database.module';
import { SocketModule, LockModule } from 'src/shared';

@Module({
    imports: [
        DatabaseModule,
        CacheModule.register({ ttl: 30, max: 1000 }),
        SocketModule,
        LockModule
    ],
    exports: [DatabaseModule],
})
export class InfrastructureModule { }