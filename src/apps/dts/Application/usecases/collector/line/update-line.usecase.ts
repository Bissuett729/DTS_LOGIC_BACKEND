import { Inject, Injectable } from '@nestjs/common';
import { ILineRepository } from 'src/apps/dts/Domain';
import { LINE_REPO } from '../../../tokens';
import { SocketNotificationService } from 'src/shared/socket.io';

@Injectable()
export class UpdateLineUseCase {
    constructor(
        @Inject(LINE_REPO) private readonly lineRepo: ILineRepository,
        private readonly socketNotification: SocketNotificationService,
    ) { }

    async execute(id: string, dto: Partial<{ name: string; standardOutput: number; active: boolean }>) {
        const line = await this.lineRepo.update(id, dto);
        await this.socketNotification.notifyLineUpdated(id, line);
        return line;
    }
}
