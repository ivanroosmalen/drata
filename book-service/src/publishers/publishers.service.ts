import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publisher } from './publisher.entity';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';

@Injectable()
export class PublishersService {
  constructor(
    @InjectRepository(Publisher)
    private publishersRepository: Repository<Publisher>,
  ) {}

  async create(createPublisherDto: CreatePublisherDto): Promise<Publisher> {
    const publisher = this.publishersRepository.create(createPublisherDto);
    return await this.publishersRepository.save(publisher);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Publisher>> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.publishersRepository.findAndCount({
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

  async findOne(id: number): Promise<Publisher> {
    const publisher = await this.publishersRepository.findOne({
      where: { id },
      relations: ['books'],
    });
    
    if (!publisher) {
      throw new NotFoundException(`Publisher with ID ${id} not found`);
    }
    return publisher;
  }

  async update(id: number, updatePublisherDto: UpdatePublisherDto): Promise<Publisher> {
    const publisher = await this.findOne(id);
    
    publisher.name = updatePublisherDto.name;
    publisher.address = updatePublisherDto.address || null;
    return await this.publishersRepository.save(publisher);
  }

  async remove(id: number): Promise<void> {
    const publisher = await this.findOne(id);

    await this.publishersRepository.remove(publisher);
  }
}

