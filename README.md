
# RPG Maker MV CoreScript

## Introduction

"RPG Maker MV CoreScript" is a multiplatform game engine for 2D-RPG development. "RPG Maker MV CoreScript" is designed as a game engine dedicated to "RPG Maker MV", the latest in the award-winning "RPG Maker" series. As the number one 2D-RPG development platform in the world, "RPG Maker" has over 20 years of history and, as of February of 2017, has been used to develop more than 1,000 games worldwide.

## What is this project?

This project is a concerted effort by the community to improve and enhance the "RPG Maker MV CoreScript" for the benefit of game and plugin developers alike.

As releases become stable, the core script developed by this project will be widely distributed to RPG Maker users by KADOKAWA, via RPG Maker MV's software updates.

Since much of the RPGMaker MV community revolves around plugins, the version 1.0 series aims to limit sweeping changes in order to minimize incompatability with current plugins.

## How to use

There are currently three release versions:

- Develop --- the Development version, which can be downloaded via GitHub.
- RC --- the Release candidate, which is available to game developers for testing. This version will be distributed through the "RPG Atsumaru" website, found here: http://blog.nicovideo.jp/atsumaru/atsumaru-corescript.html
- Stable --- the Stable version, which will be widely distributed by KADOKAWA to general users through Steam and the official RPG Maker website.

## How to build

To build the RPG Maker MV Corescripts, you'll first need to install "Node.js", which can be downloaded from this website: https://nodejs.org/en/

Next, open a console, change the working directory to the Corescript folder you downloaded (usually "Corescript-________"), and then enter the following commands:

```
npm install
npm run build
```

This will create a folder called "dist" inside the "Corescript-________" directory, inside of which you will find all of the compiled Corescripts.

If you want to build each Corescript individually, you can use the following commands:
```
npm run build:core
npm run build:managers
npm run build:objects
npm run build:scenes
npm run build:sprites
npm run build:windows
```

To test, place MV’s project in game/ and type

```
npm test
```

There are helpful tasks, watch and start.

Watch task is watching js/rpg_*** changes, concat them, and copy that to ./game/js/ .

```
npm run watch
```

Start task starts local server. You can test Corescripts in your browser.

http://localhost:8080/

```
npm start
```


## How to join

- This project uses English as the main language.
- The workflow is Github Flow. When sending PR, prepare a new feature branch and send it to the master branch of this repository.http://scottchacon.com/2011/08/31/github-flow.html
- This project uses ES5. It is for compatibility with plugins.
- Please apply for development slack from this form. It will usually be invited within 48 hours.https://docs.google.com/forms/d/1T5wrKeOAfFBNytHrby4HMDzShtOMl2s7ayvjGwBrbNY/edit
- This project is just started. The rules of development are decided through discussion.

## Roadmap

Development will be done according to the roadmap. Currently we are developing ver 1.2

### ver 1.0

Goal: Publish community development version
- Split core script file
- Put on github
- Publish roadmap

### ver 1.1

Goal: Fix a fatal bug
- Fix memory related problems
- Preceding reading of image material
- Responding to sound problems of google Chrome
- Fixed bugs already known


### ver 1.2

Goal: Responding to problems where games can not continue
- Retry at load error
- Development of a standard plugin for options
- Volume Change API

### ver 1.3

Goal: Assist in game development
- AutoSave
- Simple conflict check for plugins
- Guidelines and sample writing for plugins
- Refined bug report

### ver 1.4

Goal: Accelerate speed, reduce experience time
- High-speed loading of sound source
- Progress bar on load screen
- Lightweight Save File

### ver 1.5

Goal: Improve UI
- Multilingual
- Multi-touch
- Battle system touch compliance
- Touch correspondence of basic system such as equipment

## Constitution
The core script is finally output to mainly 6 files.
<dl>
    <dt>rpg_core.js</dt>
    <dd>Wrapper classes of Pixi.js and base classes such as audio and input processing.</dd>
    <dt>rpg_managers.js</dt>
    <dd>Static classes named XxxManager that manage the game overall.</dd>
    <dt>rpg_objects.js</dt>
    <dd>Classes named Game_Xxx dealing with game data (many are saved).</dd>
    <dt>rpg_scenes.js</dt>
    <dd>Classes named Scene_Xxx in which the scene is defined.</dd>
    <dt>rpg_sprites.js</dt>
    <dd>Classes named Sprite_Xxx related to image display and processing.</dd>
    <dt>rpg_windows.js</dt>
    <dd>Classes named Window_Xxx handling window display and input.</dd>
</dl>

In addition, a plugin list is defined in *plugins.js*, and *main.js* launches the game.

## Inheritance style

```js
// In JavaScript this function is constructor
function Derived() {
    this.initialize.apply(this, arguments); // Delegate to initialize()
}

Derived.prototype = Object.create(Base.prototype); // Derived inherits from Base
Derived.prototype.constructor = Derived;

Derived.prototype.initialize = function () {
    Base.prototype.initialize.call(this); // This makes super.initialize() sense
};
```

## Global variables
Variables named `$dataXxx` are read from JSON in the *data* folder.
These files are changed by the editor, but they are immutable during play.
Variables named `$gameXxx` are instances of the class defined in *rpg_objects.js*.
When saving the game, these objects (except `$gameTemp, $gameMessage, $gameTroop`) are serialized to JSON and saved.
When loading, since the prototype chain is reconnected simultaneously with deserialization, you can continue using instance methods.

## Scene graph
The scene graph is a drawing tree like FLASH provided by Pixi.js.
Children are influenced by parent's coordinates and visibility.
Register a child in the form `(scene or sprite or window).addChild(child)`.

### Scene
In RMMV the scene is the root element of the scene graph and has children with Sprite and Window.
The life cycle is managed by `SceneManager`, and it operates up to one at the same time.

Life cycle: `new Scene_Xxx() -> create() -> start() -> update()* -> stop() -> terminate()`

## Flow

### Initialization
1. When the page is loaded, call `SceneManager.run()`. *(main.js)*
1. Initialize classes such as `Graphics, WebAudio, Input, TouchInput`.
1. Set `Scene_Boot` to `SceneManager`.
1. Register `SceneManager.update` in `requestAnimationFrame`.

`requestAnimationFrame` is called by the browser at regular time intervals (every time drawing is required).

### Update
1. `requestAnimationFrame` calls `SceneManager.update()`.
1. Process the current scene every 1/60 second according to the scene lifecycle rule
1. If `Scene_Xxx.update()` is called, then
    1. Call all children `update()`.
    1. Children recursively call their children `update()`.
1. Render the scene (including its children) onto the screen.
1. Register `SceneManager.update` in `requestAnimationFrame`.


## License
This content is released under the (http://opensource.org/licenses/MIT) MIT License.
