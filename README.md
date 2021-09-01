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
| `findById(id: string \| number \| Date \| ObjectID \| FindId, options?: FindManyOptions<T>)` | `Promise<T>` | Better way of looking up database entries by their respective id. To search for an id with different column name you can pass an instance of FindId.

<i><b>More will be added in the future</b></i>

## Validation
The `Validator` class used to be a `REQUEST` scoped injectable. However this approach caused some performance issues which is why a `@Validation()` decorator on parameter-level was introduced. Inside services or controllers you can now add this decorator before a parameter to make use of a unique validator instance every time the function is called. Below is an example on how this looks in practice:
```javascript
// Important part
import { Validation, Validator } from '@tsalliance/rest';

@Injectable()
export class ServiceClass {
    
    public doSomething(@Validation() validator: Validator) {
        // Use validator to validate things...
        validator.text("message", data.title).alphaNum().minLen(3).maxLen(32).required().check();

        // and to throw errors on failure
        validator.throwErrors();
    }
}
```

Additionally to that the `Validator` still exists as an `Injectable`. To use it globally you can import the `ValidatorModule` in your `app.module.ts`. But keep in mind, that injected instances of the `Validator` are not unique anymore. That means, failed tests are accumulated all over the application and never cleared.

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
