import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DownTime } from '../schemas';
import { IDownTimeRepository } from 'src/apps/dts/Domain';

@Injectable()
export class DownTimeQuery implements IDownTimeRepository {

    constructor(
        @InjectModel(DownTime.name) private readonly downTimeModel: Model<DownTime>,
    ) { }

    // ─────────────────────── CRUD ───────────────────────────────────────────────

    async create(data: Partial<Record<string, any>>): Promise<DownTime> {
        const created = await this.downTimeModel.create(data);
        return created;
    }

    async findAll(filters?: {
        page?: number;
        limit?: number;
        week?: number;
        shift?: string;
        line?: string;
        stage?: string;
    }): Promise<{ data: DownTime[]; total: number }> {
        const page  = filters?.page  ?? 0;
        const limit = filters?.limit ?? 20;
        const skip  = page * limit;

        const query: Record<string, any> = {};
        if (filters?.week)  query.week  = filters.week;
        if (filters?.shift) query.shift = filters.shift;
        if (filters?.line)  query.line  = filters.line;
        if (filters?.stage) query.stage = filters.stage;

        const [data, total] = await Promise.all([
            this.downTimeModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
            this.downTimeModel.countDocuments(query),
        ]);

        return { data, total };
    }

    async findById(id: string | Types.ObjectId): Promise<DownTime> {
        const doc = await this.downTimeModel.findById(id);
        if (!doc) throw new NotFoundException(`DownTime ${id} no encontrado`);
        return doc;
    }

    async update(id: string | Types.ObjectId, data: Partial<Record<string, any>>): Promise<DownTime> {
        const updated = await this.downTimeModel.findByIdAndUpdate(id, { $set: data }, { new: true });
        if (!updated) throw new NotFoundException(`DownTime ${id} no encontrado`);
        return updated;
    }

    async delete(id: string | Types.ObjectId): Promise<DownTime> {
        const deleted = await this.downTimeModel.findByIdAndDelete(id);
        if (!deleted) throw new NotFoundException(`DownTime ${id} no encontrado`);
        return deleted;
    }

    // ─────────────────────── Classification ─────────────────────────────────────

    async addClassification(
        id: string | Types.ObjectId,
        classification: { downTimeGenerated: number; department: string; reason: string },
    ): Promise<DownTime> {
        const updated = await this.downTimeModel.findByIdAndUpdate(
            id,
            { $push: { classification } },
            { new: true },
        );
        if (!updated) throw new NotFoundException(`DownTime ${id} no encontrado`);
        return updated;
    }

    async removeClassification(id: string | Types.ObjectId, classificationIndex: number): Promise<DownTime> {
        const doc = await this.findById(id);
        doc.classification.splice(classificationIndex, 1);
        return doc.save();
    }

    // ─────────────────────── Analytics ──────────────────────────────────────────

    async findByWeek(week: number): Promise<DownTime[]> {
        return this.downTimeModel.find({ week }).sort({ startTime: 1 });
    }

    async findByShift(shift: string): Promise<DownTime[]> {
        return this.downTimeModel.find({ shift }).sort({ startTime: -1 });
    }

    async findByLine(line: string): Promise<DownTime[]> {
        return this.downTimeModel.find({ line }).sort({ startTime: -1 });
    }

    async findByDateRange(startTime: Date, endTime: Date): Promise<DownTime[]> {
        return this.downTimeModel.find({
            startTime: { $gte: startTime },
            endTime:   { $lte: endTime },
        }).sort({ startTime: 1 });
    }

    // ─────────────────────── Aggregated Analytics ────────────────────────────────

    /** Hourly breakdown for a single day. Returns one doc per hour (0-23). */
    async getHourlyReport(date: Date, filters?: { line?: string; stage?: string }): Promise<any[]> {
        const start = new Date(date); start.setHours(0, 0, 0, 0);
        const end   = new Date(date); end.setHours(23, 59, 59, 999);
        const match: Record<string, any> = { startTime: { $gte: start, $lte: end } };
        if (filters?.line)  match['line']  = filters.line;
        if (filters?.stage) match['stage'] = filters.stage;
        return this.downTimeModel
            .find(match)
            .sort({ startTime: 1 })
            .lean();
    }

