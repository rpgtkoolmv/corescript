//-----------------------------------------------------------------------------
// Scene_Base
//
// The superclass of all scenes within the game.

function Scene_Base() {
    this.initialize.apply(this, arguments);
}

Scene_Base.prototype = Object.create(Stage.prototype);
Scene_Base.prototype.constructor = Scene_Base;

Scene_Base.prototype.initialize = function() {
    Stage.prototype.initialize.call(this);
    this._active = false;
    this._fadeSign = 0;
    this._fadeDuration = 0;
    this._fadeSprite = null;
    this._imageReservationId = Utils.generateRuntimeId();
};

Scene_Base.prototype.create = function() {
};

Scene_Base.prototype.isActive = function() {
    return this._active;
};

Scene_Base.prototype.isReady = function() {
    return ImageManager.isReady();
};

Scene_Base.prototype.start = function() {
    this._active = true;
    ImageManager.setDefaultReservationId(this._imageReservationId);
};

Scene_Base.prototype.update = function() {
    this.updateFade();
    this.updateChildren();
    AudioManager.checkErrors();
};

Scene_Base.prototype.stop = function() {
    this._active = false;
};

Scene_Base.prototype.isBusy = function() {
    return this._fadeDuration > 0;
};

Scene_Base.prototype.terminate = function() {
    ImageManager.releaseReservation(this._imageReservationId);
};

Scene_Base.prototype.createWindowLayer = function() {
    var width = Graphics.boxWidth;
    var height = Graphics.boxHeight;
    var x = (Graphics.width - width) / 2;
    var y = (Graphics.height - height) / 2;
    this._windowLayer = new WindowLayer();
    this._windowLayer.move(x, y, width, height);
    this.addChild(this._windowLayer);
};

Scene_Base.prototype.addWindow = function(window) {
    this._windowLayer.addChild(window);
};

Scene_Base.prototype.startFadeIn = function(duration, white) {
    this.createFadeSprite(white);
    this._fadeSign = 1;
    this._fadeDuration = duration || 30;
    this._fadeSprite.opacity = 255;
};

Scene_Base.prototype.startFadeOut = function(duration, white) {
    this.createFadeSprite(white);
    this._fadeSign = -1;
    this._fadeDuration = duration || 30;
    this._fadeSprite.opacity = 0;
};

Scene_Base.prototype.createFadeSprite = function(white) {
    if (!this._fadeSprite) {
        this._fadeSprite = new ScreenSprite();
        this.addChild(this._fadeSprite);
    }
    if (white) {
        this._fadeSprite.setWhite();
    } else {
        this._fadeSprite.setBlack();
    }
};

Scene_Base.prototype.updateFade = function() {
    if (this._fadeDuration > 0) {
        var d = this._fadeDuration;
        if (this._fadeSign > 0) {
            this._fadeSprite.opacity -= this._fadeSprite.opacity / d;
        } else {
            this._fadeSprite.opacity += (255 - this._fadeSprite.opacity) / d;
        }
        this._fadeDuration--;
    }
};

Scene_Base.prototype.updateChildren = function() {
    this.children.forEach(function(child) {
        if (child.update) {
            child.update();
        }
    });
};

Scene_Base.prototype.popScene = function() {
    SceneManager.pop();
};

Scene_Base.prototype.checkGameover = function() {
    if ($gameParty.isAllDead()) {
        SceneManager.goto(Scene_Gameover);
    }
};

Scene_Base.prototype.fadeOutAll = function() {
    var time = this.slowFadeSpeed() / 60;
    AudioManager.fadeOutBgm(time);
    AudioManager.fadeOutBgs(time);
    AudioManager.fadeOutMe(time);
    this.startFadeOut(this.slowFadeSpeed());
};

Scene_Base.prototype.fadeSpeed = function() {
    return 24;
};

Scene_Base.prototype.slowFadeSpeed = function() {
    return this.fadeSpeed() * 2;
};
