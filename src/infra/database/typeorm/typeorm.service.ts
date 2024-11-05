import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { TypeOrmMysqlProvider } from './typeorm-mysql.provider';
import { CustomError } from 'src/exceptions/error-custom';

interface Iconnections {
  [key: string]: TypeOrmMysqlProvider;
}

export interface Icredentials {
  host?: string;
  url?: string;
  database?: string;
  user?: string;
  password?: string;
  port?: number;
}

@Injectable()
export class DataBaseService {
  static connection: Icredentials = {
    host: '',
    url: '',
    database: '',
    user: '',
    password: '',
    port: 0,
  };

  static connections: Iconnections = {};

  async getConnection(credentials: Icredentials) {
    try {
      let host = credentials.host;

      if (process.env.ENVIRONMENT == 'development' && !credentials.url) {
        host = process.env.ENV_HOST;
        DataBaseService.connection.host = process.env.ENV_HOST;
        credentials.port = Number(process.env.ENV_PORT);
      }

      const isNotHostExisting = !DataBaseService.connections[host]
      const isNotUrlExisting = !DataBaseService.connections[credentials.url]

      if (isNotHostExisting && isNotUrlExisting) {
        DataBaseService.connection = {
          host: host,
          url: !host ? credentials.url : undefined,
          database: credentials.database || process.env.DB_NAME,
          user: credentials.user || process.env.DB_USER,
          password: credentials.password || process.env.DB_PASSWORD,
          port: Number(credentials.port || process.env.DB_PORT),
        };


        const dbMysql = new TypeOrmMysqlProvider({
          ...DataBaseService.connection
        })

        await dbMysql.initialize().catch(() => {
          throw new CustomError({
            message: `Não foi possível estabelecer uma conexão com o host ${host || credentials.url} ${DataBaseService.connection.port}. Verifique se o servidor do banco de dados está online e acessível.`,
            code: 500
          });
        });

        DataBaseService.connections[host || credentials.url] = dbMysql;
      }

      return DataBaseService.connections[host || credentials.url];
    } catch (error) {
      throw new CustomError({
        message: error.message,
        code: 500
      });
    }
  }


}
