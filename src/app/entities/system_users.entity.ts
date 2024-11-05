import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

enum system_users_status {
    active,
    inactive
}

enum system_users_reset_password {
    true,
    false
}

@Entity({ name: 'system_users' })
export class SYSTEMUSERS {
    @PrimaryColumn()
    id: number;

    @Column({ default: 0 })
    group_id: number

    @Column()
    user_name: string

    @Column()
    email: string

    @Column()
    password: string

    @Column({ default: new Date() })
    date_registered: string

    @Column({ default: 'active' })
    status: system_users_status

    @Column()
    last_login: string

    @Column({ default: false })
    reset_password: system_users_reset_password;

    @Column()
    reset_password_token: string;

    @Column()
    reset_password_expires: string
}
