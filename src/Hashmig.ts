import * as fs from 'fs';

import DbHelper from './DbHelper';
import {
  DBFunctionRow,
  DBFunctionSourceRow,
  DBMigrationRow,
  DBProcedureRow,
  DBProcedureSourceRow,
  HashmigConfig,
  LoggerEngine
} from './interfaces';
import Logger from './Logger';
import SQLHash from './SQLHash';

export default class Hashmig {
  private db: DbHelper;

  private readonly folder: string;

  private readonly database: string | undefined;
  private readonly table: string;

  private logger: LoggerEngine = {
    log: () => {},
    info: () => {},
    warn: () => {},
    error: () => {},
    success: () => {}
  };

  constructor(options?: HashmigConfig) {
    this.folder = options?.folder || './hashmig_migrations';

    this.table = options?.table || 'hashmig_migrations';
    this.database = options?.db?.database || process.env.DB_SELECT;

    this.initLogger(options?.logger, options?.silent);

    this.db = new DbHelper(
      options?.db || {
        port: +(process.env.DB_PORT || 3306),
        host: process.env.DB_SERVER,
        database: process.env.DB_SELECT,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        ssl: { rejectUnauthorized: false }
      }
    );
  }

  private initLogger(logger?: LoggerEngine, silent?: boolean) {
    if (silent) {
      return;
    }

    if (this.instanceOfLoggerEngine(logger || {})) {
      this.logger = logger as LoggerEngine;
      return;
    }

    this.logger = new Logger();
  }

  private instanceOfLoggerEngine(object: any): object is LoggerEngine {
    return ['log', 'info', 'warn', 'error', 'success'].reduce(
      (result, method) => result && method in object,
      true
    );
  }

  public isMigrationsFolderExists(): boolean {
    return fs.existsSync(this.folder);
  }

  public createMigrationsFolder() {
    fs.mkdirSync(this.folder);
  }

  public async getProcedures(): Promise<{ Name: string; Modified: string }[]> {
    return this.db
      .query(`SHOW PROCEDURE STATUS WHERE Db = '${this.database}'`)
      .then((results) => results as DBProcedureRow[])
      .then((rows) =>
        rows.map((row) => ({ Name: row.Name, Modified: row.Modified }))
      );
  }

  public async getFunctions(): Promise<{ Name: string; Modified: string }[]> {
    return this.db
      .query(`SHOW FUNCTION STATUS WHERE Db = '${this.database}'`)
      .then((results) => results as DBFunctionRow[])
      .then((rows) =>
        rows.map((row) => ({ Name: row.Name, Modified: row.Modified }))
      );
  }

  public async getProcedureSource(name: string): Promise<string> {
    return this.db
      .query(`SHOW CREATE PROCEDURE ${name}`)
      .then((results) => results as DBProcedureSourceRow[])
      .then((results) => results[0]['Create Procedure']);
  }

  public async getFunctionSource(name: string): Promise<string> {
    return this.db
      .query(`SHOW CREATE FUNCTION ${name}`)
      .then((results) => results as DBFunctionSourceRow[])
      .then((results) => results[0]['Create Function']);
  }

  public async isMigrationsTableExists(): Promise<boolean> {
    return this.db
      .query(`SHOW TABLES LIKE '${this.table}'`)
      .then((results) => results as { TABLE_NAME: string }[])
      .then((results) => results.length > 0);
  }

