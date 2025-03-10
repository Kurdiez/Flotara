import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreEntity } from '../database/entities/store.entity';
import { StoreIntegrationEntity } from '../database/entities/store-integration.entity';
import { ShopifySession } from '~/commons/types/auth';

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);

  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,
    @InjectRepository(StoreIntegrationEntity)
    private readonly integrationRepository: Repository<StoreIntegrationEntity>,
  ) {}

  async storeSession(sessionData: ShopifySession) {
    try {
      this.logger.debug('Finding store:', { shopDomain: sessionData.shop });

      // 스토어 엔티티 생성 또는 조회
      let store = await this.storeRepository.findOne({
        where: { shopifyStoreDomain: sessionData.shop },
        relations: ['integration'],
      });

      if (!store) {
        this.logger.debug('Store not found, creating new store');
        store = this.storeRepository.create({
          shopifyStoreDomain: sessionData.shop,
          shopifyStoreId: sessionData.id,
        });
        await this.storeRepository.save(store);
        this.logger.debug('New store created:', { storeId: store.id });
      }

      // 스토어 통합 정보 업데이트
      if (store.integration) {
        this.logger.debug('Updating existing integration');
        store.integration.session = sessionData;
        await this.integrationRepository.save(store.integration);
      } else {
        this.logger.debug('Creating new integration');
        const integration = this.integrationRepository.create({
          storeId: store.id,
          session: sessionData,
        });
        await this.integrationRepository.save(integration);
      }

      this.logger.log('Session stored successfully');
      return true;
    } catch (error) {
      this.logger.error('Error in storeSession:', error);
      throw error;
    }
  }

  async loadSession(id: string): Promise<ShopifySession | undefined> {
    try {
      this.logger.debug('Loading session:', { id });
      const integration = await this.integrationRepository
        .createQueryBuilder('integration')
        .innerJoinAndSelect('integration.store', 'store')
        .where('store.shopifyStoreId = :id', { id })
        .getOne();

      return integration?.session;
    } catch (error) {
      this.logger.error('Error in loadSession:', error);
      throw error;
    }
  }

  async deleteSession(id: string): Promise<boolean> {
    try {
      this.logger.debug('Deleting session:', { id });
      const integration = await this.integrationRepository
        .createQueryBuilder('integration')
        .innerJoinAndSelect('integration.store', 'store')
        .where('store.shopifyStoreId = :id', { id })
        .getOne();

      if (integration) {
        await this.integrationRepository.remove(integration);
        this.logger.debug('Session deleted successfully');
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error('Error in deleteSession:', error);
      throw error;
    }
  }

  async findSessionsByShop(shop: string): Promise<ShopifySession[]> {
    try {
      this.logger.debug('Finding sessions for shop:', { shop });
      const integration = await this.integrationRepository
        .createQueryBuilder('integration')
        .innerJoinAndSelect('integration.store', 'store')
        .where('store.shopifyStoreDomain = :shop', { shop })
        .getOne();

      return integration ? [integration.session] : [];
    } catch (error) {
      this.logger.error('Error in findSessionsByShop:', error);
      throw error;
    }
  }
}
