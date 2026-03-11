import { Types } from 'mongoose';

export interface ILineRepository {
    create(data: { name: string; standardOutput?: number; stages?: { name: string }[] }): Promise<any>;
    findAll(filters?: { active?: boolean }): Promise<any[]>;
    findById(id: string | Types.ObjectId): Promise<any>;
    findByName(name: string): Promise<any>;
    update(id: string | Types.ObjectId, data: Partial<{ name: string; standardOutput: number; active: boolean }>): Promise<any>;
    delete(id: string | Types.ObjectId): Promise<any>;

    // Stage management
    addStage(id: string | Types.ObjectId, stageName: string, defaultStandard?: number): Promise<any>;
    removeStage(id: string | Types.ObjectId, stageId: string | Types.ObjectId): Promise<any>;

    // Hourly standards management
    updateHourlyStandard(id: string | Types.ObjectId, stageId: string | Types.ObjectId, startHour: number, standard: number): Promise<any>;
    updateAllHourlyStandards(id: string | Types.ObjectId, stageId: string | Types.ObjectId, standards: { startHour: number; standard: number }[]): Promise<any>;
    getStageHourlyStandards(id: string | Types.ObjectId, stageId: string | Types.ObjectId): Promise<any[]>;
}
