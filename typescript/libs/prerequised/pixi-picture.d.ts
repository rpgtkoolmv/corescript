// <reference types="pixi.js" />
declare module PIXI.extras {
    class PictureShader extends PIXI.Shader {
        tempQuad: Quad;
        tilingMode: number;
        static blendVert: string;
        constructor(gl: WebGLRenderingContext, vert: string, frag: string, tilingMode: number);
    }
}
declare module PIXI.extras {
    class HardLightShader extends PictureShader {
        constructor(gl: WebGLRenderingContext, tilingMode: number);
    }
}
declare module PIXI.extras {
    function mapFilterBlendModesToPixi(gl: WebGLRenderingContext, array?: Array<Array<PictureShader>>): Array<Array<PictureShader>>;
}
declare module PIXI.extras {
    class NormalShader extends PictureShader {
        constructor(gl: WebGLRenderingContext, tilingMode: number);
    }
}
declare module PIXI.extras {
    class OverlayShader extends PictureShader {
        constructor(gl: WebGLRenderingContext, tilingMode: number);
    }
}
declare module PIXI.extras {
    class PictureRenderer extends ObjectRenderer {
        constructor(renderer: WebGLRenderer);
        drawModes: Array<Array<PictureShader>>;
        normalShader: Array<PictureShader>;
        _tempClamp: Float32Array;
        _tempColor: Float32Array;
        _tempRect: PIXI.Rectangle;
        _tempRect2: PIXI.Rectangle;
        _tempRect3: PIXI.Rectangle;
        _tempMatrix: PIXI.Matrix;
        _tempMatrix2: PIXI.Matrix;
        _bigBuf: Uint8Array;
        _renderTexture: PIXI.BaseRenderTexture;
        onContextChange(): void;
        start(): void;
        flush(): void;
        _getRenderTexture(minWidth: number, minHeight: number): BaseRenderTexture;
        _getBuf(size: number): Float32Array;
        render(sprite: Sprite): void;
        _renderNormal(sprite: Sprite, shader: PictureShader): void;
        _renderBlend(sprite: Sprite, shader: PictureShader): void;
        _renderInner(sprite: Sprite, shader: PictureShader): void;
        _renderWithShader(ts: TilingSprite, isSimple: boolean, shader: PictureShader): void;
        _renderSprite(sprite: Sprite, shader: PictureShader): void;
        _isSimpleSprite(ts: Sprite): boolean;
    }
}
declare module PIXI.extras {
    class PictureSprite extends Sprite {
        constructor(texture: Texture);
    }
}
declare module PIXI.extras {
    class PictureTilingSprite extends TilingSprite {
        constructor(texture: Texture);
    }
}