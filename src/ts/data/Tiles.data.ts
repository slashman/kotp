const defs = {
	GRASS: {
		solid: false,
		opaque: false,
		name: 'Grass',
		coords: [[0,8], [7, 2]]
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
	STONE_FLOOR: {
		solid: false,
		opaque: false,
		name: 'Path',
		coords: [[6,1]]
	},
	MISC_BLOCKS: {
		solid: true,
		opaque: false,
		name: 'Path',
		rectCoords: [3, 3, 7, 5]
	},
	throne: {
		solid: true,
		opaque: false,
		name: 'Path',
		rectCoords: [0, 6, 4, 7]
	},
	BLACK_FLOOR: {
		solid: false,
		opaque: false,
		name: 'Path',
		coords: [[1,4]]
	},
	STONE_WALL: {
		solid: true,
		opaque: false,
		name: 'Path',
		coords: [[4,8]]
	},
	WATER: {
		solid: true,
		opaque: false,
		name: 'Path',
		coords: [[9,10]]
	},
	BRIDGE: {
		solid: false,
		opaque: false,
		name: 'Path',
		coords: [[11,10]]
	},
	HOUSE: {
		solid: false,
		opaque: false,
		name: 'Path',
		coords: [[7,9], [8,9], [9,9], [10,9], [11, 9], [12,9], [1,10], [5, 10], [6, 10], [7, 10]]
	},
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