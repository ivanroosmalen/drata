import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './author.entity';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private authorsRepository: Repository<Author>,
  ) {}

  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const author = this.authorsRepository.create(createAuthorDto);
    return this.authorsRepository.save(author);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Author>> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.authorsRepository.findAndCount({
      relations: ['books'],
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

  async findOne(id: number): Promise<Author> {
    const author = await this.authorsRepository.findOne({
      where: { id },
      relations: ['books'],
    });

    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    
    return author;
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto): Promise<Author> {
    const author = await this.findOne(id);
    
    author.firstName = updateAuthorDto.firstName;
    author.lastName = updateAuthorDto.lastName;
    return this.authorsRepository.save(author);
  }

  async remove(id: number): Promise<void> {
    const author = await this.findOne(id);
    if(!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    
    await this.authorsRepository.remove(author);
  }
}
