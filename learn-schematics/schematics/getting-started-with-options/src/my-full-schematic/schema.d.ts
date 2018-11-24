
export interface FullSchematicOptions {

    /**
     * Use to provide a name value for the schematic (required).
     */
    name: string;

    /**
     * Use to provide a specific path.
     */
    path: string;

    /**
     * Use to indicate the name of the project to apply the template changes (required).
     */
    project: string;

    /**
     * Use to indicate the time of the schematic run (value supplied during runtime).
     */
    currentDateTime: Date;
}