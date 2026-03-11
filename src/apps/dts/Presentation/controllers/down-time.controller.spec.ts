import { Test, TestingModule } from '@nestjs/testing';
import { DownTimeController } from './down-time.controller';
import {
    CreateDownTimeUseCase,
    GetDownTimeUseCase,
    UpdateDownTimeUseCase,
    DeleteDownTimeUseCase,
    AddClassificationUseCase,
    RemoveClassificationUseCase,
} from '../../Application/usecases/collector/down-time';

describe('DownTimeController', () => {
    let controller: DownTimeController;

    const mockCreate = { execute: jest.fn() };
    const mockGet = {
        execute: jest.fn(),
        executeGetAll: jest.fn(),
        executeGetByWeek: jest.fn(),
        executeGetByShift: jest.fn(),
        executeGetByLine: jest.fn(),
        executeGetByDateRange: jest.fn(),
    };
    const mockUpdate               = { execute: jest.fn() };
    const mockDelete               = { execute: jest.fn() };
    const mockAddClassification    = { execute: jest.fn() };
    const mockRemoveClassification = { execute: jest.fn() };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [DownTimeController],
            providers: [
                { provide: CreateDownTimeUseCase, useValue: mockCreate },
                { provide: GetDownTimeUseCase, useValue: mockGet },
                { provide: UpdateDownTimeUseCase, useValue: mockUpdate },
                { provide: DeleteDownTimeUseCase, useValue: mockDelete },
                { provide: AddClassificationUseCase, useValue: mockAddClassification },
                { provide: RemoveClassificationUseCase, useValue: mockRemoveClassification },
            ],
        }).compile();

        controller = module.get<DownTimeController>(DownTimeController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should call createUC.execute with the dto', async () => {
            const dto = { line: 'Line A', shift: 'Morning', week: 1 };
            const result = { _id: 'dt1', ...dto };
            mockCreate.execute.mockResolvedValue(result);

            const response = await controller.create(dto as any);

            expect(mockCreate.execute).toHaveBeenCalledWith(dto);
            expect(response).toEqual(result);
        });
    });

    describe('findAll', () => {
        it('should call getUC.executeGetAll with the filters', async () => {
            const filters = { page: 1, limit: 10 };
            mockGet.executeGetAll.mockResolvedValue([]);

            await controller.findAll(filters as any);

            expect(mockGet.executeGetAll).toHaveBeenCalledWith(filters);
        });
    });

    describe('findById', () => {
        it('should call getUC.execute with the id', async () => {
            mockGet.execute.mockResolvedValue({ _id: 'dt1' });

            const response = await controller.findById('dt1');

            expect(mockGet.execute).toHaveBeenCalledWith('dt1');
            expect(response).toEqual({ _id: 'dt1' });
        });
    });

    describe('update', () => {
        it('should call updateUC.execute with the id and dto', async () => {
            const dto = { minutes: 45 };
            mockUpdate.execute.mockResolvedValue({});

            await controller.update('dt1', dto as any);

            expect(mockUpdate.execute).toHaveBeenCalledWith('dt1', dto);
        });
    });

    describe('delete', () => {
        it('should call deleteUC.execute with the id', async () => {
            mockDelete.execute.mockResolvedValue({ deleted: true });

            await controller.delete('dt1');

            expect(mockDelete.execute).toHaveBeenCalledWith('dt1');
        });
    });

    describe('findByWeek', () => {
        it('should call getUC.executeGetByWeek with the numeric week', async () => {
            mockGet.executeGetByWeek.mockResolvedValue([]);

            await controller.findByWeek('5');

            expect(mockGet.executeGetByWeek).toHaveBeenCalledWith(5);
        });
    });

    describe('findByShift', () => {
        it('should call getUC.executeGetByShift with the shift', async () => {
            mockGet.executeGetByShift.mockResolvedValue([]);

            await controller.findByShift('Night');

            expect(mockGet.executeGetByShift).toHaveBeenCalledWith('Night');
        });
    });

    describe('findByLine', () => {
        it('should call getUC.executeGetByLine with the line', async () => {
            mockGet.executeGetByLine.mockResolvedValue([]);

            await controller.findByLine('Line B');

            expect(mockGet.executeGetByLine).toHaveBeenCalledWith('Line B');
        });
    });

    describe('findByDateRange', () => {
        it('should call getUC.executeGetByDateRange with startTime and endTime', async () => {
            const dto = { startTime: '2026-01-01', endTime: '2026-01-31' };
            mockGet.executeGetByDateRange.mockResolvedValue([]);

            await controller.findByDateRange(dto as any);

            expect(mockGet.executeGetByDateRange).toHaveBeenCalledWith(dto.startTime, dto.endTime);
        });
    });

    describe('addClassification', () => {
        it('should call addClassificationUC.execute with the id and dto', async () => {
            const dto = { downTimeGenerated: 30, department: 'Engineering', reason: 'Breakdown' };
            mockAddClassification.execute.mockResolvedValue({});

            await controller.addClassification('dt1', dto as any);

            expect(mockAddClassification.execute).toHaveBeenCalledWith('dt1', dto);
        });
    });

    describe('removeClassification', () => {
        it('should call removeClassificationUC.execute with the id and numeric index', async () => {
            mockRemoveClassification.execute.mockResolvedValue({});

            await controller.removeClassification('dt1', '2');

            expect(mockRemoveClassification.execute).toHaveBeenCalledWith('dt1', 2);
        });
    });
});
