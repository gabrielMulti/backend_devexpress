import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'clientesfornecedores' })
export class CLIENTESFORNECEDORES {
    @PrimaryColumn()
    cod_cliente: number;

    @PrimaryColumn()
    portal: number;

    @Column()
    razao_cliente: string;

    @Column()
    nome_cliente: string;

    @Column()
    doc_cliente: number;

    @Column()
    tipo_cliente: string;

    @Column()
    endereco_cliente: string;

    @Column()
    numero_rua_cliente: string;

    @Column()
    complement_end_cli: string;

    @Column()
    bairro_cliente: string;

    @Column()
    cep_cliente: string;

    @Column()
    cidade_cliente: string;

    @Column()
    uf_cliente: string;

    @Column()
    pais: string;

    @Column()
    fone_cliente: string;

    @Column()
    email_cliente: string;

    @Column()
    sexo: string;

    @Column()
    data_cadastro: string;

    @Column()
    data_nascimento: string;

    @Column()
    cel_cliente: string;

    @Column()
    ativo: string;

    @Column()
    dt_update: string;

    @Column()
    inscricao_estadual: string;

    @Column()
    incricao_municipal: string;

    @Column()
    identidade_cliente: string;

    @Column()
    cartao_fidelidade: string;

    @Column()
    cod_ibge_municipio: string;

    @Column()
    classe_cliente: string;

    @Column()
    matricula_conveniado: string;

    @Column()
    tipo_cadastro: string;

    @Column()
    empresa_cadastro: string;

    @Column()
    id_estado_civil: string;

    @Column()
    fax_cliente: string;

    @Column()
    site_cliente: string;

    @Column()
    timestamp: number;

    @Column()
    cliente_anonimo: string;

    @Column()
    limite_compras: number;

    @Column()
    codigo_ws: string;

    @Column()
    limite_credito_compra: number;

    @Column()
    id_classe_fiscal: string;

    @Column()
    obs: string;

    @Column()
    mae: string;

    @Column()
    cliente_contribuinte: string;

    @Column()
    chg: string;

}
