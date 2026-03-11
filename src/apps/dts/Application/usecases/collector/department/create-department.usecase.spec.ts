import { Test, TestingModule } from '@nestjs/testing';
import { CreateDepartmentUseCase } from './create-department.usecase';
import { DEPARTMENT_REPO } from '../../../tokens';
import { IDepartmentRepository } from 'src/apps/dts/Domain';

describe('CreateDepartmentUseCase', () => {
    let useCase: CreateDepartmentUseCase;
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
                CreateDepartmentUseCase,
                { provide: DEPARTMENT_REPO, useValue: repoMock },
            ],
        }).compile();

        useCase = module.get<CreateDepartmentUseCase>(CreateDepartmentUseCase);
    });

    it('should be defined', () => {
        expect(useCase).toBeDefined();
    });

    it('should call repository.create with the given dto', async () => {
        const dto = { department: 'Engineering', reasons: ['Breakdown', 'Setup'] };
        const expectedResult = { _id: 'abc123', ...dto };
        repoMock.create.mockResolvedValue(expectedResult as any);

        const result = await useCase.execute(dto);

        expect(repoMock.create).toHaveBeenCalledTimes(1);
        expect(repoMock.create).toHaveBeenCalledWith(dto);
        expect(result).toEqual(expectedResult);
    });

    it('should propagate repository errors', async () => {
        repoMock.create.mockRejectedValue(new Error('DB error'));
        await expect(useCase.execute({ department: 'Test' })).rejects.toThrow('DB error');
    });
});
