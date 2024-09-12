import { DBMigrationRow, HashmigConfig } from './interfaces';
export default class Hashmig {
    private db;
    private readonly folder;
    private readonly database;
    private readonly table;
    private logger;
    constructor(options?: HashmigConfig);
    private initLogger;
    private instanceOfLoggerEngine;
    isMigrationsFolderExists(): boolean;
    createMigrationsFolder(): void;
    getProcedures(): Promise<{
        Name: string;
        Modified: string;
    }[]>;
    getFunctions(): Promise<{
        Name: string;
        Modified: string;
    }[]>;
    getProcedureSource(name: string): Promise<string>;
    getFunctionSource(name: string): Promise<string>;
    isMigrationsTableExists(): Promise<boolean>;
    createMigrationsTable(): Promise<any>;
    getMigrations(): Promise<DBMigrationRow[]>;
    initProcedures(procedures: string[]): Promise<void>;
    private initProcedure;
    initFunctions(functions: string[]): Promise<void>;
    private initFunction;
    private getHash;
    getMigrationsFiles(): Promise<Map<string, string>>;
    getMigrationsToRun(debug?: boolean): Promise<Map<string, string>>;
    runMigrations(files: string[]): Promise<void>;
    private migrateFile;
    clear(): Promise<void>;
    private clearDb;
    private clearFolder;
    private runFileSql;
}
