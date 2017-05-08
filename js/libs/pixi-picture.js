/*!
 * pixi-picture - v1.0.3
 * Compiled Wed Oct 12 2016 22:33:16 GMT+0300 (RTZ 2 (зима))
 *
 * pixi-picture is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.pixiPicture = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var PictureShader = require('./PictureShader');

/**
 * @class
 * @extends PIXI.Shader
 * @memberof PIXI.extras
 * @param gl {PIXI.Shader} The WebGL shader manager this shader works for.
 * @param tilingMode {number} 0 for default, 1 for simple tiling, 2 for tiling
 */
function HardLightShader(gl, tilingMode)
{
    PictureShader.call(this,
        gl,
        "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\n\nuniform mat3 projectionMatrix;\nuniform mat3 mapMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec2 vMapCoord;\n%SPRITE_UNIFORMS%\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    %SPRITE_CODE%\n    vMapCoord = (mapMatrix * vec3(aVertexPosition, 1.0)).xy;\n}\n",
        "#define GLSLIFY 1\nvarying vec2 vTextureCoord;\nvarying vec2 vMapCoord;\nvarying vec4 vColor;\n\nuniform sampler2D uSampler[2];\nuniform vec4 uColor;\n%SPRITE_UNIFORMS%\n\nvoid main(void)\n{\n    %SPRITE_CODE%\n    vec4 source = texture2D(uSampler[0], textureCoord) * uColor;\n    vec4 target = texture2D(uSampler[1], vMapCoord);\n\n    //reverse hardlight\n    if (source.a == 0.0) {\n        gl_FragColor = vec4(0, 0, 0, 0);\n        return;\n    }\n    //yeah, premultiplied\n    vec3 Cb = source.rgb/source.a, Cs;\n    if (target.a > 0.0) {\n        Cs = target.rgb / target.a;\n    }\n    vec3 multiply = Cb * Cs * 2.0;\n    vec3 Cs2 = Cs * 2.0 - 1.0;\n    vec3 screen = Cb + Cs2 - Cb * Cs2;\n    vec3 B;\n    if (Cb.r <= 0.5) {\n        B.r = multiply.r;\n    } else {\n        B.r = screen.r;\n    }\n    if (Cb.g <= 0.5) {\n        B.g = multiply.g;\n    } else {\n        B.g = screen.g;\n    }\n    if (Cb.b <= 0.5) {\n        B.b = multiply.b;\n    } else {\n        B.b = screen.b;\n    }\n    vec4 res;\n    res.xyz = (1.0 - source.a) * Cs + source.a * B;\n    res.a = source.a + target.a * (1.0-source.a);\n    gl_FragColor = vec4(res.xyz * res.a, res.a);\n}\n",
        tilingMode
    );
    this.bind();
    this.uniforms.uSampler = [0, 1];
}

