import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './store.entity';
import { StoreBook } from './store-book.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { BooksClientService } from '../books/books-client.service';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
    @InjectRepository(StoreBook)
    private storeBooksRepository: Repository<StoreBook>,
    private booksClientService: BooksClientService,
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const store = this.storesRepository.create({
      name: createStoreDto.name,
    });
    return this.storesRepository.save(store);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Store>> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.storesRepository.findAndCount({
      relations: ['storeBooks'],
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        pageCount: totalPages,
      },
    };
  }

  async findOne(id: number): Promise<Store> {
    const store = await this.storesRepository.findOne({
      where: { id },
      relations: ['storeBooks'],
    });
    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
    return store;
  }

  async update(id: number, updateStoreDto: UpdateStoreDto): Promise<Store> {
    const store = await this.findOne(id);

    store.name = updateStoreDto.name;
    return this.storesRepository.save(store);
  }

  async remove(id: number): Promise<void> {
    const store = await this.findOne(id);
    await this.storesRepository.remove(store);
  }

  async addBook(storeId: number, bookId: number): Promise<Store> {
    const store = await this.findOne(storeId);

    if(!store) {
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    }

    const bookExists = await this.booksClientService.validateBookExists(bookId);
    if (!bookExists) {
      throw new NotFoundException(`Book with ID ${bookId} not found`);
    }

    const existingStoreBook = await this.storeBooksRepository.findOne({
      where: { storeId, bookId },
    });

    if (existingStoreBook) {
      throw new BadRequestException(`Book with ID ${bookId} is already in the store`);
    }

    const storeBook = this.storeBooksRepository.create({
      storeId,
      bookId,
    });
    await this.storeBooksRepository.save(storeBook);

    return this.findOne(storeId);
  }

  async removeBook(storeId: number, bookId: number): Promise<Store> {
    const store = await this.findOne(storeId);
    if(!store) {
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    }

    const storeBook = await this.storeBooksRepository.findOne({
      where: { storeId, bookId },
    });

    if (!storeBook) {
      throw new NotFoundException(`Book with ID ${bookId} is not in the store`);
    }

    await this.storeBooksRepository.remove(storeBook);

    return this.findOne(storeId);
  }

  async getBooks(storeId: number): Promise<any[]> {
    const store = await this.findOne(storeId);

    if (!store.storeBooks || store.storeBooks.length === 0) {
      return [];
    }

    const bookIds = store.storeBooks.map((storeBook) => storeBook.bookId);

    const books = await Promise.all(
      bookIds.map((bookId) => this.booksClientService.getBook(bookId)),
    );

    return books;
  }
}

