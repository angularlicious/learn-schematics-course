# demo outline
* Install the required Dev kit packages
* Install the required Nx packages
* Create a new workspace
* Create new **folder** called schematics
* Open a terminal to the new folder 
* Use this the `schematics` collection to create a new schematics project
* Use the schematic item called `schematics`
* Create Schematic project called `getting started`
* Add/Update the `schematics` path in the package.json 
* Add an output directory property in the typescript configuration file: `outDir`
    * "outDir": "./../../dist/schematics/getting-started",
* Add a build script for the schematic
    *  "build:schematics": "npm run build-schematic:getting-started",
    "build-schematic:getting-started": "tsc -p ./schematics/getting-started/tsconfig.json",
* Add package to prepare for launch configuration
    * "@angular-devkit/schematics": "^7.0.5",
* Rename `dependencies` to `peerDependencies` in the schematic project location.
* Update the `schematics` collection path in the local project's package.json file
    *  "schematics": "./collection.json",
    *  path used for distributed/published version of schematic
* Create build scripts for the schematic:
    *  `build:schematics` in the package.json scripts section
* Run the schematic
    * ng generate @angularlicious/getting-started:my-full-schematic --name="test"