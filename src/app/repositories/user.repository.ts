import { Inject, Injectable, Logger } from '@nestjs/common';
import { TypeOrmMysqlProvider } from '../../infra/database/typeorm/typeorm-mysql.provider';
import { SYSTEMUSERS } from '../entities/system_users.entity'
import { SYSTEMGROUPS } from '../entities/system_groups.entity'
import { SYSTEMPERMISSIONS } from '../entities/system_permissions.entity'
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserRepository {
    public dataBase: TypeOrmMysqlProvider;
    private readonly logger = new Logger(UserRepository.name);
    private repository:
        Repository<SYSTEMUSERS> |
        Repository<SYSTEMGROUPS> |
        Repository<SYSTEMPERMISSIONS>;

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    setDataBase(db: TypeOrmMysqlProvider) {
        this.dataBase = db;
    }

    async findGroupByID(params: { group_id: number }) {
        try {
            const cacheResult: SYSTEMGROUPS = await this.cacheManager.get(`group-${params.group_id}`);

            if(cacheResult) return cacheResult;

            this.repository = this.dataBase.mysqlConection.getRepository(SYSTEMGROUPS);

            const group = await this.repository.findOne({
                where: {
                    id: params.group_id
                }
            });

            await this.cacheManager.set(`group-${params.group_id}`, group);

            return group;
        } catch (error) {
            console.log(error.message);
        }
    }

    async findPermissionsByGroupID(params: { group_id: number }) {
        try {
            const cacheResult: SYSTEMPERMISSIONS[] = await this.cacheManager.get(`permissions-${params.group_id}`);

            if(cacheResult) return cacheResult;

            this.repository = this.dataBase.mysqlConection.getRepository(SYSTEMPERMISSIONS);

            const permissions = await this.repository.find({
                where: {
                    group_id: params.group_id
                }
            });

            await this.cacheManager.set(`permissions-${params.group_id}`, permissions);

            return permissions;
        } catch (error) {
            console.log(error.message)
        }
    }

    async findUser(params: { email: string }) {
        try {
            const cacheResult: SYSTEMUSERS = await this.cacheManager.get(params.email);

            if(cacheResult) return cacheResult;

            this.repository = this.dataBase.mysqlConection.getRepository(SYSTEMUSERS);

            const user = await this.repository.findOne({
                where: {
                    email: params.email
                }
            });

            await this.cacheManager.set(params.email, user);

            return user;
        } catch (error) {
            console.log(error.message)
        }
    }

    async createUser() {}

}
