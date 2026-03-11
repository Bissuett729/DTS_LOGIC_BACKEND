import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateDepartmentDto {
    @ApiProperty({ example: 'Mantenimiento' })
    @IsString()
    department: string;

    @ApiPropertyOptional({ example: ['Falla mecánica', 'Falla eléctrica'] })
    @IsOptional()
    @IsString({ each: true })
    reasons?: string[];
}

export class UpdateDepartmentDto {
    @ApiPropertyOptional({ example: 'Mantenimiento' })
    @IsOptional()
    @IsString()
    department?: string;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    active?: boolean;
}

export class AddReasonDto {
    @ApiProperty({ example: 'Falla mecánica' })
    @IsString()
    reason: string;
}

export class RemoveReasonDto {
    @ApiProperty({ example: 'Falla mecánica' })
    @IsString()
    reason: string;
}
