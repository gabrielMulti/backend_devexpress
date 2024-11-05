import { Inject, Injectable, Logger } from '@nestjs/common';
import { TypeOrmMysqlProvider } from '../../infra/database/typeorm/typeorm-mysql.provider';
import { CLIENTESFORNECEDORES } from '../entities/clientes_fornec.entity'
import { Between, Equal, MoreThan, Not, Repository, EntityTarget } from 'typeorm';
import { CustomError } from 'src/exceptions/error-custom';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import entities from '../../app/entities/entities_index'

@Injectable()
export class PainelRepository {
    public dataBase: TypeOrmMysqlProvider;
    private readonly logger = new Logger(PainelRepository.name);
    private repository: Map<string, Repository<any>> = new Map();

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    setDataBase(db: TypeOrmMysqlProvider) {
        this.dataBase = db;
    }

    async findRecords(params: { entity: string, offset: number, limit: number }) {
        try {
            const cacheKey = `${params.entity}-${params.limit}-${params.offset}`;
            const cacheValue = await this.cacheManager.get(cacheKey);

            if (cacheValue) {
                await this.cacheManager.set(cacheKey, cacheValue);

                return cacheValue;
            }

            if (!entities[params.entity]) {

                const count = await this.dataBase.mysqlConection
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .offset(params.offset)
                .limit(params.limit)
                .from(params.entity, null)
                .getRawMany().then(count => { return { count: Number(count[0].count )} });

                const primaryColuns = await this.dataBase.mysqlConection.query(`
                    SELECT COLUMN_NAME
                    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
                    WHERE TABLE_NAME = '${params.entity}'
                    AND CONSTRAINT_NAME = 'PRIMARY';
                `).then(c => c.map((res: { COLUMN_NAME: string }) => res.COLUMN_NAME));

                const records = await this.dataBase.mysqlConection
                    .createQueryBuilder()
                    .select()
                    .offset(params.offset)
                    .limit(params.limit)
                    .from(params.entity, null)
                    .getRawMany()

                await this.cacheManager.set(cacheKey, {
                    data: records,
                    primaryKey: primaryColuns,
                    ...count
                })

                return {
                    data: records,
                    primaryKey: primaryColuns,
                    ...count
                }
            };

            this.repository.set(params.entity.toString(), this.dataBase.mysqlConection.getRepository(params.entity));

            const  primaryColuns  = this.repository.get(params.entity.toString()).metadata.primaryColumns.map(c => c.propertyName);

            const [ records, count ] = await this.repository.get(params.entity.toString()).findAndCount({
                take: params.limit,
                skip: params.offset,
            });

            await this.cacheManager.set(cacheKey, {
                data: records,
                primaryKey: primaryColuns,
                count: count
            })

            return {
                data: records,
                primaryKey: primaryColuns,
                count: count
            }
        } catch (error) {
            throw new CustomError({ message: error.message, code: 500 });
        }
    }

    async editRecords(params: { entity: string }) {
        const records = await this.dataBase.mysqlConection
            .createQueryBuilder().update(params.entity, null).set({  }).execute()

        return {
            data: records,
        }
    }
}
