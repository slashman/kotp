// Use `interact` to display info about things on bump

import Loc from "../loc/Loc";

const items =  {
	MACHETE: {
		name: 'items.machete',
		tilesetData: '19-0',
		description: 'items.machete.description',
		rarity: 100,
		goldValue: 150,
		infinite: true,
		fixed: true,
		useFunction: (game, endTurn, item, dx, dy) => {
			game.display.showDialog(Loc.loc("action.use.machete"), endTurn);
		}
	},
	RUANA: {
		name: 'items.ruana',
		tilesetData: '21-0',
		description: 'items.ruana.description',
		rarity: 100,
		goldValue: 150,
		infinite: true,
		fixed: true,
		useFunction: (game, endTurn, item, dx, dy) => {
			game.display.showDialog(Loc.loc("action.use.ruana"), endTurn);
		}
	},
	CARRIEL: {
		name: 'items.carriel',
		tilesetData: '20-0',
		description: 'items.carriel.description',
		rarity: 100,
		goldValue: 150,
		infinite: true,
		fixed: true,
		useFunction: (game, endTurn, item, dx, dy) => {
			game.display.showDialog(Loc.loc("action.use.carriel"), endTurn);
		}
	},
	COIN: {
		name: 'items.money',
		tilesetData: '30-0',
		description: 'items.money.description',
		rarity: 100,
		goldValue: 10,
		fixed: true,
		useFunction: (game, endTurn, item, dx, dy) => {
			game.display.showDialog(Loc.loc("action.use.money")); // No endTurn
		}
	},


	AGUARDIENTE: {
		name: 'items.aguardiente',
		tilesetData: '25-0',
		rarity: 100,
		effectDescription: 'items.aguardiente.effect',
		description: 'items.aguardiente.description',
		goldValue: 30,
		useFunction: (game, endTurn, item, dx, dy) => {
			game.player.guts.recover(30);
			game.player.drunkness.spend(1);
			let drunkMessage;
			switch (game.player.drunkness.current) {
				case 4:
					drunkMessage = Loc.loc('action.use.guaro.1');
					break;
				case 3:
					drunkMessage = Loc.loc('action.use.guaro.2');
					break;
				case 2:
					drunkMessage = Loc.loc('action.use.guaro.3');
					break;
				case 1:
					drunkMessage = Loc.loc('action.use.guaro.4');
					break;
				case 0:
					drunkMessage = Loc.loc('action.use.guaro.5');
					break;
			}
			if (game.player.hp.current > 1 && game.player.drunkness.current === 0) {
				game.player.hp.spend(1);
			}
			game.display.showDialog(`${drunkMessage} ${Loc.loc('action.use.guaro')}`, endTurn);
			game.audio.playSfx('sfx_drink_guaro');
		}
	},
	COFFEE: {
		name: 'items.coffee',
		tilesetData: '26-0',
		rarity: 50,
		goldValue: 20,
		effectDescription: 'items.coffee.effect',
		description: 'items.coffee.description',
		useFunction: (game, endTurn, item, dx, dy) => {
			const player = game.player;
			player.guts.recover(15);
			game.display.showDialog(Loc.loc("action.use.coffee"), endTurn);
			game.audio.playSfx('sfx_drink_guaro');
		}
	},
	AGUAPANELA: {
		name: 'items.aguapanela',
		tilesetData: '32-0',
		rarity: 200,
		goldValue: 20,
		effectDescription: 'items.aguapanela.effect',
		description: 'items.aguapanela.description',
		useFunction: (game, endTurn, item, dx, dy) => {
			const player = game.player;
			player.guts.recover(15);
			game.display.showDialog(Loc.loc("action.use.aguapanela"), endTurn);
			game.audio.playSfx('sfx_drink_guaro');
		}
	},
	CHOCOLATE: {
		name: 'items.chocolate',
		tilesetData: '34-0',
		rarity: 100,
		goldValue: 20,
		effectDescription: 'items.chocolate.effect',
		description: 'items.chocolate.description',
		useFunction: (game, endTurn, item, dx, dy) => {
			const player = game.player;
			player.guts.recover(15);
			game.display.showDialog(Loc.loc("action.use.chocolate"), endTurn);
			game.audio.playSfx('sfx_drink_guaro');
		}
	},
	BANDAGE: {
		name: 'items.bandage',
		tilesetData: '33-0',
		rarity: 10,
		effectDescription: 'items.bandage.effect',
		description: 'items.bandage.description',
		goldValue: 70,
		useFunction: (game, endTurn, item, dx, dy) => {
			const player = game.player;
			if (player.hp.current === 5) {
				game.display.showDialog(Loc.loc("action.use.bandage.noWounds"), endTurn);
			} else {
				player.hp.recover(5);
				game.display.showDialog(Loc.loc("action.use.bandage"), endTurn);
			}
		}
	},
	ESCAPE_PRAYER: {
		name: 'items.escapePrayer',
		tilesetData: '16-1',
		rarity: 5,
		infinite: true,
		description: 'items.escapePrayer.description',
		goldValue: 100,
		useFunction: (game, endTurn, item, dx, dy) => {
			if (game.world.level.safe) {
				game.display.showDialog(Loc.loc("action.use.prayer.unheard"), endTurn);
			} else {
				game.display.showDialog(Loc.loc("action.use.prayer"), endTurn);
				game.player.startEscape();
			}
		}
	},
	AREPA: {
		name: 'items.arepa',
		tilesetData: '34-0',  // Pending
		rarity: 10,
		effectDescription: 'items.arepa.effect',
		description: 'items.arepa.description',
		goldValue: 35,
		useFunction: (game, endTurn, item, dx, dy) => {
			const player = game.player;
			player.hp.recover(2);
			game.display.showDialog(Loc.loc("action.use.arepa"), endTurn);
		}
	},
	DONGO: {
		name: 'items.dongo',
		tilesetData: '24-0',
		rarity: 200,
		effectDescription: 'items.dongo.effect',
		description: 'items.dongo.description',
		goldValue: 30,
		useFunction: (game, endTurn, item, dx, dy) => {
			const player = game.player;
			player.hp.recover(1);
			game.display.showDialog(Loc.loc("action.use.dongo"), endTurn);
		}
	},
	SHOVEL: {
		name: 'items.shovel',
		description: 'items.shovel.description',
		tilesetData: '16-0',
		rarity: 100,
		goldValue: 40,
		treasure: true
	},
	AXE: {
		name: 'items.axe',
		description: 'items.axe.description',
		tilesetData: '17-0',
		rarity: 100,
		goldValue: 40,
		treasure: true
	},
	/*CANDELABRA: {
		name: 'Candelabra',
		effectDescription: 'Trade in towns for useful items.',
		tilesetData: '30-0', // Pending
		rarity: 100,
		goldValue: 150,
		treasure: true
	},*/
	HOLY_WATER: {
		name: 'items.holyWater',
		description: 'items.holyWater.description',
		tilesetData: '28-0',
		rarity: 100,
		goldValue: 100
	},
	KNIFE: {
		name: 'items.knife',
		description: 'items.knife.description',
		tilesetData: '18-0',
		rarity: 100,
		goldValue: 40,
		treasure: true
	},
	/*ROPE: {
		name: 'Rope',
		effectDescription: 'Trade in towns for useful items.',
		tilesetData: '30-0', // Pending
		rarity: 100,
		goldValue: 100,
		treasure: true
	},*/
	CRUCIFIX: {
		name: 'items.crucifix',
		description: 'items.crucifix.description',
		tilesetData: '29-0',
		rarity: 100,
		goldValue: 100,
		treasure: true
	},
	TUNJO: {
		name: 'items.tunjo',
		description: 'items.tunjo.description',
		tilesetData: '31-0',
		rarity: 100,
		goldValue: 200,
		treasure: true
	},
	CODEX: {
		name: 'items.codex',
		description: 'items.codex.description',
		tilesetData: '35-0',
		rarity: 100,
	},
	/*TOBACCO: {
		name: 'Tobacco',
		effectDescription: 'Trade in towns for useful items.',
		tilesetData: '30-0', // Pending
		rarity: 100,
		goldValue: 100,
		treasure: true
	}*/
}

Object.keys(items).forEach(k => {
	items[k].id = k;
});

export default items;