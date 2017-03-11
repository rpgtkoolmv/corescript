declare namespace JSON {

    export interface ITrait {
        code: number;
        dataId: number;
        value: number;
    }

    /**
     * The JSON interface for the Weapons.
     * 
     * @export
     * @interface JSON::IWeapons
     */
    export interface IWeapons {
        [index: number]: {
            id: number;
            animationId: number;
            description: string;
            etypeId: number;
            traits: ITrait[];
            iconIndex: number;
            name: string;
            note: string;
            params: number[];
            price: number;
            wtypeId: number;
        }
    }
} 