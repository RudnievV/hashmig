import { ConnectionOptions } from 'mysql2';
export default class DbHelper {
    private conn;
    constructor(access: ConnectionOptions);
    private connect;
    query(sql: string, values?: any): Promise<unknown>;
    execute(sql: string, values?: any): Promise<unknown>;
}
