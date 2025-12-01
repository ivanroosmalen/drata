import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { StoresService } from '../../src/stores/stores.service';
import { Store } from '../../src/stores/store.entity';
import { StoreBook } from '../../src/stores/store-book.entity';
import { CreateStoreDto } from '../../src/stores/dto/create-store.dto';
import { UpdateStoreDto } from '../../src/stores/dto/update-store.dto';
import { BooksClientService } from '../../src/books/books-client.service';

describe('StoresService', () => {
  let service: StoresService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockStoreBooksRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockBooksClientService = {
    getBook: jest.fn(),
    validateBookExists: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoresService,
        {
          provide: getRepositoryToken(Store),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(StoreBook),
          useValue: mockStoreBooksRepository,
        },
        {
          provide: BooksClientService,
          useValue: mockBooksClientService,
        },
      ],
    }).compile();

    service = module.get<StoresService>(StoresService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new store', async () => {
      const createStoreDto: CreateStoreDto = {
        name: 'Test Store',
      };
      const store = { id: 1, ...createStoreDto, storeBooks: [] } as Store;

      mockRepository.create.mockReturnValue(store);
      mockRepository.save.mockResolvedValue(store);

      const result = await service.create(createStoreDto);

      expect(mockRepository.create).toHaveBeenCalledWith({
        name: createStoreDto.name,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(store);
      expect(result).toEqual(store);
    });
  });

  describe('findAll', () => {
    it('should return paginated stores', async () => {
      const stores = [
        { id: 1, name: 'Store 1', storeBooks: [] },
        { id: 2, name: 'Store 2', storeBooks: [] },
      ] as Store[];
      const total = 2;

      mockRepository.findAndCount.mockResolvedValue([stores, total]);

      const result = await service.findAll(1, 10);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        relations: ['storeBooks'],
        skip: 0,
        take: 10,
      });
      expect(result).toEqual({
        data: stores,
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
    it('should return a store by id', async () => {
      const store = { id: 1, name: 'Test Store', storeBooks: [] } as Store;

      mockRepository.findOne.mockResolvedValue(store);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['storeBooks'],
      });
      expect(result).toEqual(store);
    });

    it('should throw NotFoundException if store not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a store with full object', async () => {
      const store = { id: 1, name: 'Old Name', storeBooks: [] } as Store;
      const updateStoreDto: UpdateStoreDto = {
        name: 'New Name',
      };
      const updatedStore = { ...store, ...updateStoreDto };

      mockRepository.findOne.mockResolvedValue(store);
      mockRepository.save.mockResolvedValue(updatedStore);

      const result = await service.update(1, updateStoreDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['storeBooks'],
      });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual(updatedStore);
    });
  });

  describe('remove', () => {
    it('should remove a store', async () => {
      const store = { id: 1, name: 'Test Store', storeBooks: [] } as Store;

      mockRepository.findOne.mockResolvedValue(store);
      mockRepository.remove.mockResolvedValue(store);

      await service.remove(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['storeBooks'],
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(store);
    });
  });

  describe('addBook', () => {
    it('should add a book to a store', async () => {
      const store = { id: 1, name: 'Test Store', storeBooks: [] } as Store;
      const bookId = 1;
      const storeBook = { id: 1, storeId: 1, bookId: 1 } as StoreBook;
      const updatedStore = { ...store, storeBooks: [storeBook] } as Store;

      mockRepository.findOne.mockResolvedValue(store);
      mockBooksClientService.validateBookExists.mockResolvedValue(true);
      mockStoreBooksRepository.findOne.mockResolvedValue(null);
      mockStoreBooksRepository.create.mockReturnValue(storeBook);
      mockStoreBooksRepository.save.mockResolvedValue(storeBook);
      mockRepository.findOne.mockResolvedValueOnce(store).mockResolvedValueOnce(updatedStore);

      const result = await service.addBook(1, bookId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['storeBooks'],
      });
      expect(mockBooksClientService.validateBookExists).toHaveBeenCalledWith(bookId);
      expect(mockStoreBooksRepository.findOne).toHaveBeenCalledWith({
        where: { storeId: 1, bookId: 1 },
      });
      expect(result.storeBooks).toContainEqual(storeBook);
    });

    it('should throw BadRequestException if book already in store', async () => {
      const store = { id: 1, name: 'Test Store', storeBooks: [] } as Store;
      const existingStoreBook = { id: 1, storeId: 1, bookId: 1 } as StoreBook;

      mockRepository.findOne.mockResolvedValue(store);
      mockBooksClientService.validateBookExists.mockResolvedValue(true);
      mockStoreBooksRepository.findOne.mockResolvedValue(existingStoreBook);

      await expect(service.addBook(1, 1)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if book does not exist', async () => {
      const store = { id: 1, name: 'Test Store', storeBooks: [] } as Store;

      mockRepository.findOne.mockResolvedValue(store);
      mockBooksClientService.validateBookExists.mockResolvedValue(false);

      await expect(service.addBook(1, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeBook', () => {
    it('should remove a book from a store', async () => {
      const storeBook1 = { id: 1, storeId: 1, bookId: 1 } as StoreBook;
      const storeBook2 = { id: 2, storeId: 1, bookId: 2 } as StoreBook;
      const store = { id: 1, name: 'Test Store', storeBooks: [storeBook1, storeBook2] } as Store;
      const updatedStore = { ...store, storeBooks: [storeBook2] } as Store;

      mockRepository.findOne.mockResolvedValue(store);
      mockStoreBooksRepository.findOne.mockResolvedValue(storeBook1);
      mockStoreBooksRepository.remove.mockResolvedValue(storeBook1);
      mockRepository.findOne.mockResolvedValueOnce(store).mockResolvedValueOnce(updatedStore);

      const result = await service.removeBook(1, 1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['storeBooks'],
      });
      expect(mockStoreBooksRepository.findOne).toHaveBeenCalledWith({
        where: { storeId: 1, bookId: 1 },
      });
      expect(result.storeBooks).not.toContainEqual(storeBook1);
    });

    it('should throw NotFoundException if book is not in store', async () => {
      const store = { id: 1, name: 'Test Store', storeBooks: [] } as Store;

      mockRepository.findOne.mockResolvedValue(store);
      mockStoreBooksRepository.findOne.mockResolvedValue(null);

      await expect(service.removeBook(1, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getBooks', () => {
    it('should return books from book-service', async () => {
      const storeBook1 = { id: 1, storeId: 1, bookId: 1 } as StoreBook;
      const storeBook2 = { id: 2, storeId: 1, bookId: 2 } as StoreBook;
      const store = { id: 1, name: 'Test Store', storeBooks: [storeBook1, storeBook2] } as Store;
      const book1 = { id: 1, title: 'Book 1' };
      const book2 = { id: 2, title: 'Book 2' };

      mockRepository.findOne.mockResolvedValue(store);
      mockBooksClientService.getBook
        .mockResolvedValueOnce(book1)
        .mockResolvedValueOnce(book2);

      const result = await service.getBooks(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['storeBooks'],
      });
      expect(mockBooksClientService.getBook).toHaveBeenCalledWith(1);
      expect(mockBooksClientService.getBook).toHaveBeenCalledWith(2);
      expect(result).toEqual([book1, book2]);
    });

    it('should return empty array if store has no books', async () => {
      const store = { id: 1, name: 'Test Store', storeBooks: [] } as Store;

      mockRepository.findOne.mockResolvedValue(store);

      const result = await service.getBooks(1);

      expect(result).toEqual([]);
    });
  });
});

