import { Inject, Injectable } from '@nestjs/common';
import { IDepartmentRepository } from 'src/apps/dts/Domain';
import { DEPARTMENT_REPO } from '../../../tokens';
import { SocketNotificationService } from 'src/shared/socket.io';

@Injectable()
export class UpdateDepartmentUseCase {
    constructor(
        @Inject(DEPARTMENT_REPO) private readonly departmentRepo: IDepartmentRepository,
        private readonly socketNotification: SocketNotificationService,
    ) { }

    async execute(id: string, dto: Partial<{ department: string; active: boolean }>) {
        const department = await this.departmentRepo.update(id, dto);
        await this.socketNotification.notifyDepartmentUpdated(id, department);
        return department;
    }
}
