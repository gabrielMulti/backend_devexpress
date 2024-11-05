import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SYSTEMPERMISSIONS } from 'src/app/entities/system_permissions.entity';
import { ScreensRepository } from 'src/app/repositories/screens.repository';
import { UserRepository } from 'src/app/repositories/user.repository';
import { CustomError } from 'src/exceptions/error-custom';
import { IUser } from 'src/interfaces/user.interface';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userRepository: UserRepository,
    ) { }

    async getTokenJWT(params: { user: IUser }): Promise<{ access_token: string, expiresIn: string }> {
        const secret = process.env.SECRET;

        return {
            access_token: await this.jwtService.signAsync({ ...params.user }, { secret }),
            expiresIn: process.env.TOKEN_EXPIRES
        };
    };

    async validateTokenJWT(params: { token: string }) {
        const secret = process.env.SECRET;

        return await this.jwtService.verifyAsync(params.token, { secret }).catch(err => { throw new CustomError({ message: 'token invalido', code: 401 }) })
    }

    async getUserByEmail(params: { email: string }) {
        const permissionsPages: Map<number, SYSTEMPERMISSIONS> = new Map();

        const user = await this.userRepository.findUser({ email: params.email });

        if(!user) throw new CustomError({ message: 'usuario não encontrado', code: 400 });

        const group = await this.userRepository.findGroupByID({ group_id: user.group_id });
        const permissions = await this.userRepository.findPermissionsByGroupID({ group_id: group.id });


        permissions.forEach(permission => {
            permissionsPages.set(permission.screen_id, permission)
        })

        return {
            user,
            group,
            permissionsPages
        }
    };

}