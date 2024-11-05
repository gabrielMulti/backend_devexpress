import { Controller, Get, Inject, Param } from '@nestjs/common';
import { PainelRepository } from 'src/app/repositories/painel.repository';
import { ErrorException } from 'src/exceptions/error-exception';
import { DataBaseService } from 'src/infra/database/typeorm/typeorm.service';
import { ApiParam } from '@nestjs/swagger';
import { LinxService } from '../services/linx.service';

@Controller('')
export class PainelController {
    constructor(
        private readonly dataBaseService: DataBaseService,
        private readonly errorException: ErrorException,
        private readonly painelRepository: PainelRepository,
    ) { }

    @Get('get/:entity/:offset/:limit')
    @ApiParam({ name: "entity", type: String })
    @ApiParam({ name: "limit", type: Number })
    @ApiParam({ name: "offset", type: Number })
    async findRecords(@Param() params: { entity: string, limit: number, offset: number }): Promise<any> {
        try {
            const dbCloud = await this.dataBaseService.getConnection({
                url: process.env.URL_CLOUD_DB,
                database: 'linx',
            });

            this.painelRepository.setDataBase(dbCloud);

            const records = await this.painelRepository.findRecords({
                ...params,
                entity: params.entity
            });

            return records;
        } catch (error) {
            return this.errorException.handle({ message: error.message, errorCode: error.code });
        }
    }
}
