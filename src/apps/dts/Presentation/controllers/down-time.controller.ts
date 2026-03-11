import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    CreateDownTimeUseCase,
    GetDownTimeUseCase,
    UpdateDownTimeUseCase,
    DeleteDownTimeUseCase,
    AddClassificationUseCase,
    RemoveClassificationUseCase,
} from '../../Application/usecases/collector/down-time';
import {
    AddClassificationDto,
    CreateDownTimeDto,
    DashboardStatsQueryDto,
    DateRangeDto,
    FilterDownTimeDto,
    HourlyReportQueryDto,
    UpdateDownTimeDto,
    WeeklyTrendsQueryDto,
} from '../dto';

@ApiBearerAuth('JWT-auth')
@ApiTags('Down Time')
@Controller('v1/down-time')
export class DownTimeController {

    constructor(
        private readonly createUC: CreateDownTimeUseCase,
        private readonly getUC: GetDownTimeUseCase,
        private readonly updateUC: UpdateDownTimeUseCase,
        private readonly deleteUC: DeleteDownTimeUseCase,
        private readonly addClassificationUC: AddClassificationUseCase,
        private readonly removeClassificationUC: RemoveClassificationUseCase,
    ) { }

    // ──────────────── CRUD ────────────────────────────────────────────────────

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo registro de downtime' })
    @ApiResponse({ status: 201, description: 'Registro creado exitosamente' })
    create(@Body() dto: CreateDownTimeDto) {
        return this.createUC.execute(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los registros de downtime (paginado y filtrable)' })
    @ApiResponse({ status: 200, description: 'Lista de registros' })
    findAll(@Query() filters: FilterDownTimeDto) {
        return this.getUC.executeGetAll(filters);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un registro por ID' })
    @ApiParam({ name: 'id', description: 'MongoDB ObjectId del downtime' })
    @ApiResponse({ status: 200, description: 'Registro encontrado' })
    @ApiResponse({ status: 404, description: 'Registro no encontrado' })
    findById(@Param('id') id: string) {
        return this.getUC.execute(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un registro de downtime' })
    @ApiParam({ name: 'id', description: 'MongoDB ObjectId del downtime' })
    @ApiResponse({ status: 200, description: 'Registro actualizado' })
    update(@Param('id') id: string, @Body() dto: UpdateDownTimeDto) {
        return this.updateUC.execute(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un registro de downtime' })
    @ApiParam({ name: 'id', description: 'MongoDB ObjectId del downtime' })
    @ApiResponse({ status: 200, description: 'Registro eliminado' })
    delete(@Param('id') id: string) {
        return this.deleteUC.execute(id);
    }

    // ──────────────── Filters ─────────────────────────────────────────────────

    @Get('filter/week/:week')
    @ApiOperation({ summary: 'Obtener downtimes por semana' })
    @ApiParam({ name: 'week', type: Number, description: 'Número de semana' })
    findByWeek(@Param('week') week: string) {
        return this.getUC.executeGetByWeek(+week);
    }

    @Get('filter/shift/:shift')
    @ApiOperation({ summary: 'Obtener downtimes por turno' })
    @ApiParam({ name: 'shift', description: 'Nombre del turno' })
    findByShift(@Param('shift') shift: string) {
        return this.getUC.executeGetByShift(shift);
    }

    @Get('filter/line/:line')
    @ApiOperation({ summary: 'Obtener downtimes por línea' })
    @ApiParam({ name: 'line', description: 'Nombre de la línea' })
    findByLine(@Param('line') line: string) {
        return this.getUC.executeGetByLine(line);
    }

    @Post('filter/date-range')
    @ApiOperation({ summary: 'Obtener downtimes en un rango de fechas' })
    @ApiResponse({ status: 200, description: 'Lista de registros en el rango' })
    findByDateRange(@Body() dto: DateRangeDto) {
        return this.getUC.executeGetByDateRange(dto.startTime, dto.endTime);
    }

    // ──────────────── Classification ──────────────────────────────────────────

    @Post(':id/classification')
    @ApiOperation({ summary: 'Agregar una clasificación al downtime' })
    @ApiParam({ name: 'id', description: 'MongoDB ObjectId del downtime' })
    @ApiResponse({ status: 201, description: 'Clasificación agregada' })
    addClassification(@Param('id') id: string, @Body() dto: AddClassificationDto) {
        return this.addClassificationUC.execute(id, dto);
    }

    @Delete(':id/classification/:index')
    @ApiOperation({ summary: 'Eliminar una clasificación por índice' })
    @ApiParam({ name: 'id', description: 'MongoDB ObjectId del downtime' })
    @ApiParam({ name: 'index', type: Number, description: 'Índice del array de classification (0-based)' })
    @ApiResponse({ status: 200, description: 'Clasificación eliminada' })
    removeClassification(@Param('id') id: string, @Param('index') index: string) {
        return this.removeClassificationUC.execute(id, +index);
    }

    // ──────────────── Analytics ───────────────────────────────────────────────

    @Get('analytics/dashboard')
    @ApiOperation({ summary: 'KPIs, pareto, distribución por depto, heatmap y tendencia semanal' })
    @ApiResponse({ status: 200, description: 'Datos del dashboard' })
    getDashboard(@Query() query: DashboardStatsQueryDto) {
        return this.getUC.executeGetDashboardStats({ line: query.line, stage: query.stage });
    }

    @Get('analytics/hourly')
    @ApiOperation({ summary: 'Reporte hora × hora para una fecha y línea' })
    @ApiResponse({ status: 200, description: 'Registros del día ordenados por hora' })
    getHourlyReport(@Query() query: HourlyReportQueryDto) {
        return this.getUC.executeGetHourlyReport(query.date, { line: query.line, stage: query.stage });
    }

    @Get('analytics/weekly-trends')
    @ApiOperation({ summary: 'Tendencia semanal de DT y comparativa de causas' })
    @ApiResponse({ status: 200, description: 'Datos de tendencias semanales' })
    getWeeklyTrends(@Query() query: WeeklyTrendsQueryDto) {
        return this.getUC.executeGetWeeklyTrends({
            numWeeks: query.numWeeks,
            line:     query.line,
            stage:    query.stage,
            dept:     query.dept,
        });
    }
}
