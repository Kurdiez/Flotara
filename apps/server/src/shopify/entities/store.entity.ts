import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('shopify_stores')
export class ShopifyStore {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  storeId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
