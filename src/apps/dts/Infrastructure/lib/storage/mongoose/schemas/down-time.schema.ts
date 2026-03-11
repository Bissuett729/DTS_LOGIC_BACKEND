import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ClassificationSchema, Classification } from './classification.schema';

@Schema({ collection: 'Down Time', timestamps: true })
export class DownTime extends Document {

    @Prop({ type: Date })
    startTime: Date;

    @Prop({ type: Date })
    endTime: Date;

    @Prop({ type: Number })
    week: number;

    @Prop({ type: String })
    shift: string;

    @Prop({ type: String })
    line: string;

    @Prop({ type: String })
    stage: string;

    @Prop({ type: String })
    supervisor: string;

    @Prop({ type: String })
    registeredBy: string;

    @Prop({ type: Number })
    standardOutput: number;

    @Prop({ type: Number })
    currentOutput: number;

    @Prop({ type: Number })
    efficiency: number;

    @Prop({ type: Number })
    downTimeGenerated: number;

    @Prop({ type: Number })
    downTimeUnreported: number;

    @Prop({ type: Number })
    downTimeReported: number;

    @Prop({ type: [ClassificationSchema], default: [] })
    classification: Classification[];

}

export const DownTimeSchema = SchemaFactory.createForClass(DownTime);