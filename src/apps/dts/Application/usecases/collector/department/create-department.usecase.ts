import { Inject, Injectable } from '@nestjs/common';
import { IDepartmentRepository } from 'src/apps/dts/Domain';
import { DEPARTMENT_REPO } from '../../../tokens';
import { SocketNotificationService } from 'src/shared/socket.io';

@Injectable()
export class CreateDepartmentUseCase {
    constructor(
        @Inject(DEPARTMENT_REPO) private readonly departmentRepo: IDepartmentRepository,
        private readonly socketNotification: SocketNotificationService,
    ) { }

    async execute(dto: { department: string; reasons?: string[] }) {
        const department = await this.departmentRepo.create(dto);
        await this.socketNotification.notifyDepartmentCreated(department);
        return department;
    }
}
