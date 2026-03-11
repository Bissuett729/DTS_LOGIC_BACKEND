import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Department } from '../schemas';
import { IDepartmentRepository } from 'src/apps/dts/Domain';

@Injectable()
export class DepartmentQuery implements IDepartmentRepository {

    constructor(
        @InjectModel(Department.name) private readonly departmentModel: Model<Department>,
    ) { }

    // ─────────────────────── CRUD ───────────────────────────────────────────────

    async create(data: { department: string; reasons?: string[] }): Promise<Department> {
        return this.departmentModel.create(data);
    }

    async findAll(filters?: { active?: boolean }): Promise<Department[]> {
        const query: Record<string, any> = {};
        if (filters?.active !== undefined) query.active = filters.active;
        return this.departmentModel.find(query).sort({ department: 1 });
    }

    async findById(id: string | Types.ObjectId): Promise<Department> {
        const doc = await this.departmentModel.findById(id);
        if (!doc) throw new NotFoundException(`Department ${id} no encontrado`);
        return doc;
    }

    async findByName(name: string): Promise<Department> {
        return this.departmentModel.findOne({ department: name });
    }

    async update(
        id: string | Types.ObjectId,
        data: Partial<{ department: string; active: boolean }>,
    ): Promise<Department> {
        const updated = await this.departmentModel.findByIdAndUpdate(id, { $set: data }, { new: true });
        if (!updated) throw new NotFoundException(`Department ${id} no encontrado`);
        return updated;
    }

    async delete(id: string | Types.ObjectId): Promise<Department> {
        const deleted = await this.departmentModel.findByIdAndDelete(id);
        if (!deleted) throw new NotFoundException(`Department ${id} no encontrado`);
        return deleted;
    }

    // ─────────────────────── Reasons ────────────────────────────────────────────

    async addReason(id: string | Types.ObjectId, reason: string): Promise<Department> {
        const updated = await this.departmentModel.findByIdAndUpdate(
            id,
            { $addToSet: { reasons: reason } },
            { new: true },
        );
        if (!updated) throw new NotFoundException(`Department ${id} no encontrado`);
        return updated;
    }

    async removeReason(id: string | Types.ObjectId, reason: string): Promise<Department> {
        const updated = await this.departmentModel.findByIdAndUpdate(
            id,
            { $pull: { reasons: reason } },
            { new: true },
        );
        if (!updated) throw new NotFoundException(`Department ${id} no encontrado`);
        return updated;
    }

    async getReasonsById(id: string | Types.ObjectId): Promise<string[]> {
        const doc = await this.findById(id);
        return doc.reasons ?? [];
    }
}
