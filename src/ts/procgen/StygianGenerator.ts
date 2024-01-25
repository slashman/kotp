const Generator = require('./stygianGen/Generator.class');
import TilesData from '../data/Tiles.data';
import Being from '../model/Being.class';
import Item from '../model/Item.class';
import Random from '../Random';

const config = {
	MIN_WIDTH: 10,
	MIN_HEIGHT: 10,
	MAX_WIDTH: 20,
	MAX_HEIGHT: 15,
	LEVEL_WIDTH: 80,
	LEVEL_HEIGHT: 22,
	SUBDIVISION_DEPTH: 3,
	SLICE_RANGE_START: 3/8,
	SLICE_RANGE_END: 5/8,
	RIVER_SEGMENT_LENGTH: 10,
	MIN_RIVER_SEGMENTS: 10,
	MAX_RIVER_SEGMENTS: 20,
	MIN_RIVERS: 3,
	MAX_RIVERS: 5
};

const ROOM_NAMES = [
	"Bunker",
	"Storage",
	"Weapons Storage",
	"Electrical Room",
	"Hallway",
	"Walkway",
	"Computers Room",
	"Armory",
	"Mecha Storage",
	"Willemite Storage",
	"Laboratory",
	"Guardpost",
	"Barracks",
	"Gallery",
	"Passageway",
	"Tunnel",
	"Vault"
];

let CELLS_TO_TILES;

const StygianGenerator = {
	init () {
		CELLS_TO_TILES = {
			water: TilesData.getById('DUNGEON_WATER'),
			lava: TilesData.getById('DUNGEON_VOID'),
			fakeWater: TilesData.getById('DUNGEON_WATER'),
			solidRock: TilesData.getById('DUNGEON_WALL'),
			darkRock: TilesData.getById('DUNGEON_WALL'),
			grayRock: TilesData.getById('DUNGEON_WALL'),
			cavernFloor: TilesData.getById('DUNGEON_FLOOR'),
			downstairs: TilesData.getById('DUNGEON_STAIRS_DOWN'),
			upstairs: TilesData.getById('DUNGEON_FLOOR'),
			stoneWall: TilesData.getById('DUNGEON_WALL'),
			stoneFloor: TilesData.getById('DUNGEON_FLOOR'),
			corridor: TilesData.getById('DUNGEON_FLOOR'),
			padding: TilesData.getById('DUNGEON_FLOOR'),
			bridge: TilesData.getById('DUNGEON_FLOOR'),
		}
	},
	loadLevel: function(level, mapId, fromId, metadata){
		const generator = new Generator(config);
		const results = generator.generateLevel(metadata, {});
		level.regionsMap = [];
		const cells = results.level.cells;
		for (let x = 0; x < cells.length; x++) {
			level.map[x] = [];
			level.regionsMap[x] = [];
			for (let y = 0; y < cells[x].length; y++) {
				level.map[x][y] = CELLS_TO_TILES[cells[x][y]];
			}
		}
		level.regions = [];
		const areas = results.sketch.areas;
		const hasLava = results.sketch.hasLava;
		areas.forEach(a => {
			let regionDescription = a.areaType;
			if (a.areaType == 'cavern') {
				if (a.cavernType == 'rocky') {
					regionDescription = "Rocky Cavern";
				} else if (a.cavernType == 'bridges') {
					if (hasLava) {
						regionDescription = "Lava Cavern";
					} else {
						regionDescription = "Underground River";
					}
				} else if (a.cavernType == 'watery') {
					regionDescription = "Lagoon";
				}
			} else if (a.areaType == 'rooms') {
				regionDescription = Random.from(ROOM_NAMES);
			}
			const region = regionDescription
			level.regions.push(region);
			for (let x = a.x; x < a.x + a.w; x++) {
				for (let y = a.y; y < a.y + a.h; y++) {
					level.regionsMap[x][y] = region;
				}
			}
		})
		const wallTile = TilesData.getById('DUNGEON_WALL');
		for (let x = 0; x < cells.length; x++) {
			level.map[x] = [];
			for (let y = 0; y < cells[x].length; y++) {
				level.map[x][y] = CELLS_TO_TILES[cells[x][y]];
			}
		}

		for (let x = 0; x < cells.length; x++) {
			for (let y = 1; y < cells[x].length - 1; y++) {
				if (level.map[x][y] === wallTile) {
					if (level.map[x][y - 1] !== wallTile && level.map[x][y + 1] !== wallTile) {
						// Check if alone
						level.map[x][y] = TilesData.getById('DUNGEON_FLOOR')
					}
				}
			}
		}

		for (let x = 0; x < cells.length; x++) {
			for (let y = 0; y < cells[x].length - 1; y++) {
				if (level.map[x][y] === wallTile) {
					if (level.map[x][y + 1] === wallTile) {
						level.map[x][y] = TilesData.getById('DUNGEON_WALL_TOP')
					}
				}
			}
		}

		const waterTile = TilesData.getById('DUNGEON_WATER');
		const floorTile = TilesData.getById('DUNGEON_WATER');

		for (let x = 0; x < cells.length; x++) {
			for (let y = cells[x].length; y > 0; y--) {
				if (level.map[x][y] === waterTile) {
					if (level.map[x][y - 1] !== waterTile && level.map[x][y - 1] !== wallTile) {
						level.map[x][y] = TilesData.getById('DUNGEON_WATER_BORDER')
					}
				}
			}
		}

		const enemies = results.level.enemies;
		enemies.forEach(e => {
			const being = new Being();
			being.init(level.game, level, e.code, metadata.depth ?? 0);
			level.addBeing(being, e.x, e.y);
		});

		const items = results.level.items;
		items.forEach(i => {
			const item = new Item();
			item.init(i.code);
			level.addItem(item, i.x, i.y);
		});

		const features = results.level.features;
		features.forEach(f => {
			switch (f.code) {
				/*case "chamber":
					level.map[f.x][f.y] = TILES.CHAMBER;
					level.addTerminal("chamber", f.x, f.y);
					break;*/
			}
		});

		level.enterMessage = metadata.enterMessage;
		level.isReactor = true;
		level.name = metadata.name;
		// level.addExit(results.level.start.x, results.level.start.y, fromId, TilesData.getById('DUNGEON_STAIRS_UP'));
		level.addExit(results.level.end.x, results.level.end.y, metadata.nextLevelId, TilesData.getById('DUNGEON_STAIRS_DOWN'));
		level.player.x = results.level.start.x;
		level.player.y = results.level.start.y;

		level.music = Random.from(['mx_cave_v3','mx_cave_v2']);
		// level.ambience = 'bg_exterior_day'; TODO: Put Cave ambience?
		level.persistent = false;
	}
}

export default StygianGenerator;