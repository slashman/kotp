/**
 * Represents an inanimate object that can be picked up by
 * the player and droped into the level.
 * 
 * @param {*} def ItemDefinition describing the attributes of a particular type of item.
 */

import ItemsData from "../data/Items.data";
import Loc from "../loc/Loc";
const circular = require('circular-functions');

export default class Item {
	_c: any;

	def: any;
	defId: string;
	x: number;
	y: number;
	constructor () {
		this._c =  circular.register('Item');
	}
	
	init (def: any) {
		this.def = def;
		this.defId = def.id;
	}

	getName (): string {
		return Loc.loc(this.def.name);
	}
}

circular.registerClass('Item', Item, {
	transients: {
		def: true
	},
	reviver(object: Item) {
		object.def = ItemsData[object.defId];
	}
});
