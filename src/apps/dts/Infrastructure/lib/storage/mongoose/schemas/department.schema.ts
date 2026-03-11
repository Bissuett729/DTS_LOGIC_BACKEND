import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'Department', timestamps: true })
export class Department extends Document {

    @Prop({ type: String, required: true, trim: true, unique: true })
    department: string;

    @Prop({ type: [String], default: [] })
    reasons: string[];

    @Prop({ type: Boolean, default: true })
    active: boolean;

}

export const DepartmentSchema = SchemaFactory.createForClass(Department);

DepartmentSchema.virtual('reasonsCount').get(function () {
    return this.reasons?.length ?? 0;
});