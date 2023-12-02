import mysql, { ConnectionOptions, Connection } from 'mysql2';

export default class DbHelper {
  private conn: Connection | undefined;

  constructor(access: ConnectionOptions) {
    this.connect(access);
  }
  private connect(access: ConnectionOptions) {
    this.conn = mysql.createConnection(access);
  }

  public async query(sql: string, values?: any) {
    return new Promise((resolve, reject) => {
      if (!this.conn) {
        reject('Connection is not established');
      }
      this.conn?.query(sql, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  public async execute(sql: string, values?: any) {
    return new Promise((resolve, reject) => {
      if (!this.conn) {
        reject('Connection is not established');
      }
      this.conn?.execute(sql, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
}
