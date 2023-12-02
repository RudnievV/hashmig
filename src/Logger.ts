import { LoggerEngine } from './interfaces';
import kleur from 'kleur';

export default class Logger implements LoggerEngine {
  private readonly silent: boolean = false;

  constructor(silent = false) {
    this.silent = silent;
  }

  public log(message: string): void {
    !this.silent && console.log(kleur.gray().italic(message));
  }

  public info(message: string): void {
    !this.silent && console.log(kleur.green().italic(message));
  }

  public warn(message: string): void {
    !this.silent && console.warn(kleur.red().italic(message));
  }

  public error(message: string): void {
    !this.silent && console.error(kleur.red().italic(message));
  }

  public success(message: string): void {
    !this.silent && console.log(kleur.bgGreen().bold(message));
  }
}
