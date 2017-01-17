const {readFileSync, writeFileSync, mkdirSync, existsSync} = require('fs');
const Concat = require('concat-with-sourcemaps');

const name = process.argv[2];
const sourceMap = process.argv[3];
const order = JSON.parse(readFileSync(`./${name}.json`).toString());

let concat = new Concat(true, `${name}.js`, '\n');

order.forEach(fileName=>{
    const path = __dirname + `/src/${name}/${fileName}`;
    concat.add(path, readFileSync(path).toString());
});

const outFolder = 'dist';
if(!existsSync(outFolder)) mkdirSync(outFolder);

writeFileSync(`./${outFolder}/${name}.js`, concat.content);
if(sourceMap)writeFileSync(`./${outFolder}/${name}.js.map`, concat.sourceMap);
