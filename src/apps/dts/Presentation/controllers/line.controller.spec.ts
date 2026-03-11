import { Test, TestingModule } from '@nestjs/testing';
import { LineController } from './line.controller';
import {
    CreateLineUseCase,
    GetLineUseCase,
    UpdateLineUseCase,
    DeleteLineUseCase,
    AddStageUseCase,
    RemoveStageUseCase,
    UpdateHourlyStandardUseCase,
} from '../../Application/usecases/collector/line';

describe('LineController', () => {
    let controller: LineController;

    const mockCreate  = { execute: jest.fn() };
    const mockGet     = {
        execute: jest.fn(),
        executeGetAll: jest.fn(),
        executeGetByName: jest.fn(),
        executeGetStageHourlyStandards: jest.fn(),
    };
    const mockUpdate        = { execute: jest.fn() };
    const mockDelete        = { execute: jest.fn() };
    const mockAddStage      = { execute: jest.fn() };
    const mockRemoveStage   = { execute: jest.fn() };
    const mockUpdateHourly  = { execute: jest.fn() };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [LineController],
            providers: [
                { provide: CreateLineUseCase, useValue: mockCreate },
                { provide: GetLineUseCase, useValue: mockGet },
                { provide: UpdateLineUseCase, useValue: mockUpdate },
                { provide: DeleteLineUseCase, useValue: mockDelete },
                { provide: AddStageUseCase, useValue: mockAddStage },
                { provide: RemoveStageUseCase, useValue: mockRemoveStage },
                { provide: UpdateHourlyStandardUseCase, useValue: mockUpdateHourly },
            ],
        }).compile();

        controller = module.get<LineController>(LineController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should call createUC.execute with the dto', async () => {
            const dto = { name: 'Line A', standardOutput: 100 };
            const result = { _id: 'line1', ...dto };
            mockCreate.execute.mockResolvedValue(result);

            const response = await controller.create(dto as any);

            expect(mockCreate.execute).toHaveBeenCalledWith(dto);
            expect(response).toEqual(result);
        });
    });

    describe('findAll', () => {
        it('should call getUC.executeGetAll with undefined filter when active is not provided', async () => {
            mockGet.executeGetAll.mockResolvedValue([]);

            await controller.findAll(undefined as any);

            expect(mockGet.executeGetAll).toHaveBeenCalledWith(undefined);
        });

        it('should pass active=true when query param is "true"', async () => {
            mockGet.executeGetAll.mockResolvedValue([]);

            await controller.findAll('true');

            expect(mockGet.executeGetAll).toHaveBeenCalledWith({ active: true });
        });

        it('should pass active=false when query param is "false"', async () => {
            mockGet.executeGetAll.mockResolvedValue([]);

            await controller.findAll('false');

            expect(mockGet.executeGetAll).toHaveBeenCalledWith({ active: false });
        });
    });

    describe('findById', () => {
        it('should call getUC.execute with the id', async () => {
            mockGet.execute.mockResolvedValue({ _id: 'line1', name: 'Line A' });

            const response = await controller.findById('line1');

            expect(mockGet.execute).toHaveBeenCalledWith('line1');
            expect(response).toEqual({ _id: 'line1', name: 'Line A' });
        });
    });

    describe('findByName', () => {
        it('should call getUC.executeGetByName with the name', async () => {
            mockGet.executeGetByName.mockResolvedValue({});

            await controller.findByName('Line A');

            expect(mockGet.executeGetByName).toHaveBeenCalledWith('Line A');
        });
    });

    describe('update', () => {
        it('should call updateUC.execute with the id and dto', async () => {
            const dto = { name: 'Updated Line' };
            mockUpdate.execute.mockResolvedValue({});

            await controller.update('line1', dto as any);

            expect(mockUpdate.execute).toHaveBeenCalledWith('line1', dto);
        });
    });

    describe('delete', () => {
        it('should call deleteUC.execute with the id', async () => {
            mockDelete.execute.mockResolvedValue({ deleted: true });

            await controller.delete('line1');

            expect(mockDelete.execute).toHaveBeenCalledWith('line1');
        });
    });

    describe('addStage', () => {
        it('should call addStageUC.execute with id, name and defaultStandard', async () => {
            const dto = { name: 'Stage 1', defaultStandard: 100 };
            mockAddStage.execute.mockResolvedValue({});

            await controller.addStage('line1', dto as any);

            expect(mockAddStage.execute).toHaveBeenCalledWith('line1', dto.name, dto.defaultStandard);
        });
    });

    describe('removeStage', () => {
        it('should call removeStageUC.execute with lineId and stageId', async () => {
            mockRemoveStage.execute.mockResolvedValue({});

            await controller.removeStage('line1', 'stage1');

            expect(mockRemoveStage.execute).toHaveBeenCalledWith('line1', 'stage1');
        });
    });

    describe('getHourlyStandards', () => {
        it('should call getUC.executeGetStageHourlyStandards with lineId and stageId', async () => {
            mockGet.executeGetStageHourlyStandards.mockResolvedValue([]);

            await controller.getHourlyStandards('line1', 'stage1');

            expect(mockGet.executeGetStageHourlyStandards).toHaveBeenCalledWith('line1', 'stage1');
        });
    });

    describe('updateHourly', () => {
        it('should call updateHourlyUC.execute with lineId, stageId, startHour and standard', async () => {
            const dto = { startHour: 8, standard: 90 };
            mockUpdateHourly.execute.mockResolvedValue({});

            await controller.updateHourly('line1', 'stage1', dto as any);

            expect(mockUpdateHourly.execute).toHaveBeenCalledWith('line1', 'stage1', dto.startHour, dto.standard);
        });
    });
});
