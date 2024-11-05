import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'config_tributaria' })
export class CONFIGTRIBUTARIA {
    @PrimaryColumn()
    id_config_tributaria: number;

    @Column()
    cnpj_emp: number

    @Column()
    desc_config_tributaria: string

    @Column()
    portal: number;

    @Column()
    chg: string;

    @Column()
    sigla_config_tributaria: string

    @Column()
    timestamp: number

    @Column()
    ativa: boolean

    @Column()
    uf: string

    @Column()
    sistema_tributacao: string

    @Column()
    tipo_atividade: string

    @Column()
    id_origem_mercadoria: string

    @Column()
    utiliza_uso_consumo: boolean

    @Column()
    id_classificacao_cest_produto: string

    @Column()
    codigo_ws: string
}
