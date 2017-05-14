function FrameStabilizer(){
    this.initialize.apply(this, arguments);
}

FrameStabilizer.MEASURE_COUNT = 10;

FrameStabilizer.now = (function(root){
    if(root.performance && root.performance.now){
        return function(){
            return root.performance.now();
        }
    }else{
        return function(){
            return Date.now();
        }
    }
})(this);

FrameStabilizer.prototype.initialize = function(deltaTime){
    this._averageFrameTimes = [];
    this._accumulator = 0;
    this._deltaTime = deltaTime * 1000;
    this._currentTime = FrameStabilizer.now();
};

FrameStabilizer.prototype._calcAverageFrameTime = function(){
    return this._averageFrameTimes.reduce(function(a,b){return a+b;}, 0) / this._averageFrameTimes;
};

FrameStabilizer.prototype._calcFrameSkipCount = function(delta){
    if(this._averageFrameTimes.length === 0 || this._calcAverageFrameTime() > this._deltaTime/2){
        //There isn't enough machine power to skip, so do not skip
        return 1;
    }

    this._accumulator += delta;
    var count = Math.floor(this._accumulator / this._deltaTime);
    this._accumulator -= count * this._deltaTime;

    return count;
};

FrameStabilizer.prototype._measureFrame = function(delta, count){
    this._averageFrameTimes.push(delta / count);
    if(this._averageFrameTimes.length > FrameStabilizer.MEASURE_COUNT){
        this._averageFrameTimes.shift();
    }
};

FrameStabilizer.prototype.frame = function(frame){
    var current = FrameStabilizer.now();
    var delta = current - this._currentTime;
    this._currentTime = current;

    var frameCount = this._calcFrameSkipCount(delta);

    var frameStart = FrameStabilizer.now();
    for(var n = 0; n < frameCount; ++n) frame();
    this._measureFrame(FrameStabilizer.now() - frameStart, frameCount);
};