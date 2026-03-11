import { Inject, Injectable } from '@nestjs/common';
import { IDepartmentRepository } from 'src/apps/dts/Domain';
import { DEPARTMENT_REPO } from '../../../tokens';
import { SocketNotificationService } from 'src/shared/socket.io';

@Injectable()
export class RemoveReasonUseCase {
    constructor(
        @Inject(DEPARTMENT_REPO) private readonly departmentRepo: IDepartmentRepository,
        private readonly socketNotification: SocketNotificationService,
    ) { }

    async execute(id: string, reason: string) {
        const department = await this.departmentRepo.removeReason(id, reason);
        await this.socketNotification.notifyDepartmentUpdated(id, department);
        return department;
    }
}
