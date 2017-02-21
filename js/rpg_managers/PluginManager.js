//-----------------------------------------------------------------------------
// PluginManager
//
// The static class that manages the plugins.

function PluginManager() {
    throw new Error('This is a static class');
}

PluginManager._path         = 'js/plugins/';
PluginManager._scripts      = [];
PluginManager._errorUrls    = [];
PluginManager._parameters   = {};
PluginManager._programCache = {};

PluginManager.setup = function(plugins) {
    plugins.forEach(function(plugin) {
        if (plugin.status && !this._scripts.contains(plugin.name)) {
            this.setParameters(plugin.name, plugin.parameters);
            this.loadScript(plugin.name + '.js');
            this._scripts.push(plugin.name);
        }
    }, this);
};

PluginManager.checkErrors = function() {
    var url = this._errorUrls.shift();
    if (url) {
        throw new Error('Failed to load: ' + url);
    }
};

PluginManager.parameters = function(name) {
    return this._parameters[name.toLowerCase()] || {};
};

PluginManager.setParameters = function(name, parameters) {
    this._parameters[name.toLowerCase()] = parameters;
};

PluginManager.loadScript = function(name) {
    var url = this._path + name;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.async = false;
    script.onerror = this.onError.bind(this);
    script._url = url;
    document.body.appendChild(script);
};

PluginManager.onError = function(e) {
    this._errorUrls.push(e.target._url);
};

PluginManager.createPluginProgram = function(program) {
    if(this._programCache[program] != void 0) throw new Error('Already initialized pulgin program ' + program);
    this._programCache[program] = new PluginProgram(program);
    return this._programCache[program];
};

PluginManager.runProgram = function(program, params) {
    if(this._programCache[program] != void 0)
        this._programCache[program].run(params);
    else {
        throw new Error('Failed to find plugin command: ' + program + '.');
    }
};

//-----------------------------------------------------------------------------
// PluginProgram
//
// The class that process plugin commands.


function PluginProgram() {
    this.initialize.apply(this, arguments);
}

PluginProgram.prototype.initialize = function(name) {
    this._name = name;
    this._commands = {};
}

PluginProgram.createParams = function(paramsStyle, args) {
    if(paramsStyle.length != args.length) throw new Error('Wrong number of arguments (given ' + args.length + ', expected ' + paramsStyle.length + ').')
    var params = {};
    args.forEach(function(arg, index) {
        var value;
        switch (paramsStyle[index].type) {
            case 'number':
                value = Number(arg)
                break;
            case 'string':
                value = String(arg)
                break;
            case 'boolean':
                value = Boolean(arg)
                break;
            default:
                throw new Error('Failed to not find param type(' + paramsStyle[index].type + ').')
                break;
        }
        params[paramsStyle[index].name] = value;
    })
    return params;
}

PluginProgram.prototype.run = function(args) {
    if(this._commands[args[0]] == void 0) {
        if(this._commands.__default == void 0) throw new Error('Failed to not find the default command.');
        var params = PluginProgram.createParams(this._commands.__default.params, args);
        this._commands.__default.callback(params);
    } else {
        var command = args.shift()
        var params = PluginProgram.createParams(this._commands[command].params, args);
        this._commands[command].callback(params);
    }
}

PluginProgram.prototype.command = function() {
    var commandName, argStyle, callback;
    if(arguments.length == 3) {
        commandName = arguments[0];
        argStyle = arguments[1];
        callback = arguments[2];
    } else {
        if(this._commands.__default != void 0) throw new Error('The default command already exists');
        commandName = '__default';
        argStyle = arguments[0];
        callback = arguments[1];
    }
    var params = [];
    argStyle.split(',').forEach(function(value){
        params.push({
            name: value.match(/([a-zA-Z_]*):(.*)/)[1], 
            type: value.match(/([a-zA-Z_]*):(.*)/)[2]
        });
    })
    this._commands[commandName] = {params: params, callback: callback};
    return this;
}