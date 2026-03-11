import { Inject, Injectable } from '@nestjs/common';
import { ILineRepository } from 'src/apps/dts/Domain';
import { LINE_REPO } from '../../../tokens';
import { SocketNotificationService } from 'src/shared/socket.io';

@Injectable()
export class DeleteLineUseCase {
    constructor(
        @Inject(LINE_REPO) private readonly lineRepo: ILineRepository,
        private readonly socketNotification: SocketNotificationService,
    ) { }

    async execute(id: string) {
        const result = await this.lineRepo.delete(id);
        await this.socketNotification.notifyLineDeleted(id);
        return result;
    }
}
