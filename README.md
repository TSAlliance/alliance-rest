# Alliance REST Library
This library adds validation and error handling to NestJS applications

## Validation
The validator class is an injectable class in NestJS. Because of this you can make use of dependency injection.
```javascript
// Important part
import { Validator } from '@tsalliance/rest';

@Injectable()
export class ServiceClass {
    // Important part
    constructor(private validator: Validator){}
}
```

The validator as an per request scope, which means every instance of the validator is unique to a request.
This makes using the validator pretty simple inside of service calls or controllers:
```javascript
// Important part
import { Validator } from '@tsalliance/rest';

@Injectable()
export class ServiceClass {
    // Important part
    constructor(private validator: Validator){}

    public async createHelloWorld(data: HelloWorldData) {
        // The "message" represents the field name inside of the HelloWorldData object
        this.validator.text("message", data.title).alphaNum().minLen(3).maxLen(32).required().check();
        this.validator.throwErrors();
    }
}
```
The `check()` at the end of the line returns a boolean, so you could even check if something did successfully validate to directly use the validated data before throwing errors:
```javascript
createHelloWorld(data: HelloWorldData) {
    // The "message" represents the field name inside of the HelloWorldData object
    if(this.validator.text("message", data.title).alphaNum().minLen(3).maxLen(32).required().check()) {
        // Do something...
    }
    this.validator.throwErrors();
}
```

## Exception Handling
To use the global exception handler you have to register its filter globally.
```javascript
// Important part
import { ApiExceptionFilter } from '@tsalliance/rest';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Important part
  app.useGlobalFilters(new ApiExceptionFilter());

  await app.listen(3000);
}
```
