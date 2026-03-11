import { Test, TestingModule } from '@nestjs/testing';
import { CreateDownTimeUseCase } from './create-down-time.usecase';
import { DOWN_TIME_REPO } from '../../../tokens';
import { IDownTimeRepository } from 'src/apps/dts/Domain';

describe('CreateDownTimeUseCase', () => {
    let useCase: CreateDownTimeUseCase;
    let repoMock: jest.Mocked<IDownTimeRepository>;

    beforeEach(async () => {
        repoMock = {
            create: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            findByWeek: jest.fn(),
            findByShift: jest.fn(),
            findByLine: jest.fn(),
            findByDateRange: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            addClassification: jest.fn(),
            removeClassification: jest.fn(),
        } as any;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateDownTimeUseCase,
                { provide: DOWN_TIME_REPO, useValue: repoMock },
            ],
        }).compile();

        useCase = module.get<CreateDownTimeUseCase>(CreateDownTimeUseCase);
    });

    it('should be defined', () => {
        expect(useCase).toBeDefined();
    });

    it('should call repository.create with the given dto', async () => {
        const dto = { line: 'Line A', shift: 'Morning', week: 1, minutes: 30, stage: 'Stage 1' };
        const expectedResult = { _id: 'dt123', ...dto };
        repoMock.create.mockResolvedValue(expectedResult as any);

        const result = await useCase.execute(dto);

        expect(repoMock.create).toHaveBeenCalledTimes(1);
        expect(repoMock.create).toHaveBeenCalledWith(dto);
        expect(result).toEqual(expectedResult);
    });

    it('should propagate repository errors', async () => {
        repoMock.create.mockRejectedValue(new Error('Validation failed'));
        await expect(useCase.execute({ line: 'X' })).rejects.toThrow('Validation failed');
    });
});
