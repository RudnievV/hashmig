import { LoggerEngine } from './interfaces';
export default class Logger implements LoggerEngine {
    private readonly silent;
    constructor(silent?: boolean);
    log(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
    success(message: string): void;
}
