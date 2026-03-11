import { Test, TestingModule } from '@nestjs/testing';
import { CreateLineUseCase } from './create-line.usecase';
import { LINE_REPO } from '../../../tokens';
import { ILineRepository } from 'src/apps/dts/Domain';

describe('CreateLineUseCase', () => {
    let useCase: CreateLineUseCase;
    let repoMock: jest.Mocked<ILineRepository>;

    beforeEach(async () => {
        repoMock = {
            create: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            findByName: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            addStage: jest.fn(),
            removeStage: jest.fn(),
            getStageHourlyStandards: jest.fn(),
            updateHourlyStandard: jest.fn(),
            updateAllHourlyStandards: jest.fn(),
        } as any;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateLineUseCase,
                { provide: LINE_REPO, useValue: repoMock },
            ],
        }).compile();

        useCase = module.get<CreateLineUseCase>(CreateLineUseCase);
    });

    it('should be defined', () => {
        expect(useCase).toBeDefined();
    });

    it('should call repository.create with the given dto', async () => {
        const dto = { name: 'Line A', standardOutput: 100, stages: [{ name: 'Stage 1' }] };
        const expectedResult = { _id: 'line123', ...dto };
        repoMock.create.mockResolvedValue(expectedResult as any);

        const result = await useCase.execute(dto);

        expect(repoMock.create).toHaveBeenCalledTimes(1);
        expect(repoMock.create).toHaveBeenCalledWith(dto);
        expect(result).toEqual(expectedResult);
    });

    it('should create a line without optional fields', async () => {
        const dto = { name: 'Line B' };
        repoMock.create.mockResolvedValue({ _id: 'line456', name: 'Line B' } as any);

        await useCase.execute(dto);

        expect(repoMock.create).toHaveBeenCalledWith(dto);
    });

    it('should propagate repository errors', async () => {
        repoMock.create.mockRejectedValue(new Error('Duplicate name'));
        await expect(useCase.execute({ name: 'Line A' })).rejects.toThrow('Duplicate name');
    });
});
