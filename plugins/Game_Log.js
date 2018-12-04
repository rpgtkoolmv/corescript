

function Game_LogBase(){
    this.initialize.apply(this,arguments);
}

Game_LogBase.prototype.createMessage = function(){
    return 'unknow error';
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
        return ( "MapID: %1,%2, page: %3").format(this._mapId,event.debugName(),this._page);
    }
    return "";
};

function Game_LogEventPgaeMoveRoute(){
    this.initialize.apply(this,arguments);
}

Game_LogEventPgaeMoveRoute.prototype = Object.create(Game_LogMapEvent.prototype);
Game_LogEventPgaeMoveRoute.prototype.constructor = Game_LogEventPgaeMoveRoute;

Game_LogEventPgaeMoveRoute.prototype.createMessage =function(){
    return "(Move Route)"+ Game_LogMapEvent.prototype.createMessage.call(this) ;
};

function Game_LogCommonEvent(){
    this.initialize.apply(this,arguments);
}

Game_LogCommonEvent.prototype = Object.create(Game_LogBase.prototype);
Game_LogCommonEvent.prototype.constructor = Game_LogCommonEvent;

Game_LogCommonEvent.prototype.initialize = function(eventId){
    this._eventId = eventId;
    this._parent =null;
};

Game_LogCommonEvent.prototype.getEventName = function(){
    var event = $dataCommonEvents[this._eventId];
    if(event){
        if(event.name ===''){
            return 'unnamede';
        }
        return event.name;
    }
    return "";
};
Game_LogCommonEvent.prototype.createMessage = function(){
    var name = this.getEventName();
    return ("CommonEvent: %1(%2)").format(
        this._eventId,
        name
    );
};

