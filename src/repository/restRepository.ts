import { PageableRepository } from "nestjs-pager";
import { FindConditions, FindManyOptions, ObjectID } from "typeorm";

export class FindId {
    col: string;
    value: string | number | Date | ObjectID;
}

export class RestRepository<T> extends PageableRepository<T> {
    public async findById(id: string | number | Date | ObjectID, options?: FindManyOptions<T>): Promise<T> {
        /*console.log(id);

        if (Object.keys(id).includes("col")) {
            if (!options) options = {};
            if (!options.where) options.where = {};
            id = id as FindId;

            options.where[id.col] = id.value;

            console.log(options);
            return this.findOne({ where: {

            }});
        } else {
            id = id as string | number | Date | ObjectID;

            console.log(id);
            // return this.findOne({ where: { id: id }})
            
        }*/

        return this.findOne(id, options);
    }

    public async exists(where: FindConditions<T>, options?: FindManyOptions<T>): Promise<boolean> {
        return !!(await this.findOne(where, options));
    }
}
