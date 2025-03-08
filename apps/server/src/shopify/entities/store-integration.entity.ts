import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ShopifyStore } from './store.entity';

@Entity('shopify_store_integrations')
export class ShopifyStoreIntegration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  storeId: string;

  @Column({ type: 'json' })
  session: Record<string, any>;

  @ManyToOne(() => ShopifyStore, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storeId' })
  store: ShopifyStore;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
