import { Module } from "@nestjs/common";
import { DataBaseService } from "../database/typeorm/typeorm.service";
import { ScheduleModule } from "@nestjs/schedule";
import { ErrorException } from "src/exceptions/error-exception";
import { StatusController } from "./controller/status.controller";
import { PainelRepository } from "src/app/repositories/painel.repository";
import { PainelController } from "./controller/painel.controller";
import { LinxService } from "./services/linx.service";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
  imports: [ScheduleModule.forRoot(), CacheModule.register({ ttl: 0 })],
  controllers: [StatusController, PainelController],
  providers: [
    DataBaseService,
    ErrorException,
    PainelRepository,
    LinxService
  ],
})
export class HttpModule {}
