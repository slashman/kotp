function ItemPopulator(config){
	this.config = config;
}

var Util = require('./Utils');

ItemPopulator.prototype = {
	populateLevel: function(specs, level, uniqueRegistry){
		this.uniqueRegistry = uniqueRegistry;
		this.calculateRarities(specs.items);
		const items = specs.itemsQuantity + Util.rand(1,2);
		for (let i = 0; i < items; i++){
			const item = this.getAnItem();
			const position = level.getFreePlaceOnLevel(false, true);
			if (position){
				level.addItem(item, position.x, position.y);
			}
		}
	},
	calculateRarities: function(items){
		this.thresholds = [];
		this.generationChanceTotal = 0;
		for (let i = 0; i < items.length; i++){
			const item = items[i];
			if (!item.rarity) throw new Error ("Item " + item.name + " has no rarity");
			this.generationChanceTotal += item.rarity;
			this.thresholds.push({threshold: this.generationChanceTotal, item: item});
		}
	},
	getAnItem: function(){
		var number = Util.rand(0, this.generationChanceTotal);
		for (var i = 0; i < this.thresholds.length; i++){
			if (number <= this.thresholds[i].threshold){
				if (this.uniqueRegistry && this.thresholds[i].item.unique) {
					if (this.uniqueRegistry[this.thresholds[i].item.code]){
						i = 0;
						number = Util.rand(0, this.generationChanceTotal);
						continue
					} else {
						this.uniqueRegistry[this.thresholds[i].item.code] = true;
					}
				}
				return this.thresholds[i].item;
			}
		}
		return this.thresholds[0].item;
	}
}

module.exports = ItemPopulator;