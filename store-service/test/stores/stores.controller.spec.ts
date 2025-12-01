import { Test, TestingModule } from '@nestjs/testing';
import { StoresController } from '../../src/stores/stores.controller';
import { StoresService } from '../../src/stores/stores.service';
import { CreateStoreDto } from '../../src/stores/dto/create-store.dto';
import { UpdateStoreDto } from '../../src/stores/dto/update-store.dto';
import { AddBookDto } from '../../src/stores/dto/add-book.dto';

describe('StoresController', () => {
  let controller: StoresController;
  let service: StoresService;

  const mockStoresService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    addBook: jest.fn(),
    removeBook: jest.fn(),
    getBooks: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoresController],
      providers: [
        {
          provide: StoresService,
          useValue: mockStoresService,
        },
      ],
    }).compile();

    controller = module.get<StoresController>(StoresController);
    service = module.get<StoresService>(StoresService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a store', async () => {
      const createStoreDto: CreateStoreDto = {
        name: 'Test Store',
      };
      const store = { id: 1, ...createStoreDto, storeBooks: [] };

      mockStoresService.create.mockResolvedValue(store);

      const result = await controller.create(createStoreDto);

      expect(service.create).toHaveBeenCalledWith(createStoreDto);
      expect(result).toEqual(store);
    });
  });

  describe('findAll', () => {
    it('should return paginated stores', async () => {
      const paginatedResponse = {
        data: [
          { id: 1, name: 'Store 1', address: 'Address 1', storeBooks: [] },
          { id: 2, name: 'Store 2', address: 'Address 2', storeBooks: [] },
        ],
        meta: {
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
          pageCount: 1,
        },
      };

      mockStoresService.findAll.mockResolvedValue(paginatedResponse);

      const result = await controller.findAll({ page: 1, limit: 10 });

      expect(service.findAll).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(paginatedResponse);
    });
  });

  describe('findOne', () => {
    it('should return a store by id', async () => {
      const store = { id: 1, name: 'Test Store', address: '123 Main St', storeBooks: [] };

      mockStoresService.findOne.mockResolvedValue(store);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(store);
    });
  });

  describe('update', () => {
    it('should update a store with full object', async () => {
      const updateStoreDto: UpdateStoreDto = {
        name: 'Updated Store',
      };
      const updatedStore = { id: 1, ...updateStoreDto, storeBooks: [] };

      mockStoresService.update.mockResolvedValue(updatedStore);

      const result = await controller.update(1, updateStoreDto);

      expect(service.update).toHaveBeenCalledWith(1, updateStoreDto);
      expect(result).toEqual(updatedStore);
    });
  });

  describe('remove', () => {
    it('should remove a store', async () => {
      mockStoresService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('addBook', () => {
    it('should add a book to a store', async () => {
      const addBookDto: AddBookDto = { bookId: 1 };
      const store = { id: 1, name: 'Test Store', storeBooks: [{ id: 1, storeId: 1, bookId: 1 }] };

      mockStoresService.addBook.mockResolvedValue(store);

      const result = await controller.addBook(1, addBookDto);

      expect(service.addBook).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual(store);
    });
  });

  describe('getBooks', () => {
    it('should return books from a store', async () => {
      const books = [
        { id: 1, title: 'Book 1' },
        { id: 2, title: 'Book 2' },
      ];

      mockStoresService.getBooks.mockResolvedValue(books);

      const result = await controller.getBooks(1);

      expect(service.getBooks).toHaveBeenCalledWith(1);
      expect(result).toEqual(books);
    });
  });

  describe('removeBook', () => {
    it('should remove a book from a store', async () => {
      const store = { id: 1, name: 'Test Store', storeBooks: [] };

      mockStoresService.removeBook.mockResolvedValue(store);

      const result = await controller.removeBook(1, 1);

      expect(service.removeBook).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual(store);
    });
  });
});

