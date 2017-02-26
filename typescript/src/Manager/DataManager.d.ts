/**
 * The global variable who hold the data for the Actor JSON
 * 
 * @property Window.$dataActors
 * @type JSON
 * @constant
 * @global
 */
declare const $dataActors: JSON.IDataActor;

/**
 * The static class that manages the database and game objects.
 * 
 * @abstract
 * @class DataManager
 */
declare abstract class DataManager {

    private static _globalId: string;
    private static _lastAccessedId: number;
    private static _errorUrl:
}