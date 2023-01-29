import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Text')
export class TextEntity {
    @PrimaryColumn()
    textId : string;

    @Column({ length: 50 })
    name : string;

    @Column({ length: 60 })
    createName : string;

    @Column({ length: 5000 })
    context : string;
}