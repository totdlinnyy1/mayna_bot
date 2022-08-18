import {
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    VersionColumn,
} from 'typeorm'

export class CommonBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
    createdAt: Date

    @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
    updatedAt: Date

    @DeleteDateColumn({ type: 'timestamp with time zone', name: 'deleted_at' })
    deletedAt?: Date

    @VersionColumn({ default: 1 })
    version: number

    get isDeleted(): boolean {
        return this.deletedAt != null
    }
}
