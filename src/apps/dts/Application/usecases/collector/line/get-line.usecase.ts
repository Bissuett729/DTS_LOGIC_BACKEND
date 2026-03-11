import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ILineRepository } from 'src/apps/dts/Domain';
import { LINE_REPO } from '../../../tokens';

@Injectable()
export class GetLineUseCase {
    constructor(
        @Inject(LINE_REPO) private readonly lineRepo: ILineRepository,
    ) { }

    async execute(id: string) {
        const doc = await this.lineRepo.findById(id);
        if (!doc) throw new NotFoundException(`Line ${id} no encontrada`);
        return doc;
    }

    async executeGetAll(filters?: { active?: boolean }) {
        return this.lineRepo.findAll(filters);
    }

    async executeGetByName(name: string) {
        return this.lineRepo.findByName(name);
    }

    async executeGetStageHourlyStandards(lineId: string, stageId: string) {
        return this.lineRepo.getStageHourlyStandards(lineId, stageId);
    }
}
