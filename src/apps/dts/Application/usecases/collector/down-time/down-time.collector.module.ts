import { Module } from '@nestjs/common';
import * as useCases from '.';
import { InfrastructureModule } from 'src/apps/dts/Infrastructure/Infrastructure.module';

const sharedProviders = [
    useCases.CreateDownTimeUseCase,
    useCases.GetDownTimeUseCase,
    useCases.UpdateDownTimeUseCase,
    useCases.DeleteDownTimeUseCase,
    useCases.AddClassificationUseCase,
    useCases.RemoveClassificationUseCase,
];

@Module({
    imports: [InfrastructureModule],
    providers: [...sharedProviders],
    exports: [...sharedProviders],
})
export class DownTimeCollectorModule { }
