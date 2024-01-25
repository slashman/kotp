/**
 * Represent an area of the World, connected to others via stairs
 * 
 * Contains Beings, Items and exits.
 * Controls the order of interaction of all beings and the player.
 * 
 */

import TilesData from "../data/Tiles.data";
import Loc from "../loc/Loc";
import Being from "./Being.class";
import Item from "./Item.class";
import Player from "./Player";
import IPosition from "./Position";

const circular = require('circular-functions');

export default class Level {
	_c: any;
	__serialData: any;

	map: any[];
	name: string;
	music: string;
	ambience: string;
	onEnter: string[];
	enterSFX: string;
	safe: boolean;
	respawn: boolean;
	persistent: boolean;
	private beings: Being[][];
	private exits: string[][];
	private items: Item[][];
	
	private beingsList: Being[];
	private exitsList: { levelId: string, x: number, y: number, _c: any} [];
	private entrance: IPosition;
	game: any;
	id: string;
	player: Player;

	constructor () {
		this._c =  circular.register('Level');
	}

	init (game: any, id: string) {
		this.map = [];
		this.beings = [];
		this.beingsList = [];
		this.exits = [];
		this.exitsList = [];
		this.items = [];

		this.game = game;
		this.id = id;
		this.player = game.player;
	}

	setEntrance(x: number, y: number) {
		this.entrance = {
			x, y, _c: circular.setSafe()
		}
	}

	getEntrance (): IPosition{
		return this.entrance;
	}

	async beingsTurn () {
		this.game.input.inputEnabled = false;
		for (var i = 0; i < this.beingsList.length; i++){
			await this.beingsList[i].act();
		}
		this.player.updateFOV();
		this.game.display.refresh();
		if (!this.player.dead) {
			this.game.input.inputEnabled = true;
			if (this.player.fireWarpAdvise) {
				this.player.fireWarpAdvise = false;
				this.game.display.showDialogs(Loc.locAll([
					'dialog.guts.1',
					'dialog.guts.2',
					'dialog.guts.3',
					'dialog.guts.4',
					'dialog.guts.5',
					'dialog.guts.6'
				]));
			} else {
				this.game.input.processQueuedMovement();
			}
		}
	}

	addBeing (being: Being, x: number, y: number) {
		this.beingsList.push(being);
		being.placeOn(x, y);
		if (!this.beings[x])
			this.beings[x] = [];
		this.beings[x][y] = being;
	}

	canWalkTo (x: number, y: number) {
		try {
			if (this.map[x][y].solid){
				return false;
			}
		} catch (e){
			// Catch OOB
			return false;
		}
		if (this.beings[x] && this.beings[x][y]){
			return false;
		}
		if (this.player && this.player.x === x && this.player.y === y)
			return false;
		return true;
	}

	getBeing (x: number, y: number): Being {
		return this.beings[x] ? this.beings[x][y] : null;
	}

	getTile (x: number, y: number): any {
		return this.map[x] ? this.map[x][y] : null;
	}

	addExit (x: number, y: number, levelId: string, tile?: any) {
		if (tile) {
			if (!this.map[x])
				this.map[x] = [];
			this.map[x][y] = tile;
		}
		if (!this.exits[x])
			this.exits[x] = [];
		this.exits[x][y] = levelId;
		this.exitsList.push({
			levelId,
			x,
			y,
			_c: circular.setSafe()
		});
	}

	getExitFor (levelId: string): IPosition {
		return this.exitsList.find(e => e.levelId === levelId);
	}

	addItem (item: Item, x: number, y: number) {
		if (!this.items[x])
			this.items[x] = [];
		this.items[x][y] = item;
		item.x = x;
		item.y = y;
	}

	getItem (x: number, y: number) {
		if (!this.items[x])
			return false;
		return this.items[x][y];
	}

	removeItem (x: number, y: number) {
		if (!this.items[x])
			this.items[x] = [];
		this.items[x][y] = null;
	}

	moveBeing (being: Being, dx: number, dy: number) {
		if (!this.beings[being.x])
			this.beings[being.x] = [];
		this.beings[being.x][being.y] = null;
		if (!this.beings[being.x + dx])
			this.beings[being.x + dx] = [];
		this.beings[being.x + dx][being.y + dy] = being;
	}

	removeBeing (being: Being) {
		this.beingsList.splice(this.beingsList.indexOf(being), 1);
		if (!this.beings[being.x])
			this.beings[being.x] = [];
		this.beings[being.x][being.y] = null;
	}

	relocateBeingsAfterDeserialization () {
		this.beings = [];
		this.beingsList.forEach(being => {
			if (!this.beings[being.x])
				this.beings[being.x] = [];
			this.beings[being.x][being.y] = being;
		});
	}

	getBeingsByRaceId (raceId: string): Being[] {
		return this.beingsList.filter(b => b.race.id === raceId);
	}
}

circular.registerClass('Level', Level,
	{
		transients: {
			map: true,
			beings: true
		},
		reviver(object: Level) {
			const cellIds = object.__serialData.cellIds;
			object.map = [];
			for (let x = 0; x < cellIds.length; x++) {
				object.map[x] = cellIds[x].map(cellId => TilesData.getById(cellId));
			}
			object.relocateBeingsAfterDeserialization();
		},
		prepare(object: Level) {
			const cellIds = [];
			for (let x = 0; x < object.map.length; x++) {
				cellIds[x] = object.map[x].map(tile => tile.id);
			}
			return {
				cellIds
			}
		}
	}
);
