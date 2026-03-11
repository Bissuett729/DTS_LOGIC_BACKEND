import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class PUSH_DELETE_ARRAY_BY_ID_DTO {
    @ApiProperty({
        name: '_id',
        type: 'Types.ObjectId',
        description: 'id on payload',
        example: "657b5d0e1522c24ccfba0eb5",
        required: true
    })
    @IsNotEmpty()
    @IsMongoId() _id: Types.ObjectId;

    @ApiProperty({
        name: "_mode",
        type: 'boolean',
        description: 'a bolean validation dto',
        example: true
    })
    @IsBoolean() _mode: boolean;
}

export class PUSH_DELETE_ARRAY_BY_IDS_DTO {
    @ApiProperty({
        name: '_id',
        type: 'Types.ObjectId',
        description: 'id on payload',
        example: ["657b5d0e1522c24ccfba0eb5", "657b5d0e1522c24ccfba0eb6"],
        required: true
    })
    @IsNotEmpty()
    @IsMongoId({ each: true })
    @Type(() => Types.ObjectId)
    readonly _id: Types.ObjectId[];

    @ApiProperty({
        name: "_mode",
        type: 'boolean',
        description: 'a bolean validation dto',
        example: true
    })
    @IsBoolean() _mode: boolean;
}

export class PUSH_DELETE_ARRAY_BY_ID_USER_DTO {
    @ApiProperty({
        name: '_id',
        type: 'Types.ObjectId',
        description: 'id on payload',
        example: ["657b5d0e1522c24ccfba0eb5", "657b5d0e1522c24ccfba0eb6"],
        required: true
    })
    @IsNotEmpty()
    @IsMongoId({ each: true })
    @Type(() => String)
    readonly _id: Types.ObjectId[]


    @ApiProperty({
        name: "_mode",
        type: 'boolean',
        description: 'a bolean validation dto',
        example: true
    })
    @IsBoolean() _mode: boolean;
}

export class PUSH_DELETE_ARRAY_BY_STRING_DTO {
    @ApiProperty({
        name: '_string',
        type: 'string',
        description: 'string on payload',
        example: "qwerty",
        required: true
    })
    @IsNotEmpty()
    @IsMongoId() _string: string;

    @ApiProperty({
        name: "_mode",
        type: 'boolean',
        description: 'a bolean validation dto',
        example: true
    })
    @IsBoolean() _mode: boolean;
}