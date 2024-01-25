/**
 * Object that loads a predesigned map into a game level.
 *  
 */

import {levelMaps} from './data/Maps.data';
import TilesData from './data/Tiles.data';
import Being from './model/Being.class';
import Item from './model/Item.class';
import Level from './model/Level.class';
import Random from './Random';

export default {
	loadLevel: function(level: Level, mapId: string, fromId?: string){
		const map = levelMaps[mapId];
		if (!map) {
			throw new Error (`No map definition found for [${mapId}]`);
		}
		level.map = [];
		level.name = map.name;
		level.music = map.music;
		level.ambience = map.ambience;
		level.onEnter = map.onEnter;
		level.enterSFX = map.enterSFX;
		level.safe = map.safe;
		level.respawn = map.respawn;
		level.persistent = !!map.persistent;
		const indexesMap = {};
		// Indexes map
		for (var y = 0; y < map.height; y++){
			for (var x = 0; x < map.width; x++){
				if (!level.map[x]) {
					level.map[x] = [];
				}
				const mapIndex = map.indexMap[y * map.width + x] - 1;
				let def = indexesMap[mapIndex];
				if (!def) {
					def = TilesData.getByIndex(mapIndex);
					if (!def) {
						throw new Error(`def not found for index [${mapIndex}] at [${x},${y}]`);
					}
					indexesMap[mapIndex] = def;
				}
				level.map[x][y] = def;

			}
		}
		if (map.exits) {
			map.exits.forEach(e => {
				if (e.target) {
					level.addExit(e.x, e.y, e.target);
				} else if (!e.start) {
					level.addExit(e.x, e.y, fromId);
				}
				if (e.start) {
					level.setEntrance(e.x, e.y);
					level.player.x = e.x;
					level.player.y = e.y;
				}
			})
		}
		if (map.beings) {
			map.beings.forEach(b => {
				const being = new Being();
				being.init(level.game, level, b.race, b.levelModifier ?? map.levelModifier ?? 0);
				level.addBeing(being, b.x, b.y);
				being.setIntent(b.intent || 'RANDOM');
				being.eventId = b.eventId;
			})
		}
		if (map.items) {
			map.items.forEach(i => {
				const item = new Item();
				item.init(i.item);
				level.addItem(item, i.x, i.y);
			})
		}
		if (map.townLocations) {
			map.townLocations = Random.shuffle(map.townLocations);
			const exits = [
				'sanFelipe', 'predrerio', 'fosolargo', 'elCamellal', 'ortigas'
			];
			exits.forEach((e: string, i: number) => {
				const townLoc = map.townLocations[i];
				// level.addExit(townLoc.x, townLoc.y, e, TilesData.getById('OW_TOWN'));
			});
		}
	},
}