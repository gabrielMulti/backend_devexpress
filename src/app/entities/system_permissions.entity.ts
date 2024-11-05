import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'system_permissions' })
export class SYSTEMPERMISSIONS {
    @PrimaryColumn()
    id: number;

    @Column()
    screen_id: number

    @Column()
    group_id: number

    @Column()
    user_id: number

    @Column()
    create: boolean

    @Column()
    read: boolean

    @Column()
    update: boolean

    @Column()
    delete: boolean

    @Column()
    date_registered: string

    @Column()
    last_updated: string
}
