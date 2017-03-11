declare namespace JSON {

    /**
     * The JSON interface for tileset data. 
     * 
     * @export
     * @interface JSON::IDataTileset
     */
    export interface IDataTileset {
        [index: number]: {
            id: number;
            flags: number[];
            mode: number;
            name: string;
            note: string;
            tilesetNames: string[];
        }
    }
}