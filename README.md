# Knights of the Pun
A game for GGJ 2024

# What is this?
A traditional jRPG where you have to make people laugh

# Local Development Server

Local development can occur in two flavours: *web*, or *electron*. In both environments, changes to your source are hot-reloaded.

## Web

* `npm install`
* `npm run web:pixi`

## Electron

* `npm install`
* `npm run electron:pixi`

# Building and Distribution

Distribution files are also seperated by either *web* or *electron* targets.

## Web

* `npm run build:web:pixi`
* Directory `dist/web` will contain the web directory contents you can serve or FTP

## Electron

* `npm run package:<one of *win32*, *mac* or *linux*>:pixi`
* Directory `dist` will contain the distribution folders for the given platform


# Credits
* Created from JavaScript Roguelike Template https://github.com/slashman/jsrl
* Uses PIXI.JS for display
