/*:
 * @plugindesc Show the process of loading sounds.
 * @author RM CoreScript team
 *
 * @param chunkSize
 * @type number
 * @desc the size of first loading (KB)
 * @default 75
 *
 * @param chunkGainRate
 * @type number
 * @desc the size of second loading (per chunkSize)
 * @default 5
 *
 */

/*:ja
 * @plugindesc 音声読み込みの様子を表示します。
 * @author RM CoreScript team
 *
 * @param chunkSize
 * @type number
 * @desc 一回目の分割読み込みのサイズ(KB)
 * @default 75
 *
 * @param chunkGainRate
 * @type number
 * @desc 二回目の分割読み込みのサイズ(一回目の何倍のサイズかで表す)
 * @default 5
 *
 */

(function(){
    'use strict';
    function isNumber(str) {
        return !!str && !isNaN(str);
    }

    function toNumber(str, def) {
        return isNumber(str) ? +str : def;
    }

    function updateInfo() {
        var loadTime = info.loadTime.map(function(time) {
            return time < 0 ? '(progress)' : time;
        });
        var decodeTime = info.decodeTime.map(function(time) {
            return time < 0 ? '(progress)' : time;
        });
        var content = 'name: ' + info.url + '<br>';
        content += 'loadingMode: ' + info.loadingMode + '<br>';
        content += 'loadTime: ' + loadTime + '<br>';
        content += 'decodeTime: ' + decodeTime + '<br>';

        if (div.innerHTML !== content) div.innerHTML = content;
        div.style.zIndex = 11;
    }

    var parameters = PluginManager.parameters('Debug_ReportSound');
    var chunkSize = toNumber(parameters['chunkSize'], 75) * 1024;
    var chunkGainRate = toNumber(parameters['chunkGainRate'], 5);
    var info;

    var div = document.createElement('div');
    div.style.backgroundColor = 'AliceBlue';
    div.style.position = 'fixed';
    div.style.right = 0;
    div.style.bottom = 0;
    document.body.appendChild(div);

    var _WebAudio_clear = WebAudio.prototype.clear;
    WebAudio.prototype.clear = function() {
        _WebAudio_clear.apply(this, arguments);
        info = {
            fastLoadEnabled: !!this._chunkSize,
            rangeEnabled: null,
            loadingMode: '',
            url: '',
            loadTime: [],
            decodeTime: []
        };
        this._chunkSize = chunkSize;
        this._chunkGainRate = chunkGainRate;
    };

    var _WebAudio__load = WebAudio.prototype._load;
    WebAudio.prototype._load = function(url) {
        _WebAudio__load.apply(this, arguments);
        info.url = info.url || url;
        if (url === info.url) {
            info.loadTime.push(-Date.now());
        }
    };

    if (WebAudio.prototype._onPartialLoad && WebAudio.prototype._onWholeLoad && WebAudio.prototype._onDecode) {
        var _WebAudio__onPartialLoad = WebAudio.prototype._onPartialLoad;
        WebAudio.prototype._onPartialLoad = function(xhr) {
            if (this._url === info.url) {
                info.loadingMode = 'Range Enabled<br>(load & decode multiply)';
                info.loadTime[info.loadTime.length - 1] += Date.now();
                info.decodeTime.push(-Date.now());
                updateInfo();
            }
            _WebAudio__onPartialLoad.apply(this, arguments);
        };

        var _WebAudio__onWholeLoad = WebAudio.prototype._onWholeLoad;
        WebAudio.prototype._onWholeLoad = function(array) {
            if (this._url === info.url) {
                info.loadingMode = 'Range Disabled<br>(load once, decode multiply)';
                if (info.decodeTime.length === 0) {
                    info.loadTime[0] += Date.now();
                }
                info.decodeTime.push(-Date.now());
                updateInfo();
            }
            _WebAudio__onWholeLoad.apply(this, arguments);
        };

        var _WebAudio__onDecode = WebAudio.prototype._onDecode;
        WebAudio.prototype._onDecode = function(buffer) {
            if (this._url === info.url && info.decodeTime[info.decodeTime.length - 1] < 0) {
                info.decodeTime[info.decodeTime.length - 1] += Date.now();
                updateInfo();
            }
            _WebAudio__onDecode.apply(this, arguments);
        };
    } else {
        var _WebAudio__onXhrLoad = WebAudio.prototype._onXhrLoad;
        WebAudio.prototype._onXhrLoad = function(xhr) {
            if (this._url === info.url) {
                info.loadingMode = 'Legacy<br>(load & decode once)';
                info.loadTime[0] += Date.now();
                info.decodeTime.push(-Date.now());
                updateInfo();
            }
            _WebAudio__onXhrLoad.apply(this, arguments);
        };

        var _WebAudio__onLoad = WebAudio.prototype._onLoad;
        WebAudio.prototype._onLoad = function() {
            if (this._url === info.url && info.decodeTime[info.decodeTime.length - 1] < 0) {
                info.decodeTime[info.decodeTime.length - 1] += Date.now();
                updateInfo();
            }
            _WebAudio__onLoad.apply(this, arguments);
        };
    }
})();