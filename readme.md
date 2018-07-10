# CanvasFPS

Uses the [Impact](https://github.com/phoboslab/Impact) engine, and the [TwoPointFive](https://github.com/phoboslab/TwoPointFive) plugin for Impact, both included in this repo for convenience (minus the Weltmeister level editor). Yes, Impact is old and hasn't been updated in quite a while, who cares, it's free now :D

Most art is from the TwoPointFive demo, though some is from [Xibalba](http://phoboslab.org/xibalba/) (also made by the author behind Impact/TwoPointFive).

This is **very incomplete** with no optimizations and lots of commented out code. There's no real end goal with this specific project, though anything neat here could be used in something else later down the line.

## Running
Since this isn't hosted statically just yet, you'll need to do the following:
* Download or clone the repository
* Within the repo folder, start some kind of HTTP server (Node works well)
* In your WebGL-capable browser of choice, navigate to the local address provided by your server, the game should launch in a Canvas element.

### Controls
Click on the game or enter fullscreen mode to enable mouse look.

* Move/Strafe - WASD
* Move/Turn - Arrow keys
* Primary fire - Left mouse button or Ctrl key
* Secondary fire - Right mouse button (no keyboard input yet...)
* Change weapons - V (keyboard) or Mouse Wheel (mouse wheel weapon change is janky...)

Also supports gamepad input and somewhat supports touchscreen (mobile) input, though this is not complete (no secondary fire, for example).

## Editing
TODO (though you can just edit it like any other Impact project).