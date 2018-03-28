/*:
 * @plugindesc Basic plugin for manipulating important parameters..
 * @author RM CoreScript team
 *
 * @help
 * Basic plugin for manipulating important parameters..
 * There is no plugin command.
 *
 * @param cacheLimit
 * @type number
 * @desc The upper limit of images' cached size (MPixel)
 * @default 10
 *
 * @param screenWidth
 * @type number
 * @desc The resolution of screen width
 * @default 816
 *
 * @param screenHeight
 * @type number
 * @desc The resolution of screen height
 * @default 624
 *
 * @param changeWindowWidthTo
 * @type number
 * @desc If set, change window width to this value
 *
 * @param changeWindowHeightTo
 * @type number
 * @desc If set, change window height to this value
 *
 * @param renderingMode
 * @type select
 * @option canvas
 * @option webgl
 * @option auto
 * @desc The rendering mode (canvas/webgl/auto)
 * @default auto
 *
 * @param alwaysDash
 * @type boolean
 * @desc The initial value whether the player always dashes (on/off)
 * @default false
 *
 * @param autoSaveFileId
 * @type number
 * @desc The file number to auto save when "Transfer Player" (0: off)
 * @default 0
 *
 * @param errorMessage
 * @type string
 * @desc The message when error occurred
 * @default Error occurred. Please ask to the creator of this game.
 */

/*:ja
 * @plugindesc 基本的なパラメーターを設定するプラグインです。
 * @author RM CoreScript team
 *
 * @help
 * 基本的なパラメーターを設定するプラグインです。
 * このプラグインにはプラグインコマンドはありません。
 *
 * @param cacheLimit
 * @type number
 * @desc 画像のメモリへのキャッシュの上限値 (MPix)
 * @default 10
 *
 * @param screenWidth
 * @type number
 * @desc 画面サイズの幅
 * @default 816
 *
 * @param screenHeight
 * @type number
 * @desc 画面サイズの高さ
 * @default 624
 *
 * @param changeWindowWidthTo
 * @type number
 * @desc 値が設定された場合、ウインドウの幅を指定した値に変更
 *
 * @param changeWindowHeightTo
 * @type number
 * @desc 値が設定された場合、ウインドウの高さを指定した値に変更
 *
 * @param renderingMode
 * @type select
 * @option canvas
 * @option webgl
 * @option auto
 * @desc レンダリングモード (canvas/webgl/auto)
 * @default auto
 *
 * @param alwaysDash
 * @type boolean
 * @desc プレイヤーが常時ダッシュするかどうかの初期値 (on/off)
 * @default false
 *
 * @param autoSaveFileId
 * @type number
 * @desc 「場所移動」の際にオートセーブするファイル番号 (0でoff)
 * @default 0
 *
 * @param errorMessage
 * @type string
 * @desc エラーが発生した際に表示するメッセージ
 * @default エラーが発生しました。ゲームの作者にご連絡ください。
 */

(function() {
    'use strict';
    function isNumber(str) {
        return !!str && !isNaN(str);
    }

    function toNumber(str, def) {
        return isNumber(str) ? +str : def;
    }

    var parameters = PluginManager.parameters('Community_Basic');
    var cacheLimit = toNumber(parameters['cacheLimit'], 10);
    var screenWidth = toNumber(parameters['screenWidth'], 816);
    var screenHeight = toNumber(parameters['screenHeight'], 624);
    var renderingMode = parameters['renderingMode'].toLowerCase();
    var alwaysDash = parameters['alwaysDash'].toLowerCase() === 'true';
    var windowWidthTo = toNumber(parameters['changeWindowWidthTo'], 0);
    var windowHeightTo = toNumber(parameters['changeWindowHeightTo'], 0);
    var autoSaveFileId = toNumber(parameters['autoSaveFileId'], 0);
    var errorMessage = parameters['errorMessage'];

    var windowWidth;
    var windowHeight;

    if(windowWidthTo){
        windowWidth = windowWidthTo;
    }else if(screenWidth !== SceneManager._screenWidth){
        windowWidth = screenWidth;
    }

    if(windowHeightTo){
        windowHeight = windowHeightTo;
    }else if(screenHeight !== SceneManager._screenHeight){
        windowHeight = screenHeight;
    }


    ImageCache.limit = cacheLimit * 1000 * 1000;
    SceneManager._screenWidth = screenWidth;
    SceneManager._screenHeight = screenHeight;
    SceneManager._boxWidth = screenWidth;
    SceneManager._boxHeight = screenHeight;

    SceneManager.preferableRendererType = function() {
        if (Utils.isOptionValid('canvas')) {
            return 'canvas';
        } else if (Utils.isOptionValid('webgl')) {
            return 'webgl';
        } else if (renderingMode === 'canvas') {
            return 'canvas';
        } else if (renderingMode === 'webgl') {
            return 'webgl';
        } else {
            return 'auto';
        }
    };

    var _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.apply(this, arguments);
        if (config['alwaysDash'] === undefined) {
            this.alwaysDash = alwaysDash;
        }
    };


    var _SceneManager_initNwjs = SceneManager.initNwjs;
    SceneManager.initNwjs = function() {
        _SceneManager_initNwjs.apply(this, arguments);

        if (Utils.isNwjs() && windowWidth && windowHeight) {
            var dw = windowWidth - window.innerWidth;
            var dh = windowHeight - window.innerHeight;
            window.moveBy(-dw / 2, -dh / 2);
            window.resizeBy(dw, dh);
        }
    };

    DataManager.setAutoSaveFileId(autoSaveFileId);
    Graphics.setErrorMessage(errorMessage);
})();