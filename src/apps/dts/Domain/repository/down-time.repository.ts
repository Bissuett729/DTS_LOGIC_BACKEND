import { Types } from 'mongoose';

export interface IDownTimeRepository {
    create(data: Partial<Record<string, any>>): Promise<any>;
    findAll(filters?: { page?: number; limit?: number; week?: number; shift?: string; line?: string; stage?: string }): Promise<{ data: any[]; total: number }>;
    findById(id: string | Types.ObjectId): Promise<any>;
    update(id: string | Types.ObjectId, data: Partial<Record<string, any>>): Promise<any>;
    delete(id: string | Types.ObjectId): Promise<any>;

    // Classification sub-document operations
    addClassification(id: string | Types.ObjectId, classification: { downTimeGenerated: number; department: string; reason: string }): Promise<any>;
    removeClassification(id: string | Types.ObjectId, classificationIndex: number): Promise<any>;

    // Analytics
    findByWeek(week: number): Promise<any[]>;
    findByShift(shift: string): Promise<any[]>;
    findByLine(line: string): Promise<any[]>;
    findByDateRange(startTime: Date, endTime: Date): Promise<any[]>;

    // Aggregated analytics
    getHourlyReport(date: Date, filters?: { line?: string; stage?: string }): Promise<any[]>;
    getDashboardStats(filters?: { line?: string; stage?: string }): Promise<any>;
    getWeeklyTrends(filters?: { numWeeks?: number; line?: string; stage?: string; dept?: string }): Promise<any>;
}
