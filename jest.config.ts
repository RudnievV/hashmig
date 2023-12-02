import type { Config } from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  }
};

process.env = Object.assign(process.env, {
  DB_PORT: '33311',
  DB_SERVER: 'localhost',
  DB_SELECT: 'db',
  DB_USERNAME: 'root',
  DB_PASSWORD: 'pwd',
  HASHMIG_FOLDER: 'folder',
  HASHMIG_TABLE: 'table',
  HASHMIG_SILENT: 'true'
});

export default config;
