import { Module } from '@nestjs/common';
import { PresentationModule } from './Presentation/presentation.module';

@Module({
    imports: [PresentationModule],
})
export class DTSModule { }