  public async createMigrationsTable(): Promise<any> {
    return this.db.query(`
        CREATE TABLE ${this.table}
        (
            ID        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            FileName  VARCHAR(255)                   NOT NULL,
            Hash      VARCHAR(312)                   NOT NULL,
            Type      ENUM ('procedure', 'function') NOT NULL,
            CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
  }

  public async getMigrations(): Promise<DBMigrationRow[]> {
    return (await this.db.query(`
      SELECT FileName, Hash, Type
       FROM ${this.table}
       WHERE ID IN (
          SELECT MAX(ID) FROM ${this.table} GROUP BY FileName
       )
    `)) as Promise<DBMigrationRow[]>;
  }

  public async initProcedures(procedures: string[]) {
    const errors = [];
    let i = 0;
    for (const procedure of procedures) {
      i++;
      try {
        await this.initProcedure(procedure);
        this.logger.info(
          `     ${i}. migration for procedure ${procedure} initialized`
        );
      } catch (error) {
        errors.push(procedure);
        this.logger.error(
          `     ${i}. migration for procedure ${procedure} not initialized: ${
            (error as Error).message
          }`
        );
      }
    }

    if (errors.length > 0) {
      this.logger.error(
        `     - migrations for procedures ${errors.join(', ')} not initialized`
      );
    }
  }

  private async initProcedure(procedure: string) {
    let source = await this.getProcedureSource(procedure);
    source = source.replace(/DEFINER=`[^`]+`@`[^`]+`/, '');
    source = `DROP PROCEDURE IF EXISTS \`${procedure}\`;
-- NEW_COMMAND
${source}`;
    const hash = this.getHash(source);
    const fileName = `p_${procedure}.sql`;

    fs.writeFileSync(`${this.folder}/${fileName}`, source);

    await this.db.query(
      `INSERT INTO ${this.table} (FileName, Hash, Type)
                         VALUES (?, ?, 'procedure')`,
      [fileName, hash]
    );
  }

  public async initFunctions(functions: string[]) {
    const errors = [];
    let i = 0;
    for (const func of functions) {
      i++;
      try {
        await this.initFunction(func);
        this.logger.info(
          `     ${i}. migration for function ${func} initialized`
        );
      } catch (error) {
        errors.push(func);
        this.logger.error(
          `     ${i}. migration for function ${func} not initialized: ${
            (error as Error).message
          }`
        );
      }
    }

    if (errors.length > 0) {
      this.logger.error(
        `     - migrations for functions ${errors.join(', ')} not initialized`
      );
    }
  }

  private async initFunction(func: string) {
    let source = await this.getFunctionSource(func);
    source = source.replace(/DEFINER=`[^`]+`@`[^`]+`/, '');
    source = `DROP PROCEDURE IF EXISTS \`${func}\`;
-- NEW_COMMAND
${source}`;
    const hash = this.getHash(source);
    const fileName = `f_${func}.sql`;

    fs.writeFileSync(`${this.folder}/${fileName}`, source);

    await this.db.query(
      `INSERT INTO ${this.table} (FileName, Hash, Type)
                         VALUES (?, ?, 'function')`,
      [fileName, hash]
    );
  }

  private getHash(source: string) {
    return SQLHash(source);
    // return crypto.createHash('sha256').update(source).digest('hex');
  }

  public async getMigrationsFiles(): Promise<Map<string, string>> {
    const map = new Map();
    const files = fs.readdirSync(this.folder);
    for (const file of files) {
      const source = fs.readFileSync(`${this.folder}/${file}`).toString();
      const hash = this.getHash(source);
      map.set(hash, file);
    }
    return map;
  }

  public async getMigrationsToRun(): Promise<Map<string, string>> {
    const dbMigrations = await this.getMigrations().then((rows) =>
      rows.reduce((map, row) => {
        map.set(row.Hash, row.FileName);
        return map;
      }, new Map())
    );
    const filesMap = await this.getMigrationsFiles();

    for (const [hash, file] of filesMap) {
      if (dbMigrations.has(hash) && dbMigrations.get(hash) === file) {
        // this.logger.log(`     - ${file} already migrated`);
        filesMap.delete(hash);
      } else {
        this.logger.log(`     + ${file} will be migrated`);
      }
    }

    return filesMap;
  }

  public async runMigrations(files: string[]) {
    const errors = [];
    let i = 0;
    for (const file of files) {
      i++;
      try {
        await this.migrateFile(file);
        this.logger.info(`     ${i}. migration for file ${file} completed`);
      } catch (error) {
        errors.push(file);
        this.logger.error(
          `     ${i}. migration for file ${file} not completed: ${
            (error as Error).message
          }`
        );
      }
    }

    if (errors.length > 0) {
      this.logger.error(
        `     - migrations for files ${errors.join(', ')} not completed`
      );
    }
  }

  private async migrateFile(file: string) {
    const source = fs.readFileSync(`${this.folder}/${file}`).toString();
    const hash = this.getHash(source);

    await this.runFileSql(source);
    await this.db.query(
      `INSERT INTO ${this.table} (FileName, Hash, Type)
                         VALUES (?, ?, 'function')`,
      [file, hash]
    );
  }

  public async clear() {
    await this.clearDb();
    this.clearFolder();
  }

  private async clearDb() {
    await this.db.query(`DROP TABLE IF EXISTS ${this.table}`);
    this.logger.success('--- Migrations table dropped');
  }

  private clearFolder() {
    fs.rmSync(this.folder, { recursive: true, force: true });
    this.logger.success('--- Migrations folder removed');
  }

  private async runFileSql(sql: string) {
    const commands = sql.toString().split('NEW_COMMAND');
    return Promise.all(
      commands
        .map((command) => command.trim())
        .filter(Boolean)
        .map((command) => this.db.query(command))
    );
  }
}
