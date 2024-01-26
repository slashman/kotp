import './css/styles.css';
import {printEnvironment} from './environment';
import Game from './ts/Game';

window.onload = () => {
  printEnvironment()

  Game.start({
    display: 'pixi',
    displayConfig: {
      baseTileSize: 16,

      canvasWidth: 256,
      canvasHeight: 240,

      viewportCountX: 18,
      viewportCountY: 16,
      textboxFontSize: 32,
      textColor: 0xFFFFFF,

      "tilesets": [
        {
          "id": "ui",
          "file": "assets/gfx/tileset.png",
          "tilesetCountX": 16,
          "tilesetCountY": 16,
          "tileSizeX": 16,
          "tileSizeY": 16,
          "offsetX": 0,
          "offsetY": 0
        },
        {
          "id": "main",
          "file": "assets/gfx/fftiles.png",
          "tilesetCountX": 16,
          "tilesetCountY": 16,
          "tileSizeX": 16,
          "tileSizeY": 16,
          "offsetX": 0,
          "offsetY": 0
        },
        {
          "id": "battle",
          "file": "assets/gfx/battle.png",
          "tilesetCountX": 16,
          "tilesetCountY": 10,
          "tileSizeX": 16,
          "tileSizeY": 24,
          "offsetX": 0,
          "offsetY": 0
        },
        {
          "id": "slashie",
          "file": "assets/gfx/slashie.png",
          "tilesetCountX": 16,
          "tilesetCountY": 16,
          "tileSizeX": 16,
          "tileSizeY": 16,
          "offsetX": 0,
          "offsetY": 0
        }
      ],

      "windowTiles": {
        "tiles": {
          "a": "8-10",
          "b": "9-10",
          "c": "10-10",
          "d": "8-11",
          "e": "9-11",
          "f": "10-11",
          "g": "8-12",
          "h": "9-12",
          "i": "10-12"
        }
      },
      "squareCursor": {
        "tileset": "ui",
        "index": "2-3"
      },
      "pointyCursor": {
        "tileset": "slashie",
        "index": "10-0"
      },
    }
  });
}
