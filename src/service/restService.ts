import { Pageable } from "@tsalliance/sdk";
import { Page } from "nestjs-pager";
import { DeleteResult, FindManyOptions, Repository } from "typeorm";

export abstract class RestService<Type, DTO, Repo extends Repository<Type>> {
    constructor(private repository: Repo) {}

    public abstract findAll?(pageable: Pageable, options?: FindManyOptions<Type>): Promise<Page<Type>>;
    public abstract findById?(id: string, options?: FindManyOptions<Type>): Promise<Type>;
    public abstract create?(data: DTO): Promise<Type>;
    public abstract update?(id: string, data: DTO): Promise<Type>;
    public abstract delete?(id: string): Promise<DeleteResult>;

    public save(obj: Type): Promise<Type> {
        return this.repository.save(obj);
    }

    public getRepository(): Repo {
        return this.repository;
    }
}
