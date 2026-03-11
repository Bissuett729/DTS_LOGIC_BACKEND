import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Classification {
    @Prop({ type: Number })
    downTimeGenerated: number;

    @Prop({ type: String })
    department: string;

    @Prop({ type: String })
    reason: string;
}

export const ClassificationSchema = SchemaFactory.createForClass(Classification);