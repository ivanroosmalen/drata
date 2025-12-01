import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from '../../src/books/books.controller';
import { BooksService } from '../../src/books/books.service';
import { CreateBookDto } from '../../src/books/dto/create-book.dto';
import { UpdateBookDto } from '../../src/books/dto/update-book.dto';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  const mockBooksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        authorId: 1,
        publisherId: 1,
        releaseDate: '2023-01-01',
      };
      const book = { id: 1, ...createBookDto, releaseDate: new Date(createBookDto.releaseDate) };

      mockBooksService.create.mockResolvedValue(book);

      const result = await controller.create(createBookDto);

      expect(service.create).toHaveBeenCalledWith(createBookDto);
      expect(result).toEqual(book);
    });
  });

  describe('findAll', () => {
    it('should return paginated books', async () => {
      const paginatedResponse = {
        data: [
          { id: 1, title: 'Book 1', authorId: 1, publisherId: 1, releaseDate: new Date('2023-01-01') },
          { id: 2, title: 'Book 2', authorId: 1, publisherId: 1, releaseDate: new Date('2023-02-01') },
        ],
        meta: {
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
          pageCount: 1,
        },
      };

      mockBooksService.findAll.mockResolvedValue(paginatedResponse);

      const result = await controller.findAll({ page: 1, limit: 10 });

      expect(service.findAll).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(paginatedResponse);
    });
  });

  describe('findOne', () => {
    it('should return a book by id', async () => {
      const book = { id: 1, title: 'Test Book', authorId: 1, publisherId: 1, releaseDate: new Date('2023-01-01') };

      mockBooksService.findOne.mockResolvedValue(book);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(book);
    });
  });

  describe('update', () => {
    it('should update a book with full object', async () => {
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book',
        authorId: 1,
        publisherId: 1,
        releaseDate: '2024-01-01',
      };
      const updatedBook = {
        id: 1,
        ...updateBookDto,
        releaseDate: new Date(updateBookDto.releaseDate),
      };

      mockBooksService.update.mockResolvedValue(updatedBook);

      const result = await controller.update(1, updateBookDto);

      expect(service.update).toHaveBeenCalledWith(1, updateBookDto);
      expect(result).toEqual(updatedBook);
    });
  });

  describe('remove', () => {
    it('should remove a book', async () => {
      mockBooksService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
