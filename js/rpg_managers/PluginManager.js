//-----------------------------------------------------------------------------
// PluginManager
//
// The static class that manages the plugins.

function PluginManager() {
    throw new Error('This is a static class');
}

PluginManager._path         = 'js/plugins/';
PluginManager._scripts      = [];
PluginManager._errorUrls    = [];
PluginManager._parameters   = {};
PluginManager._features     = {};
PluginManager._enabledFeatures = {};

PluginManager.setup = function(plugins) {
    plugins.forEach(function(plugin) {
        if (plugin.status && !this._scripts.contains(plugin.name)) {
            this.setParameters(plugin.name, plugin.parameters);
            this.loadScript(plugin.name + '.js');
            this._scripts.push(plugin.name);
        }
    }, this);
};

PluginManager.checkErrors = function() {
    var url = this._errorUrls.shift();
    if (url) {
        throw new Error('Failed to load: ' + url);
    }
};

PluginManager.parameters = function(name) {
    return this._parameters[name.toLowerCase()] || {};
};

PluginManager.setParameters = function(name, parameters) {
    this._parameters[name.toLowerCase()] = parameters;
};

PluginManager.loadScript = function(name) {
    var url = this._path + name;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.async = false;
    script.onerror = this.onError.bind(this);
    script._url = url;
    document.body.appendChild(script);
};

PluginManager.onError = function(e) {
    this._errorUrls.push(e.target._url);
};

PluginManager.isFeatureEnabled = function(featureName) {
    return !!this._enabledFeatures[featureName];
};

PluginManager.enableFeature = function(featureName) {
    if (!this.isFeatureEnabled(featureName)) {
        this._features[featureName].apply(this, Array.prototype.slice.call(arguments, 1));
        this._enabledFeatures[featureName] = true;
    }
};

PluginManager._features.autoSave = function(autoSaveFileId) {
    var _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function() {
        var transfer = this.isTransferring();
        _Game_Player_performTransfer.apply(this, arguments);
        if (transfer && !DataManager.isEventTest() && $gameSystem.isSaveEnabled()) {
            $gameSystem.onBeforeSave();
            if (DataManager.saveGame(autoSaveFileId)) {
                StorageManager.cleanBackup(autoSaveFileId);
            }
        }
    };

    var _Scene_Save_onSavefileOk = Scene_Save.prototype.onSavefileOk;
    Scene_Save.prototype.onSavefileOk = function() {
        if (this.savefileId() === autoSaveFileId) {
            this.onSaveFailure();
        } else {
            _Scene_Save_onSavefileOk.apply(this, arguments);
        }
    };

    var _Window_SavefileList_drawFileId = Window_SavefileList.prototype.drawFileId;
    Window_SavefileList.prototype.drawFileId = function(id, x, y) {
        if (id === autoSaveFileId) {
            if (this._mode === 'save') {
                this.changePaintOpacity(false);
            }
            this.drawText(TextManager.file + ' ' + id + '(Auto)', x, y, 180);
        } else {
            _Window_SavefileList_drawFileId.apply(this, arguments);
        }
    };
};
