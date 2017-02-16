function ImageCache(){
    this.initialize.apply(this, arguments);
}

ImageCache.limit = 20 * 1000 * 1000;

ImageCache.prototype.initialize = function(){
    this._items = {};

    //it holds purged bitmap which is not in ready.
    this._purged = [];
};

ImageCache.prototype.add = function(key, value){
    this._items[key] = {
        bitmap: value,
        touch: Date.now(),
        key: key
    };

    this._truncateCache();
};

ImageCache.prototype.get = function(key){
    if(this._items[key]){
        var item = this._items[key];
        item.touch = Date.now();
        return item.bitmap;
    }

    return null;
};

ImageCache.prototype.reserve = function(key, reservationId){
    this._items[key].reservationId = reservationId;
};

ImageCache.prototype.releaseReservation = function(reservationId){
    var items = this._items;

    Object.keys(items)
        .map(function(key){return items[key];})
        .forEach(function(item){
            if(item.reservationId === reservationId){
                delete item.reservationId;
            }
        });
};

ImageCache.prototype._truncateCache = function(){
    var items = this._items;
    var sizeLeft = ImageCache.limit;
    var purged = this._purged;

    Object.keys(items).map(function(key){
        return items[key];
    }).sort(function(a, b){
        return b.touch - a.touch;
    }).forEach(function(item){
        if(sizeLeft > 0 || item.reservationId){
            var bitmap = item.bitmap;
            sizeLeft -= bitmap.width * bitmap.height;
        }else{
            purged.push(items[item.key]);
            delete items[item.key];
        }
    });
};

ImageCache.prototype.isReady = function(){
    var items = this._items;
    return !Object.keys(items).some(function(key){
        return !items[key].bitmap.isRequestOnly() && !items[key].bitmap.isReady();
    }) || this._purged.length !== 0;
};

ImageCache.prototype.gc = function(){
    this._purged = this._purged.filter(function(bitmap){
        return !bitmap.isReady();
    });
};

ImageCache.prototype.getErrorBitmap = function(){
    var items = this._items;
    var bitmap = null;
    if(!Object.keys(items).some(function(key){
            if(items[key].bitmap.isError()){
                bitmap = items[key].bitmap;
                return true;
            }
            return false;
        })) {
        return bitmap;
    }

    this._purged.forEach(function(item){
        if(item.isError()) bitmap = item;
    });

    return bitmap;
};