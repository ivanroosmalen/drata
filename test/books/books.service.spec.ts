import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { BooksService } from '../../src/books/books.service';
import { Book } from '../../src/books/book.entity';
import { CreateBookDto } from '../../src/books/dto/create-book.dto';
import { UpdateBookDto } from '../../src/books/dto/update-book.dto';
import { AuthorsService } from '../../src/authors/authors.service';

describe('BooksService', () => {
  let service: BooksService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockAuthorsService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockRepository,
        },
        {
          provide: AuthorsService,
          useValue: mockAuthorsService,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        authorId: 1,
        releaseDate: '2023-01-01',
      };
      const author = { id: 1, firstName: 'John', lastName: 'Doe' };
      const book = {
        id: 1,
        ...createBookDto,
        author,
        releaseDate: new Date(createBookDto.releaseDate),
      } as Book;

      mockAuthorsService.findOne.mockResolvedValue(author);
      mockRepository.create.mockReturnValue(book);
      mockRepository.save.mockResolvedValue(book);

      const result = await service.create(createBookDto);

      expect(mockAuthorsService.findOne).toHaveBeenCalledWith(1);
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalledWith(book);
      expect(result).toEqual(book);
    });
  });

  describe('findAll', () => {
    it('should return paginated books', async () => {
      const books = [
        { id: 1, title: 'Book 1', authorId: 1, releaseDate: new Date('2023-01-01') },
        { id: 2, title: 'Book 2', authorId: 1, releaseDate: new Date('2023-02-01') },
      ] as Book[];
      const total = 2;

      mockRepository.findAndCount.mockResolvedValue([books, total]);

      const result = await service.findAll(1, 10);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        relations: ['author'],
        skip: 0,
        take: 10,
      });
      expect(result).toEqual({
        data: books,
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
      const books = [
        { id: 1, title: 'Book 1', authorId: 1, releaseDate: new Date('2023-01-01') },
      ] as Book[];
      const total = 25;

      mockRepository.findAndCount.mockResolvedValue([books, total]);

      const result = await service.findAll(2, 10);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        relations: ['author'],
        skip: 10,
        take: 10,
      });
      expect(result.meta.totalPages).toBe(3);
      expect(result.meta.pageCount).toBe(3);
      expect(result.meta.page).toBe(2);
    });
  });

  describe('findOne', () => {
    it('should return a book by id', async () => {
      const book = {
        id: 1,
        title: 'Test Book',
        authorId: 1,
        releaseDate: new Date('2023-01-01'),
      } as Book;

      mockRepository.findOne.mockResolvedValue(book);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['author'],
      });
      expect(result).toEqual(book);
    });

    it('should throw NotFoundException if book not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a book with full object', async () => {
      const book = {
        id: 1,
        title: 'Old Title',
        authorId: 1,
        releaseDate: new Date('2023-01-01'),
      } as Book;
      const updateBookDto: UpdateBookDto = {
        title: 'New Title',
        authorId: 2,
        releaseDate: '2024-01-01',
      };
      const updatedBook = {
        ...book,
        ...updateBookDto,
        releaseDate: new Date(updateBookDto.releaseDate),
      };
      const author = { id: 2, firstName: 'Jane', lastName: 'Doe' };

      mockRepository.findOne.mockResolvedValue(book);
      mockAuthorsService.findOne.mockResolvedValue(author);
      mockRepository.save.mockResolvedValue(updatedBook);

      const result = await service.update(1, updateBookDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['author'],
      });
      expect(mockAuthorsService.findOne).toHaveBeenCalledWith(2);
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual(updatedBook);
    });
  });

  describe('remove', () => {
    it('should remove a book', async () => {
      const book = {
        id: 1,
        title: 'Test Book',
        authorId: 1,
        releaseDate: new Date('2023-01-01'),
      } as Book;

      mockRepository.findOne.mockResolvedValue(book);
      mockRepository.remove.mockResolvedValue(book);

      await service.remove(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['author'],
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(book);
    });
  });
});
