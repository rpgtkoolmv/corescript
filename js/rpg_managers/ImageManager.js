//-----------------------------------------------------------------------------
// ImageManager
//
// The static class that loads images, creates bitmap objects and retains them.

function ImageManager() {
    throw new Error('This is a static class');
}

ImageManager.cache = new CacheMap(ImageManager);

ImageManager.loadAnimation = function(filename, hue) {
    return this.loadBitmap('img/animations/', filename, hue, true);
};

ImageManager.loadBattleback1 = function(filename, hue) {
    return this.loadBitmap('img/battlebacks1/', filename, hue, true);
};

ImageManager.loadBattleback2 = function(filename, hue) {
    return this.loadBitmap('img/battlebacks2/', filename, hue, true);
};

ImageManager.loadEnemy = function(filename, hue) {
    return this.loadBitmap('img/enemies/', filename, hue, true);
};

ImageManager.loadCharacter = function(filename, hue) {
    return this.loadBitmap('img/characters/', filename, hue, false);
};

ImageManager.loadFace = function(filename, hue) {
    return this.loadBitmap('img/faces/', filename, hue, true);
};

ImageManager.loadParallax = function(filename, hue) {
    return this.loadBitmap('img/parallaxes/', filename, hue, true);
};

ImageManager.loadPicture = function(filename, hue) {
    return this.loadBitmap('img/pictures/', filename, hue, true);
};

ImageManager.loadSvActor = function(filename, hue) {
    return this.loadBitmap('img/sv_actors/', filename, hue, false);
};

ImageManager.loadSvEnemy = function(filename, hue) {
    return this.loadBitmap('img/sv_enemies/', filename, hue, true);
};

ImageManager.loadSystem = function(filename, hue) {
    return this.loadBitmap('img/system/', filename, hue, false);
};

ImageManager.loadTileset = function(filename, hue) {
    return this.loadBitmap('img/tilesets/', filename, hue, false);
};

ImageManager.loadTitle1 = function(filename, hue) {
    return this.loadBitmap('img/titles1/', filename, hue, true);
};

ImageManager.loadTitle2 = function(filename, hue) {
    return this.loadBitmap('img/titles2/', filename, hue, true);
};

ImageManager.loadBitmap = function(folder, filename, hue, smooth) {
    if (filename) {
        var path = folder + encodeURIComponent(filename) + '.png';
        var bitmap = this.loadNormalBitmap(path, hue || 0);
        bitmap.smooth = smooth;
        return bitmap;
    } else {
        return this.loadEmptyBitmap();
    }
};

ImageManager.loadEmptyBitmap = function() {
    var empty = this.cache.getItem('empty');
    if (!empty) {
        empty = new Bitmap();
        this.cache.setItem('empty', empty);
    }
    return empty;
};

ImageManager.loadNormalBitmap = function(path, hue) {
    var key = path + ':' + hue;
    var bitmap = this.cache.getItem(key);
    if (!bitmap) {
        bitmap = Bitmap.load(path);
        bitmap.addLoadListener(function() {
            bitmap.rotateHue(hue);
        });
        this.cache.setItem(key, bitmap);
    }
    return bitmap;
};

ImageManager.clear = function() {
    this.cache.clear();
};

ImageManager.isReady = function() {
    for (var key in this.cache._inner) {
        var bitmap = this.cache._inner[key].item;
        if (bitmap.isError()) {
            throw new Error('Failed to load: ' + bitmap.url);
        }
        if (!bitmap.isReady()) {
            return false;
        }
    }
    return true;
};

ImageManager.isObjectCharacter = function(filename) {
    var sign = filename.match(/^[\!\$]+/);
    return sign && sign[0].contains('!');
};

ImageManager.isBigCharacter = function(filename) {
    var sign = filename.match(/^[\!\$]+/);
    return sign && sign[0].contains('$');
};

ImageManager.isZeroParallax = function(filename) {
    return filename.charAt(0) === '!';
};
