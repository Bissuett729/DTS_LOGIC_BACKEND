import { Module } from '@nestjs/common';
import { ApplicationModule } from '../Application/application.module';
import { DownTimeController } from './controllers/down-time.controller';
import { DepartmentController } from './controllers/department.controller';
import { LineController } from './controllers/line.controller';

@Module({
  imports: [ApplicationModule],
  controllers: [DownTimeController, DepartmentController, LineController],
  providers: [],
  exports: [],
})
export class PresentationModule { }