/**
 * The global variable who hold the data for the Actor JSON
 * 
 * @property Window.$dataActors
 * @type JSON
 * @constant
 * @global
 */
declare var $dataActors: JSON.IDataActor;
declare var $dataSkills: any;
declare var $dataItems: any;
declare var $dataArmors: any;
declare var $dataEnemies: any;
declare var $dataTroops: JSON.IDataTroops;


declare type T_MV_Objects = JSON.IDataActor | JSON.IDataMap;

/**
 * The interface for the dataManager array.
 * 
 * @export
 * @interface IDatabaseFiles
 */
export interface IDatabaseFiles {
    name: string,
    src: string
}

/**
 * The static class that manages the database and game objects.
 * 
 * @abstract
 * @class DataManager
 */
declare abstract class DataManager {
    
    /**
     * The private static variable who hold MV global ID.
     * 
     * @private
     * @static
     * @type {string}
     * @memberOf DataManager
     */
    private static _globalId: string;

    /**
     * The private static variable who hold the last accessed ID.
     * 
     * @private
     * @static
     * @type {number}
     * @memberOf DataManager
     */
    private static _lastAccessedId: number;
    
    /**
     * The private static variable who hold the error url.
     * 
     * @private
     * @static
     * @type {string}
     * @memberOf DataManager
     */
    private static _errorUrl: string;

    /**
     * The private static array who define the JSON data src.
     * 
     * @private
     * @static
     * @type {IDatabaseFiles[]}
     * @memberOf DataManager
     */
    private static _databaseFiles: IDatabaseFiles[];
    
    /**
     * The static method who load the database.
     * 
     * @static
     * 
     * @memberOf DataManager
     */
    public static loadDatabase(): void;

    /**
     * The static method who load data files.
     * 
     * @static
     * @param {string} name the name of the global variable
     * @param {string} src the name of the json file
     * 
     * @memberOf DataManager
     */
    public static loadDataFile(name: string, src: string): void;

    /**
     * The static method who check if the  database is loaded.
     * 
     * @static
     * @returns {boolean} return true if the database is loaded
     * 
     * @memberOf DataManager
     */
    public static isDatabaseLoaded(): boolean;

    /**
     * The static method who load the map data.
     * 
     * @static
     * @param {number} mapId the id of the map
     * 
     * @memberOf DataManager
     */
    public static loadMapData(mapId: number): void;

    /**
     * the static method who make a empty map.
     * 
     * @static
     * 
     * @memberOf DataManager
     */
    public static makeEmptyMap(): void;

    /**
     * The static method who check if the map is loaded.
     * 
     * @static
     * @returns {boolean} return true if the map is loaded
     * 
     * @memberOf DataManager
     */
    public static isMapLoaded(): boolean;

    /**
     * The static method who load json internal data and parse it.
     * 
     * @static
     * @param {T_MV_Objects} object The object to data to load.
     * 
     * @memberOf DataManager
     */
    public static onLoad(object: T_MV_Objects): void;

    /**
     * The static method who extract the metadata from the json.
     * 
     * @static
     * @param {T_MV_Objects} data the data to load
     * 
     * @memberOf DataManager
     */
    public static extractMetadata(data: T_MV_Objects): void;

    /**
     * The static method who check for error if it's occurs a error is throw
     * 
     * @static
     * @throws Error
     * 
     * @memberOf DataManager
     */
    public static checkError(): void;

    /**
     * The static method who check if the game is actually in battle test.
     * 
     * @static
     * @returns {boolean} return true if the game is actually in battle test.
     * 
     * @memberOf DataManager
     */
    public static isBattleTest(): boolean;
    
    /**
     * The static method who check if the game is actually in event test.
     * 
     * @static
     * @returns {boolean} return true if the game is actually in event test.
     * 
     * @memberOf DataManager
     */
    public static isEventTest(): boolean;

    /**
     * The static method who check if the actual item is a skill.
     * 
     * @static
     * @param {string} item the string 
     * @returns {boolean} 
     * 
     * @memberOf DataManager
     */
    public static isSkill(item: string): boolean;

    
}