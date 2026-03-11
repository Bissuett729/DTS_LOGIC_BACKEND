import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class boolean_DTO {
    @ApiProperty({
        name: "_boolean",
        type: 'boolean',
        description: 'a bolean validation dto',
        example: true
    })
    @IsBoolean() _boolean: boolean;

}