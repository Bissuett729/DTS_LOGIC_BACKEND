import { Inject, Injectable } from '@nestjs/common';
import { IDownTimeRepository } from 'src/apps/dts/Domain';
import { DOWN_TIME_REPO } from '../../../tokens';
import { SocketNotificationService } from 'src/shared/socket.io';

@Injectable()
export class UpdateDownTimeUseCase {
    constructor(
        @Inject(DOWN_TIME_REPO) private readonly downTimeRepo: IDownTimeRepository,
        private readonly socketNotification: SocketNotificationService,
    ) { }

    async execute(id: string, dto: Partial<Record<string, any>>) {
        const downTime = await this.downTimeRepo.update(id, dto);
        await this.socketNotification.notifyDownTimeUpdated(id, downTime);
        return downTime;
    }
}
