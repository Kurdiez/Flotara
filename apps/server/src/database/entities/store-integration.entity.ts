import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ShopifySession } from '~/commons/types/auth';
import { StoreEntity } from './store.entity';

@Entity('store_integration')
export class StoreIntegrationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column('uuid')
  storeId!: string;

  @Column({ type: 'json' })
  session!: ShopifySession;

  @OneToOne(() => StoreEntity, (store) => store.integration, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'storeId' })
  store?: StoreEntity;
}