    /** Dashboard summary: KPIs, pareto, dept distribution, weekly trend & heatmap. */
    async getDashboardStats(filters?: { line?: string; stage?: string }): Promise<any> {
        const matchBase: Record<string, any> = {};
        if (filters?.line)  matchBase['line']  = filters.line;
        if (filters?.stage) matchBase['stage'] = filters.stage;

        // Boundaries: current week Mon 00:00 and previous week Mon 00:00
        const now          = new Date();
        const dayOfWeek    = now.getDay() === 0 ? 7 : now.getDay(); // ISO: Mon=1…Sun=7
        const weekStart    = new Date(now); weekStart.setDate(now.getDate() - dayOfWeek + 1); weekStart.setHours(0, 0, 0, 0);
        const prevWeekStart = new Date(weekStart); prevWeekStart.setDate(weekStart.getDate() - 7);
        const twoWeeksAgo   = new Date(prevWeekStart); twoWeeksAgo.setDate(prevWeekStart.getDate() - 7);

        const [kpiCurrent, kpiPrev, pareto, deptDist, weeklyTrend, heatmap] = await Promise.all([
            // ── Current-week KPIs ─────────────────────────────────────────────
            this.downTimeModel.aggregate([
                { $match: { ...matchBase, startTime: { $gte: weekStart } } },
                { $group: { _id: null, totalDt: { $sum: '$downTimeGenerated' }, count: { $sum: 1 } } },
            ]),
            // ── Previous-week KPIs ────────────────────────────────────────────
            this.downTimeModel.aggregate([
                { $match: { ...matchBase, startTime: { $gte: prevWeekStart, $lt: weekStart } } },
                { $group: { _id: null, totalDt: { $sum: '$downTimeGenerated' }, count: { $sum: 1 } } },
            ]),
            // ── Pareto: top reasons from classification sub-docs ──────────────
            this.downTimeModel.aggregate([
                { $match: matchBase },
                { $unwind: { path: '$classification', preserveNullAndEmptyArrays: false } },
                { $group: { _id: '$classification.reason', totalDt: { $sum: '$classification.downTimeGenerated' }, dept: { $first: '$classification.department' } } },
                { $sort: { totalDt: -1 } },
                { $limit: 8 },
            ]),
            // ── Dept distribution from classification sub-docs ────────────────
            this.downTimeModel.aggregate([
                { $match: matchBase },
                { $unwind: { path: '$classification', preserveNullAndEmptyArrays: false } },
                { $group: { _id: '$classification.department', totalDt: { $sum: '$classification.downTimeGenerated' } } },
                { $sort: { totalDt: -1 } },
                { $limit: 6 },
            ]),
            // ── Last-14-days trend: reported vs unreported per day-of-week ────
            this.downTimeModel.aggregate([
                { $match: { ...matchBase, startTime: { $gte: twoWeeksAgo } } },
                { $addFields: { dayOfWeek: { $isoDayOfWeek: '$startTime' } } },
                { $group: {
                    _id: '$dayOfWeek',
                    reported:   { $sum: '$downTimeReported' },
                    unreported: { $sum: '$downTimeUnreported' },
                    generated:  { $sum: '$downTimeGenerated' },
                } },
                { $sort: { _id: 1 } },
            ]),
            // ── Heatmap: intensity per (day-of-week × hour-of-day) ────────────
            this.downTimeModel.aggregate([
                { $match: { ...matchBase, startTime: { $gte: twoWeeksAgo } } },
                { $addFields: {
                    dayOfWeek: { $isoDayOfWeek: '$startTime' },
                    hourOfDay: { $hour: '$startTime' },
                } },
                { $group: {
                    _id: { day: '$dayOfWeek', hour: '$hourOfDay' },
                    value: { $sum: '$downTimeGenerated' },
                    count: { $sum: 1 },
                } },
            ]),
        ]);

        return {
            kpiCurrent:  kpiCurrent[0]  ?? { totalDt: 0, count: 0 },
            kpiPrev:     kpiPrev[0]     ?? { totalDt: 0, count: 0 },
            pareto,
            deptDist,
            weeklyTrend,
            heatmap,
        };
    }

