import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IDepartmentRepository } from 'src/apps/dts/Domain';
import { DEPARTMENT_REPO } from '../../../tokens';

@Injectable()
export class GetDepartmentUseCase {
    constructor(
        @Inject(DEPARTMENT_REPO) private readonly departmentRepo: IDepartmentRepository,
    ) { }

    async execute(id: string) {
        const doc = await this.departmentRepo.findById(id);
        if (!doc) throw new NotFoundException(`Department ${id} no encontrado`);
        return doc;
    }

    async executeGetAll(filters?: { active?: boolean }) {
        return this.departmentRepo.findAll(filters);
    }

    async executeGetByName(name: string) {
        return this.departmentRepo.findByName(name);
    }

    async executeGetReasons(id: string) {
        return this.departmentRepo.getReasonsById(id);
    }
}
