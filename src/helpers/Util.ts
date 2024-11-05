import { Icredentials } from "src/infra/database/typeorm/typeorm.service";

export function storeIP(cod_loja: number): string {
    if (cod_loja == 998) return process.env.IP_CIC_MULTICOISAS;
    return `10.${Math.floor(cod_loja / 100)}.${cod_loja % 100}.2`;
}

export function getCredentials(cod_loja: number): Icredentials {
    const credentials: Icredentials = {
        host: storeIP(cod_loja),
        port: cod_loja == 998 ? 3301 : 3306
    }

    return credentials
}
