import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsController } from '../../src/authors/authors.controller';
import { AuthorsService } from '../../src/authors/authors.service';
import { CreateAuthorDto } from '../../src/authors/dto/create-author.dto';
import { UpdateAuthorDto } from '../../src/authors/dto/update-author.dto';

describe('AuthorsController', () => {
  let controller: AuthorsController;
  let service: AuthorsService;

  const mockAuthorsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorsController],
      providers: [
        {
          provide: AuthorsService,
          useValue: mockAuthorsService,
        },
      ],
    }).compile();

    controller = module.get<AuthorsController>(AuthorsController);
    service = module.get<AuthorsService>(AuthorsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an author', async () => {
      const createAuthorDto: CreateAuthorDto = {
        firstName: 'John',
        lastName: 'Doe',
      };
      const author = { id: 1, ...createAuthorDto };

      mockAuthorsService.create.mockResolvedValue(author);

      const result = await controller.create(createAuthorDto);

      expect(service.create).toHaveBeenCalledWith(createAuthorDto);
      expect(result).toEqual(author);
    });
  });

  describe('findAll', () => {
    it('should return paginated authors', async () => {
      const paginatedResponse = {
        data: [
          { id: 1, name: 'John Doe', email: 'john@example.com' },
          { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
        ],
        meta: {
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
          pageCount: 1,
        },
      };

      mockAuthorsService.findAll.mockResolvedValue(paginatedResponse);

      const result = await controller.findAll({ page: 1, limit: 10 });

      expect(service.findAll).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(paginatedResponse);
    });
  });

  describe('findOne', () => {
    it('should return an author by id', async () => {
      const author = { id: 1, name: 'John Doe', email: 'john@example.com' };

      mockAuthorsService.findOne.mockResolvedValue(author);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(author);
    });
  });

  describe('update', () => {
    it('should update an author with full object', async () => {
      const updateAuthorDto: UpdateAuthorDto = {
        firstName: 'John Updated',
        lastName: 'Doe Updated',
      };
      const updatedAuthor = { id: 1, ...updateAuthorDto };

      mockAuthorsService.update.mockResolvedValue(updatedAuthor);

      const result = await controller.update(1, updateAuthorDto);

      expect(service.update).toHaveBeenCalledWith(1, updateAuthorDto);
      expect(result).toEqual(updatedAuthor);
    });
  });

  describe('remove', () => {
    it('should remove an author', async () => {
      mockAuthorsService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
