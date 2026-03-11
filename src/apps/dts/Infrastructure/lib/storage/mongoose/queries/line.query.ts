import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Line, generateHourlySlots } from '../schemas';
import { ILineRepository } from 'src/apps/dts/Domain';

@Injectable()
export class LineQuery implements ILineRepository {

    constructor(
        @InjectModel(Line.name) private readonly lineModel: Model<Line>,
    ) { }

    // ─────────────────────── CRUD ───────────────────────────────────────────────

    async create(data: { name: string; standardOutput?: number; stages?: { name: string }[] }): Promise<Line> {
        const stages = (data.stages ?? []).map(s => ({
            name: s.name,
            hourlyStandards: generateHourlySlots(data.standardOutput ?? 50),
        }));
        return this.lineModel.create({ ...data, stages });
    }

    async findAll(filters?: { active?: boolean }): Promise<Line[]> {
        const query: Record<string, any> = {};
        if (filters?.active !== undefined) query.active = filters.active;
        return this.lineModel.find(query).sort({ name: 1 });
    }

    async findById(id: string | Types.ObjectId): Promise<Line> {
        const doc = await this.lineModel.findById(id);
        if (!doc) throw new NotFoundException(`Line ${id} no encontrada`);
        return doc;
    }

    async findByName(name: string): Promise<Line> {
        return this.lineModel.findOne({ name });
    }

    async update(
        id: string | Types.ObjectId,
        data: Partial<{ name: string; standardOutput: number; active: boolean }>,
    ): Promise<Line> {
        const updated = await this.lineModel.findByIdAndUpdate(id, { $set: data }, { new: true });
        if (!updated) throw new NotFoundException(`Line ${id} no encontrada`);
        return updated;
    }

    async delete(id: string | Types.ObjectId): Promise<Line> {
        const deleted = await this.lineModel.findByIdAndDelete(id);
        if (!deleted) throw new NotFoundException(`Line ${id} no encontrada`);
        return deleted;
    }

    // ─────────────────────── Stage management ───────────────────────────────────

    async addStage(id: string | Types.ObjectId, stageName: string, defaultStandard = 50): Promise<Line> {
        const newStage = {
            name: stageName,
            hourlyStandards: generateHourlySlots(defaultStandard),
        };
        const updated = await this.lineModel.findByIdAndUpdate(
            id,
            { $push: { stages: newStage } },
            { new: true },
        );
        if (!updated) throw new NotFoundException(`Line ${id} no encontrada`);
        return updated;
    }

    async removeStage(id: string | Types.ObjectId, stageId: string | Types.ObjectId): Promise<Line> {
        const updated = await this.lineModel.findByIdAndUpdate(
            id,
            { $pull: { stages: { _id: new Types.ObjectId(stageId.toString()) } } },
            { new: true },
        );
        if (!updated) throw new NotFoundException(`Line ${id} no encontrada`);
        return updated;
    }

    // ─────────────────────── Hourly standards ───────────────────────────────────

    async updateHourlyStandard(
        id: string | Types.ObjectId,
        stageId: string | Types.ObjectId,
        startHour: number,
        standard: number,
    ): Promise<Line> {
        const updated = await this.lineModel.findOneAndUpdate(
            { _id: id, 'stages._id': new Types.ObjectId(stageId.toString()) },
            {
                $set: {
                    'stages.$[stage].hourlyStandards.$[slot].standard': standard,
                }
            },
            {
                arrayFilters: [
                    { 'stage._id': new Types.ObjectId(stageId.toString()) },
                    { 'slot.startHour': startHour },
                ],
                new: true,
            },
        );
        if (!updated) throw new NotFoundException(`Line ${id} o Stage ${stageId} no encontrado`);
        return updated;
    }

    async updateAllHourlyStandards(
        id: string | Types.ObjectId,
        stageId: string | Types.ObjectId,
        standards: { startHour: number; standard: number }[],
    ): Promise<Line> {
        const line = await this.findById(id);
        const stage = line.stages.find(s => s['_id']?.toString() === stageId.toString());
        if (!stage) throw new NotFoundException(`Stage ${stageId} no encontrado en Line ${id}`);

        stage.hourlyStandards.forEach(slot => {
            const match = standards.find(s => s.startHour === slot.startHour);
            if (match) slot.standard = match.standard;
        });

        return line.save();
    }

    async getStageHourlyStandards(id: string | Types.ObjectId, stageId: string | Types.ObjectId): Promise<any[]> {
        const line = await this.findById(id);
        const stage = line.stages.find(s => s['_id']?.toString() === stageId.toString());
        if (!stage) throw new NotFoundException(`Stage ${stageId} no encontrado en Line ${id}`);
        return stage.hourlyStandards;
    }
}
