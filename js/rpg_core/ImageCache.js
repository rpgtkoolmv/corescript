function ImageCache(){
    this.initialize.apply(this, arguments);
}

ImageCache.limit = 20 * 1000 * 1000;

ImageCache.prototype.initialize = function(){
    this._items = {};
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

    Object.keys(items).map(function(key){
        return items[key];
    }).sort(function(a, b){
        return b.touch - a.touch;
    }).forEach(function(item){
        if(sizeLeft > 0 || item.reservationId){
            var bitmap = item.bitmap;
            sizeLeft -= bitmap.width * bitmap.height;
        }else{
            delete items[item.key];
        }
    });
};

ImageCache.prototype.getSize = function(){
    var totalSize = 0;
    var items = this._items;

    Object.keys(items).forEach(function(key){
        var bitmap = items[key].bitmap;
        totalSize += bitmap.width * bitmap.height;
    });

    return totalSize;
};

ImageCache.prototype.countBitmap = function(){
    return Object.keys(this._items).length;
};

ImageCache.prototype.countRequest = function(){
    var items = this._items;

    return Object.keys(this._items)
        .map(function(key){
            return items[key].bitmap;
        }).filter(function(bitmap){
            return bitmap.isRequestOnly();
        }).length;
};

ImageCache.prototype.countReserved = function(){
    var items = this._items;

    return Object.keys(this._items)
        .map(function(key){
            return items[key].reservationId;
        }).filter(function(id){
            return id;
        }).length;
};

ImageCache.prototype.isReady = function(){
    var items = this._items;
    return !Object.keys(items).some(function(key){
        return !items[key].bitmap.isRequestOnly() && !items[key].bitmap.isReady();
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

    return null;
};