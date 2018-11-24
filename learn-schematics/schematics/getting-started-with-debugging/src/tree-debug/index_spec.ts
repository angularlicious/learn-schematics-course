// import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import {Schema as WorkspaceOptions} from '@schematics/angular/workspace/schema';
import {Schema as ApplicationOptions} from '@schematics/angular/application/schema';

const collectionPath = path.join(__dirname, '../collection.json');

describe('getting-started-with-debugging', () => {
  const testRunner = new SchematicTestRunner(
    'getting-started', collectionPath);

  const workspaceOptions: WorkspaceOptions = {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '6.0.0',
  };

  const appOptions: ApplicationOptions = {
    name: 'web-app-with-options',
    inlineStyle: false,
    inlineTemplate: false,
    routing: true,
    style: 'scss',
    skipTests: false,
    skipPackageJson: false,
};

  let appTree: UnitTestTree;
  beforeEach(() => {
    appTree = testRunner.runExternalSchematic(
      '@schematics/angular', 'workspace', workspaceOptions);
    appTree = testRunner.runExternalSchematic(
      '@schematics/angular', 'application', appOptions, appTree);
  });

  it('has a tree', () => {
    console.log(`collectionPath: ${collectionPath}`);
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = runner.runSchematic('tree-debug', {
      name: 'debug-schematic',
      project: 'web-app-with-options'
    }, appTree);

    expect(tree.files.length).toBeGreaterThanOrEqual(1);
  });
});
