import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
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

  @Column({ unique: true })
  storeId!: string;

  @Column({ type: 'json' })
  session!: ShopifySession;

  @OneToOne(() => StoreEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'storeId' })
  store?: StoreEntity;
}
