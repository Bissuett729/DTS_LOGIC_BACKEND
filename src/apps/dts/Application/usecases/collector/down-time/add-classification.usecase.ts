import { Inject, Injectable } from '@nestjs/common';
import { IDownTimeRepository } from 'src/apps/dts/Domain';
import { DOWN_TIME_REPO } from '../../../tokens';

@Injectable()
export class AddClassificationUseCase {
    constructor(
        @Inject(DOWN_TIME_REPO) private readonly downTimeRepo: IDownTimeRepository,
    ) { }

    async execute(id: string, classification: { downTimeGenerated: number; department: string; reason: string }) {
        return this.downTimeRepo.addClassification(id, classification);
    }
}
