import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    CreateDepartmentUseCase,
    GetDepartmentUseCase,
    UpdateDepartmentUseCase,
    DeleteDepartmentUseCase,
    AddReasonUseCase,
    RemoveReasonUseCase,
} from '../../Application/usecases/collector/department';
import { AddReasonDto, CreateDepartmentDto, UpdateDepartmentDto } from '../dto';

@ApiBearerAuth('JWT-auth')
@ApiTags('Department')
@Controller('v1/department')
export class DepartmentController {

    constructor(
        private readonly createUC: CreateDepartmentUseCase,
        private readonly getUC: GetDepartmentUseCase,
        private readonly updateUC: UpdateDepartmentUseCase,
        private readonly deleteUC: DeleteDepartmentUseCase,
        private readonly addReasonUC: AddReasonUseCase,
        private readonly removeReasonUC: RemoveReasonUseCase,
    ) { }

    // ──────────────── CRUD ────────────────────────────────────────────────────

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo departamento' })
    @ApiResponse({ status: 201, description: 'Departamento creado exitosamente' })
    create(@Body() dto: CreateDepartmentDto) {
        return this.createUC.execute(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los departamentos' })
    @ApiQuery({ name: 'active', required: false, type: Boolean, description: 'Filtrar por estado activo' })
    @ApiResponse({ status: 200, description: 'Lista de departamentos' })
    findAll(@Query('active') active?: string) {
        const filter = active !== undefined ? { active: active === 'true' } : undefined;
        return this.getUC.executeGetAll(filter);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener departamento por ID' })
    @ApiParam({ name: 'id', description: 'MongoDB ObjectId del departamento' })
    @ApiResponse({ status: 200, description: 'Departamento encontrado' })
    @ApiResponse({ status: 404, description: 'Departamento no encontrado' })
    findById(@Param('id') id: string) {
        return this.getUC.execute(id);
    }

    @Get('name/:name')
    @ApiOperation({ summary: 'Obtener departamento por nombre' })
    @ApiParam({ name: 'name', description: 'Nombre del departamento' })
    findByName(@Param('name') name: string) {
        return this.getUC.executeGetByName(name);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un departamento' })
    @ApiParam({ name: 'id', description: 'MongoDB ObjectId del departamento' })
    @ApiResponse({ status: 200, description: 'Departamento actualizado' })
    update(@Param('id') id: string, @Body() dto: UpdateDepartmentDto) {
        return this.updateUC.execute(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un departamento' })
    @ApiParam({ name: 'id', description: 'MongoDB ObjectId del departamento' })
    @ApiResponse({ status: 200, description: 'Departamento eliminado' })
    delete(@Param('id') id: string) {
        return this.deleteUC.execute(id);
    }

    // ──────────────── Reasons ─────────────────────────────────────────────────

    @Get(':id/reasons')
    @ApiOperation({ summary: 'Obtener las razones de un departamento' })
    @ApiParam({ name: 'id', description: 'MongoDB ObjectId del departamento' })
    getReasons(@Param('id') id: string) {
        return this.getUC.executeGetReasons(id);
    }

    @Post(':id/reasons')
    @ApiOperation({ summary: 'Agregar una razón a un departamento' })
    @ApiParam({ name: 'id', description: 'MongoDB ObjectId del departamento' })
    @ApiResponse({ status: 201, description: 'Razón agregada' })
    addReason(@Param('id') id: string, @Body() dto: AddReasonDto) {
        return this.addReasonUC.execute(id, dto.reason);
    }

    @Delete(':id/reasons/:reason')
    @ApiOperation({ summary: 'Eliminar una razón de un departamento' })
    @ApiParam({ name: 'id', description: 'MongoDB ObjectId del departamento' })
    @ApiParam({ name: 'reason', description: 'Texto de la razón a eliminar (URL-encoded)' })
    @ApiResponse({ status: 200, description: 'Razón eliminada' })
    removeReason(@Param('id') id: string, @Param('reason') reason: string) {
        return this.removeReasonUC.execute(id, decodeURIComponent(reason));
    }
}
