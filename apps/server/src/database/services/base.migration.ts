import { Logger } from '@nestjs/common';
import { LessThan, Repository } from 'typeorm';
import { LogExecutionTime } from '../utils/decorators';
import { loadMigrations } from '../utils/load-migrations';

export type MigrateFn = (content: unknown) => Promise<any>;

export abstract class BaseMigration {
  protected readonly logger: Logger;

  constructor(
    protected repository: Repository<any>,
    protected currentVersion: number,
    loggerName: string,
  ) {
    this.logger = new Logger(loggerName);
  }

  @LogExecutionTime('Entity Migration')
  async migrate() {
    const migrateFns = await this.getMigrateFns();
    const pageSize = 1000;
    let page = 0;
    let entities;

    do {
      entities = await this.repository.find({
        where: {
          version: LessThan(this.currentVersion),
        },
        skip: page * pageSize,
        take: pageSize,
      });

      await Promise.all(
        entities.map(async (entity) => this.migrateEntity(entity, migrateFns)),
      );

      page++;
    } while (entities.length === pageSize);
  }

  protected abstract getMigrationsPath(): string;
  protected abstract getContentField(entity: any): any;
  protected abstract setContentField(entity: any, content: any): void;

  private async getMigrateFns() {
    const migrationsDir = this.getMigrationsPath();
    return await loadMigrations<MigrateFn>(migrationsDir);
  }

  private async migrateEntity(entity: any, migrateFns: MigrateFn[]) {
    try {
      const finalVersion = migrateFns.length;
      if (
        entity.version === finalVersion ||
        (entity.version === 0 && finalVersion === 0)
      )
        return;

      const content = this.getContentField(entity);
      const migratedContent = await this.migrateSequentially(
        entity.version,
        content,
        migrateFns,
      );

      this.setContentField(entity, migratedContent);
      entity.version = finalVersion;

      await this.repository.save(entity);
    } catch (error) {
      // report but don't rethrow the error
      this.logger.error(`Failed to migrate entity: ${entity.id}`, error?.stack);
    }
  }

  private async migrateSequentially(
    currentVersion: number,
    content: any,
    migrateFns: MigrateFn[],
  ): Promise<any> {
    const finalVersion = migrateFns.length;

    for (let i = currentVersion; i < finalVersion; i++) {
      content = await migrateFns[i]!(content);
    }

    return content;
  }
}
