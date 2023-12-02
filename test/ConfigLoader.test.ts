import ConfigLoader from '../src/ConfigLoader';
import * as jsonConfig from '../hashmig.example.config.json';

describe('ConfigLoader', () => {
  const fileConfig = ConfigLoader.getConfig('./hashmig.example.config.json');
  const envConfig = ConfigLoader.getConfig('./hashmig.wrong.config.json');

  it('should load config from file', () => {
    expect(fileConfig).not.toBeNull();
  });

  it('should have same values as config', () => {
    expect(fileConfig?.db).toEqual(jsonConfig.db);
  });

  it('should have same values as config', () => {
    expect(fileConfig?.folder).toEqual(jsonConfig.folder);
  });

  it('should have same values as config', () => {
    expect(fileConfig?.table).toEqual(jsonConfig.table);
  });

  it('should have same values as config', () => {
    expect(fileConfig?.silent).toEqual(jsonConfig.silent);
  });

  it('should load config from env', () => {
    expect(envConfig).not.toBeNull();
  });

  it('should have same values as env', () => {
    expect(envConfig?.db).toEqual({
      port: +(process.env.DB_PORT || 3306),
      host: process.env.DB_SERVER,
      database: process.env.DB_SELECT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      ssl: { rejectUnauthorized: false }
    });
  });

  it('should return null config', () => {
    const host = process.env.DB_SERVER;
    process.env.DB_SERVER = '';
    const nullConfig = ConfigLoader.getConfig('./hashmig.wrong.config.json');
    expect(nullConfig).toBeNull();
    process.env.DB_SERVER = host;
  });
});
