function FirstLevelGenerator(config){
	this.config = config;
}

var Util = require('./Utils');
var Splitter = require('./Splitter');

FirstLevelGenerator.prototype = {
	CAVERN_WALLS: 1,
	CAVERN_FLOORS: 4,
	STONE_WALLS: 6,
	STONE_FLOORS: 3,
	generateLevel: function(specs){
		var hasRiver = Util.chance(specs.chances.water);
		var hasLava = Util.chance(specs.chances.lava);
		var mainEntrance = specs.isMainEntrance;
		var areas = this.generateAreas(specs, hasLava);
		this.placeExits(specs, areas);
		this.placeFeatures(specs, areas);
		var level = {
			hasRivers: hasRiver,
			hasLava: hasLava,
			mainEntrance: mainEntrance,
			strata: 'solidRock',
			areas: areas,
			depth: specs.depth,
			ceilingHeight: specs.height,
			vermin: specs.vermin
		} 
		return level;
	},
	generateAreas: function(specs, hasLava){
		var bigArea = {
			x: 0,
			y: 0,
			w: this.config.LEVEL_WIDTH,
			h: this.config.LEVEL_HEIGHT
		}
		var maxDepth = this.config.SUBDIVISION_DEPTH;
		var MIN_WIDTH = this.config.MIN_WIDTH;
		var MIN_HEIGHT = this.config.MIN_HEIGHT;
		var MAX_WIDTH = this.config.MAX_WIDTH;
		var MAX_HEIGHT = this.config.MAX_HEIGHT;
		var SLICE_RANGE_START = this.config.SLICE_RANGE_START;
		var SLICE_RANGE_END = this.config.SLICE_RANGE_END;
		var areas = Splitter.subdivideArea(bigArea, maxDepth, MIN_WIDTH, MIN_HEIGHT, MAX_WIDTH, MAX_HEIGHT, SLICE_RANGE_START, SLICE_RANGE_END);
		Splitter.connectAreas(areas,3);
		for (var i = 0; i < areas.length; i++){
			var area = areas[i];
			this.setAreaDetails(area, specs, hasLava);
		}
		return areas;
	},
	setAreaDetails: function(area, specs, hasLava){
		if (Util.chance(specs.chances.cavern)){
			area.areaType = 'cavern';
			if (hasLava){
				area.floor = 'cavernFloor';
				area.cavernType = Util.randomElementOf(['rocky','bridges']);
			} else {
				if (Util.chance(specs.chances.lagoon)){
					area.floor = 'fakeWater';
				} else {
					area.floor = 'cavernFloor';
				}
				area.cavernType = Util.randomElementOf(['rocky','bridges','watery']);
			}
			area.floorType = Util.rand(1, this.CAVERN_FLOORS);
		} else {
			area.areaType = 'rooms';
			area.floor = 'stoneFloor';
			area.floorType = Util.rand(1, this.STONE_FLOORS);
			if (Util.chance(specs.chances.wall_less)){
				area.wall = false;
			} else {
				area.wall = 'stoneWall';
				area.wallType = Util.rand(1, this.STONE_WALLS);
			}
			area.corridor = 'stoneFloor';
		}
		area.enemies = [];
		area.items = [];
		if (Util.chance(50)){
			// area.feature = Util.randomElementOf(specs.objects);
		}
	},
	placeExits: function(specs, areas){
		var dist = null;
		var area1 = null;
		var area2 = null;
		var fuse = 1000;
		do {
			area1 = Util.randomElementOf(areas);
			area2 = Util.randomElementOf(areas);
			if (fuse < 0){
				break;
			}
			dist = Util.lineDistance(area1, area2);
			fuse--;
		} while (dist < (this.config.LEVEL_WIDTH + this.config.LEVEL_HEIGHT) / 3);
		area1.hasExit = true;
		area2.hasEntrance = true;

		var randomGang = Util.randomElementOf(specs.gangs);
		area1.enemies = randomGang.minions;
		area1.enemyCount = randomGang.quantity;
		area1.boss = randomGang.boss;
	},
	placeFeatures: function(specs, areas){
		if (!specs.features) {
			return;
		}
		specs.features.forEach(f => {
			let fuse = 1000;
			let area;
			do {
				area = Util.randomElementOf(areas);
				if (fuse-- < 0){
					return;
				}
				if (!area.hasExit && !area.hasEntrance) {
					break;
				}
			} while (true);
			area.feature = f;
		});
	}
}

module.exports = FirstLevelGenerator;