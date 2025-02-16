import { promises as fs } from 'fs';
import { join } from 'path';
import { captureException } from '~/commons/error-handlers/capture-exception';
import { CustomException } from '~/commons/errors/custom-exception';

export async function loadMigrations<FunctionType>(
  migrationsDir: string,
): Promise<FunctionType[]> {
  try {
    const files = await fs.readdir(migrationsDir);
    // making sure migrations are applied in correct sequence
    const jsFiles = files.filter((file) => file.endsWith('.js')).sort();

    if (jsFiles.length === 0) {
      return [];
    }

    const migrations = await Promise.all(
      jsFiles.map(async (file) => {
        const filePath = join(migrationsDir, file);
        const migration = await import(filePath);
        return migration.default;
      }),
    );
    return migrations;
  } catch (error) {
    const genieException = new CustomException('Failed to load migrations', {
      migrationsDir,
      error,
    });
    captureException({ error: genieException });
    throw genieException;
  }
}
