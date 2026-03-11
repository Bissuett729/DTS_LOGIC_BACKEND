import { Inject, Injectable } from '@nestjs/common';
import { ILineRepository } from 'src/apps/dts/Domain';
import { LINE_REPO } from '../../../tokens';
import { SocketNotificationService } from 'src/shared/socket.io';

@Injectable()
export class CreateLineUseCase {
    constructor(
        @Inject(LINE_REPO) private readonly lineRepo: ILineRepository,
        private readonly socketNotification: SocketNotificationService,
    ) { }

    async execute(dto: { name: string; standardOutput?: number; stages?: { name: string }[] }) {
        const line = await this.lineRepo.create(dto);
        await this.socketNotification.notifyLineCreated(line);
        return line;
    }
}
