export default class Interact {
    private hashmig;
    private logger;
    private isInteractive;
    constructor();
    init(configFileName?: string): void;
    main: () => Promise<void>;
    createMigrationsTableExists: () => Promise<boolean>;
    createMigrationFolder: () => Promise<boolean>;
    initMigrations: (required?: boolean) => Promise<void>;
    runMigrations: () => Promise<void>;
}
