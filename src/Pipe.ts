type HandlerType = () => (str: string, initialValueString?: string) => (string | number | boolean | null);

const handlers: Record<string, HandlerType> = {
  required: () => (str: string, initialValueString?: string) => {
    if (!str) {
      throw new Error(`Required value is empty: ${initialValueString}`);
    }
    return str;
  },
  toNull: () => (str: string) => str || null,
  toInt: () => (str: string) => (str ? +str : 0),
  toBool: () => (str: string) =>
    str === 'true' ? true : str === 'false' ? false : !!str,
  emptyStringToNull: () => (str: string) => (str === '' ? null : str),
  upper: () => (str: string) => str.toUpperCase(),
  lower: () => (str: string) => str.toLowerCase(),
  trim: () => (str: string) => str.trim(),
  env: () => (str: string) => process.env[str] || '',
  padEnd:
    (length = 100, fillString = '.') =>
    (str: string) =>
      str.padEnd(length, fillString)
};

export default class Pipe {
  private argDelimiter = ':';
  private functionDelimiter = '|';
  private lastFilter = 'emptyStringToNull';

  public setArgDelimiter(delimiter: string) {
    this.argDelimiter = delimiter;
    return this;
  }

  public setFunctionDelimiter(delimiter: string) {
    this.functionDelimiter = delimiter;
    return this;
  }

  public setLastFilter(filter: string) {
    this.lastFilter = filter;
    return this;
  }

  private getFunctionFromString(functionString: string) {
    const [name, ...args] = functionString.split(this.argDelimiter);
    const handler = handlers[name as keyof typeof handlers];
    if (!handler) {
      return (x: string) => x;
    }
    return (x: string, str?: string) => handler(...(args as []))(x, str);
  }

  private checkLastFilter() {
    if (!this.lastFilter) {
      return false;
    }
    const [filter] = this.lastFilter.split(this.argDelimiter);
    return filter in handlers;
  }

  public pipe(functionStrings: string[]) {
    if (this.checkLastFilter()) {
      functionStrings.push(this.lastFilter);
    }
    return (initialValue: string, initialValueString?: string) =>
      functionStrings.reduce((currentValue, functionString) => {
        const fnc = this.getFunctionFromString(functionString);
        return fnc(currentValue, initialValueString) as string;
      }, initialValue);
  }

  public pipeString(line: string) {
    const [initialValue, ...functionStrings] = line.split(
      this.functionDelimiter
    );
    return this.pipe(functionStrings)(initialValue, initialValue);
  }

  public pipeEnv(line: string, defaultInitialValue = '') {
    const [initialValue, ...functionStrings] = (line || '').split(
      this.functionDelimiter
    );
    const [processPart, envPart, variableName] = initialValue.split('.');
    if (processPart !== 'process' && envPart !== 'env') {
      return this.pipe(functionStrings)(initialValue, initialValue);
    }
    const value = process.env[variableName];
    return this.pipe(functionStrings)(
      value || defaultInitialValue,
      initialValue
    );
  }
}
