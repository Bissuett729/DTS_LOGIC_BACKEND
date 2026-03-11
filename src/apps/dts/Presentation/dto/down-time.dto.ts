import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

export class ClassificationDto {
    @ApiProperty({ example: 30, description: 'Minutos de downtime generado' })
    @IsNumber()
    downTimeGenerated: number;

    @ApiProperty({ example: 'Mantenimiento', description: 'Departamento responsable' })
    @IsString()
    department: string;

    @ApiProperty({ example: 'Falla mecánica', description: 'Razón del downtime' })
    @IsString()
    reason: string;
}

export class CreateDownTimeDto {
    @ApiProperty({ example: '2026-03-02T06:00:00.000Z' })
    @Type(() => Date)
    @IsDate()
    startTime: Date;

    @ApiProperty({ example: '2026-03-02T07:00:00.000Z' })
    @Type(() => Date)
    @IsDate()
    endTime: Date;

    @ApiPropertyOptional({ example: 9 })
    @IsOptional()
    @IsNumber()
    week?: number;

    @ApiPropertyOptional({ example: 'Morning' })
    @IsOptional()
    @IsString()
    shift?: string;

    @ApiPropertyOptional({ example: 'Línea 1' })
    @IsOptional()
    @IsString()
    line?: string;

    @ApiPropertyOptional({ example: 'FA' })
    @IsOptional()
    @IsString()
    stage?: string;

    @ApiPropertyOptional({ example: 'Juan Pérez' })
    @IsOptional()
    @IsString()
    supervisor?: string;

    @ApiPropertyOptional({ example: 'Maria López' })
    @IsOptional()
    @IsString()
    registeredBy?: string;

    @ApiPropertyOptional({ example: 100 })
    @IsOptional()
    @IsNumber()
    standardOutput?: number;

    @ApiPropertyOptional({ example: 78 })
    @IsOptional()
    @IsNumber()
    currentOutput?: number;

    @ApiPropertyOptional({ example: 78 })
    @IsOptional()
    @IsNumber()
    efficiency?: number;

    @ApiPropertyOptional({ example: 60 })
    @IsOptional()
    @IsNumber()
    downTimeGenerated?: number;

    @ApiPropertyOptional({ example: 10 })
    @IsOptional()
    @IsNumber()
    downTimeUnreported?: number;

    @ApiPropertyOptional({ example: 50 })
    @IsOptional()
    @IsNumber()
    downTimeReported?: number;

    @ApiPropertyOptional({ type: [ClassificationDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ClassificationDto)
    classification?: ClassificationDto[];
}

export class UpdateDownTimeDto {
    @ApiPropertyOptional({ example: '2026-03-02T06:00:00.000Z' })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    startTime?: Date;

    @ApiPropertyOptional({ example: '2026-03-02T07:00:00.000Z' })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    endTime?: Date;

    @ApiPropertyOptional({ example: 9 })
    @IsOptional()
    @IsNumber()
    week?: number;

    @ApiPropertyOptional({ example: 'Morning' })
    @IsOptional()
    @IsString()
    shift?: string;

    @ApiPropertyOptional({ example: 'Línea 1' })
    @IsOptional()
    @IsString()
    line?: string;

    @ApiPropertyOptional({ example: 'FA' })
    @IsOptional()
    @IsString()
    stage?: string;

    @ApiPropertyOptional({ example: 'Juan Pérez' })
    @IsOptional()
    @IsString()
    supervisor?: string;

    @ApiPropertyOptional({ example: 'Maria López' })
    @IsOptional()
    @IsString()
    registeredBy?: string;

    @ApiPropertyOptional({ example: 100 })
    @IsOptional()
    @IsNumber()
    standardOutput?: number;

    @ApiPropertyOptional({ example: 78 })
    @IsOptional()
    @IsNumber()
    currentOutput?: number;

    @ApiPropertyOptional({ example: 78 })
    @IsOptional()
    @IsNumber()
    efficiency?: number;

    @ApiPropertyOptional({ example: 60 })
    @IsOptional()
    @IsNumber()
    downTimeGenerated?: number;

    @ApiPropertyOptional({ example: 10 })
    @IsOptional()
    @IsNumber()
    downTimeUnreported?: number;

    @ApiPropertyOptional({ example: 50 })
    @IsOptional()
    @IsNumber()
    downTimeReported?: number;
}

export class AddClassificationDto extends ClassificationDto {}

export class FilterDownTimeDto {
    @ApiPropertyOptional({ example: 0 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page?: number;

    @ApiPropertyOptional({ example: 20 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit?: number;

    @ApiPropertyOptional({ example: 9 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    week?: number;

    @ApiPropertyOptional({ example: 'Morning' })
    @IsOptional()
    @IsString()
    shift?: string;

    @ApiPropertyOptional({ example: 'Línea 1' })
    @IsOptional()
    @IsString()
    line?: string;

    @ApiPropertyOptional({ example: 'FA' })
    @IsOptional()
    @IsString()
    stage?: string;
}

export class DateRangeDto {
    @ApiProperty({ example: '2026-03-01T00:00:00.000Z' })
    @Type(() => Date)
    @IsDate()
    startTime: Date;

    @ApiProperty({ example: '2026-03-02T23:59:59.999Z' })
    @Type(() => Date)
    @IsDate()
    endTime: Date;
}

export class HourlyReportQueryDto {
    @ApiProperty({ example: '2026-02-01', description: 'Fecha del reporte (YYYY-MM-DD o ISO)' })
    @Type(() => Date)
    @IsDate()
    date: Date;

    @ApiPropertyOptional({ example: 'FA HY' })
    @IsOptional()
    @IsString()
    line?: string;

    @ApiPropertyOptional({ example: 'FA' })
    @IsOptional()
    @IsString()
    stage?: string;
}

export class DashboardStatsQueryDto {
    @ApiPropertyOptional({ example: 'FA HY' })
    @IsOptional()
    @IsString()
    line?: string;

    @ApiPropertyOptional({ example: 'FA' })
    @IsOptional()
    @IsString()
    stage?: string;
}

export class WeeklyTrendsQueryDto {
    @ApiPropertyOptional({ example: 8, description: 'Número de semanas a incluir (máx 26)' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    numWeeks?: number;

    @ApiPropertyOptional({ example: 'FA HY' })
    @IsOptional()
    @IsString()
    line?: string;

    @ApiPropertyOptional({ example: 'FA' })
    @IsOptional()
    @IsString()
    stage?: string;

    @ApiPropertyOptional({ example: 'MFG' })
    @IsOptional()
    @IsString()
    dept?: string;
}
