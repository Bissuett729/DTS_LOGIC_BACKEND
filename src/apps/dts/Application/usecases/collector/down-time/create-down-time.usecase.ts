import { Inject, Injectable } from '@nestjs/common';
import { IDownTimeRepository } from 'src/apps/dts/Domain';
import { DOWN_TIME_REPO } from '../../../tokens';
import { SocketNotificationService } from 'src/shared/socket.io';

@Injectable()
export class CreateDownTimeUseCase {
    constructor(
        @Inject(DOWN_TIME_REPO) private readonly downTimeRepo: IDownTimeRepository,
        private readonly socketNotification: SocketNotificationService,
    ) { }

    async execute(dto: Partial<Record<string, any>>) {
        const downTime = await this.downTimeRepo.create(dto);
        await this.socketNotification.notifyDownTimeCreated(downTime);
        return downTime;
    }
}
