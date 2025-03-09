import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StoreEntity } from './store.entity';

// shopify session type
interface ShopifySession {
  id: string;
  shop: string;
  state: string;
  isOnline: boolean;
  accessToken: string;
}

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
