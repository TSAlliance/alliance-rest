# Alliance REST Library
This library basically adds validation and error handling to NestJS applications. However, the package also offers some bonus features that are explained below.<br>
For you to successfully use the package you have to understand the basics of [NestJS](https://docs.nestjs.com/) and the basic concepts of [typeorm](https://typeorm.io/), like the repository structure.

## Installation
```
npm install @tsalliance/rest
```

## Using the RestRepository
The package provides some basic methods for typeorm's repository structure. To use all the methods you have to extend the `RestRepository<T>` class.
```javascript
import { RestRepository } from "@tsalliance/rest"

@EntityRepository()
export class UserRepository extends RestRepository<T> {

}
```
Now you have access to following methods:
| Method                                           | Returned type          | Description                                                                                     |
| ------------------------------------------------ | ---------------------- | ----------------------------------------------------------------------------------------------- |
| `exists(options?: FindManyOptions<T>)`           | `Promise<boolean>`     | This method counts entities in a table and if it count's more than `0` it evaluates to true
| `listAll(pageable: Pageable, options?: FindManyOptions<T>)`           | `Promise<Page<T>>`     | This method retrieves a page from the database given the defined paging values

<i><b>More will be added in the future</b></i>

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
