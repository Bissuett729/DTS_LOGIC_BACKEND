import { Inject, Injectable } from '@nestjs/common';
import { ILineRepository } from 'src/apps/dts/Domain';
import { LINE_REPO } from '../../../tokens';
import { SocketNotificationService } from 'src/shared/socket.io';

@Injectable()
export class RemoveStageUseCase {
    constructor(
        @Inject(LINE_REPO) private readonly lineRepo: ILineRepository,
        private readonly socketNotification: SocketNotificationService,
    ) { }

    async execute(lineId: string, stageId: string) {
        const line = await this.lineRepo.removeStage(lineId, stageId);
        await this.socketNotification.notifyLineUpdated(lineId, line);
        return line;
    }
}
