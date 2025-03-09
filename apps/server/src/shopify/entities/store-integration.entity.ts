import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ShopifyStore } from './store.entity';

interface ShopifySession {
  id: string;
  shop: string;
  state: string;
  isOnline: boolean;
  accessToken: string;
}

@Entity('shopify_store_integrations')
export class ShopifyStoreIntegration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  storeId: string;

  @Column({ type: 'json' })
  session: ShopifySession;

  @OneToOne(() => ShopifyStore, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storeId' })
  store: ShopifyStore;
}
