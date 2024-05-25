import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { LoggerVariables } from './entities/logger-variables.entity';

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(LoggerVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