Game_LogCommonEvent.prototype.setParent = function(parent){
    this._parent = parent;
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
    return ("TroopID: %1(%2), page: %3").format(
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

(function(){
Game_CharacterBase.prototype.setMoveRouteLog = function(callLog){
    this._moveRouteLog = callLog;
};
Game_CharacterBase.prototype.getErrorLog = function(){
    return this._moveRouteLog;
};


Game_Character.prototype.restoreMoveRoute = function() {
    this._moveRoute          = this._originalMoveRoute;
    this._moveRouteIndex     = this._originalMoveRouteIndex;
    this._originalMoveRoute  = null;
    this._moveRouteLog       = null;
};

Game_Character.prototype.evalRouteScript = function(script){
    var gc = Game_Character;
    try {
        eval(script);        
    } catch (error) {
        if(this._moveRouteLog){
            error.rpgmv = this;
            this._moveRouteLog.addLog('moveRouteError');
            this._moveRouteLog.addLog('target:'+this.debugName());
            this._moveRouteLog.addLog("script:"+script);
        }
        throw(error);
    }
};

Game_Player.prototype.debugName = function(){
    return "player";
};

Game_Follower.prototype.debugName = function(){
    return "follower[" + this._memberIndex+"]";
};

Game_Vehicle.prototype.debugName = function(){
    return "vehicle("+this._type+")";
};

Game_Event.prototype.debugName = function(){
    var event = this.event();
    if(event){
        return "MapEvent:"+ this._eventId +"("+ event.name+")";
    }
    return "";
};

Game_Event.prototype.createLogClass = function(){
    return new Game_LogMapEvent(
        this._mapId,
        this._eventId,
        this._pageIndex
    );
};

Game_Event.prototype.setupPageSettings = function() {
    var page = this.page();
    var image = page.image;
    if (image.tileId > 0) {
        this.setTileImage(image.tileId);
    } else {
        this.setImage(image.characterName, image.characterIndex);
    }
    if (this._originalDirection !== image.direction) {
        this._originalDirection = image.direction;
        this._prelockDirection = 0;
        this.setDirectionFix(false);
        this.setDirection(image.direction);
    }
    if (this._originalPattern !== image.pattern) {
        this._originalPattern = image.pattern;
        this.setPattern(image.pattern);
    }
    this.setMoveSpeed(page.moveSpeed);
    this.setMoveFrequency(page.moveFrequency);
    this.setPriorityType(page.priorityType);
    this.setWalkAnime(page.walkAnime);
    this.setStepAnime(page.stepAnime);
    this.setDirectionFix(page.directionFix);
    this.setThrough(page.through);
    this.setMoveRoute(page.moveRoute);
    this._moveType = page.moveType;

    if(this._moveType === 3){
        this.setMoveRouteLog( new Game_LogEventPgaeMoveRoute(this._mapId,this._eventId,this._pageIndex));
    }

    this._trigger = page.trigger;
    if (this._trigger === 4) {
        this._interpreter = new Game_Interpreter();
    } else {
        this._interpreter = null;
    }
};


Game_Map.prototype.setupStartingMapEvent = function() {
    var events = this.events();
    for (var i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.isStarting()) {
            event.clearStartingFlag();
            this._interpreter.setup(event.list(), event.eventId());
            this._interpreter.setEventCallLog(event.createLogClass());
            return true;
        }
    }
    return false;
};


Game_Map.prototype.setupTestEvent = function() {
    if ($testEvent) {
        this._interpreter.setup($testEvent, 0);
        this._interpreter.setEventCallLog(new Game_LogEventTest());
        $testEvent = null;
        return true;
    }
    return false;
};


Game_CommonEvent.prototype.setupEvent = function(){
    this._interpreter.setup(this.list());
    this._interpreter.setEventCallLog(new Game_LogCommonEvent(this._commonEventId));
};
Game_CommonEvent.prototype.update = function() {
    if (this._interpreter) {
        if (!this._interpreter.isRunning()) {
            this.setupEvent();
        }
        this._interpreter.update();
    }
};

Game_Troop.prototype.setupBattleEvent = function() {
    if (!this._interpreter.isRunning()) {
        if (this._interpreter.setupReservedCommonEvent()) {
            return;
        }
        var pages = this.troop().pages;
        for (var i = 0; i < pages.length; i++) {
            var page = pages[i];
            if (this.meetsConditions(page) && !this._eventFlags[i]) {
                this._interpreter.setup(page.list);
                this._interpreter.setEventCallLog(new Game_LogBattleEvent(this._troopId,i));
                if (page.span <= 1) {
                    this._eventFlags[i] = true;
                }
                break;
            }
        }
    }
};

Game_Interpreter.prototype.setEventCallLog = function(callLog){
    this._callLog = callLog;
};


Game_Interpreter.prototype.setupChild = function(list, eventId) {
    this._childInterpreter = new Game_Interpreter(this._depth + 1);
    this._childInterpreter.setup(list, eventId);
    this._childInterpreter.setEventCallLog(log);
//    log.setParent(this._callLog);
};


Game_Interpreter.prototype.getErrorLog = function(){
    return this._callLog;
};
Game_Interpreter.prototype.evalScript = function(script){
    try {
        return eval(script);        
    } catch (error) {
        if(this._callLog){
            error.rpgmv = this;
            this._callLog.addLog("evalError");
            this._callLog.addLog(script);
        }
        throw(error);
    }
};
// Set Movement Route
Game_Interpreter.prototype.command205 = function() {
    $gameMap.refreshIfNeeded();
    this._character = this.character(this._params[0]);
    if (this._character) {
        this._character.forceMoveRoute(this._params[1]);
        if (this._params[1].wait) {
            this.setWaitMode('route');
        }
        this._character.setMoveRouteLog(this._callLog);
    }
    return true;
};

// Plugin Command
Game_Interpreter.prototype.command356 = function() {
    var args = this._params[0].split(" ");
    var command = args.shift();
    try {
        this.pluginCommand(command, args);            
    } catch (error) {
        if(this._callLog){
            error.rpgmv = this;
            this._callLog.addLog("command:"+command);
            this._callLog.addLog("args:"+args);
        }
        throw(error);
    }
    return true;
};


Graphics.createErrorHTML = function(error){
    return this._makeEventInfo(error)+ this._makeErrorStackLog(error);
};

Graphics._makeEventInfo = function(e){
    if(e.rpgmv){
        if(e.rpgmv.getErrorLog){
            var log = e.rpgmv.getErrorLog();
            if(log){
                return log.createErrorHTML();
            }
        }
    }
    return "";
};


SceneManager.showErrorLog = function(e){
    console.error(e.stack);
    if(e.rpgmv){
        if(e.rpgmv.getErrorLog){
            var log = e.rpgmv.getErrorLog();
            if(log){
                console.error(log.createConsolMessage() );
            }
        }
    }
};

})();
