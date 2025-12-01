import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { AuthorsService } from '../../src/authors/authors.service';
import { Author } from '../../src/authors/author.entity';
import { CreateAuthorDto } from '../../src/authors/dto/create-author.dto';
import { UpdateAuthorDto } from '../../src/authors/dto/update-author.dto';

describe('AuthorsService', () => {
  let service: AuthorsService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        {
          provide: getRepositoryToken(Author),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new author', async () => {
      const createAuthorDto: CreateAuthorDto = {
        firstName: 'John',
        lastName: 'Doe',
      };
      const author = { id: 1, ...createAuthorDto } as Author;

      mockRepository.create.mockReturnValue(author);
      mockRepository.save.mockResolvedValue(author);

      const result = await service.create(createAuthorDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createAuthorDto);
      expect(mockRepository.save).toHaveBeenCalledWith(author);
      expect(result).toEqual(author);
    });

    it('should propagate error on exception', async () => {
      const createAuthorDto: CreateAuthorDto = {
        firstName: 'John',
        lastName: 'Doe',
      };
      const author = { id: 1, ...createAuthorDto } as Author;

      mockRepository.create.mockReturnValue(author);
      mockRepository.save.mockRejectedValue(new Error('Test error'));

      await expect(service.create(createAuthorDto)).rejects.toThrow(Error);
    });
  });

  describe('findAll', () => {
    it('should return paginated authors with books', async () => {
      const authors = [
        { id: 1, firstName: 'John', lastName: 'Doe', books: [] },
        { id: 2, firstName: 'Jane', lastName: 'Doe', books: [] },
      ] as Author[];
      const total = 2;

      mockRepository.findAndCount.mockResolvedValue([authors, total]);

      const result = await service.findAll(1, 10);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        relations: ['books'],
        skip: 0,
        take: 10,
      });
      expect(result).toEqual({
        data: authors,
        meta: {
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
          pageCount: 1,
        },
      });
    });

    it('should handle pagination with different page and limit', async () => {
      const authors = [{ id: 1, firstName: 'John', lastName: 'Doe', books: [] }] as Author[];
      const total = 25;

      mockRepository.findAndCount.mockResolvedValue([authors, total]);

      const result = await service.findAll(2, 10);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        relations: ['books'],
        skip: 10,
        take: 10,
      });
      expect(result.meta.totalPages).toBe(3);
      expect(result.meta.pageCount).toBe(3);
      expect(result.meta.page).toBe(2);
    });

    it('should propagate error on exception', async () => {
      mockRepository.findAndCount.mockRejectedValue(new Error('Test error'));

      await expect(service.findAll(1, 10)).rejects.toThrow(Error);
    });
  });

  describe('findOne', () => {
    it('should return an author by id with books', async () => {
      const author = { id: 1, firstName: 'John', lastName: 'Doe', books: [] } as Author;

      mockRepository.findOne.mockResolvedValue(author);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['books'],
      });
      expect(result).toEqual(author);
    });

    it('should throw NotFoundException if author not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('should propagate error on exception', async () => {
      mockRepository.findOne.mockRejectedValue(new Error('Test error'));

      await expect(service.findOne(999)).rejects.toThrow(Error);
    });
  });

  describe('update', () => {
    it('should update an author with full object', async () => {
      const author = { id: 1, firstName: 'John', lastName: 'Doe' } as Author;
      const updateAuthorDto: UpdateAuthorDto = {
        firstName: 'John Updated',
        lastName: 'Doe Updated',
      };
      const updatedAuthor = { ...author, ...updateAuthorDto };

      mockRepository.findOne.mockResolvedValue(author);
      mockRepository.save.mockResolvedValue(updatedAuthor);

      const result = await service.update(1, updateAuthorDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['books'] });
      expect(mockRepository.save).toHaveBeenCalledWith(updatedAuthor);
      expect(result).toEqual(updatedAuthor);
    });

    it('should propagate error on exception', async () => {
      mockRepository.findOne.mockRejectedValue(new Error('Test error'));
      mockRepository.save.mockRejectedValue(new Error('Test error'));

      await expect(service.update(1, { firstName: 'John Updated', lastName: 'Doe Updated' })).rejects.toThrow(Error);
    });
  });

  describe('remove', () => {
    it('should remove an author', async () => {
      const author = { id: 1, firstName: 'John', lastName: 'Doe' } as Author;

      mockRepository.findOne.mockResolvedValue(author);
      mockRepository.remove.mockResolvedValue(author);

      await service.remove(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['books'] });
      expect(mockRepository.remove).toHaveBeenCalledWith(author);
    });

    it('should propagate error on exception', async () => {
      mockRepository.findOne.mockRejectedValue(new Error('Test error'));
      mockRepository.remove.mockRejectedValue(new Error('Test error'));

      await expect(service.remove(1)).rejects.toThrow(Error);
    });
  });
});
