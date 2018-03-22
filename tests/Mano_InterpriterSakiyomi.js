
Game_Interpreter.requestImagesByPluginCommand=function(command,args){

};

Game_Interpreter.requestImagesForCommand　=function(command){
    var params = command.parameters;
    switch(command.code){
        // Show Text
        case 101:
            ImageManager.requestFace(params[0]);
            break;

        // Change Party Member
        case 129:
            var actor = $gameActors.actor(params[0]);
            if (actor && params[1] === 0) {
                var name = actor.characterName();
                ImageManager.requestCharacter(name);
            }
            break;

        // Set Movement Route
        case 205:
            if(params[1]){
                params[1].list.forEach(function(command){
                    var params = command.parameters;
                    if(command.code === Game_Character.ROUTE_CHANGE_IMAGE){
                        ImageManager.requestCharacter(params[0]);
                    }
                });
            }
            break;

        // Show Animation, Show Battle Animation
        case 212: case 337:
            if(params[1]) {
                var animation = $dataAnimations[params[1]];
                var name1 = animation.animation1Name;
                var name2 = animation.animation2Name;
                var hue1 = animation.animation1Hue;
                var hue2 = animation.animation2Hue;
                ImageManager.requestAnimation(name1, hue1);
                ImageManager.requestAnimation(name2, hue2);
            }
            break;

        // Change Player Followers
        case 216:
            if (params[0] === 0) {
                $gamePlayer.followers().forEach(function(follower) {
                    var name = follower.characterName();
                    ImageManager.requestCharacter(name);
                });
            }
            break;

        // Show Picture
        case 231:
            ImageManager.requestPicture(params[1]);
            break;

        // Change Tileset
        case 282:
            var tileset = $dataTilesets[params[0]];
            tileset.tilesetNames.forEach(function(tilesetName){
                ImageManager.requestTileset(tilesetName);
            });
            break;

        // Change Battle Back
        case 283:
            if ($gameParty.inBattle()) {
                ImageManager.requestBattleback1(params[0]);
                ImageManager.requestBattleback2(params[1]);
            }
            break;

        // Change Parallax
        case 284:
            if (!$gameParty.inBattle()) {
                ImageManager.requestParallax(params[0]);
            }
            break;

        // Change Actor Images
        case 322:
            ImageManager.requestCharacter(params[1]);
            ImageManager.requestFace(params[3]);
            ImageManager.requestSvActor(params[5]);
            break;

        // Change Vehicle Image
        case 323:
            var vehicle = $gameMap.vehicle(params[0]);
            if(vehicle){
                ImageManager.requestCharacter(params[1]);
            }
            break;

        // Enemy Transform
        case 336:
            var enemy = $dataEnemies[params[1]];
            var name = enemy.battlerName;
            var hue = enemy.battlerHue;
            if ($gameSystem.isSideView()) {
                ImageManager.requestSvEnemy(name, hue);
            } else {
                ImageManager.requestEnemy(name, hue);
            }
            break;
    }
};

Game_Interpreter.requestImagesByChildEvent =function(command,commonList){
    var params =command.parameters;
    var commonEvent = $dataCommonEvents[params[0]];
    if (commonEvent) {
        if (!commonList) {
            commonList = [];
        }
        if (!commonList.contains(params[0])) {
            commonList.push(params[0]);
            Game_Interpreter.requestImages(commonEvent.list, commonList);
        }
    }

};

Game_Interpreter.requestImages = function(list, commonList){
    if(!list) return;
    var len = list.length;
    for(var i=0; i<len; i+=1 ){
        var command = list[i];
        // Common Event
        if(command.code ===117){
            Game_Interpreter.requestImagesByChildEvent(command,commonList);
        }else{
            Game_Interpreter.requestImagesForCommand(command);            
        }
    }
};
