import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from './infra/http/http.module';
import { DataBaseService } from './infra/database/typeorm/typeorm.service';

@Module({
  imports: [AuthModule, ScheduleModule.forRoot(), HttpModule],
  controllers: [],
  providers: [ DataBaseService],
})
export class AppModule { }
