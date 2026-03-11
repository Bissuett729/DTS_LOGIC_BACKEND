import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentController } from './department.controller';
import {
    CreateDepartmentUseCase,
    GetDepartmentUseCase,
    UpdateDepartmentUseCase,
    DeleteDepartmentUseCase,
    AddReasonUseCase,
    RemoveReasonUseCase,
} from '../../Application/usecases/collector/department';

describe('DepartmentController', () => {
    let controller: DepartmentController;

    const mockCreate    = { execute: jest.fn() };
    const mockGet       = { execute: jest.fn(), executeGetAll: jest.fn(), executeGetByName: jest.fn(), executeGetReasons: jest.fn() };
    const mockUpdate    = { execute: jest.fn() };
    const mockDelete    = { execute: jest.fn() };
    const mockAddReason = { execute: jest.fn() };
    const mockRemoveReason = { execute: jest.fn() };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [DepartmentController],
            providers: [
                { provide: CreateDepartmentUseCase, useValue: mockCreate },
                { provide: GetDepartmentUseCase, useValue: mockGet },
                { provide: UpdateDepartmentUseCase, useValue: mockUpdate },
                { provide: DeleteDepartmentUseCase, useValue: mockDelete },
                { provide: AddReasonUseCase, useValue: mockAddReason },
                { provide: RemoveReasonUseCase, useValue: mockRemoveReason },
            ],
        }).compile();

        controller = module.get<DepartmentController>(DepartmentController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should call createUC.execute with the dto', async () => {
            const dto = { department: 'Engineering', reasons: ['Breakdown'] };
            const result = { _id: 'dept1', ...dto };
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

        it('should pass active=true when query string is "true"', async () => {
            mockGet.executeGetAll.mockResolvedValue([]);

            await controller.findAll('true' as any);

            expect(mockGet.executeGetAll).toHaveBeenCalledWith({ active: true });
        });

        it('should pass active=false when query string is "false"', async () => {
            mockGet.executeGetAll.mockResolvedValue([]);

            await controller.findAll('false' as any);

            expect(mockGet.executeGetAll).toHaveBeenCalledWith({ active: false });
        });
    });

    describe('findById', () => {
        it('should call getUC.execute with the id', async () => {
            const mockDept = { _id: 'dept1', department: 'Engineering' };
            mockGet.execute.mockResolvedValue(mockDept);

            const response = await controller.findById('dept1');

            expect(mockGet.execute).toHaveBeenCalledWith('dept1');
            expect(response).toEqual(mockDept);
        });
    });

    describe('findByName', () => {
        it('should call getUC.executeGetByName with the name', async () => {
            mockGet.executeGetByName.mockResolvedValue({ _id: 'dept1', department: 'Engineering' });

            await controller.findByName('Engineering');

            expect(mockGet.executeGetByName).toHaveBeenCalledWith('Engineering');
        });
    });

    describe('update', () => {
        it('should call updateUC.execute with the id and dto', async () => {
            const dto = { department: 'Engineering Updated' };
            mockUpdate.execute.mockResolvedValue({ _id: 'dept1', ...dto });

            await controller.update('dept1', dto as any);

            expect(mockUpdate.execute).toHaveBeenCalledWith('dept1', dto);
        });
    });

    describe('delete', () => {
        it('should call deleteUC.execute with the id', async () => {
            mockDelete.execute.mockResolvedValue({ deleted: true });

            await controller.delete('dept1');

            expect(mockDelete.execute).toHaveBeenCalledWith('dept1');
        });
    });

    describe('getReasons', () => {
        it('should call getUC.executeGetReasons with the id', async () => {
            mockGet.executeGetReasons.mockResolvedValue(['Breakdown', 'Setup']);

            await controller.getReasons('dept1');

            expect(mockGet.executeGetReasons).toHaveBeenCalledWith('dept1');
        });
    });

    describe('addReason', () => {
        it('should call addReasonUC.execute with id and reason', async () => {
            mockAddReason.execute.mockResolvedValue({});

            await controller.addReason('dept1', { reason: 'New Reason' } as any);

            expect(mockAddReason.execute).toHaveBeenCalledWith('dept1', 'New Reason');
        });
    });

    describe('removeReason', () => {
        it('should call removeReasonUC.execute with id and decoded reason', async () => {
            mockRemoveReason.execute.mockResolvedValue({});

            await controller.removeReason('dept1', 'New%20Reason');

            expect(mockRemoveReason.execute).toHaveBeenCalledWith('dept1', 'New Reason');
        });
    });
});
