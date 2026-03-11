import { Global, Module } from '@nestjs/common';
import { GlobalLockService } from './global-lock.service';

@Global()
@Module({
    providers: [GlobalLockService],
    exports: [GlobalLockService],
})
export class LockModule { }