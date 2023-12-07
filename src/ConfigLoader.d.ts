import { HashmigConfig } from './interfaces';
export default class ConfigLoader {
    private static fileName;
    static getConfig(configFileName?: string): HashmigConfig | null;
    private static getConfigFromEnv;
    private static loadConfigFromFile;
    private static validateAndFillConfig;
}
