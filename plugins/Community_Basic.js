/*:
 * @plugindesc Basic plugin for manipulating important parameters..
 * @author RM CoreScript team
 *
 * @help
 * Basic plugin for manipulating important parameters..
 * There is no plugin command.
 *
 * @param cacheLimit
 * @desc The upper limit of images' cached size (MPixel)
 * @default 20
 *
 * @param screenWidth
 * @desc The resolution of screen width
 * @default 816
 *
 * @param screenHeight
 * @desc The resolution of screen height
 * @default 624
 *
 * @param scaleFactor
 * @desc Scale window to (screen size * value).
 * @default 1
 *
 * @param changeWindowWidthTo
 * @desc If set, change window width to this value
 *
 * @param changeWindowHeightTo
 * @desc If set, change window height to this value
 *
 * @param renderingMode
 * @desc The rendering mode (canvas/webgl/auto)
 * @default auto
 *
 * @param alwaysDash
 * @desc The initial value whether the player always dashes (on/off)
 * @default off
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
 * @desc 画像のメモリへのキャッシュの上限値 (MPix)
 * @default 20
 *
 * @param screenWidth
 * @desc 画面サイズの幅
 * @default 816
 *
 * @param screenHeight
 * @desc 画面サイズの高さ
 * @default 624
 *
 * @param scaleFactor
 * @desc ウインドウを、画面サイズの指定された値分拡大・縮小します
 * @default 1
 *
 * @param changeWindowWidthTo
 * @desc 値が設定された場合、ウインドウの幅を指定した値に変更
 *
 * @param changeWindowHeightTo
 * @desc 値が設定された場合、ウインドウの高さを指定した値に変更
 *
 * @param renderingMode
 * @desc レンダリングモード (canvas/webgl/auto)
 * @default auto
 *
 * @param alwaysDash
 * @desc プレイヤーが常時ダッシュするかどうかの初期値 (on/off)
 * @default off
 */

(function() {
    function toNumber(str, def) {
        return isNaN(str) ? def : +(str || def);
    }

    var parameters = PluginManager.parameters('Community_Basic');
    var cacheLimit = toNumber(parameters['cacheLimit'], 20);
    var scaleFactor = toNumber(parameters['scaleFactor'], 1);
    var screenWidth = toNumber(parameters['screenWidth'], 816);
    var screenHeight = toNumber(parameters['screenHeight'], 624);
    var renderingMode = parameters['renderingMode'].toLowerCase();
    var alwaysDash = parameters['alwaysDash'].toLowerCase() === 'on';
    var windowWidth = toNumber(parameters['changeWindowWidthTo'], 0);
    var windowHeight = toNumber(parameters['changeWindowHeightTo'], 0);

    if(screenWidth !== SceneManager._screenWidth || (scaleFactor !== 1 && !windowWidth)) {
        windowWidth = screenWidth * scaleFactor;
    }

    if(screenHeight !== SceneManager._screenHeight || (scaleFactor !== 1 && !windowHeight)) {
        windowHeight = screenHeight * scaleFactor;
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
})();