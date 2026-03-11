import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetDepartmentUseCase } from './get-department.usecase';
import { DEPARTMENT_REPO } from '../../../tokens';
import { IDepartmentRepository } from 'src/apps/dts/Domain';

describe('GetDepartmentUseCase', () => {
    let useCase: GetDepartmentUseCase;
    let repoMock: jest.Mocked<IDepartmentRepository>;

    beforeEach(async () => {
        repoMock = {
            create: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            findByName: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            addReason: jest.fn(),
            removeReason: jest.fn(),
            getReasons: jest.fn(),
        } as any;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GetDepartmentUseCase,
                { provide: DEPARTMENT_REPO, useValue: repoMock },
            ],
        }).compile();

        useCase = module.get<GetDepartmentUseCase>(GetDepartmentUseCase);
    });

    it('should be defined', () => {
        expect(useCase).toBeDefined();
    });

    describe('execute (findById)', () => {
        it('should return a department when found', async () => {
            const mockDept = { _id: 'abc123', department: 'Engineering' };
            repoMock.findById.mockResolvedValue(mockDept as any);

            const result = await useCase.execute('abc123');

            expect(repoMock.findById).toHaveBeenCalledWith('abc123');
            expect(result).toEqual(mockDept);
        });

        it('should throw NotFoundException when department is not found', async () => {
            repoMock.findById.mockResolvedValue(null);

            await expect(useCase.execute('nonexistent')).rejects.toThrow(NotFoundException);
            await expect(useCase.execute('nonexistent')).rejects.toThrow('Department nonexistent no encontrado');
        });
    });

    describe('executeGetAll', () => {
        it('should return all departments without filters', async () => {
            const mockList = [{ _id: '1', department: 'Engineering' }, { _id: '2', department: 'Quality' }];
            repoMock.findAll.mockResolvedValue(mockList as any);

            const result = await useCase.executeGetAll();

            expect(repoMock.findAll).toHaveBeenCalledWith(undefined);
            expect(result).toEqual(mockList);
        });

        it('should pass filters to the repository', async () => {
            repoMock.findAll.mockResolvedValue([]);

            await useCase.executeGetAll({ active: true });

            expect(repoMock.findAll).toHaveBeenCalledWith({ active: true });
        });
    });
});
