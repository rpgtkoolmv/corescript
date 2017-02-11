(function(){
    var div = document.createElement('div');
    div.style.backgroundColor = 'AliceBlue';
    div.style.position = 'fixed';
    div.style.right = 0;
    div.style.top = 0;
    document.body.appendChild(div);

    function updateInfo(){
        var content = 'size: ' + Math.floor(ImageManager._imageCache.getSize()/1000)/1000 + 'MPix<br>';
        content += 'totalCount: ' + ImageManager._imageCache.countBitmap() + '<br>';
        content += 'requestCount: ' + ImageManager._imageCache.countRequest() + '<br>';
        content += 'reservedCount: ' + ImageManager._imageCache.countReserved() + '<br>';

        div.innerHTML = content;
        div.style.zIndex = 11;
    }

    var ImageManager_update = ImageManager.update;
    ImageManager.update = function(){
        ImageManager_update.call(this);
        updateInfo();
    }
})();