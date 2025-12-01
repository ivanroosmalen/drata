import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

export interface Book {
  id: number;
  title: string;
  authorId: number;
  publisherId: number;
  releaseDate: string;
  createdAt: string;
  updatedAt: string;
  author?: any;
  publisher?: any;
}

@Injectable()
export class BooksClientService {
  private readonly bookServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.bookServiceUrl = this.configService.get<string>(
      'BOOK_SERVICE_URL',
      'http://book-service:3000',
    );
  }

  async getBook(bookId: number): Promise<Book> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<Book>(`${this.bookServiceUrl}/v1/books/${bookId}`),
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new HttpException(
          `Book with ID ${bookId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        'Failed to fetch book from book-service',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async getBooks(page: number = 1, limit: number = 10): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.bookServiceUrl}/v1/books`, {
          params: { page, limit },
        }),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch books from book-service',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async validateBookExists(bookId: number): Promise<boolean> {
    try {
      await this.getBook(bookId);
      return true;
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        return false;
      }
      throw error;
    }
  }
}

