import { HashmigConfig } from './interfaces';
import fs from 'fs';
import { z } from 'zod';
import Pipe from './Pipe';

export default class ConfigLoader {
  private static fileName = './hashmig.config.json';

  public static getConfig(
    configFileName = './hashmig.config.json'
  ): HashmigConfig | null {
    this.fileName = configFileName;
    const fileConfig = this.loadConfigFromFile();
    if (fileConfig) {
      return fileConfig;
    }
    const envConfig = this.getConfigFromEnv();
    if (envConfig) {
      return envConfig;
    }
    return null;
  }

  private static getConfigFromEnv(): HashmigConfig {
    const config = {
      db: {
        port: +(process.env.DB_PORT || 3306),
        host: process.env.DB_SERVER,
        database: process.env.DB_SELECT,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        ssl: { rejectUnauthorized: false }
      },
      folder: process.env.HASHMIG_FOLDER || './hashmig_migrations',
      table: process.env.HASHMIG_TABLE || 'hashmig_migrations',
      silent: process.env.HASHMIG_SILENT === 'true'
    };

    return this.validateAndFillConfig(config) as HashmigConfig;
  }

  private static loadConfigFromFile(): HashmigConfig | null {
    if (!fs.existsSync(`${this.fileName}`)) {
      return null;
    }
    const json = fs.readFileSync(`${this.fileName}`).toString();
    return this.validateAndFillConfig(JSON.parse(json));
  }

  private static validateAndFillConfig(
    config: HashmigConfig
  ): HashmigConfig | null {
    const configSchema = z.object({
      db: z.object({
        port: z.string().or(z.number()),
        host: z.string(),
        database: z.string(),
        user: z.string(),
        password: z.string(),
        ssl: z.object({ rejectUnauthorized: z.boolean().or(z.string()) })
      }),
      folder: z.string(),
      table: z.string(),
      silent: z.string().or(z.boolean())
    });

    try {
      configSchema.parse(config);

      const trueConfigSchema = z.object({
        db: z.object({
          port: z.number(),
          host: z.string(),
          database: z.string(),
          user: z.string(),
          password: z.string(),
          ssl: z.object({ rejectUnauthorized: z.boolean() })
        }),
        folder: z.string(),
        table: z.string(),
        silent: z.boolean()
      });

      const trueConfig = {
        db: {
          port: this.valFromEnvString(`${config.db?.port || 3306}|toInt`),
          host: this.valFromEnvString(config.db?.host || ''),
          database: this.valFromEnvString(config.db?.database || ''),
          user: this.valFromEnvString(config.db?.user || ''),
          password: this.valFromEnvString(config.db?.password || ''),
          ssl: config.db.ssl
        },
        folder: this.valFromEnvString(config.folder || ''),
        table: this.valFromEnvString(config.table || ''),
        silent:
          config.silent === true
            ? true
            : config.silent === false
              ? false
              : this.valFromEnvString(config.silent || 'false|toBool')
      };

      return trueConfigSchema.parse(trueConfig) as HashmigConfig;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  private static valFromEnvString(
    str: string
  ): string | number | boolean | undefined | null {
    return new Pipe().pipeEnv(str);
  }
}
