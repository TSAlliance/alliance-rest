import { PageableRepository } from "nestjs-pager";
import { FindManyOptions } from "typeorm";

export class RestRepository<T> extends PageableRepository<T> {

    public async exists(options?: FindManyOptions<T>): Promise<boolean> {
        return (await this.count(options)) > 0;
    }

}