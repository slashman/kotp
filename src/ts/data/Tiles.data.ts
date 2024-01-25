const defs = {
	GRASS: {
		solid: false,
		opaque: false,
		name: 'Grass',
		coords: [[0,5]]
	},
	TREE: {
		solid: true,
		opaque: false,
		name: 'Tree',
		rectCoords: [11, 8, 12, 8]
	},
	STONE_PATH: {
		solid: false,
		opaque: false,
		name: 'Path',
		rectCoords: [0, 9, 6, 9]
	},


	DUNGEON_WATER: {
		solid: false,
		opaque: false,
		name: 'Water',
		coords: [[37,7]]
	},
	DUNGEON_WATER_BORDER: {
		solid: false,
		opaque: false,
		name: 'Water',
		tileset: 'slashie',
		coords: [[6,0]]
	},
	DUNGEON_VOID: {
		solid: true,
		opaque: false,
		name: 'Void',
		coords: [[1,11]]
	},
	DUNGEON_FLOOR: {
		solid: false,
		opaque: false,
		name: 'Floor',
		coords: [[0,12]]
	},
	DUNGEON_WALL: {
		solid: true,
		opaque: false,
		name: 'Wall',
		tileset: 'slashie',
		coords: [[7,2]]
	},
	DUNGEON_WALL_TOP: {
		solid: true,
		opaque: true,
		name: 'Wall',
		tileset: 'slashie',
		coords: [[7,1]]
	},
	DUNGEON_STAIRS_UP: {
		solid: false,
		opaque: false,
		name: 'Stairs',
		coords: [[0,13]]
	},
	DUNGEON_STAIRS_DOWN: {
		solid: false,
		opaque: false,
		name: 'Stairs',
		coords: [[1,12]]
	},


	LAIR_WATER_BORDER: {
		solid: false,
		opaque: false,
		name: 'Water',
		coords: [[32,17]]
	},
	LAIR_WALL: {
		solid: true,
		opaque: false,
		name: 'Wall',
		coords: [[30,18]]
	},
	LAIR_WALL_TOP: {
		solid: true,
		opaque: true,
		name: 'Wall',
		coords: [[30,17]]
	},

	OW_GRASSLAND: {
		solid: false,
		opaque: false,
		name: 'Grassland',
		coords: [[0,5]]
	},
	OW_FOREST_BLOB: {
		solid: false,
		opaque: false,
		name: 'Forest',
		rectCoords: [3, 0, 5, 2]
	},
	OW_TOWN: {
		solid: false,
		opaque: false,
		name: 'Town',
		rectCoords: [9, 0, 13, 5]
	},
	OW_MOUNTAIN: {
		solid: true,
		opaque: false,
		name: 'Mountain',
		rectCoords: [0, 0, 2, 2]
	},
	OW_DESERT: {
		solid: true,
		opaque: false,
		name: 'Desert',
		coords: [[7, 6]]
	},
	OW_DESERT_2: {
		solid: true,
		opaque: false,
		name: 'Desert',
		rectCoords: [2, 3, 3, 4]
	},
	OW_RIVER: {
		solid: true,
		opaque: false,
		name: 'River',
		coords: [[2, 5]]
	},
	OW_RIVER_2: {
		solid: true,
		opaque: false,
		name: 'River',
		rectCoords: [0, 3, 1, 4]
	},
	OW_TOWER: {
		solid: false,
		opaque: false,
		name: 'Tower',
		coords: [[6,6]]
	},
	OW_TOWER_ENTRANCE: {
		solid: false,
		opaque: false,
		name: 'Tower',
		coords: [[6,7]]
	},
	OW_OCEAN: {
		solid: true,
		opaque: false,
		name: 'Ocean',
		rectCoords: [6, 0, 8, 2]
	}
}

const terrainTileWidth = 16;

export default {
	init () {
		this.indexMap = {};
		Object.keys(defs).forEach(k => {
			const def = defs[k];
			def.id = k;
			if (!def.tileset) {
				def.tileset = 'main';
			}
			if (def.rectCoords) {
				let counter = 0;
				for (let xx = def.rectCoords[0]; xx <= def.rectCoords[2]; xx++) {
					for (let yy = def.rectCoords[1]; yy <= def.rectCoords[3]; yy++) {
						const sdef = Object.assign({}, def);
						delete sdef.coords;
						sdef.coord = [xx, yy];
						sdef.id = k + '_' + counter;
						defs[sdef.id] = sdef;
						if (def.tileset === 'main') {
							this.indexMap[sdef.coord[1] * terrainTileWidth + sdef.coord[0]] = sdef;
						}
						counter++;
					}
				}
			} else if (def.coords.length === 1) {
				def.coord = def.coords[0];
				if (def.tileset === 'main') {
					this.indexMap[def.coord[1] * terrainTileWidth + def.coord[0]] = def;
				}
			} else {
				// Create one Tile for each
				def.coords.forEach((c, counter: number) => {
					const sdef = Object.assign({}, def);
					delete sdef.coords;
					sdef.coord = c;
					sdef.id = k + '_' + counter;
					defs[sdef.id] = sdef;
					if (def.tileset === 'main') {
						this.indexMap[sdef.coord[1] * terrainTileWidth + sdef.coord[0]] = sdef;
					}
				});
			}
		});
	},
	getByIndex (index: number) {
		return this.indexMap[index];
	},
	getById (id: string) {
		return defs[id];
	}
}