import { Logger } from '@nestjs/common';

function LogExecutionTime(contextTag: string) {
  const logger = new Logger(contextTag);

  return function (_: unknown, __: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const startTime = performance.now();
      try {
        logger.log(`${contextTag} - started...`);
        const result = await originalMethod.apply(this, args);
        return result;
      } finally {
        const endTime = performance.now();
        const duration = (endTime - startTime) / 60000;
        logger.log(
          `${contextTag} - executed in ${duration.toFixed(2)} minute(s).`,
        );
      }
    };

    return descriptor;
  };
}

export { LogExecutionTime };
