export default class Pipe {
    private argDelimiter;
    private functionDelimiter;
    private lastFilter;
    setArgDelimiter(delimiter: string): this;
    setFunctionDelimiter(delimiter: string): this;
    setLastFilter(filter: string): this;
    private getFunctionFromString;
    private checkLastFilter;
    pipe(functionStrings: string[]): (initialValue: string, initialValueString?: string) => string;
    pipeString(line: string): string;
    pipeEnv(line: string, defaultInitialValue?: string): string;
}
