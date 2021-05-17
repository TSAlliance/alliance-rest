import { Model, ModelCtor, Sequelize } from "sequelize-typescript";

export interface DatabaseOptions {
    host: string;
    port: number;
    user: string;
    database: string;
    password: string;
    syncStrategy: SyncStrategy;
    logging: any;
}

export const enum SyncStrategy {
    STRATEGY_ALTER = 0,
    STRATEGY_NONE = 1,
}

export class Database {
    private static _instance: Database = undefined;
    private _sequelize: Sequelize;
    private _databaseOptions: DatabaseOptions;

    constructor(databaseOptions: DatabaseOptions, models: ModelCtor<Model<any, any>>[], callback?: Function) {
        this._databaseOptions = databaseOptions;

        this._sequelize = new Sequelize({
            database: this._databaseOptions.database,
            dialect: "mysql",
            username: this._databaseOptions.user,
            password: this._databaseOptions.password,
            host: this._databaseOptions.host,
            port: this._databaseOptions.port,
            logging: this._databaseOptions.logging,
        });

        this._sequelize.addModels(models);

        this._sequelize.authenticate().then(async () => {
            console.info(
                "Successfully connected to database '" +
                    this._databaseOptions.user +
                    "@" +
                    this._databaseOptions.host +
                    ":" +
                    this._databaseOptions.port +
                    "/" +
                    this._databaseOptions.database +
                    "'",
            );
            console.info("Setting up database and synching models...");

            this._sequelize
                .sync({
                    alter: this._databaseOptions.syncStrategy === SyncStrategy.STRATEGY_ALTER,
                })
                .then(() => {
                    console.info("Database setup successfully.");

                    if (callback) callback();
                })
                .catch((error) => {
                    console.error(error);
                });
        });
    }

    public static createInstance(
        databaseOptions: DatabaseOptions,
        models: ModelCtor<Model<any, any>>[],
        callback?: Function,
    ): Database {
        this._instance = new Database(databaseOptions, models, callback);
        return this._instance;
    }

    public static getInstance(): Database {
        return this._instance;
    }
}
