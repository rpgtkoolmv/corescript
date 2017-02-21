/**
 * @author shitake
 * 
 */

var program = PluginManager.createPluginProgram('Example');

/**
 * Plugin command: 
 * 
 * example true
 * 
 * output:
 *  Plugin: Exmaple, Params: {isRun :true}
 */
program.command('', 'isRun:boolean', function(params) {
  console.log('Plugin: Exmaple, Params: {isRun: ' + params.isRun + '}')
})

/**
 * Plugin command: 
 * 
 * example init helloworld 12 12 640 480
 * 
 * output:
 *  Plugin: Exmaple, Command: init, Params: {title: helloworld, x: 12, y: 12, width: 640, height: 480}
 */
program.command('init', 'title:string, x:number, y:number, width:number, height:number', function(params) {
  console.log('Plugin: Exmaple, Command: init, Params: {title: ' + params.title + ',x: '+ params.x +', y: '+ params.y +', width: '+ params.width +', height: '+ params.height +'}')
})