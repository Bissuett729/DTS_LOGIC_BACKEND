import { Types } from 'mongoose';

export interface IDepartmentRepository {
    create(data: { department: string; reasons?: string[] }): Promise<any>;
    findAll(filters?: { active?: boolean }): Promise<any[]>;
    findById(id: string | Types.ObjectId): Promise<any>;
    findByName(name: string): Promise<any>;
    update(id: string | Types.ObjectId, data: Partial<{ department: string; active: boolean }>): Promise<any>;
    delete(id: string | Types.ObjectId): Promise<any>;

    // Reasons management
    addReason(id: string | Types.ObjectId, reason: string): Promise<any>;
    removeReason(id: string | Types.ObjectId, reason: string): Promise<any>;
    getReasonsById(id: string | Types.ObjectId): Promise<string[]>;
}
