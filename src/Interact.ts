import prompts from 'prompts';
import { Command } from 'commander';
import Hashmig from './Hashmig';
import Logger from './Logger';
import ConfigLoader from './ConfigLoader';

const program = new Command();

export default class Interact {
  private hashmig: Hashmig;
  private logger: Logger;

  private isInteractive = true;
  private debug = false;

  constructor() {
    this.logger = new Logger();
    this.hashmig = new Hashmig();
  }

  init(configFileName?: string) {
    const config = ConfigLoader.getConfig(configFileName);
    if (!config) {
      console.log('Config not found');
      process.exit(1);
    }

    this.hashmig = new Hashmig({
      ...config,
      silent: false
    });
  }

  main = async () => {
    program
      .name('hashmig')
      .description(
        'CLI migrations tool for MySQL stored procedures and functions'
      )
      .version('1.0.4')
      .option(
        '-c, --config <string>',
        'Path to config file',
        './hashmig.config.json'
      )
      .hook('preAction', (thisArg) => {
        const { config: configFileName } = thisArg.opts();
        this.init(configFileName);
      });

    program.addHelpText(
      'after',
      `

To configure, you can use \`./hashmig.config.json\` (see \`./hashmig.example.config.json\`) file or the following environment variables:
  DB_PORT - post number
  DB_SERVER - server address
  DB_SELECT - database name
  DB_USERNAME - username
  DB_PASSWORD - password
  HASHMIG_FOLDER - path to folder with migrations
  HASHMIG_TABLE - name of table with migrations
  HASHMIG_SILENT - disable logger`
    );

    program
      .command('run')
      .description('Execute migrations')
      .option('-n, --noninteractive', 'Non-interactive mode', false)
      .option('-d, --debug', 'Debug mode', false)
      .action((options) => {
        const { noninteractive = false, debug = false } = options;
        this.isInteractive = !noninteractive;
        this.debug = debug;

        (async () => {
          // ----------------------------------- Table -----------------------------------
          let result = await this.createMigrationsTableExists();
          if (!result) {
            process.exit(0);
          }

          // ----------------------------------- Folder -----------------------------------
          result = await this.createMigrationFolder();
          if (!result) {
            process.exit(0);
          }

          // ----------------------------------- Init -----------------------------------
          this.isInteractive && (await this.initMigrations());

          // ----------------------------------- Run -----------------------------------
          await this.runMigrations();

          process.exit(0);
        })();
      });

    program
      .command('clear')
      .description('Clear folder and table')
      .action(() => {
        (async () => {
          const { value } = await prompts({
            type: 'toggle',
            name: 'value',
            message: 'Are you sure to delete table and folder?',
            initial: true,
            active: 'yes',
            inactive: 'no'
          });

          if (!value) {
            process.exit(0);
          }

          await this.hashmig.clear();
        })();
      });

    program
      .command('init')
      .description(
        'Fill table and folder by existing stored procedures and functions'
      )
      .action(() => {
        (async () => {
          // ----------------------------------- Table -----------------------------------
          let result = await this.createMigrationsTableExists();
          if (!result) {
            process.exit(0);
          }

          // ----------------------------------- Folder -----------------------------------
          result = await this.createMigrationFolder();
          if (!result) {
            process.exit(0);
          }

          // ----------------------------------- Init -----------------------------------
          await this.initMigrations(true);
        })();
      });

    program.parse();
  };

  createMigrationsTableExists = async () => {
    const isMigrationsTableExists =
      await this.hashmig.isMigrationsTableExists();
    if (isMigrationsTableExists) {
      return true;
    }

    await this.hashmig.createMigrationsTable();
    this.logger.success('--- Migration table created');

    return true;
  };

  createMigrationFolder = async () => {
    const isMigrationFolderExists = this.hashmig.isMigrationsFolderExists();
    if (isMigrationFolderExists) {
      return true;
    }

    this.hashmig.createMigrationsFolder();
    this.logger.success('--- Migration folder created');

    return true;
  };

  initMigrations = async (required = false) => {
    const migrations = await this.hashmig.getMigrations();
    if (!required && migrations.length > 0) {
      return;
    }

    const { value } = await prompts({
      type: 'toggle',
      name: 'value',
      message:
        'Would you like to initialize migrations by existing stored procedures and functions it?',
      initial: true,
      active: 'yes',
      inactive: 'no'
    });

    if (!value) {
      this.logger.error('--- Migrations don\'t initialized');
      return;
    }

    const functions = await this.hashmig.getFunctions();
    const { value: selectedFunctions } = await prompts({
      type: 'multiselect',
      name: 'value',
      message: 'Select functions',
      choices: functions.map((func) => ({
        title: func.Name,
        value: func.Name,
        selected: true
      }))
    });

    const procedures = await this.hashmig.getProcedures();
    const { value: selectedProcedures } = await prompts({
      type: 'multiselect',
      name: 'value',
      message: 'Select procedures',
      choices: procedures.map((proc) => ({
        title: proc.Name,
        value: proc.Name,
        selected: true
      }))
    });

    if (selectedProcedures.length > 0) {
      await this.hashmig.initProcedures(selectedProcedures);
      this.logger.success('--- Migration for procedures initialized');
    }

    if (selectedFunctions.length > 0) {
      await this.hashmig.initFunctions(selectedFunctions);
      this.logger.success('--- Migration for functions initialized');
    }
  };

  runMigrations = async () => {
    const migrations = await this.hashmig.getMigrationsToRun(this.debug);

    if (migrations.size === 0) {
      this.logger.success('--- All migrations already completed');
      return;
    }

    if (!this.isInteractive) {
      await this.hashmig.runMigrations(Array.from(migrations.values()));
      this.logger.success('--- Migrations completed');
      return;
    }

    const { value: selectedFiles } = await prompts({
      type: 'multiselect',
      name: 'value',
      message: 'Select files to run',
      choices: Array.from(migrations.values()).map((file) => ({
        title: file,
        value: file,
        selected: true
      }))
    });

    if (selectedFiles.length === 0) {
      this.logger.error('--- No one file selected');
      return;
    }

    await this.hashmig.runMigrations(selectedFiles);

    this.logger.success('--- Migrations completed');
  };
}
