//-----------------------------------------------------------------------------
/**
 * The resource loading manager.
 *
 * @class ResourceLoader
 */
function ResourceLoader() {
    this.initialize.apply(this, arguments);
}

ResourceLoader.prototype.initialize = function(url, retryMethod, resignMethod, retryInterval) {
    this._retryCount = 0;
    this._url = url;
    this._retryMethod = retryMethod;
    this._resignMethod = resignMethod;
    this._retryInterval = retryInterval || [0, 1000, 3000];
};

ResourceLoader._failedResources = [];

ResourceLoader.add = function(loader) {
    if (this._failedResources.length === 0) {
        Graphics.printLoadingError(loader._url);
    }
    this._failedResources.push(loader);
};

ResourceLoader.retry = function() {
    if (this._failedResources.length > 0) {
        Graphics.eraseLoadingError();
        this._failedResources.forEach(function(loader) {
            loader._retryCount = 0;
            loader._onError();
        });
        this._failedResources.length = 0;
        SceneManager.updateInputData();
    }
};

ResourceLoader.prototype.onError = function() {
    return this._onError.bind(this);
};

ResourceLoader.prototype._onError = function() {
    if (this._retryCount < this._retryInterval.length) {
        setTimeout(this._retryMethod, this._retryInterval[this._retryCount]);
        this._retryCount++;
    } else {
        if (this._resignMethod) {
            this._resignMethod();
        }
        if (this._url) {
            ResourceLoader.add(this);
        }
    }
};