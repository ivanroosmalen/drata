import { Test, TestingModule } from '@nestjs/testing';
import { PublishersController } from '../../src/publishers/publishers.controller';
import { PublishersService } from '../../src/publishers/publishers.service';
import { CreatePublisherDto } from '../../src/publishers/dto/create-publisher.dto';
import { UpdatePublisherDto } from '../../src/publishers/dto/update-publisher.dto';

describe('PublishersController', () => {
  let controller: PublishersController;
  let service: PublishersService;

  const mockPublishersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublishersController],
      providers: [
        {
          provide: PublishersService,
          useValue: mockPublishersService,
        },
      ],
    }).compile();

    controller = module.get<PublishersController>(PublishersController);
    service = module.get<PublishersService>(PublishersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a publisher', async () => {
      const createPublisherDto: CreatePublisherDto = {
        name: 'Test Publisher',
        address: '123 Main St',
      };
      const publisher = { id: 1, ...createPublisherDto };

      mockPublishersService.create.mockResolvedValue(publisher);

      const result = await controller.create(createPublisherDto);

      expect(service.create).toHaveBeenCalledWith(createPublisherDto);
      expect(result).toEqual(publisher);
    });
  });

  describe('findAll', () => {
    it('should return paginated publishers', async () => {
      const paginatedResponse = {
        data: [
          { id: 1, name: 'Publisher 1', address: 'Address 1' },
          { id: 2, name: 'Publisher 2', address: 'Address 2' },
        ],
        meta: {
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
          pageCount: 1,
        },
      };

      mockPublishersService.findAll.mockResolvedValue(paginatedResponse);

      const result = await controller.findAll({ page: 1, limit: 10 });

      expect(service.findAll).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(paginatedResponse);
    });
  });

  describe('findOne', () => {
    it('should return a publisher by id', async () => {
      const publisher = { id: 1, name: 'Test Publisher', address: '123 Main St' };

      mockPublishersService.findOne.mockResolvedValue(publisher);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(publisher);
    });
  });

  describe('update', () => {
    it('should update a publisher with full object', async () => {
      const updatePublisherDto: UpdatePublisherDto = {
        name: 'Updated Publisher',
        address: 'Updated Address',
      };
      const updatedPublisher = { id: 1, ...updatePublisherDto };

      mockPublishersService.update.mockResolvedValue(updatedPublisher);

      const result = await controller.update(1, updatePublisherDto);

      expect(service.update).toHaveBeenCalledWith(1, updatePublisherDto);
      expect(result).toEqual(updatedPublisher);
    });
  });

  describe('remove', () => {
    it('should remove a publisher', async () => {
      mockPublishersService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});

