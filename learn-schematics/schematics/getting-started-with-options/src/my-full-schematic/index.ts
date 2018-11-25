import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  apply,
  mergeWith,
  move,
  template,
  url,
  branchAndMerge,
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { parseName } from '@schematics/angular/utility/parse-name'
import { getWorkspace } from '@schematics/angular/utility/config'
import { buildDefaultPath } from '@schematics/angular/utility/project'
import { WorkspaceProject } from '@schematics/angular/utility/workspace-models';

import { FullSchematicOptions } from './schema';

/**
 * Use to setup the target path using the specified options [project].
 * @param host the current [Tree]
 * @param options the current [options]
 * @param context the [SchematicContext]
 */
export function setupOptions(host: Tree, options: FullSchematicOptions, context: SchematicContext) {
  const workspace = getWorkspace(host);
  if (!options.project) {
    context.logger.error(`The [project] option is missing.`);
    throw new SchematicsException('Option (project) is required.');
  }
  context.logger.info (`Preparing to retrieve the project using: ${options.project}`);
  const project = <WorkspaceProject>workspace.projects[options.project];

  if (options.path === undefined) {
    context.logger.info(`Preparing to determine the target path.`);
    options.path = buildDefaultPath(project);
    context.logger.info(`The target path: ${options.path}`);
  }

  const parsedPath = parseName(options.path, options.name);
  options.name = parsedPath.name;
  options.path = parsedPath.path;

  context.logger.info(`Finished options setup.`);
  return host;
}

export default function (options: FullSchematicOptions): Rule {
  return (host: Tree, context: SchematicContext) => {

    setupOptions(host, options, context);

    // setup a variable [currentDateTime] programmatically --> used in template;
    options.currentDateTime = new Date(Date.now());

    const templateSource = apply(url('./files'), [
      template({
        ...strings,
        ...options,
      }),
      move(options.path),
    ]);

    return branchAndMerge(mergeWith(templateSource));
  };    
}
