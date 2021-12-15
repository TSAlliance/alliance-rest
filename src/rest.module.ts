import { DynamicModule, Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { REST_CONFIG_OPTIONS } from "./constants";
import { AllianceExceptionFilter } from "./error/exceptionFilter";
import { ResponseInterceptor } from "./interceptor/response.interceptor";

export class AllianceRestOptions {
    /**
     * Enable or disabled debug logs.
     */
    public logging?: boolean = false;
}

@Module({
    providers: [],
})
export class AllianceRestModule {
    public static forRoot(options: AllianceRestOptions = {}): DynamicModule {
        const exceptionFilter = new AllianceExceptionFilter(options);

        return {
            module: AllianceRestModule,
            providers: [
                {
                    provide: REST_CONFIG_OPTIONS,
                    useValue: options,
                },
                {
                    provide: APP_FILTER,
                    useValue: exceptionFilter,
                },
                {
                    provide: APP_INTERCEPTOR,
                    useClass: ResponseInterceptor,
                },
            ],
            exports: [
                {
                    provide: REST_CONFIG_OPTIONS,
                    useValue: options,
                },
            ],
        };
    }
}
