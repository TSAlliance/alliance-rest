# Alliance REST Library
This library basically adds validation and error handling to NestJS applications. However, the package also offers some bonus features that are explained below.<br>
For you to successfully use the package you have to understand the basics of [NestJS](https://docs.nestjs.com/) and the basic concepts of [typeorm](https://typeorm.io/), like the repository structure.

## Installation
```
npm install @tsalliance/rest
```

## Permissions
This package offers some tools to limit access to certain endpoints (``@CanAccess()``). This allows to define permissions on properties in your Entities (``@CanRead()``). You can either allow reading properties, forbid access completely or restrict to just certain types of requests by
making authentication required or by setting permissions. Both decorator types work the same.
For all use cases, this can look similar to the following examples:
```typescript
// Using @CanAccess() on Controller routes
@Controller('invite')
export class InviteController {
    constructor(private readonly inviteService: InviteService) {}

    @Post()
    @CanAccess(PermissionCatalog.INVITES_WRITE)
    public create(@Body() createInviteDto: CreateInviteDto, @Authentication() authentication: RestAccount) {
        return this.inviteService.create(createInviteDto, authentication);
    }

    @Get(':id')
    public findOne(@Param('id') id: string) {
        return this.inviteService.findById(id);
    }

    @Put(':id')
    @CanAccess(PermissionCatalog.INVITES_WRITE)
    public update(@Param('id') id: string, @Body() updateInviteDto: UpdateInviteDto) {
        return this.inviteService.update(id, updateInviteDto);
    }

    @Delete(':id')
    @CanAccess(PermissionCatalog.INVITES_WRITE)
    public remove(@Param('id') id: string) {
        return this.inviteService.delete(id);
    }
}

// Using @CanRead() on Entity Properties
export class Invite {
    @PrimaryColumn("varchar", { length: 6 })
    public id: string;

    @CanRead([PermissionCatalog.INVITES_READ, PermissionCatalog.INVITES_WRITE])
    @Column({ nullable: false, default: 0 })
    public maxUses: number;

    @CanRead([PermissionCatalog.INVITES_READ, PermissionCatalog.INVITES_WRITE])
    @Column({ nullable: false, default: 0 })
    public uses: number;

    @CanRead([PermissionCatalog.INVITES_READ, PermissionCatalog.INVITES_WRITE])
    @CreateDateColumn()
    public createdAt: Date;

    @CanRead([PermissionCatalog.INVITES_READ, PermissionCatalog.INVITES_WRITE])
    @CreateDateColumn()
    public updatedAt: Date;

    @CanRead([PermissionCatalog.INVITES_READ, PermissionCatalog.INVITES_WRITE])
    @Column({ nullable: true })
    public expiresAt?: Date;
}
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
### Using the validator as Object
The `Validator` class used to be a `REQUEST` scoped injectable. However this approach caused some performance issues which is why it must now be instantiated inside method calls. However there is still the possibility to inject the validator, but only as non-request-scoped injectable. Below is an example on how this looks in practice:
```javascript
// Important part
import { Validator } from '@tsalliance/rest';

@Injectable()
export class ServiceClass {
    
    public doSomething() {
        const validator = new Validator();
        // Use validator to validate things...
        validator.text("message", data.title).alphaNum().minLen(3).maxLen(32).required().check();

        // and to throw errors on failure
        validator.throwErrors();
    }
}
```

### Using the validator as Injectable
Additionally, the `Validator` can be used as an `Injectable`. To use it globally you can import the `ValidatorModule` in your `app.module.ts`. But keep in mind, that using the validator as an injectible, it becomes inefficient, because the Injectable that injects the validator becomes `REQUEST` scoped compulsorily in the nature of NestJS.
```javascript
// Important part
import { Validator } from '@tsalliance/rest';

@Injectable()
export class ServiceClass {
    constructor(private validator: Validator)
    
    public doSomething() {
        // Use validator to validate things...
        this.validator.text("message", data.title).alphaNum().minLen(3).maxLen(32).required().check();

        // and to throw errors on failure
        this.validator.throwErrors();
    }
}
```

### Validating required and optional values

The `check()` at the end of a line triggers the validation process and returns a boolean to check if something did successfully validate. Check the example below:
```javascript
createHelloWorld(data: HelloWorldData) {
    // "message" represents the field name inside of the HelloWorldData object
    if(this.validator.text("message", data.title).alphaNum().minLen(3).maxLen(32).required().check()) {
        // Do something...
    }
    this.validator.throwErrors();
}
```

The example above show how to make fields inside of objects required. As you can see this is done by adding the `required()` rule to the chain.
If you leave that rule out, the above example would still validate to `false` if the value (e.g.: `data.title`) is undefined or something similar. The only difference is, that when appending `required()`, internally an error is added to a list. So when calling `this.validator.throwErrors()` these collected errors are thrown. But leaving out the required rule does not throw such an `ValidationException`. This is especially useful for validating optional values. To give a better understanding, check out this example on how to validate optional values:
```javascript
createHelloWorld(data: HelloWorldData) {
    // "message" represents the field name inside of the HelloWorldData object
    // Notice the missing required() here
    if(this.validator.text("message", data.title).alphaNum().minLen(3).maxLen(32).check()) {
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
