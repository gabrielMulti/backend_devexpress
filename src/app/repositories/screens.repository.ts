import { Inject, Injectable, Logger } from '@nestjs/common';
import { TypeOrmMysqlProvider } from '../../infra/database/typeorm/typeorm-mysql.provider';
import { SYSTEMSCREENS } from '../entities/system_screens.entity'
import { Repository } from 'typeorm';
import { SYSTEMPERMISSIONS } from '../entities/system_permissions.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ScreensRepository {
    public dataBase: TypeOrmMysqlProvider;
    private readonly logger = new Logger(ScreensRepository.name);
    private repository: Repository<SYSTEMSCREENS>;

    setDataBase(db: TypeOrmMysqlProvider) {
        this.dataBase = db;
    }

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}


    async findScreen(params: { screen_id: number }) {
        try {
            const cacheResult: SYSTEMSCREENS = await this.cacheManager.get(`screen-${params.screen_id}`);

            if(cacheResult) return cacheResult;

            this.repository = this.dataBase.mysqlConection.getRepository(SYSTEMSCREENS);

            const screen = await this.repository.findOne({
                where: {
                    id: params.screen_id
                }
            })

            await this.cacheManager.set(`screen-${params.screen_id}`, screen);

            return screen;
        } catch (error) {
            console.log(error.message)
        }
    }

    async findScreensDetails(params: { permissions: Map<number, SYSTEMPERMISSIONS> }) {
        const screens: Map<number, {
            text: string
            icon: string | null
            items: {
                text: string
                path: string
                element: string
                flags: {
                    create: boolean
                    read: boolean
                    update: boolean
                    delete: boolean
                }
                disable: boolean
            }[]
        }> = new Map();

        for (const [ screen_id, permission ] of params.permissions) {
            const screen = await this.findScreen({ screen_id });

            if(screen.screen_id == 0) {
                screens.set(screen.id, {
                    text: screen.name,
                    icon: screen.image,
                    items: []
                })
            } else {
                screens.set(screen.screen_id, {
                    text: screens.get(screen.screen_id).text,
                    icon: screens.get(screen.screen_id).icon,
                    items: [ ...screens.get(screen.screen_id).items, {
                        text: screen.name,
                        path: screen.path,
                        element: screen.element,
                        flags: {
                            create: permission.create,
                            delete: permission.delete,
                            read: permission.read,
                            update: permission.update
                        },
                        disable: screen.status == "active" ? false : true
                    } ]
                });
            };
        };

        return screens
    }

}
