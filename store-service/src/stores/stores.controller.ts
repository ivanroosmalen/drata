import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { AddBookDto } from './dto/add-book.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Controller({ path: 'stores', version: '1' })
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storesService.create(createStoreDto);
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.storesService.findAll(paginationQuery.page, paginationQuery.limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.storesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storesService.update(id, updateStoreDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.storesService.remove(id);
  }

  @Post(':id/books')
  addBook(@Param('id', ParseIntPipe) id: number, @Body() addBookDto: AddBookDto) {
    return this.storesService.addBook(id, addBookDto.bookId);
  }

  @Get(':id/books')
  getBooks(@Param('id', ParseIntPipe) id: number) {
    return this.storesService.getBooks(id);
  }

  @Delete(':id/books/:bookId')
  removeBook(@Param('id', ParseIntPipe) id: number, @Param('bookId', ParseIntPipe) bookId: number) {
    return this.storesService.removeBook(id, bookId);
  }
}

