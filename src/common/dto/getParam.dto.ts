import { IsNotEmpty, IsNumber, IsString, IsBoolean, Min, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GET_PARAM_DTO {
    @ApiProperty({
        name: '_order',
        type: 'boolean',
        description: 'sort data from the database',
        example: true,
        required: true
    })
    @IsNotEmpty()
    @IsBoolean() _order: boolean;

    @ApiProperty({
        name: '_page',
        type: 'number',
        description: 'skip information from database',
        example: 0,
        required: true
    })
    @IsNotEmpty()
    @Min(0)
    @IsNumber() _page: number;

    @ApiProperty({
        name: '_pageSize',
        type: 'number',
        description: 'limit of information from database',
        example: 0,
        required: true
    })
    @IsNotEmpty()
    @Min(0)
    @IsNumber() _pageSize: number;

    @ApiProperty({
        name: '_active',
        type: 'boolean',
        description: 'active or inactive information',
        example: true,
        required: true
    })
    @IsNotEmpty()
    @IsBoolean() _active: boolean;

    @ApiProperty({
        name: '_search',
        type: 'string',
        description: 'search specific information from database',
        example: "_",
        required: false
    })
    @IsOptional()
    @IsString() _search: string = "_";

    @ApiProperty({
        name: '_rangeStartDate',
        type: Date,
        description: 'Range of start date',
        example: true,
        required: false
    })
    @IsOptional()
    @IsDateString({}, { message: 'format date: ISO 8601 (YYYY-MM-DDTHH:MM:SS.sssZ).' })
    readonly _rangeStartDate: Date = null;

    @ApiProperty({
        name: '_rangeFinishDate',
        type: Date,
        description: 'Range of end date',
        example: true,
        required: false
    })
    @IsOptional()
    @IsDateString({}, { message: 'format date: ISO 8601 (YYYY-MM-DDTHH:MM:SS.sssZ).' })
    readonly _rangeFinishDate: Date = null;

} // end class