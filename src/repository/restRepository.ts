import { PageableRepository } from "nestjs-pager";
import { FindManyOptions, ObjectID } from "typeorm";

export class FindId { 
    colName: string;
    value: string | number | Date | ObjectID 
}

export class RestRepository<T> extends PageableRepository<T> {

    public async findById(id: string | number | Date | ObjectID | FindId, options?: FindManyOptions<T>): Promise<T> {
        if(id instanceof FindId) {
            const whereClause = {...options}
            whereClause[id.colName] = id.value;

            return this.findOne({ where: whereClause })
        } else {
            return this.findOne(id, options);
        }
    }

    public async exists(options?: FindManyOptions<T>): Promise<boolean> {
        return !!(await this.findOne(options));
    }
}
