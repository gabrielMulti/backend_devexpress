import { DataSource } from 'typeorm';
import { Icredentials } from './typeorm.service';


export class TypeOrmMysqlProvider {
    mysqlConection: DataSource;

    constructor(params: Icredentials) {
        this.mysqlConection = new DataSource({
            type: 'mysql',
            url: params.url,
            host: params.host,
            port: params.port,
            username: params.user,
            password: params.password,
            database: params.database,
            insecureAuth: true,
            cache: true,
            entities: [__dirname + '/../../../**/*.entity.{js,ts}'],
          });
    }

    initialize = async () => {
        try {
          await new Promise((resolve, reject) => {
            this.mysqlConection
              .initialize()
              .then(() => {
                resolve('Data Source has been initialized!');
              })
              .catch((err) => {
                reject(err);
              });
          });
        } catch (error) {
          throw error;
        }
      };

      async pingDB(): Promise<boolean> {
        try {
          return await this.mysqlConection
            .query(`SELECT BUSCA_LOJA() as cod_loja;`)
            .then((result) => {
              return result.length > 0;
            })
            .catch(() => {
              return false;
            });
        } catch (error) {
          return false;
        }
      }
}