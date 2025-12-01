import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { PublishersService } from '../../src/publishers/publishers.service';
import { Publisher } from '../../src/publishers/publisher.entity';
import { CreatePublisherDto } from '../../src/publishers/dto/create-publisher.dto';
import { UpdatePublisherDto } from '../../src/publishers/dto/update-publisher.dto';

describe('PublishersService', () => {
  let service: PublishersService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublishersService,
        {
          provide: getRepositoryToken(Publisher),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PublishersService>(PublishersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new publisher', async () => {
      const createPublisherDto: CreatePublisherDto = {
        name: 'Test Publisher',
        address: '123 Main St',
      };
      const publisher = { id: 1, ...createPublisherDto } as Publisher;

      mockRepository.create.mockReturnValue(publisher);
      mockRepository.save.mockResolvedValue(publisher);

      const result = await service.create(createPublisherDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createPublisherDto);
      expect(mockRepository.save).toHaveBeenCalledWith(publisher);
      expect(result).toEqual(publisher);
    });
  });

  describe('findAll', () => {
    it('should return paginated publishers with books', async () => {
      const publishers = [
        { id: 1, name: 'Publisher 1', address: 'Address 1', books: [] },
        { id: 2, name: 'Publisher 2', address: 'Address 2', books: [] },
      ] as Publisher[];
      const total = 2;

      mockRepository.findAndCount.mockResolvedValue([publishers, total]);

      const result = await service.findAll(1, 10);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        relations: ['books'],
        skip: 0,
        take: 10,
      });
      expect(result).toEqual({
        data: publishers,
        meta: {
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
          pageCount: 1,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a publisher by id with books', async () => {
      const publisher = { id: 1, name: 'Test Publisher', address: '123 Main St', books: [] } as Publisher;

      mockRepository.findOne.mockResolvedValue(publisher);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['books'],
      });
      expect(result).toEqual(publisher);
    });

    it('should throw NotFoundException if publisher not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a publisher with full object', async () => {
      const publisher = { id: 1, name: 'Old Name', address: 'Old Address' } as Publisher;
      const updatePublisherDto: UpdatePublisherDto = {
        name: 'New Name',
        address: 'New Address',
      };
      const updatedPublisher = { ...publisher, ...updatePublisherDto };

      mockRepository.findOne.mockResolvedValue(publisher);
      mockRepository.save.mockResolvedValue(updatedPublisher);

      const result = await service.update(1, updatePublisherDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['books'],
      });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual(updatedPublisher);
    });
  });

  describe('remove', () => {
    it('should remove a publisher', async () => {
      const publisher = { id: 1, name: 'Test Publisher', address: '123 Main St' } as Publisher;

      mockRepository.findOne.mockResolvedValue(publisher);
      mockRepository.remove.mockResolvedValue(publisher);

      await service.remove(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['books'],
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(publisher);
    });
  });
});

