import { DynamicModule, Module } from "@nestjs/common";
import { APP_FILTER, APP_PIPE } from "@nestjs/core";
import { REST_CONFIG_OPTIONS } from "./constants";
import { AllianceExceptionFilter } from "./error/exceptionFilter";
import { RestValidationPipe } from "./pipes/validation.pipe";

export class AllianceRestOptions {
    /**
     * Enable or disabled debug logs.
     */
    public logging?: boolean = false;

    /**
     * Enable or disable built-in exception filter.
     */
    public disableErrorHandling?: boolean = false;

    /**
     * Enable or disable built-in validation pipe.
     * This makes use of the NestJS validation pipe using class-validator.
     */
    public disableValidation?: boolean = false;
}

@Module({
    providers: [],
})
export class AllianceRestModule {
    public static forRoot(options: AllianceRestOptions = {}): DynamicModule {
        const providers: any[] = [
            {
                provide: REST_CONFIG_OPTIONS,
                useValue: options,
            },
        ];

        if (!options.disableErrorHandling) {
            providers.push({
                provide: APP_FILTER,
                useValue: new AllianceExceptionFilter(options),
            });
        }

        if (!options.disableValidation) {
            providers.push({
                provide: APP_PIPE,
                useValue: RestValidationPipe,
            });
        }

        return {
            module: AllianceRestModule,
            providers,
            exports: [
                {
                    provide: REST_CONFIG_OPTIONS,
                    useValue: options,
                },
            ],
        };
    }
}
