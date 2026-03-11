import { Types } from 'mongoose';

export interface IShiftRepository {
    create(data: { label: string; startTime: Date; endTime: Date; duration?: number; active?: boolean }): Promise<any>;
    findAll(filters?: { active?: boolean }): Promise<any[]>;
    findById(id: string | Types.ObjectId): Promise<any>;
    findByLabel(label: string): Promise<any>;
    findActive(): Promise<any[]>;
    update(id: string | Types.ObjectId, data: Partial<{ label: string; startTime: Date; endTime: Date; duration: number; active: boolean }>): Promise<any>;
    delete(id: string | Types.ObjectId): Promise<any>;

    // Active control
    activate(id: string | Types.ObjectId): Promise<any>;
    deactivate(id: string | Types.ObjectId): Promise<any>;

    // Get current shift based on current time
    getCurrentShift(): Promise<any>;
}
