import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Query,
  InternalServerErrorException,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { ShopifySession } from '~/commons/types/auth';

@Controller('sessions')
export class SessionsController {
  private readonly logger = new Logger(SessionsController.name);

  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  async storeSession(@Body() sessionData: ShopifySession) {
    try {
      this.logger.log(`Storing session for shop: ${sessionData.shop}`);
      this.logger.debug('Session data:', sessionData);

      const result = await this.sessionsService.storeSession(sessionData);

      this.logger.log(
        `Session stored successfully for shop: ${sessionData.shop}`,
      );
      return result;
    } catch (error) {
      this.logger.error('Error storing session:', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get(':id')
  async loadSession(
    @Param('id') id: string,
  ): Promise<ShopifySession | undefined> {
    try {
      this.logger.log(`Loading session: ${id}`);
      return await this.sessionsService.loadSession(id);
    } catch (error) {
      this.logger.error(`Error loading session ${id}:`, error);
      throw new InternalServerErrorException(error.message);
    }
  }

  @Delete(':id')
  async deleteSession(@Param('id') id: string): Promise<boolean> {
    try {
      this.logger.log(`Deleting session: ${id}`);
      return await this.sessionsService.deleteSession(id);
    } catch (error) {
      this.logger.error(`Error deleting session ${id}:`, error);
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get()
  async findSessionsByShop(
    @Query('shop') shop: string,
  ): Promise<ShopifySession[]> {
    try {
      this.logger.log(`Finding sessions for shop: ${shop}`);
      return await this.sessionsService.findSessionsByShop(shop);
    } catch (error) {
      this.logger.error(`Error finding sessions for shop ${shop}:`, error);
      throw new InternalServerErrorException(error.message);
    }
  }
}
