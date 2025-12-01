import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Author } from '../authors/author.entity';
import { Publisher } from '../publishers/publisher.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @ManyToOne(() => Author)
  @JoinColumn({ name: 'authorId' })
  author: Author;

  @Column()
  authorId: number;

  @ManyToOne(() => Publisher)
  @JoinColumn({ name: 'publisherId' })
  publisher: Publisher;

  @Column()
  publisherId: number;

  @Column({ type: 'date' })
  releaseDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
