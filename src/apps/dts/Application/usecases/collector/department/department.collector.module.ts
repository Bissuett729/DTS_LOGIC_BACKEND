import { Module } from '@nestjs/common';
import * as useCases from '.';
import { InfrastructureModule } from 'src/apps/dts/Infrastructure/Infrastructure.module';

const sharedProviders = [
    useCases.CreateDepartmentUseCase,
    useCases.GetDepartmentUseCase,
    useCases.UpdateDepartmentUseCase,
    useCases.DeleteDepartmentUseCase,
    useCases.AddReasonUseCase,
    useCases.RemoveReasonUseCase,
];

@Module({
    imports: [InfrastructureModule],
    providers: [...sharedProviders],
    exports: [...sharedProviders],
})
export class DepartmentCollectorModule { }
