/=============================================================================
// ■ Scene_Base V.1.4.0 (community-1.1b)
//-----------------------------------------------------------------------------

/**
 * The Superclass of all scene within the game.
 * 
 * @class Scene_Base
 * @constructor 
 * @extends Stage
 */
function Scene_Base() {
    this.initialize.apply(this, arguments);
}

Scene_Base.prototype = Object.create(Stage.prototype);
Scene_Base.prototype.constructor = Scene_Base;


/**
 * Create a instance of Scene_Base.
 * 
 * @constructor
 * @memberof Scene_Base
 */
Scene_Base.prototype.initialize = function() {
    Stage.prototype.initialize.call(this);
    this._active = false;
    this._fadeSign = 0;
    this._fadeDuration = 0;
    this._fadeSprite = null;
    this._imageReservationId = Utils.generateRuntimeId();
};

/**
 * Attach a reservation to the reserve queue.
 * 
 * @method attachReservation
 * @memberof Scene_Base
 */
Scene_Base.prototype.attachReservation = function() {
    ImageManager.setDefaultReservationId(this._imageReservationId);
};

/**
 * Remove the reservation from the Reserve queue.
 * 
 * @method detachReservation
 * @memberof Scene_Base
 */
Scene_Base.prototype.detachReservation = function() {
    ImageManager.releaseReservation(this._imageReservationId);
};

/**
 * Create the components and add them to the rendering process.
 * 
 * @method create
 * @memberof Scene_Base
 */
Scene_Base.prototype.create = function() {
};

/**
 * Returns wether the scene is active or not.
 * 
 * @method isActive
 * @memberof Scene_Base
 * @return {Boolean} return true if the scene is active
 */
Scene_Base.prototype.isActive = function() {
    return this._active;
};

/**
 * Return wether the scene is ready to start or not.
 * 
 * @method isReady
 * @memberof Scene_Base
 * @return {Boolean} Return true if the scene is ready to start
 */
Scene_Base.prototype.isReady = function() {
    return ImageManager.isReady();
};

/**
 * Start the scene processing.
 * 
 * @method start
 * @memberof Scene_Base
 */
Scene_Base.prototype.start = function() {
    this._active = true;
};

/**
 * Update the scene processing each new frame.
 * 
 * @method update
 * @memberof Scene_Base
 */
Scene_Base.prototype.update = function() {
    this.updateFade();
    this.updateChildren();
    AudioManager.checkErrors();
};

/**
 * Stop the scene processing.
 * 
 * @method stop
 * @memberof Scene_Base
 */
Scene_Base.prototype.stop = function() {
    this._active = false;
};

/**
 * Return wether the scene is busy or not.
 * 
 * @method isBusy
 * @return {boolean} true if the scene is currently busy doing a fade
 */
Scene_Base.prototype.isBusy = function() {
    return this._fadeDuration > 0;
};

/**
 * Terminate the scene before switching to a another scene.
 * 
 * @method terminate
 * @memberof Scene_Base
 */
Scene_Base.prototype.terminate = function() {
};

/**
 * Create the layer for the windows children
 * and add it to the rendering process.
 * 
 * @method createWindowLayer
 * @memberof Scene_Base
 */
Scene_Base.prototype.createWindowLayer = function() {
    var width = Graphics.boxWidth;
    var height = Graphics.boxHeight;
    var x = (Graphics.width - width) / 2;
    var y = (Graphics.height - height) / 2;
    this._windowLayer = new WindowLayer();
    this._windowLayer.move(x, y, width, height);
    this.addChild(this._windowLayer);
};

/**
 * Add the children window to the windowLayer processing.
 * 
 * @method addWindow
 * @memberof Scene_Base
 */
Scene_Base.prototype.addWindow = function(window) {
    this._windowLayer.addChild(window);
};

/**
 * Request a fadeIn screen process.
 * 
 * @method startFadeIn
 * @param {Number} [duration=30] The time the process will take for fadeIn the screen
 * @param {Boolean} [white=false] If true the fadein will be process with a white color else it's will be black
 * 
 * @memberof Scene_Base
 */
Scene_Base.prototype.startFadeIn = function(duration, white) {
    this.createFadeSprite(white);
    this._fadeSign = 1;
    this._fadeDuration = duration || 30;
    this._fadeSprite.opacity = 255;
};

/**
 * Request a fadeOut screen process.
 * 
 * @method startFadeOut
 * @param {Number} [duration=30] The time the process will take for fadeOut the screen
 * @param {boolean} [white=false] If true the fadeOut will be process with a white color else it's will be black
 * 
 * @memberof Scene_Base
 */
Scene_Base.prototype.startFadeOut = function(duration, white) {
    this.createFadeSprite(white);
    this._fadeSign = -1;
    this._fadeDuration = duration || 30;
    this._fadeSprite.opacity = 0;
};

/**
 * Create a Screen sprite for the fadein and fadeOut purpose and
 * add it to the rendering process.
 * 
 * @method createFadeSprite
 * @memberof Scene_Base
 */
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

/**
 * Update the screen fade processing.
 * 
 * @method updateFade
 * @memberof Scene_Base
 */
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

/**
 * Update the children of the scene EACH frame.
 * 
 * @method updateChildren
 * @memberof Scene_Base
 */
Scene_Base.prototype.updateChildren = function() {
    this.children.forEach(function(child) {
        if (child.update) {
            child.update();
        }
    });
};

/**
 * Pop the scene from the stack array and switch to the
 * previous scene.
 * 
 * @method popScene
 * @memberof Scene_Base
 */
Scene_Base.prototype.popScene = function() {
    SceneManager.pop();
};

/**
 * Check wether the game should be triggering a gameover.
 * 
 * @method checkGameover
 * @memberof Scene_Base
 */
Scene_Base.prototype.checkGameover = function() {
    if ($gameParty.isAllDead()) {
        SceneManager.goto(Scene_Gameover);
    }
};

/**
 * Slowly fade out all the visual and audio of the scene.
 * 
 * @method fadeOutAll
 * @memberof Scene_Base
 */
Scene_Base.prototype.fadeOutAll = function() {
    var time = this.slowFadeSpeed() / 60;
    AudioManager.fadeOutBgm(time);
    AudioManager.fadeOutBgs(time);
    AudioManager.fadeOutMe(time);
    this.startFadeOut(this.slowFadeSpeed());
};

/**
 * Return the screen fade speed value.
 * 
 * @method fadeSpeed
 * @memberof Scene_Base
 * @return {Number} Return the fade speed
 */
Scene_Base.prototype.fadeSpeed = function() {
    return 24;
};

/**
 * Return a slow screen fade speed value.
 * 
 * @method slowFadeSpeed
 * @memberof Scene_Base
 * @return {Number} Return the fade speed.
 */
Scene_Base.prototype.slowFadeSpeed = function() {
    return this.fadeSpeed() * 2;
};
