import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateShiftDto {
    @ApiProperty({ example: 'Morning' })
    @IsString()
    label: string;

    @ApiProperty({ example: '2026-03-02T06:00:00.000Z' })
    @Type(() => Date)
    @IsDate()
    startTime: Date;

    @ApiProperty({ example: '2026-03-02T14:00:00.000Z' })
    @Type(() => Date)
    @IsDate()
    endTime: Date;

    @ApiPropertyOptional({ example: 480, description: 'Duración en minutos (se calcula automáticamente si no se envía)' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    duration?: number;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    active?: boolean;
}

export class UpdateShiftDto {
    @ApiPropertyOptional({ example: 'Afternoon' })
    @IsOptional()
    @IsString()
    label?: string;

    @ApiPropertyOptional({ example: '2026-03-02T14:00:00.000Z' })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    startTime?: Date;

    @ApiPropertyOptional({ example: '2026-03-02T22:00:00.000Z' })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    endTime?: Date;

    @ApiPropertyOptional({ example: 480 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    duration?: number;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    active?: boolean;
}
