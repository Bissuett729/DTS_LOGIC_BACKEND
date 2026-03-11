import { Inject, Injectable } from '@nestjs/common';
import { ILineRepository } from 'src/apps/dts/Domain';
import { LINE_REPO } from '../../../tokens';

@Injectable()
export class UpdateHourlyStandardUseCase {
    constructor(
        @Inject(LINE_REPO) private readonly lineRepo: ILineRepository,
    ) { }

    /** Update a single hourly slot */
    async execute(lineId: string, stageId: string, startHour: number, standard: number) {
        return this.lineRepo.updateHourlyStandard(lineId, stageId, startHour, standard);
    }

    /** Bulk update all hourly slots at once */
    async executeBulk(lineId: string, stageId: string, standards: { startHour: number; standard: number }[]) {
        return this.lineRepo.updateAllHourlyStandards(lineId, stageId, standards);
    }
}
