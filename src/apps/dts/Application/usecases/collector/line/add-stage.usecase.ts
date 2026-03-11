import { Inject, Injectable } from '@nestjs/common';
import { ILineRepository } from 'src/apps/dts/Domain';
import { LINE_REPO } from '../../../tokens';
import { SocketNotificationService } from 'src/shared/socket.io';

@Injectable()
export class AddStageUseCase {
    constructor(
        @Inject(LINE_REPO) private readonly lineRepo: ILineRepository,
        private readonly socketNotification: SocketNotificationService,
    ) { }

    async execute(lineId: string, stageName: string, defaultStandard?: number) {
        const line = await this.lineRepo.addStage(lineId, stageName, defaultStandard);
        await this.socketNotification.notifyLineUpdated(lineId, line);
        return line;
    }
}
