//-----------------------------------------------------------------------------
// Window_MenuActor
//
// The window for selecting a target actor on the item and skill screens.

function Window_MenuActor() {
    this.initialize.apply(this, arguments);
}

Window_MenuActor.prototype = Object.create(Window_MenuStatus.prototype);
Window_MenuActor.prototype.constructor = Window_MenuActor;

Window_MenuActor.prototype.initialize = function() {
    Window_MenuStatus.prototype.initialize.call(this, 0, 0);
    this.hide();
    this._action =null;
};

Window_MenuActor.prototype.action =function(){
    return this._action;
};

Window_MenuActor.prototype.processOk = function() {
    if (!this.cursorAll()) {
        $gameParty.setTargetActor($gameParty.members()[this.index()]);
    }
    this.callOkHandler();
};

Window_MenuActor.prototype.selectLast = function() {
    this.select($gameParty.targetActor().index() || 0);
};

Window_MenuActor.prototype.selectDefaultTarget =function(){
    if(!this._cursorAll){
        if(this._action.isForUser()){
            this.select(this._action.subject().index());
        }else{
            this.selectLast();
        }    
    }
};

Window_MenuActor.prototype.needsSelection =function(){
    var action = this._action;
    if(this._action.isForUser() && this._action.isItem() ){
        return true;
    }
    return this._action.needsSelection();
};

Window_MenuActor.prototype.isActionForAll=function(){
    return !this._action.isForOne();
};

Window_MenuActor.prototype.selectForItem =function(item){
    var actor = $gameParty.menuActor();
    var action = new Game_Action(actor);
    action.setItemObject(item);
    this._action = action;

    this.setCursorFixed(!this.needsSelection());
    this.setCursorAll(this.isActionForAll());
    this.selectDefaultTarget();
};
