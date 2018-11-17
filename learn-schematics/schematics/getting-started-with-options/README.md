# Getting Started With Schematic Options

This sample project builds upon the sample `getting-started` project. We will extend the schematics to provide `inputs` for the schematic to use. 

Create a new project in the `schematics` folder.

```ts
schematics schematic --name=getting-started-with-options
```

## Anatomy of a Schematic

### Project Parts

#### package.json

* The `name` and `version` properties are required to publish to npm. 
    * Use semantic versioning to update the version number.
* The `schematics` property points to the `collection.json` file.
    * This is a manifest of the schematic items in the collection. 
    * You should have at least one schematic defined.

```json
{
  "name": "@angularlicious/getting-started",
  "version": "0.0.0",
  "description": "A schematics",
  "keywords": [
    "schematics",
    "angularlicious",
    "matt vaughn"
  ],
  "author": "Matt Vaughn",
  "license": "MIT",
  "schematics": "./collection.json",
  "peerDependencies": {
    "@angular-devkit/core": "^7.0.5",
    "@angular-devkit/schematics": "^7.0.5",
    "@types/jasmine": "^2.6.0",
    "@types/node": "^8.0.31",
    "jasmine": "^2.8.0",
    "typescript": "~3.1.6"
  }
}
```

#### tsconfig.json
This configuration is used by the `tsc` compiler. The only addition to the default configuration is the `outDir`.

* Use `outDir` to define the location of compile operation.
    * The compiler will only output the `*.js` files.

```json
{
  "compilerOptions": {
    "baseUrl": "tsconfig",
    "lib": [
      "es2018",
      "dom"
    ],
    "module": "commonjs",
    "moduleResolution": "node",
    "noEmitOnError": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "noUnusedParameters": true,
    "noUnusedLocals": true,
    "outDir": "./../../dist/schematics/getting-started",
    "rootDir": "src/",
    "skipDefaultLibCheck": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "strictNullChecks": true,
    "target": "es6",
    "types": [
      "jasmine",
      "node"
    ]
  },
  "include": [
    "src/**/*",
  ],
  "exclude": [
    "src/*/files/**/*"
  ]
}
```

### Schematic Parts



#### schema.json

This is the most important file for your schematic. Think of it as the manifest for the capabilities of the schematic collection. It is collection-based - you must either have a collection of one schematic or you can add as many as you require. 

Most schematic collections are related. For example, Angular has a an `angular` schemtic collection that contains all of the individual schematic items, for example:

* new
* class
* enum
* component
* module

A good principle to follow is that a schematic should do only one thing and do that one thing well. The `SR` or `Single Responsibility` will allow for more complex schematic operations to be composed by smaller schematics. Therefore, you will need to put some thought into the organization and implementation of your schematics. 

Use the same principles as if you were developing a library.

* The top-level attribute is the name of the collection. The name of the sample below is `schematics` - which is an unfortunate name. Because we are using Angular schematics to create a schematics collection of schematics using the schematic called schematics. 
  
        Take time to select a good name for your schematic collection. Avoid
        using the word `schematic` or `schematics`.

* Each section contains the definition of the specific schematic item in the collection. 
    * description
    * factory
    * schema
    * extends

The `factory` configuration is important. It points to the entry point of the specified schematic. At a minimum provide the value of the folder that contains the default `index.ts` file - by convention the loader will use the `index` as the entry point. 

```json
// By default, collection.json is a Loose-format JSON5 format, which means it's loaded using a
// special loader and you can use comments, as well as single quotes or no-quotes for standard
// JavaScript identifiers.
// Note that this is only true for collection.json and it depends on the tooling itself.
// We read package.json using a require() call, which is standard JSON.
{
  // This is just to indicate to your IDE that there is a schema for collection.json.
  "$schema": "./node_modules/@angular-devkit/schematics/collection-schema.json",

  // Schematics are listed as a map of schematicName => schematicDescription.
  // Each description contains a description field which is required, a factory reference,
  // an extends field and a schema reference.
  // The extends field points to another schematic (either in the same collection or a
  // separate collection using the format collectionName:schematicName).
  // The factory is required, except when using the extends field. Then the factory can
  // overwrite the extended schematic factory.
  "schematics": {
    "my-schematic": {
      "description": "An example schematic",
      "factory": "./my-schematic/index#mySchematic"
    },
    "my-other-schematic": {
      "description": "A schematic that uses another schematics.",
      "factory": "./my-other-schematic"
    },
    "my-full-schematic": {
      "description": "A schematic using a source and a schema to validate options.",
      "factory": "./my-full-schematic",
      "schema": "./my-full-schematic/schema.json"
    },
    "my-extend-schematic": {
      "description": "A schematic that extends another schematic.",
      "extends": "my-full-schematic"
    }
  }
}
```

#### index.ts

The `index.ts` file is the entry point for the specified schematic. All schematics will require an entry point. By convention, always use `index` as the name for this file.

* The schematic will require additional tooling provided by `@angular-devkit/schematics` helpers. 
    * Use the `import` to add any required helpers.
* The implementation of the `loader` is a `default` function that returns a `Rule`. 
* The function allows for inputs to be passed in using the `options` value.

Notice that the type for `options` by default is `any`. This may work for simple cases or examples. However, for production or published schematics the `options` should be strongly typed using the definition of the `schema.json` file. You will need to use a tool/utility to convert the `schema` to a strongly-typed definition file (*.d.ts) so it can be used as an interface for specified options. 

```ts
import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  chain,
  mergeWith,
  schematic,
  template,
  url,
} from '@angular-devkit/schematics';


export default function (options: any): Rule {
  return chain([
    (_tree: Tree, context: SchematicContext) => {
      // Show the options for this Schematics.
      context.logger.info('My Full Schematic: ' + JSON.stringify(options));
    },

    schematic('my-other-schematic', { option: true }),

       mergeWith(apply(url('./files'), [
      template({
        INDEX: options.index,
        name: options.name,
      }),
    ])),
  ]);
}
```

#### Templates

In most code generation scenarios, templates are used to generate files and folders based on options and inputs. The schematics engine will need to know the location of the templates. By convention, most schematic developers put the templates in a folder called `files` - maybe `templates` would have been a better name, right? 

You can name this folder anything, because you will make a reference to it by name to load the `template source` in the schematic default function. The sample code below demonstrates the retrieval of the `template` source tree using `apply` and `url` functions on the folder path of `files`. It is also filtering out unwanted files with the extension `.spec.ts` if the current `spec` flag in the options is set to `false`.


```ts
const templateSource = apply(url('./files'), [
      options.spec ? noop() : filter(path => !path.endsWith('.spec.ts')),
      template({
        ...strings,
        ...options,
      }),
      move(parsedPath.path),
    ]);
```