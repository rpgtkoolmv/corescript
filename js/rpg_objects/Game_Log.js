function Game_LogBase(){
    this.initialize.apply(this,arguments);
}

Game_LogBase.prototype.createMessage = function(){
    return 'unknow error';
};
Game_LogBase.prototype.initialize = function(){};

function Game_LogMapEvent(){
    this.initialize.apply(this,arguments);
}

Game_LogMapEvent.prototype = Object.create(Game_LogBase.prototype);
Game_LogMapEvent.prototype.constructor =Game_LogMapEvent;

Game_LogMapEvent.prototype.initialize =function(mapId,eventId,page){
    this._mapId =mapId;
    this._eventId =eventId;
    this._page =page;
};

Game_LogMapEvent.prototype.getEventName = function(){
    if($gameMap.mapId() ===this._mapId){
        var event = $gameMap.event(this._eventId);
        if(event){
            return event.event().name;
        }
    }
    return "";
};
Game_LogMapEvent.prototype.createMessage = function(){
    var name = this.getEventName();
    return ( "MapID: %1, MapEventID: %2(%3), page: %4").format(
        this._mapId,
        this._eventId,
        name,
        this._page
    );
};

function Game_LogEventPgaeMoveRoute(){
    this.initialize.apply(this,arguments);
}

Game_LogEventPgaeMoveRoute.prototype = Object.create(Game_LogMapEvent.prototype);
Game_LogEventPgaeMoveRoute.prototype.constructor =Game_LogEventPgaeMoveRoute;

Game_LogEventPgaeMoveRoute.prototype.createMessage =function(){
    return  Game_LogMapEvent.prototype.createMessage.call(this) +"(Move Route)";
};

function Game_LogCommonEvent(){
    this.initialize.apply(this,arguments);
}

Game_LogCommonEvent.prototype = Object.create(Game_LogBase.prototype);
Game_LogCommonEvent.prototype.constructor =Game_LogCommonEvent;

Game_LogCommonEvent.prototype.initialize =function(eventId){
    this._eventId = eventId;
};

Game_LogCommonEvent.prototype.getEventName =function(){
    var event = $dataCommonEvents[this._eventId];
    if(event){
        return event.name;
    }
    return "";
};
Game_LogCommonEvent.prototype.createMessage =function(){
    var name = this.getEventName();
    return ("CommonEvent: %1(%2)").format(
        this._eventId,
        name
    );
};

function Game_LogBattleEvent(){
    this.initialize.apply(this,arguments);
}

Game_LogBattleEvent.prototype = Object.create(Game_LogBase.prototype);
Game_LogBattleEvent.prototype.constructor =Game_LogBattleEvent;
Game_LogBattleEvent.prototype.initialize =function(troopId,page){
    this._troopId = troopId;
    this._page =page;
};

Game_LogBattleEvent.prototype.getEventName =function(){
    var troop = $dataTroops[this._troopId];
    if(troop){
       return troop.name;
    }
    return "";
};

Game_LogBattleEvent.prototype.createMessage =function(){
    var name = this.getEventName();
    return ("TroopID: %1(%2), page: %3").format(
        this._troopId,
        name,
        this._page
    );
};

function Game_LogEventTest(){
    this.initialize.apply(this,arguments);
}

Game_LogEventTest.prototype = Object.create(Game_LogBase.prototype);
Game_LogEventTest.prototype.constructor =Game_LogBattleEvent;
Game_LogEventTest.prototype.initialize =function(){
};

Game_LogEventTest.prototype.createMessage = function(){
    return ('EventTest');
};
