declare namespace JSON {

    export interface ITroopMember {
        enemyId: number;
        x: number;
        y: number;
        hidden: boolean;
    }

    export interface ITroopCondition {
        actorHp: number;
        actorId: number;
        actorValid: boolean;
        enemyHp: number;
        enemyIndex: number;
        enemyValid: boolean;
        switchId: number;
        switchValid: boolean;
        turnA: number;
        turnB: number;
        turnEnding: boolean;
        turnValid: boolean;
    }

    export interface ITroopList {
        code: number;
        indent: number;
        parameters: any[];
    }
    
    export interface ITroopConditionPage {
        conditions: ITroopCondition;
        list: ITroopList[];
        span: number;
    }
    
    /**
     * The JSON interface for the troops
     * 
     * @export
     * @interface JSON::IDataTroops
     */
    export interface IDataTroops {
        id: number;
        members: ITroopMember[];
        name: string;
        pages: ITroopConditionPage[];
    }
}