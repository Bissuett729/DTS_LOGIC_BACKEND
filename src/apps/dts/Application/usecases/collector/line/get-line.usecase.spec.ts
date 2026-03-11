import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetLineUseCase } from './get-line.usecase';
import { LINE_REPO } from '../../../tokens';
import { ILineRepository } from 'src/apps/dts/Domain';

describe('GetLineUseCase', () => {
    let useCase: GetLineUseCase;
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
                GetLineUseCase,
                { provide: LINE_REPO, useValue: repoMock },
            ],
        }).compile();

        useCase = module.get<GetLineUseCase>(GetLineUseCase);
    });

    it('should be defined', () => {
        expect(useCase).toBeDefined();
    });

    describe('execute (findById)', () => {
        it('should return a line when found', async () => {
            const mockLine = { _id: 'line123', name: 'Line A' };
            repoMock.findById.mockResolvedValue(mockLine as any);

            const result = await useCase.execute('line123');

            expect(repoMock.findById).toHaveBeenCalledWith('line123');
            expect(result).toEqual(mockLine);
        });

        it('should throw NotFoundException when line is not found', async () => {
            repoMock.findById.mockResolvedValue(null);

            await expect(useCase.execute('missing')).rejects.toThrow(NotFoundException);
            await expect(useCase.execute('missing')).rejects.toThrow('Line missing no encontrada');
        });
    });

    describe('executeGetAll', () => {
        it('should return all lines without filters', async () => {
            const mockList = [{ _id: '1', name: 'Line A' }, { _id: '2', name: 'Line B' }];
            repoMock.findAll.mockResolvedValue(mockList as any);

            const result = await useCase.executeGetAll();

            expect(repoMock.findAll).toHaveBeenCalledWith(undefined);
            expect(result).toEqual(mockList);
        });

        it('should filter active lines', async () => {
            repoMock.findAll.mockResolvedValue([]);

            await useCase.executeGetAll({ active: true });

            expect(repoMock.findAll).toHaveBeenCalledWith({ active: true });
        });
    });

    describe('executeGetByName', () => {
        it('should call repository.findByName with the given name', async () => {
            const mockLine = { _id: 'line123', name: 'Line A' };
            repoMock.findByName.mockResolvedValue(mockLine as any);

            const result = await useCase.executeGetByName('Line A');

            expect(repoMock.findByName).toHaveBeenCalledWith('Line A');
            expect(result).toEqual(mockLine);
        });
    });

    describe('executeGetStageHourlyStandards', () => {
        it('should call repository.getStageHourlyStandards with the given IDs', async () => {
            const mockStandards = [{ hour: 0, standard: 100 }];
            repoMock.getStageHourlyStandards.mockResolvedValue(mockStandards as any);

            const result = await useCase.executeGetStageHourlyStandards('lineId', 'stageId');

            expect(repoMock.getStageHourlyStandards).toHaveBeenCalledWith('lineId', 'stageId');
            expect(result).toEqual(mockStandards);
        });
    });
});
