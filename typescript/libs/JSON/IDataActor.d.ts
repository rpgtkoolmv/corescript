declare namespace JSON {

    /**
     * The JSON interface for the actor
     * 
     * @export
     * @interface JSON::IDataActor
     */
    export interface IDataActor {
        [index: number]: {
            id: number;
            battlerName: string;
            characterIndex: number;
            characterName: string;
            classId: number;
            equips: number[];
            faceIndex: number;
            faceName: string;
            traits: any[];
            initialLevel: number;
            maxLevel: number;
            name: string;
            nickname: string;
            note: string;
            profile: string;
        }
    }
}