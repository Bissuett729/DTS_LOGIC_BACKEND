import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    CreateLineUseCase,
    GetLineUseCase,
    UpdateLineUseCase,
    DeleteLineUseCase,
    AddStageUseCase,
    RemoveStageUseCase,
    UpdateHourlyStandardUseCase,
} from '../../Application/usecases/collector/line';
import {
    AddStageDto,
    CreateLineDto,
    UpdateAllHourlyStandardsDto,
    UpdateHourlyStandardDto,
    UpdateLineDto,
} from '../dto';

@ApiBearerAuth('JWT-auth')
@ApiTags('Line')
@Controller('v1/line')
export class LineController {

    constructor(
        private readonly createUC: CreateLineUseCase,
        private readonly getUC: GetLineUseCase,
        private readonly updateUC: UpdateLineUseCase,
        private readonly deleteUC: DeleteLineUseCase,
        private readonly addStageUC: AddStageUseCase,
        private readonly removeStageUC: RemoveStageUseCase,
        private readonly updateHourlyUC: UpdateHourlyStandardUseCase,
    ) { }

    // ──────────────── CRUD ────────────────────────────────────────────────────

    @Post()
    @ApiOperation({ summary: 'Crear una nueva línea con sus stages y standards horarios' })
    @ApiResponse({ status: 201, description: 'Línea creada con stages y 24 slots horarios' })
    create(@Body() dto: CreateLineDto) {
        return this.createUC.execute(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todas las líneas' })
    @ApiQuery({ name: 'active', required: false, type: Boolean })
    @ApiResponse({ status: 200, description: 'Lista de líneas' })
    findAll(@Query('active') active?: string) {
        const filter = active !== undefined ? { active: active === 'true' } : undefined;
        return this.getUC.executeGetAll(filter);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener una línea por ID' })
    @ApiParam({ name: 'id', description: 'MongoDB ObjectId de la línea' })
    @ApiResponse({ status: 200, description: 'Línea encontrada' })
    @ApiResponse({ status: 404, description: 'Línea no encontrada' })
    findById(@Param('id') id: string) {
        return this.getUC.execute(id);
    }

    @Get('name/:name')
    @ApiOperation({ summary: 'Obtener una línea por nombre' })
    @ApiParam({ name: 'name', description: 'Nombre de la línea' })
    findByName(@Param('name') name: string) {
        return this.getUC.executeGetByName(name);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar datos generales de una línea' })
    @ApiParam({ name: 'id', description: 'MongoDB ObjectId de la línea' })
    @ApiResponse({ status: 200, description: 'Línea actualizada' })
    update(@Param('id') id: string, @Body() dto: UpdateLineDto) {
        return this.updateUC.execute(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar una línea' })
    @ApiParam({ name: 'id', description: 'MongoDB ObjectId de la línea' })
    @ApiResponse({ status: 200, description: 'Línea eliminada' })
    delete(@Param('id') id: string) {
        return this.deleteUC.execute(id);
    }

    // ──────────────── Stage management ───────────────────────────────────────

    @Post(':id/stage')
    @ApiOperation({ summary: 'Agregar un stage a la línea (genera 24 slots horarios automáticamente)' })
    @ApiParam({ name: 'id', description: 'MongoDB ObjectId de la línea' })
    @ApiResponse({ status: 201, description: 'Stage agregado con sus 24 slots horarios' })
    addStage(@Param('id') id: string, @Body() dto: AddStageDto) {
        return this.addStageUC.execute(id, dto.name, dto.defaultStandard);
    }

    @Delete(':id/stage/:stageId')
    @ApiOperation({ summary: 'Eliminar un stage de la línea' })
    @ApiParam({ name: 'id', description: 'MongoDB ObjectId de la línea' })
    @ApiParam({ name: 'stageId', description: 'MongoDB ObjectId del stage' })
    @ApiResponse({ status: 200, description: 'Stage eliminado' })
    removeStage(@Param('id') id: string, @Param('stageId') stageId: string) {
        return this.removeStageUC.execute(id, stageId);
    }

    // ──────────────── Hourly Standards ───────────────────────────────────────

    @Get(':id/stage/:stageId/hourly')
    @ApiOperation({ summary: 'Obtener los 24 slots horarios de un stage' })
    @ApiParam({ name: 'id', description: 'MongoDB ObjectId de la línea' })
    @ApiParam({ name: 'stageId', description: 'MongoDB ObjectId del stage' })
    getHourlyStandards(@Param('id') id: string, @Param('stageId') stageId: string) {
        return this.getUC.executeGetStageHourlyStandards(id, stageId);
    }

    @Patch(':id/stage/:stageId/hourly')
    @ApiOperation({ summary: 'Actualizar un slot horario individual de un stage' })
    @ApiParam({ name: 'id', description: 'MongoDB ObjectId de la línea' })
    @ApiParam({ name: 'stageId', description: 'MongoDB ObjectId del stage' })
    updateHourly(
        @Param('id') id: string,
        @Param('stageId') stageId: string,
        @Body() dto: UpdateHourlyStandardDto,
    ) {
        return this.updateHourlyUC.execute(id, stageId, dto.startHour, dto.standard);
    }

    @Patch(':id/stage/:stageId/hourly/bulk')
    @ApiOperation({ summary: 'Actualizar todos los slots horarios de un stage en un solo request' })
    @ApiParam({ name: 'id', description: 'MongoDB ObjectId de la línea' })
    @ApiParam({ name: 'stageId', description: 'MongoDB ObjectId del stage' })
    @ApiResponse({ status: 200, description: 'Todos los slots actualizados' })
    updateAllHourly(
        @Param('id') id: string,
        @Param('stageId') stageId: string,
        @Body() dto: UpdateAllHourlyStandardsDto,
    ) {
        return this.updateHourlyUC.executeBulk(id, stageId, dto.standards);
    }
}
