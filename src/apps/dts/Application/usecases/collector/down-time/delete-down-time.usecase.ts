import { Inject, Injectable } from '@nestjs/common';
import { IDownTimeRepository } from 'src/apps/dts/Domain';
import { DOWN_TIME_REPO } from '../../../tokens';
import { SocketNotificationService } from 'src/shared/socket.io';

@Injectable()
export class DeleteDownTimeUseCase {
    constructor(
        @Inject(DOWN_TIME_REPO) private readonly downTimeRepo: IDownTimeRepository,
        private readonly socketNotification: SocketNotificationService,
    ) { }

    async execute(id: string) {
        const result = await this.downTimeRepo.delete(id);
        await this.socketNotification.notifyDownTimeDeleted(id);
        return result;
    }
}
