const fs = require('fs');
const assert = require('assert');

eval(fs.readFileSync('./js/rpg_core/FrameStabilizer.js').toString());

function heavySleep(s) {
    const t = new Date().getTime() + s;

    var nop = 0;
    while (new Date().getTime() <= t){nop++;}
}

(function(){
    let stabilizer = new FrameStabilizer(0.001);
    let count = 0;

    heavySleep(100);
    stabilizer.frame(()=>{
        heavySleep(1000);
        count++;
    });

    assert(count < 3);
})();

(function(){
    let stabilizer = new FrameStabilizer(1);
    let count = 0;

    stabilizer.frame(()=>count++);
    stabilizer.frame(()=>count++);
    stabilizer.frame(()=>count++);
    stabilizer.frame(()=>count++);
    stabilizer.frame(()=>count++);
    stabilizer.frame(()=>count++);

    assert(count < 2);
})();

(function(){
    let stabilizer = new FrameStabilizer(0.1);
    let count = 0;
    stabilizer.frame(()=>count++);
    heavySleep(500);
    stabilizer.frame(()=>count++);

    assert(count >= 5);
})();