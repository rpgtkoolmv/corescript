

function Game_LogBase(){
    this.initialize.apply(this,arguments);
}

Game_LogBase.prototype.createMessage = function(){
    return 'unknown error';
};
Game_LogBase.prototype.initialize = function(){
    this._additionalLog =[];
};

Game_LogBase.prototype.createErrorHTML =function(){
    var addError = this.createAdditionalError('<br>');
    return this.createMessage() +addError+ '<hr><br>';
};
Game_LogBase.prototype.createConsolMessage =function(){
    return this.createMessage() + this.createAdditionalError("\n");
};
Game_LogBase.prototype.addLog =function(text){
    if(!this._additionalLog){
        this._additionalLog =[];
    }
    this._additionalLog.push(text);
};
Game_LogBase.prototype.createAdditionalError =function(brStr){
    if(!this._additionalLog){return "";}
    var result =brStr;
    for(var i=0; i < this._additionalLog.length; ++i){
        result +=  this._additionalLog[i] + brStr;
    }
    return result;
};

function Game_LogMapEvent(){
    this.initialize.apply(this,arguments);
}

Game_LogMapEvent.prototype = Object.create(Game_LogBase.prototype);
Game_LogMapEvent.prototype.constructor = Game_LogMapEvent;

Game_LogMapEvent.prototype.initialize = function(mapId,eventId,page){
    this._mapId = mapId;
    this._eventId = eventId;
    this._page = page;
};

Game_LogMapEvent.prototype.event = function(){
    if($gameMap.mapId() === this._mapId){
        var event = $gameMap.event(this._eventId);
        if(event){
            return event;
        }
    }
    return null;
};

Game_LogMapEvent.prototype.getEventName = function(){
    var event = this.event();
    if(event){
        return event.debugName();
    }
    return "";
}
Game_LogMapEvent.prototype.createMessage = function(){
    var event = this.event();
    if(event){
        return ( "MapID: %1,%2, page: %3").format(this._mapId,event.debugName(),this._page+1);
    }
    return "";
};

function Game_LogEventPageMoveRoute(){
    this.initialize.apply(this,arguments);
}

Game_LogEventPageMoveRoute.prototype = Object.create(Game_LogMapEvent.prototype);
Game_LogEventPageMoveRoute.prototype.constructor = Game_LogEventPageMoveRoute;

Game_LogEventPageMoveRoute.prototype.createMessage =function(){
    return "(Move Route)"+ Game_LogMapEvent.prototype.createMessage.call(this) ;
};

function Game_LogCommonEvent(){
    this.initialize.apply(this,arguments);
}

Game_LogCommonEvent.prototype = Object.create(Game_LogBase.prototype);
Game_LogCommonEvent.prototype.constructor = Game_LogCommonEvent;

Game_LogCommonEvent.prototype.initialize = function(eventId){
    this._eventId = eventId;
};

Game_LogCommonEvent.prototype.getEventName = function(){
    var event = $dataCommonEvents[this._eventId];
    if(event){
        if(event.name ===''){
            return 'unnamed';
        }
        return event.name;
    }
    return "";
};
Game_LogCommonEvent.prototype.createMessage = function(){
    var name = this.getEventName();
    return ("CommonEvent: %1(%2)").format(
        this._eventId ,
        name
    );
};


function Game_LogBattleEvent(){
    this.initialize.apply(this,arguments);
}

Game_LogBattleEvent.prototype = Object.create(Game_LogBase.prototype);
Game_LogBattleEvent.prototype.constructor = Game_LogBattleEvent;
Game_LogBattleEvent.prototype.initialize = function(troopId,page){
    this._troopId = troopId;
    this._page =page;
};

Game_LogBattleEvent.prototype.getEventName = function(){
    var troop = $dataTroops[this._troopId];
    if(troop){
       return troop.name;
    }
    return "";
};

Game_LogBattleEvent.prototype.createMessage = function(){
    var name = this.getEventName();
    return ("BattleEvent TroopID: %1(%2), page: %3").format(
        this._troopId,
        name,
        1+this._page 
    );
};

function Game_LogEventTest(){
    this.initialize.apply(this,arguments);
}

Game_LogEventTest.prototype = Object.create(Game_LogBase.prototype);
Game_LogEventTest.prototype.constructor = Game_LogBattleEvent;
Game_LogEventTest.prototype.initialize = function(){
};

Game_LogEventTest.prototype.createMessage = function(){
    return ('EventTest');
};