    /** Weekly trends for the last N weeks + top-cause comparison. */
    async getWeeklyTrends(filters?: { numWeeks?: number; line?: string; stage?: string; dept?: string }): Promise<any> {
        const numWeeks = Math.min(filters?.numWeeks ?? 8, 26);
        const matchBase: Record<string, any> = {};
        if (filters?.line)  matchBase['line']  = filters.line;
        if (filters?.stage) matchBase['stage'] = filters.stage;

        // ── Identical Monday-boundary logic as getDashboardStats ────────────
        const now       = new Date();
        const dow       = now.getDay() === 0 ? 7 : now.getDay(); // ISO Mon=1…Sun=7
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - dow + 1);
        weekStart.setHours(0, 0, 0, 0);

        const prevWeekStart = new Date(weekStart);
        prevWeekStart.setDate(weekStart.getDate() - 7);

        const rangeStart = new Date(weekStart);
        rangeStart.setDate(weekStart.getDate() - (numWeeks - 1) * 7);

        const currentWeek = this.isoWeekNumber(weekStart);
        const weeksRange  = Array.from({ length: numWeeks }, (_, i) => currentWeek - (numWeeks - 1) + i);

        // Assign week number using the same Monday boundary (weekStart) that
        // getDashboardStats uses for its $gte filter, so both totals are identical.
        //   weekNum = currentWeek + floor((startTime − weekStart) / 7 days)
        // Records >= weekStart   → floor(0…0.99) = 0 → currentWeek     ✓
        // Records in prev week   → floor(-1…-0.01) = -1 → currentWeek-1 ✓
        const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
        const weekNumExpr = {
            $add: [
                currentWeek,
                { $floor: { $divide: [{ $subtract: ['$startTime', weekStart] }, MS_PER_WEEK] } },
            ],
        };

        const [weeklyData, causeTrends] = await Promise.all([
            // ── Weekly totals ──────────────────────────────────────────────────
            this.downTimeModel.aggregate([
                { $match: { ...matchBase, startTime: { $gte: rangeStart } } },
                { $addFields: { weekNum: weekNumExpr } },
                { $group: {
                    _id:             '$weekNum',
                    totalDt:         { $sum: '$downTimeGenerated' },
                    totalReported:   { $sum: '$downTimeReported' },
                    totalUnreported: { $sum: '$downTimeUnreported' },
                    avgEfficiency:   { $avg: '$efficiency' },
                    count:           { $sum: 1 },
                } },
                { $sort: { _id: 1 } },
            ]),
            // ── Cause trends: current vs prev week ─────────────────────────────
            this.downTimeModel.aggregate([
                { $match: { ...matchBase, startTime: { $gte: prevWeekStart } } },
                { $addFields: { weekNum: weekNumExpr } },
                { $unwind: { path: '$classification', preserveNullAndEmptyArrays: false } },
                ...(filters?.dept ? [{ $match: { 'classification.department': filters.dept } }] : []),
                { $group: {
                    _id: { week: '$weekNum', reason: '$classification.reason', dept: '$classification.department' },
                    totalDt: { $sum: '$classification.downTimeGenerated' },
                } },
                { $group: {
                    _id: { reason: '$_id.reason', dept: '$_id.dept' },
                    weeks: { $push: { week: '$_id.week', totalDt: '$totalDt' } },
                } },
                { $sort: { 'weeks': -1 } },
                { $limit: 10 },
            ]),
        ]);

        return { weeklyData, causeTrends, currentWeek, weeksRange };
    }

    /** ISO 8601 week number — identical to MongoDB's $isoWeek operator. */
    private isoWeekNumber(date: Date): number {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        const yearStart = new Date(d.getFullYear(), 0, 1);
        return Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
    }
}