import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'system_screens' })
export class SYSTEMSCREENS {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    screen_id: number

    @Column()
    name: string;

    @Column()
    image: string

    @Column()
    status: "active" | "inactive"

    @Column()
    path: string;

    @Column()
    element: string;

    @Column()
    observation: string;

    @Column()
    date_registered: string

    @Column()
    last_updated: string
}
