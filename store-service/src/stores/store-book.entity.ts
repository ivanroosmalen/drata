import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Store } from './store.entity';

@Entity('store_books')
@Unique(['storeId', 'bookId'])
export class StoreBook {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  storeId: number;

  @ManyToOne(() => Store, (store) => store.storeBooks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @Column()
  bookId: number;

  @CreateDateColumn()
  createdAt: Date;
}

