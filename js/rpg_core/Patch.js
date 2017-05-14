(function() {
    //patch from triacontane (@triacontane)
    //This patch clears mapchip atlas which was drawn before.

    var TileRenderer                  = PIXI.WebGLRenderer.__plugins.tile;
    TileRenderer._clearTexture        = null;
    var _TileRenderer_initBounds      = TileRenderer.prototype.initBounds;
    TileRenderer.prototype.initBounds = function() {
        _TileRenderer_initBounds.apply(this, arguments);

        //create blank canvas to clear texture.
        var clearTexture           = document.createElement('canvas');
        clearTexture.width         = 1024;
        clearTexture.height        = 1024;
        TileRenderer._clearTexture = clearTexture;
    };

    PIXI.glCore.GLTexture.prototype._hackSubImage = function(sprite) {
        this.bind();
        var gl = this.gl;
        var x  = sprite.position.x;
        var y  = sprite.position.y;
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, x, y, this.format, this.type, TileRenderer._clearTexture);
        var baseTex = sprite.texture.baseTexture;
        gl.texSubImage2D(gl.TEXTURE_2D, 0, x, y, this.format, this.type, baseTex.source);
    };
})();