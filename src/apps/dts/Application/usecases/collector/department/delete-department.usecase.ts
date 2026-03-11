import { Inject, Injectable } from '@nestjs/common';
import { IDepartmentRepository } from 'src/apps/dts/Domain';
import { DEPARTMENT_REPO } from '../../../tokens';
import { SocketNotificationService } from 'src/shared/socket.io';

@Injectable()
export class DeleteDepartmentUseCase {
    constructor(
        @Inject(DEPARTMENT_REPO) private readonly departmentRepo: IDepartmentRepository,
        private readonly socketNotification: SocketNotificationService,
    ) { }

    async execute(id: string) {
        const result = await this.departmentRepo.delete(id);
        await this.socketNotification.notifyDepartmentDeleted(id);
        return result;
    }
}
