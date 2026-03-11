import { IsNotEmpty, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class ID_DTO {
    @ApiProperty({
        name: '_id',
        type: 'Types.ObjectId',
        description: 'id on payload',
        example: "657b5d0e1522c24ccfba0eb5",
        required: true
    })
    @IsNotEmpty()
    @IsMongoId() _id: Types.ObjectId;
}