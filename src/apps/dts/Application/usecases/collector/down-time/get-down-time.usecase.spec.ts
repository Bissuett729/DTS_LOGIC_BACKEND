import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetDownTimeUseCase } from './get-down-time.usecase';
import { DOWN_TIME_REPO } from '../../../tokens';
import { IDownTimeRepository } from 'src/apps/dts/Domain';

describe('GetDownTimeUseCase', () => {
    let useCase: GetDownTimeUseCase;
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
                GetDownTimeUseCase,
                { provide: DOWN_TIME_REPO, useValue: repoMock },
            ],
        }).compile();

        useCase = module.get<GetDownTimeUseCase>(GetDownTimeUseCase);
    });

    it('should be defined', () => {
        expect(useCase).toBeDefined();
    });

    describe('execute (findById)', () => {
        it('should return a downtime record when found', async () => {
            const mockDT = { _id: 'dt123', line: 'Line A', shift: 'Morning' };
            repoMock.findById.mockResolvedValue(mockDT as any);

            const result = await useCase.execute('dt123');

            expect(repoMock.findById).toHaveBeenCalledWith('dt123');
            expect(result).toEqual(mockDT);
        });

        it('should throw NotFoundException when record is not found', async () => {
            repoMock.findById.mockResolvedValue(null);

            await expect(useCase.execute('missing')).rejects.toThrow(NotFoundException);
            await expect(useCase.execute('missing')).rejects.toThrow('DownTime missing no encontrado');
        });
    });

    describe('executeGetAll', () => {
        it('should return all records without filters', async () => {
            const mockResponse = { data: [{ _id: '1' }, { _id: '2' }], total: 2 };
            repoMock.findAll.mockResolvedValue(mockResponse);

            const result = await useCase.executeGetAll();

            expect(repoMock.findAll).toHaveBeenCalledWith(undefined);
            expect(result).toEqual(mockResponse);
        });

        it('should pass pagination and filters to the repository', async () => {
            repoMock.findAll.mockResolvedValue({ data: [], total: 0 });

            await useCase.executeGetAll({ page: 2, limit: 10, week: 5, shift: 'Morning', line: 'Line A' });

            expect(repoMock.findAll).toHaveBeenCalledWith({ page: 2, limit: 10, week: 5, shift: 'Morning', line: 'Line A' });
        });
    });

    describe('executeGetByWeek', () => {
        it('should call repository.findByWeek with the provided week number', async () => {
            repoMock.findByWeek.mockResolvedValue([]);

            await useCase.executeGetByWeek(3);

            expect(repoMock.findByWeek).toHaveBeenCalledWith(3);
        });
    });

    describe('executeGetByShift', () => {
        it('should call repository.findByShift with the provided shift', async () => {
            repoMock.findByShift.mockResolvedValue([]);

            await useCase.executeGetByShift('Night');

            expect(repoMock.findByShift).toHaveBeenCalledWith('Night');
        });
    });

    describe('executeGetByLine', () => {
        it('should call repository.findByLine with the provided line', async () => {
            repoMock.findByLine.mockResolvedValue([]);

            await useCase.executeGetByLine('Line B');

            expect(repoMock.findByLine).toHaveBeenCalledWith('Line B');
        });
    });
});