HardLightShader.prototype = Object.create(PictureShader.prototype);
HardLightShader.prototype.constructor = HardLightShader;
module.exports = HardLightShader;

},{"./PictureShader":5}],2:[function(require,module,exports){

var PictureShader = require('./PictureShader');

/**
 * @class
 * @extends PIXI.Shader
 * @memberof PIXI.extras
 * @param gl {PIXI.Shader} The WebGL shader manager this shader works for.
 * @param tilingMode {number} 0 for default, 1 for simple tiling, 2 for tiling
 */
function NormalShader(gl, tilingMode)
{
    PictureShader.call(this,
        gl,
        "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n%SPRITE_UNIFORMS%\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    %SPRITE_CODE%\n}\n",
        "#define GLSLIFY 1\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform sampler2D uSampler;\nuniform vec4 uColor;\n%SPRITE_UNIFORMS%\n\nvoid main(void)\n{\n    %SPRITE_CODE%\n\n    vec4 sample = texture2D(uSampler, textureCoord);\n    gl_FragColor = sample * uColor;\n}\n",
        tilingMode
    );
    //do some stuff, like default values for shader
    //dont forget to bind it if you really are changing the uniforms
    this.bind();
    //default tint
    //Its an example, actually PictureRenderer takes care of this stuff
    this.uniforms.uColor = new Float32Array(1,1,1,1);
}

NormalShader.prototype = Object.create(PictureShader.prototype);
NormalShader.prototype.constructor = NormalShader;
module.exports = NormalShader;

},{"./PictureShader":5}],3:[function(require,module,exports){

var PictureShader = require('./PictureShader');

/**
 * @class
 * @extends PIXI.Shader
 * @memberof PIXI.extras
 * @param gl {PIXI.Shader} The WebGL shader manager this shader works for.
 * @param tilingMode {number} 0 for default, 1 for simple tiling, 2 for tiling
 */
function OverlayShader(gl, tilingMode)
{
    PictureShader.call(this,
        gl,
        "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\n\nuniform mat3 projectionMatrix;\nuniform mat3 mapMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec2 vMapCoord;\n%SPRITE_UNIFORMS%\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    %SPRITE_CODE%\n    vMapCoord = (mapMatrix * vec3(aVertexPosition, 1.0)).xy;\n}\n",
        "#define GLSLIFY 1\nvarying vec2 vTextureCoord;\nvarying vec2 vMapCoord;\nvarying vec4 vColor;\n\nuniform sampler2D uSampler[2];\nuniform vec4 uColor;\n%SPRITE_UNIFORMS%\n\nvoid main(void)\n{\n    %SPRITE_CODE%\n    vec4 source = texture2D(uSampler[0], textureCoord) * uColor;\n    vec4 target = texture2D(uSampler[1], vMapCoord);\n\n    //reverse hardlight\n    if (source.a == 0.0) {\n        gl_FragColor = vec4(0, 0, 0, 0);\n        return;\n    }\n    //yeah, premultiplied\n    vec3 Cb = source.rgb/source.a, Cs;\n    if (target.a > 0.0) {\n        Cs = target.rgb / target.a;\n    }\n    vec3 multiply = Cb * Cs * 2.0;\n    vec3 Cb2 = Cb * 2.0 - 1.0;\n    vec3 screen = Cb2 + Cs - Cb2 * Cs;\n    vec3 B;\n    if (Cs.r <= 0.5) {\n        B.r = multiply.r;\n    } else {\n        B.r = screen.r;\n    }\n    if (Cs.g <= 0.5) {\n        B.g = multiply.g;\n    } else {\n        B.g = screen.g;\n    }\n    if (Cs.b <= 0.5) {\n        B.b = multiply.b;\n    } else {\n        B.b = screen.b;\n    }\n    vec4 res;\n    res.xyz = (1.0 - source.a) * Cs + source.a * B;\n    res.a = source.a + target.a * (1.0-source.a);\n    gl_FragColor = vec4(res.xyz * res.a, res.a);\n}\n",
        tilingMode
    );
    this.bind();
    this.uniforms.uSampler = [0, 1];
}

OverlayShader.prototype = Object.create(PictureShader.prototype);
OverlayShader.prototype.constructor = OverlayShader;
module.exports = OverlayShader;

},{"./PictureShader":5}],4:[function(require,module,exports){
var NormalShader = require('./NormalShader'),
    mapFilterBlendModesToPixi = require('./mapFilterBlendModesToPixi'),
    glCore = PIXI.glCore,
    WRAP_MODES = PIXI.WRAP_MODES;

/**
 * Renderer that clamps the texture so neighbour frames wont bleed on it
 * immitates context2d drawImage behaviour
 *
 * @class
 * @memberof PIXI.extras
 * @extends PIXI.ObjectRenderer
 * @param renderer {PIXI.WebGLRenderer} The renderer this plugin works for
 */
function PictureRenderer(renderer) {
    PIXI.ObjectRenderer.call(this, renderer);
}

PictureRenderer.prototype = Object.create(PIXI.ObjectRenderer.prototype);
PictureRenderer.prototype.constructor = PictureRenderer;

PictureRenderer.prototype.onContextChange = function () {
    var gl = this.renderer.gl;
    this.quad = new PIXI.Quad(gl);
    this.drawModes = mapFilterBlendModesToPixi(gl);
    this.normalShader = [new NormalShader(gl, 0), new NormalShader(gl, 1), new NormalShader(gl, 2)];
    this.quad.initVao(this.normalShader[0]);
    this._tempClamp = new Float32Array(4);
    this._tempColor = new Float32Array(4);
    this._tempRect = new PIXI.Rectangle();
    this._tempRect2 = new PIXI.Rectangle();
    this._tempRect3 = new PIXI.Rectangle();
    this._tempMatrix = new PIXI.Matrix();
    this._tempMatrix2 = new PIXI.Matrix();
    this._bigBuf = new Uint8Array(1 << 20);
    this._renderTexture = new PIXI.BaseRenderTexture(1024, 1024);
};

PictureRenderer.prototype.start = function () {
    //noop
};

PictureRenderer.prototype.flush = function () {
    //noop
};

function nextPow2(v) {
    v += v === 0;
    --v;
    v |= v >>> 1;
    v |= v >>> 2;
    v |= v >>> 4;
    v |= v >>> 8;
    v |= v >>> 16;
    return v + 1;
}

PictureRenderer.prototype._getRenderTexture = function (minWidth, minHeight) {
    if (this._renderTexture.width < minWidth ||
        this._renderTexture.height < minHeight) {
        minHeight = nextPow2(minWidth);
        minHeight = nextPow2(minHeight);
        this._renderTexture.resize(minWidth, minHeight);
    }
    return this._renderTexture;
};

PictureRenderer.prototype._getBuf = function (size) {
    var buf = this._bigBuf;
    if (buf.length < size) {
        size = nextPow2(size);
        buf = new Uint8Array(size);
        this._bigBuf = buf;
    }
    return buf;
};

/**
 * Renders the picture object.
 *
 * @param sprite {PIXI.tilemap.PictureSprite} the picture to render
 */
PictureRenderer.prototype.render = function (sprite) {
    if (!sprite.texture.valid) {
        return;
    }
    var tilingMode = 0;
    if (sprite.tileTransform) {
        //for TilingSprite
        tilingMode = this._isSimpleSprite(sprite) ? 1 : 2;
    }

    var blendShader = this.drawModes[sprite.blendMode];
    if (blendShader) {
        this._renderBlend(sprite, blendShader[tilingMode]);
    } else {
        this._renderNormal(sprite, this.normalShader[tilingMode]);
    }
};

PictureRenderer.prototype._renderNormal = function (sprite, shader) {
    var renderer = this.renderer;
    renderer.bindShader(shader);
    renderer.state.setBlendMode(sprite.blendMode);
    this._renderInner(sprite, shader);
};

PictureRenderer.prototype._renderBlend = function (sprite, shader) {
    //nothing there yet
    var renderer = this.renderer;
    var spriteBounds = sprite.getBounds();
    var renderTarget = renderer._activeRenderTarget;
    var matrix = renderTarget.projectionMatrix;
    var flipX = matrix.a < 0;
    var flipY = matrix.d < 0;
    var resolution = renderTarget.resolution;
    var screen = this._tempRect;
    var fr = renderTarget.sourceFrame || renderTarget.destinationFrame;
    screen.x = 0;
    screen.y = 0;
    screen.width = fr.width;
    screen.height = fr.height;

    var bounds = this._tempRect2;
    var fbw = fr.width * resolution, fbh = fr.height * resolution;
    bounds.x = (spriteBounds.x + matrix.tx / matrix.a) * resolution + fbw / 2;
    bounds.y = (spriteBounds.y + matrix.ty / matrix.d) * resolution + fbh / 2;
    bounds.width = spriteBounds.width * resolution;
    bounds.height = spriteBounds.height * resolution;
    if (flipX) {
        bounds.y = fbw - bounds.width - bounds.x;
    }
    if (flipY) {
        bounds.y = fbh - bounds.height - bounds.y;
    }

    var screenBounds = this._tempRect3;
    var x_1 = Math.floor(Math.max(screen.x, bounds.x));
    var x_2 = Math.ceil(Math.min(screen.x + screen.width, bounds.x + bounds.width));
    var y_1 = Math.floor(Math.max(screen.y, bounds.y));
    var y_2 = Math.ceil(Math.min(screen.y + screen.height, bounds.y + bounds.height));
    var pixelsWidth = x_2 - x_1;
    var pixelsHeight = y_2 - y_1;
    if (pixelsWidth <= 0 || pixelsHeight <= 0) {
        //culling
        return;
    }
    //TODO: padding
    var rt = this._getRenderTexture(pixelsWidth, pixelsHeight);
    renderer.bindTexture(rt, 1);
    var gl = renderer.gl;
    if (renderer.renderingToScreen && renderTarget.root) {
        var buf = this._getBuf(pixelsWidth * pixelsHeight * 4);
        gl.readPixels(x_1, y_1, pixelsWidth, pixelsHeight, gl.RGBA, gl.UNSIGNED_BYTE, this._bigBuf);
        //REVERT Y?
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, pixelsWidth, pixelsHeight, gl.RGBA, gl.UNSIGNED_BYTE, this._bigBuf);
    } else {
        gl.copyTexSubImage2D(gl.TEXTURE_2D, 0, 0, 0, x_1, y_1, pixelsWidth, pixelsHeight);
    }

    renderer.bindShader(shader);
    renderer.state.setBlendMode(PIXI.BLEND_MODES.NORMAL);
    if (shader.uniforms.mapMatrix) {
        var mapMatrix = this._tempMatrix;
        mapMatrix.a = bounds.width / rt.width / spriteBounds.width;
        if (flipX) {
            mapMatrix.a = -mapMatrix.a;
            mapMatrix.tx = (bounds.x - x_1) / rt.width - (spriteBounds.x + spriteBounds.width) * mapMatrix.a;
        } else {
            mapMatrix.tx = (bounds.x - x_1) / rt.width - spriteBounds.x * mapMatrix.a;
        }
        mapMatrix.d = bounds.height / rt.height / spriteBounds.height;
        if (flipY) {
            mapMatrix.d = -mapMatrix.d;
            mapMatrix.ty = (bounds.y - y_1) / rt.height - (spriteBounds.y + spriteBounds.height) * mapMatrix.d;
        } else {
            mapMatrix.ty = (bounds.y - y_1) / rt.height - spriteBounds.y * mapMatrix.d;
        }

        shader.uniforms.mapMatrix = mapMatrix.toArray(true);
    }

    this._renderInner(sprite, shader);
};

PictureRenderer.prototype._renderInner = function (sprite, shader) {
    var renderer = this.renderer;
    if (shader.tilingMode > 0) {
        this._renderWithShader(sprite, shader.tilingMode === 1, shader);
    } else {
        this._renderSprite(sprite, shader);
    }
};

PictureRenderer.prototype._renderSprite = function(sprite, shader) {
    var renderer = this.renderer;
    var quad = this.quad;
    var uvs = sprite.texture._uvs;

    //sprite already has calculated the vertices. lets transfer them to quad

    var vertices = quad.vertices;
    var vd = sprite.computedGeometry ? sprite.computedGeometry.vertices : sprite.vertexData;
    for (var i = 0; i < 8; i++) {
        quad.vertices[i] = vd[i];
    }

    //SpriteRenderer works differently, with uint32 UVS
    //but for our demo float uvs are just fine
    quad.uvs[0] = uvs.x0;
    quad.uvs[1] = uvs.y0;
    quad.uvs[2] = uvs.x1;
    quad.uvs[3] = uvs.y1;
    quad.uvs[4] = uvs.x2;
    quad.uvs[5] = uvs.y2;
    quad.uvs[6] = uvs.x3;
    quad.uvs[7] = uvs.y3;

    //TODO: add baricentric coords here
    quad.upload();

    var frame = sprite.texture.frame;
    var base = sprite.texture.baseTexture;
    var clamp = this._tempClamp;
    //clamping 0.5 pixel from each side to reduce border artifact
    //this is our plugin main purpose
    var eps = 0.5 / base.resolution;
    clamp[0] = (frame.x + eps) / base.width;
    clamp[1] = (frame.y + eps) / base.height;
    clamp[2] = (frame.x + frame.width - eps) / base.width;
    clamp[3] = (frame.y + frame.height - eps) / base.height;
    //take a notice that size in pixels is realWidth,realHeight
    //width and height are divided by resolution
    shader.uniforms.uTextureClamp = clamp;

    var color = this._tempColor;
    PIXI.utils.hex2rgb(sprite.tint, color);
    var alpha = sprite.worldAlpha;
    //premultiplied alpha tint
    //of course we could do that in shader too
    color[0] *= alpha;
    color[1] *= alpha;
    color[2] *= alpha;
    color[3] = alpha;
    shader.uniforms.uColor = color;

    //bind texture to unit 0, our default sampler unit
    renderer.bindTexture(base, 0);
    quad.draw();
};

/**
 * this is a part of PIXI.extras.TilingSprite. It will be refactored later
 * @param ts
 * @returns {boolean}
 * @private
 */
PictureRenderer.prototype._isSimpleSprite = function(ts) {
    var renderer = this.renderer;
    var tex = ts._texture;
    var baseTex = tex.baseTexture;
    var isSimple = baseTex.isPowerOfTwo && tex.frame.width === baseTex.width && tex.frame.height === baseTex.height;

    // auto, force repeat wrapMode for big tiling textures
    if (isSimple)
    {
        if (!baseTex._glTextures[renderer.CONTEXT_UID])
        {
            if (baseTex.wrapMode === WRAP_MODES.CLAMP)
            {
                baseTex.wrapMode = WRAP_MODES.REPEAT;
            }
        }
        else
        {
            isSimple = baseTex.wrapMode !== WRAP_MODES.CLAMP;
        }
    }

    return isSimple;
};

/**
 * this is a part of PIXI.extras.TilingSprite. It will be refactored later
 * @param ts
 * @returns {boolean}
 * @private
 */
PictureRenderer.prototype._renderWithShader = function(ts, isSimple, shader)
{
    var quad = this.quad;
    var vertices = quad.vertices;

    var w0 = ts._width * (1 - ts._anchor._x);
    var w1 = ts._width * -ts._anchor._x;

    var h0 = ts._height * (1 - ts._anchor._y);
    var h1 = ts._height * -ts._anchor._y;

    var wt = ts.transform.worldTransform;

    var a = wt.a;
    var b = wt.b;
    var c = wt.c;
    var d = wt.d;
    var tx = wt.tx;
    var ty = wt.ty;

    vertices[0] = (a * w1) + (c * h1) + tx;
    vertices[1] = (d * h1) + (b * w1) + ty;

    vertices[2] = (a * w0) + (c * h1) + tx;
    vertices[3] = (d * h1) + (b * w0) + ty;

    vertices[4] = (a * w0) + (c * h0) + tx;
    vertices[5] = (d * h0) + (b * w0) + ty;

    vertices[6] = (a * w1) + (c * h0) + tx;
    vertices[7] = (d * h0) + (b * w1) + ty;

    vertices = quad.uvs;

    vertices[0] = vertices[6] = -ts.anchor.x;
    vertices[1] = vertices[3] = -ts.anchor.y;

    vertices[2] = vertices[4] = 1.0 - ts.anchor.x;
    vertices[5] = vertices[7] = 1.0 - ts.anchor.y;

    quad.upload();

    var renderer = this.renderer;
    var tex = ts._texture;
    var lt = ts.tileTransform.localTransform;
    var uv = ts.uvTransform;

    var w = tex.width;
    var h = tex.height;
    var W = ts._width;
    var H = ts._height;

    var tempMat = this._tempMatrix2;

    tempMat.set(lt.a * w / W,
        lt.b * w / H,
        lt.c * h / W,
        lt.d * h / H,
        lt.tx / W,
        lt.ty / H);

    // that part is the same as above:
    // tempMat.identity();
    // tempMat.scale(tex.width, tex.height);
    // tempMat.prepend(lt);
    // tempMat.scale(1.0 / ts._width, 1.0 / ts._height);

    tempMat.invert();
    if (isSimple)
    {
        tempMat.append(uv.mapCoord);
    }
    else
    {
        shader.uniforms.uMapCoord = uv.mapCoord.toArray(true);
        shader.uniforms.uClampFrame = uv.uClampFrame;
        shader.uniforms.uClampOffset = uv.uClampOffset;
    }
    shader.uniforms.uTransform = tempMat.toArray(true);

    var color = this._tempColor;
    var alpha = ts.worldAlpha;

    PIXI.utils.hex2rgb(ts.tint, color);
    color[0] *= alpha;
    color[1] *= alpha;
    color[2] *= alpha;
    color[3] = alpha;
    shader.uniforms.uColor = color;

    renderer.bindTexture(tex);

    quad.draw();
};

PIXI.WebGLRenderer.registerPlugin('picture', PictureRenderer);

module.exports = PictureRenderer;

},{"./NormalShader":2,"./mapFilterBlendModesToPixi":8}],5:[function(require,module,exports){
/**
 * @class
 * @extends PIXI.Shader
 * @memberof PIXI.extras
 * @param gl {PIXI.Shader} The WebGL shader manager this shader works for.
 * @param vert {string}
 * @param frag {string}
 * @param tilingMode {number} 0 for default, 1 for simple tiling, 2 for tiling
 */
function PictureShader(gl, vert, frag, tilingMode) {
    var lib = shaderLib[tilingMode];
    PIXI.Shader.call(this,
        gl,
        vert.replace(/%SPRITE_UNIFORMS%/gi, lib.vertUniforms)
            .replace(/%SPRITE_CODE%/gi, lib.vertCode),
        frag.replace(/%SPRITE_UNIFORMS%/gi, lib.fragUniforms)
            .replace(/%SPRITE_CODE%/gi, lib.fragCode)
    );

    this.tilingMode = tilingMode;
}


var shaderLib = [
    {
        //DOES NOT HAVE translationMatrix
        vertUniforms: "",
        vertCode: "vTextureCoord = aTextureCoord;",
        fragUniforms: "uniform vec4 uTextureClamp;",
        fragCode: "vec2 textureCoord = clamp(vTextureCoord, uTextureClamp.xy, uTextureClamp.zw);"
    },
    {
        //DOES HAVE translationMatrix
        vertUniforms: "uniform mat3 uTransform;",
        vertCode: "vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;",
        fragUniforms: "",
        fragCode: "vec2 textureCoord = vTextureCoord;"
    },
    {
        //DOES HAVE translationMatrix
        vertUniforms: "uniform mat3 uTransform;",
        vertCode: "vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;",
        fragUniforms: "uniform mat3 uMapCoord;\nuniform vec4 uClampFrame;\nuniform vec2 uClampOffset;",
        fragCode: "vec2 textureCoord = mod(vTextureCoord - uClampOffset, vec2(1.0, 1.0)) + uClampOffset;" +
        "\ntextureCoord = (uMapCoord * vec3(textureCoord, 1.0)).xy;" +
        "\ntextureCoord = clamp(textureCoord, uClampFrame.xy, uClampFrame.zw);"
    }
];

PictureShader.prototype = Object.create(PIXI.Shader.prototype);
PictureShader.prototype.constructor = PictureShader;
module.exports = PictureShader;

},{}],6:[function(require,module,exports){
/**
 * A Sprite with reduced border artifacts
 *
 * @class
 * @extends PIXI.Sprite
 * @memberof PIXI.extras
 * @param texture {PIXI.Texture} the texture for this sprite
 */
function PictureSprite(texture)
{
    PIXI.Sprite.call(this, texture);
}

PictureSprite.prototype = Object.create(PIXI.Sprite.prototype);
PictureSprite.prototype.constructor = PictureSprite;
module.exports = PictureSprite;

/**
 * Renders the object using the WebGL renderer
 *
 * @param renderer {PIXI.WebGLRenderer}
 * @private
 */
PictureSprite.prototype._renderWebGL = function (renderer)
{
    if (this.updateGeometry) {
        this.updateGeometry();
    } else {
        this.calculateVertices();
    }

    //use different plugin for rendering
    renderer.setObjectRenderer(renderer.plugins.picture);
    renderer.plugins.picture.render(this);
};

},{}],7:[function(require,module,exports){
/**
 * A TilingSprite with support of additional blendModes
 *
 * @class
 * @extends PIXI.extras.TilingSprite
 * @memberof PIXI.extras
 * @param texture {PIXI.Texture} the texture for this sprite
 * @param {number} width width
 * @param {number} height height
 */
function PictureTilingSprite(texture, width, height)
{
    PIXI.extras.TilingSprite.call(this, texture, width, height);
}

PictureTilingSprite.prototype = Object.create(PIXI.extras.TilingSprite.prototype);
PictureTilingSprite.prototype.constructor = PictureTilingSprite;
module.exports = PictureTilingSprite;

/**
 * Renders the object using the WebGL renderer
 *
 * @param renderer {PIXI.WebGLRenderer}
 * @private
 */
PictureTilingSprite.prototype._renderWebGL = function (renderer)
{
    if (this.updateGeometry) {
        this.updateGeometry();
    }

    const texture = this._texture;

    if (!texture || !texture.valid)
    {
        return;
    }

    this.tileTransform.updateLocalTransform();
    this.uvTransform.update();

    renderer.setObjectRenderer(renderer.plugins.picture);
    renderer.plugins.picture.render(this);
};

},{}],8:[function(require,module,exports){
var CONST = PIXI,
    OverlayShader = require('./OverlayShader'),
    HardLightShader = require('./HardLightShader');

/**
 * Maps gl blend combinations to WebGL
 * @class
 * @memberof PIXI.extras
 */
function mapFilterBlendModesToPixi(gl, array)
{
    array = array || [];

    //TODO - premultiply alpha would be different.
    //add a boolean for that!
    array[CONST.BLEND_MODES.OVERLAY] = [new OverlayShader(gl, 0), new OverlayShader(gl, 1), new OverlayShader(gl, 2)];
    array[CONST.BLEND_MODES.HARD_LIGHT] = [new HardLightShader(gl, 0), new HardLightShader(gl, 1), new HardLightShader(gl, 2)];

    return array;
}

module.exports = mapFilterBlendModesToPixi;

},{"./HardLightShader":1,"./OverlayShader":3}],9:[function(require,module,exports){
var myPlugin = {
    PictureSprite: require('./PictureSprite'),
    PictureTilingSprite: require('./PictureTilingSprite'),
    PictureRenderer: require('./PictureRenderer')
};

//dump everything into extras

Object.assign(PIXI.extras, myPlugin);

module.exports = myPlugin;

},{"./PictureRenderer":4,"./PictureSprite":6,"./PictureTilingSprite":7}]},{},[9])(9)
});


//# sourceMappingURL=pixi-picture.js.map
