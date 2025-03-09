import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('shopify_stores')
export class ShopifyStore {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  storeId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
