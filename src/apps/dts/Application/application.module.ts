import { Module } from '@nestjs/common';
import {
    DownTimeCollectorModule,
    DepartmentCollectorModule,
    LineCollectorModule,
} from './usecases/collector';

@Module({
    imports: [
        DownTimeCollectorModule,
        DepartmentCollectorModule,
        LineCollectorModule,
    ],
    exports: [
        DownTimeCollectorModule,
        DepartmentCollectorModule,
        LineCollectorModule,
    ],
})
export class ApplicationModule { }
