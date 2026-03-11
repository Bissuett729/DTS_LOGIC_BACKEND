import { Inject, Injectable } from '@nestjs/common';
import { IDownTimeRepository } from 'src/apps/dts/Domain';
import { DOWN_TIME_REPO } from '../../../tokens';

@Injectable()
export class RemoveClassificationUseCase {
    constructor(
        @Inject(DOWN_TIME_REPO) private readonly downTimeRepo: IDownTimeRepository,
    ) { }

    async execute(id: string, classificationIndex: number) {
        return this.downTimeRepo.removeClassification(id, classificationIndex);
    }
}
