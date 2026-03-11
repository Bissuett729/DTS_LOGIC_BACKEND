import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IDownTimeRepository } from 'src/apps/dts/Domain';
import { DOWN_TIME_REPO } from '../../../tokens';

@Injectable()
export class GetDownTimeUseCase {
    constructor(
        @Inject(DOWN_TIME_REPO) private readonly downTimeRepo: IDownTimeRepository,
    ) { }

    async execute(id: string) {
        const doc = await this.downTimeRepo.findById(id);
        if (!doc) throw new NotFoundException(`DownTime ${id} no encontrado`);
        return doc;
    }

    async executeGetAll(filters?: {
        page?: number;
        limit?: number;
        week?: number;
        shift?: string;
        line?: string;
        stage?: string;
    }) {
        return this.downTimeRepo.findAll(filters);
    }

    async executeGetByWeek(week: number) {
        return this.downTimeRepo.findByWeek(week);
    }

    async executeGetByShift(shift: string) {
        return this.downTimeRepo.findByShift(shift);
    }

    async executeGetByLine(line: string) {
        return this.downTimeRepo.findByLine(line);
    }

    async executeGetByDateRange(startTime: Date, endTime: Date) {
        return this.downTimeRepo.findByDateRange(startTime, endTime);
    }

    // ── Aggregated analytics ──────────────────────────────────────────────────

    async executeGetHourlyReport(date: Date, filters?: { line?: string; stage?: string }) {
        return this.downTimeRepo.getHourlyReport(date, filters);
    }

    async executeGetDashboardStats(filters?: { line?: string; stage?: string }) {
        return this.downTimeRepo.getDashboardStats(filters);
    }

    async executeGetWeeklyTrends(filters?: { numWeeks?: number; line?: string; stage?: string; dept?: string }) {
        return this.downTimeRepo.getWeeklyTrends(filters);
    }
}
