import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StoreIntegrationEntity } from './store-integration.entity';

@Entity('store')
export class StoreEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column('varchar')
  shopifyStoreId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne(() => StoreIntegrationEntity, (integration) => integration.store, {
    cascade: true,
  })
  integration?: StoreIntegrationEntity;
}
