import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards,
    UnauthorizedException,
    Param
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { UserSingIn as UserSingInModel } from 'src/infra/http/dtos/userSingIn.model';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { UserRepository } from 'src/app/repositories/user.repository';
import { ScreensRepository } from 'src/app/repositories/screens.repository';
import { DataBaseService } from 'src/infra/database/typeorm/typeorm.service';
import * as bcrypt from 'bcrypt';
import { ErrorException } from 'src/exceptions/error-exception';

@Controller('users')
export class AuthController {
    constructor(
        private userRepository: UserRepository,
        private screensRepository: ScreensRepository,
        private readonly dataBaseService: DataBaseService,
        private readonly errorException: ErrorException,
        private authService: AuthService
    ) { }

    @HttpCode(HttpStatus.OK)
    @Post('signIn')
    @ApiResponse({
        status: 201,
        description: 'Consulta realizada com sucesso',
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiBody({
        type: UserSingInModel,
        description: 'Objeto Padrão',
    })
    async signIn(@Body() userBody: { email: string, password: string }) {
        try {
            const dbCloud = await this.dataBaseService.getConnection({
                url: process.env.URL_CLOUD_DB,
                database: 'linx',
            });

            this.userRepository.setDataBase(dbCloud);
            this.screensRepository.setDataBase(dbCloud);

            const { user, group, permissionsPages } = await this.authService.getUserByEmail({ email: userBody.email }).catch(() => {
                throw { code: 500, message: 'senha ou email inválido' };
            });

            if (!await bcrypt.compare(String(userBody.password), String(user.password))) {
                throw { code: 500, message: 'senha ou email inválido' };
            }

            const screens = await this.screensRepository.findScreensDetails({ permissions: permissionsPages });

            return {
                email: user.email,
                token: (await this.authService.getTokenJWT({ user })).access_token,
                pages: Array.from(screens.values())
            }
        } catch (error) {
            return this.errorException.handle({ message: error.message, errorCode: error.code });
        }

    }

    @Get('/:email/:token')
    async getProfile(@Param() params: { email: string, token: string }) {
        try {
            await this.authService.validateTokenJWT({ token: params.token });

            const dbCloud = await this.dataBaseService.getConnection({
                url: process.env.URL_CLOUD_DB,
                database: 'linx',
            });

            this.userRepository.setDataBase(dbCloud);
            this.screensRepository.setDataBase(dbCloud);

            const { user, group, permissionsPages } = await this.authService.getUserByEmail({ email: params.email });

            const screens = await this.screensRepository.findScreensDetails({ permissions: permissionsPages });

            return {
                email: user.email,
                token: params.token,
                pages: Array.from(screens.values())
            }
        } catch (error) {
            return this.errorException.handle({ message: error.message, errorCode: error.code });
        }

    }
}