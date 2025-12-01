import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BooksClientService } from './books-client.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [BooksClientService],
  exports: [BooksClientService],
})
export class BooksModule {}

