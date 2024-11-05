import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

enum system_groups_status {
    active,
    inactive
}

@Entity({ name: 'system_groups' })
export class SYSTEMGROUPS {
    @PrimaryColumn()
    id: number;

    @Column()
    group_name: string

    @Column({ default: 'inative' })
    status: system_groups_status


    @Column()
    observation: string

    @Column()
    date_registered: string

    @Column()
    last_updated: string
}
