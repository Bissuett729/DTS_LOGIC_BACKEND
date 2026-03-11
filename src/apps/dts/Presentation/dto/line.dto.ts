import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateStageDto {
  @ApiProperty({ example: 'FA' })
  @IsString()
  name: string;
}

export class CreateLineDto {
  @ApiProperty({ example: 'Línea 1' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  standardOutput?: number;

  @ApiPropertyOptional({
    type: [CreateStageDto],
    description: 'Acepta strings ["FA","FT"] u objetos [{"name":"FA"}]',
  })
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Transform(({ value }) => {
    if (!Array.isArray(value)) return value;
    // Convierte strings sueltos → { name: string }
    return value.map((s) => (typeof s === 'string' ? { name: s } : s));
  })
  @Type(() => CreateStageDto)
  stages?: CreateStageDto[];
}

export class UpdateLineDto {
  @ApiPropertyOptional({ example: 'Línea 1' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 80 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  standardOutput?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class AddStageDto {
  @ApiProperty({ example: 'FT' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 50,
    description: 'Standard por defecto para los 24 slots horarios',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  defaultStandard?: number;
}

export class HourlySlotDto {
  @ApiProperty({ example: 8, description: 'Hora de inicio (0-23)' })
  @IsNumber()
  @Min(0)
  startHour: number;

  @ApiProperty({ example: 75 })
  @IsNumber()
  @Min(0)
  standard: number;
}

export class UpdateHourlyStandardDto extends HourlySlotDto {}

export class UpdateAllHourlyStandardsDto {
  @ApiProperty({ type: [HourlySlotDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HourlySlotDto)
  standards: HourlySlotDto[];
}
