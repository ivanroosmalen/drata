import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthorsService } from '../authors/authors.service';
import { PublishersService } from '../publishers/publishers.service';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    private authorsService: AuthorsService,
    private publishersService: PublishersService,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const author = await this.authorsService.findOne(createBookDto.authorId);
    if(!author) {
      throw new NotFoundException(`Author with ID ${createBookDto.authorId} not found`);
    }
    
    const publisher = await this.publishersService.findOne(createBookDto.publisherId);
    if(!publisher) {
      throw new NotFoundException(`Publisher with ID ${createBookDto.publisherId} not found`);
    }

    const book = this.booksRepository.create({
      title: createBookDto.title,
      authorId: createBookDto.authorId,
      publisherId: createBookDto.publisherId,
      releaseDate: new Date(createBookDto.releaseDate),
    });
    return await this.booksRepository.save(book);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Book>> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.booksRepository.findAndCount({
      relations: ['author', 'publisher'],
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

  async findOne(id: number): Promise<Book> {
    const book = await this.booksRepository.findOne({
      where: { id },
      relations: ['author', 'publisher'],
    });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);

    if (updateBookDto.authorId !== book.authorId) {
      await this.authorsService.findOne(updateBookDto.authorId);
    }

    if (updateBookDto.publisherId !== book.publisherId) {
      await this.publishersService.findOne(updateBookDto.publisherId);
    }

    book.title = updateBookDto.title;
    book.authorId = updateBookDto.authorId;
    book.publisherId = updateBookDto.publisherId;
    book.releaseDate = new Date(updateBookDto.releaseDate);
    return this.booksRepository.save(book);
  }

  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);

    await this.booksRepository.remove(book);
  }
}
