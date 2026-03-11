import { Module } from '@nestjs/common';
import * as useCases from '.';
import { InfrastructureModule } from 'src/apps/dts/Infrastructure/Infrastructure.module';

const sharedProviders = [
    useCases.CreateLineUseCase,
    useCases.GetLineUseCase,
    useCases.UpdateLineUseCase,
    useCases.DeleteLineUseCase,
    useCases.AddStageUseCase,
    useCases.RemoveStageUseCase,
    useCases.UpdateHourlyStandardUseCase,
];

@Module({
    imports: [InfrastructureModule],
    providers: [...sharedProviders],
    exports: [...sharedProviders],
})
export class LineCollectorModule { }
