# schematics :: demo outline

## environment setup
* Install the required Dev kit packages
* Install the required Nx packages
* Create a new workspace

## create schematic project
* Create new **folder** called schematics
* Open a terminal to the new folder 
* Use this the `schematics` collection to create a new schematics project
* Use the schematic item called `schematics`
* Create Schematic project called `getting started`

## configure schematic project for publish
* Add/Update the `schematics` path in the package.json 
* Add an output directory property in the typescript configuration file: `outDir`

```json
"outDir": "./../../dist/schematics/getting-started",
```

* Add a build script for the schematic
   
```json
"build:schematics": "npm run build-schematic:getting-started",
"build-schematic:getting-started": "tsc -p ./schematics/getting-started/tsconfig.json && npm run copy-schematic:getting-started-templates && npm run copy-schematic:getting-started-types && npm run copy-schematic:getting-started-package && npm run copy-schematic:getting-started-collection  && npm run copy-schematic:getting-started-readme",
"copy-schematic:getting-started-templates": "sync-glob -d false 'schematics/getting-started/src/**/*/files/*' dist/schematics/getting-started/",
"copy-schematic:getting-started-types": "sync-glob -d false 'schematics/getting-started/src/**/*/schema.*' dist/schematics/getting-started/",
"copy-schematic:getting-started-package": "sync-glob -d false 'schematics/getting-started/package.json' dist/schematics/getting-started",
"copy-schematic:getting-started-collection": "sync-glob -d false 'schematics/getting-started/src/collection.json' dist/schematics/getting-started",
"copy-schematic:getting-started-readme": "sync-glob -d false 'schematics/getting-started/README.md' dist/schematics/getting-started",  
```


* Rename `dependencies` to `peerDependencies` in the schematic project location.
* Update the `schematics` collection path in the local project's package.json file
    *  "schematics": "./collection.json",
    *  path used for distributed/published version of schematic

## run the schematic
* Emulate node_modules installation

```ts
npm link ./dist/schematics/getting-started
```
* run the schematic using `ng generate`

```
ng generate @clearwater/getting-started:my-full-schematic --name="test"
```

## debugging configuration

* Add package to prepare for launch configuration

```ts
npm install -D @angular-devkit/schematics-cli
```

* configure workspace to emulate schematic project via `package.json`

```json
"schematics": "./dist/schematics/getting-started/collection.json",
"schematics": "./dist/schematics/getting-started/collection.json",
```

## create launch configuration

```json
{
    "version": "0.2.0",
    "configurations": [
         {
            "type": "node",
            "request": "launch",
            "name": "With Debugging",
            "program": "${workspaceFolder}/node_modules/@angular-devkit/schematics-cli/bin/schematics.js",
            "args": [
                ".:my-full-schematic",
                "--name=CLEARWATER"
            ],
            "outFiles": []
        }
    ]
}
```

## debug

* set break point in `schematics` folder