import Loc from "../loc/Loc";
import Item from "../model/Item.class";
import ItemsData from "./Items.data";

const races = {
	ROSITA: {
		name: 'Rosita',
		tilesetData: '1-0',
		interact: (game) => {
			game.player.petRosita();
			return true;
		}
	},
	MULE: {
		name: 'animal.mule',
		tilesetData: '1-0',
		interact: (game) => {
			game.player.petRosita();
			return true;
		}
	},
	TOWNSMAN: {
		name: 'npc.townsman',
		tilesetData: {
			up: ['1-14', '6-14'],
			down: ['0-14', '5-14'],
			left: ['2-14', '3-14'],
			right: ['4-14', '7-14']
		},
		hp: 15,
		isPeaceful: false,
		dialogs: ['dialog.npc.1'],
		unique: false
	},
	T2: {
		name: 'npc.townsman',
		tilesetData: '10-0',
		dialogs: ['dialog.npc.2'],
		unique: false
	},
	T3: {
		name: 'npc.townsman',
		tilesetData: '10-0',
		dialogs: ['dialog.npc.3'],
		unique: false
	},
	T4: {
		name: 'npc.townsman',
		tilesetData: '10-0',
		dialogs: ['dialog.npc.4'],
		unique: false
	},
	DANIEL: {
		name: 'Daniel',
		tileset: 'slashie',
		tilesetData: '0-6',
		dialogs: ['dialog.daniel'],
		unique: true
	},
	DANIEL_SON: {
		name: 'Alejandro',
		tileset: 'slashie',
		tilesetData: '1-6',
		dialogs: ['dialog.alejandro'],
		chaseRaceId: 'DANIEL',
		isPeaceful: true,
		unique: true
	},
	DOG: {
		name: 'animal.dog',
		tilesetData: '2-0',
		interact: (game) => {
			game.player.petDog();
			return true;
		},
		isPeaceful: true,
	},
	CAT: {
		name: 'animal.cat',
		tilesetData: '3-0',
		dialogs: ['dialog.cat'],
		isPeaceful: true,
	},
	CHICKEN: {
		name: 'animal.chicken',
		tilesetData: '4-0',
		dialogs: ['dialog.chicken'],
		isPeaceful: true,
	},
	CHICK: {
		name: 'animal.chick',
		tilesetData: '5-0',
		dialogs: ['dialog.chick'],
		chaseRaceId: 'CHICKEN',
		isPeaceful: true,
	},
	BUYER: {
		name: 'npc.merchant',
		tilesetData: '13-0',
		interact: (game) => {
			const tradeFn = () => {
				game.display.showDialog(Loc.loc('dialog.merchant'), () => {
					const inventory = [
						ItemsData.AGUAPANELA,
						ItemsData.AGUARDIENTE,
						ItemsData.AREPA,
						ItemsData.BANDAGE,
						ItemsData.CHOCOLATE,
						ItemsData.COFFEE
					];
					game.input.mode = 'INVENTORY';
					game.display.displayStore(inventory);
				});
			}
			const valuables = game.player.items.filter((i: Item) => i.def.treasure);
			const valuableValue = valuables.reduce((a: number, c: Item) => a + c.def.goldValue, 0);
			if (valuableValue > 0) {
				game.input.prompt(Loc.loc("dialog.merchant.offer", valuableValue),
				(yes: boolean) => {
					if (yes) {
						valuables.forEach((i: Item) => {
							game.player.removeItem(i);
						});
						game.player.addMoney(valuableValue);
						game.display.showDialog(Loc.loc("dialog.merchant.sold"), () => tradeFn());
					} else {
						tradeFn();
					}
				});
			} else {
				tradeFn();
			}
			return true;
		}
	},
	BLACKSMITH: {
		name: 'Ananias',
		unique: true,
		tilesetData: '14-0',
		interact: (game) => {
			if (game.player.macheteLevel > 5) {
				game.display.showDialog(Loc.loc("dialog.blacksmith.cap"));
				return true;
			}
			const upgradeCost = game.player.macheteLevel * 100;
			if (game.player.money < upgradeCost) {
				game.display.showDialog(Loc.loc("dialog.blacksmith.noMoney", upgradeCost));
				return true;
			}
			game.input.prompt(Loc.loc("dialog.blacksmith.offer", upgradeCost),
				(yes: boolean) => {
					if (yes) {
						game.player.spendMoney(upgradeCost);
						game.player.macheteLevel++;
						game.display.showDialog(Loc.loc("dialog.blacksmith.upgraded"));
					} else {
						game.display.showDialog(Loc.loc("dialog.blacksmith.cancelled"));
					}
					game.player.endTurn();
				}
			);
			return false;
		}
	},
	ADRIANA: {
		name: 'Adriana',
		unique: true,
		tilesetData: '11-0',
		interact: (game) => {
			if (game.player.carrielLevel > 2) {
				game.display.showDialog(Loc.loc('dialog.artisan.cap'));
				return true;
			}
			const upgradeCost = game.player.carrielLevel * 100;
			if (game.player.money < upgradeCost) {
				game.display.showDialog(Loc.loc('dialog.artisan.noMoney', upgradeCost));
				return true;
			}
			game.input.prompt(Loc.loc("dialog.artisan.offer", upgradeCost),
				(yes: boolean) => {
					if (yes) {
						game.player.spendMoney(upgradeCost);
						game.player.carrielLevel++;
						game.display.showDialog(Loc.loc("dialog.artisan.upgraded"));
					} else {
						game.display.showDialog(Loc.loc("dialog.artisan.cancelled"));
					}
					game.player.endTurn();
				}
			);
			return false;
		}
	},
	TIBERIO: {
		name: 'Tiberio',
		unique: true,
		tilesetData: '15-0',
		interact: (game) => {
			if (game.player.ruanaLevel > 5) {
				game.display.showDialog(Loc.loc('dialog.tailor.cap'));
				return true;
			}
			const upgradeCost = game.player.ruanaLevel * 110;
			if (game.player.money < upgradeCost) {
				game.display.showDialog(Loc.loc('dialog.tailor.noMoney', upgradeCost));
				return true;
			}
			game.input.prompt(Loc.loc('dialog.tailor.offer', upgradeCost),
				(yes: boolean) => {
					if (yes) {
						game.player.spendMoney(upgradeCost);
						game.player.ruanaLevel++;
						game.display.showDialog(Loc.loc('dialog.tailor.upgraded'));
					} else {
						game.display.showDialog(Loc.loc('dialog.tailor.cancelled'));
					}
					game.player.endTurn();
				}
			);
			return false;
		}
	},
	HILARIO: {
		name: 'Hilario',
		unique: true,
		tilesetData: '12-0',
		interact: (game) => {
			const guaroCost = Math.round(ItemsData.AGUARDIENTE.goldValue * 0.75);
			if (game.player.money < guaroCost) {
				game.display.showDialog(Loc.loc('dialog.distillery.noMoney', guaroCost));
				return true;
			}
			if (!game.player.canPick()) {
				game.display.showDialog(Loc.loc('dialog.distillery.burdened'));
				return true;
			}
			
			game.input.prompt(Loc.loc('dialog.distillery.offer', guaroCost),
				(yes: boolean) => {
					if (yes) {
						game.player.spendMoney(guaroCost);
						const guaro = new Item();
						guaro.init(ItemsData.AGUARDIENTE);
						game.player.addItem(guaro);
						game.display.showDialog(Loc.loc('dialog.distillery.bought'));
					} else {
						game.display.showDialog(Loc.loc('dialog.distillery.cancelled'));
					}
					game.player.endTurn();
				}
			);
			return false;
		}
	},
	FELIPE: {
		name: 'Felipe',
		unique: true,
		tilesetData: '6-0',
		interact: (game) => {
			if (game.player.holyMachete) {
				game.display.showDialog(Loc.loc('dialog.priest.blessed'));
				return true;
			}
			const codex = game.player.items.find(i => i.def === ItemsData.CODEX);
			const holyWater = game.player.items.find(i => i.def === ItemsData.HOLY_WATER);
			if (!codex || !holyWater) {
				game.display.showDialog(Loc.loc('dialog.priest.prompt'));
				return true;
			}
			game.player.holyMachete = true;
			game.player.removeItem(codex);
			game.player.removeItem(holyWater);
			game.display.showDialogs([
				'dialog.priest.1',
				'dialog.priest.2',
				'dialog.priest.3',
				'dialog.priest.4',
				'dialog.priest.5',
				'dialog.priest.6',
				'dialog.priest.7',
				'dialog.priest.8',
				'dialog.priest.9'
			]);
			return false;
		}
	},
	DIABLO: { name: "El diablo", tileset: "32x", tilesetData: "0-0", hp: 250, attack: 20, defense: 11, speed: 20, attackSFX: "",
		unique: true,
		isLordOfHell: true,
		onKill: (game) => {
			game.player.dead = true;
			game.display.hide();
		}
	},

	// TODO: Update sheet
	MADREMONTE: { name: "La Madremonte", unique: true, tileset: "24x", tilesetData: "4-1", hp: 75, attack: 5, defense: 17, speed: 10, attackSFX: "" },
	PATASOLA: { name: "La Patasola", unique: true, tileset: "24x", tilesetData: "5-1", hp: 50, attack: 15, defense: 11, speed: 20, attackSFX: "" },
	SOMBRERON: { name: "El sombreron", unique: true, tileset: "24x", tilesetData: "7-1", hp: 150, attack: 10, defense: 11, speed: 20, attackSFX: "" },
	BRACAMONTE: { name: "El bracamonte", unique: true, tileset: "24x", tilesetData: "6-1", hp: 100, attack: 20, defense: 17, speed: 10, attackSFX: "" },

	VISAGE: { name: "monster.visage", tileset: "main", tilesetData: "5-1", hp: 15, attack: 1, defense: 3, speed: 10, attackSFX: "" },
	BAT: { name: "monster.bat", tileset: "main", tilesetData: "4-1", hp: 5, attack: 1, defense: 3, speed: 30, attackSFX: "" },
	GOBLIN: { name: "monster.goblin", tileset: "main", tilesetData: "3-1", hp: 5, attack: 3, defense: 3, speed: 10, attackSFX: "vo_goblin_attack_01,vo_goblin_attack_02,vo_goblin_attack_03,vo_goblin_attack_04,vo_goblin_attack_05" },
	MONKEY: { name: "monster.monkey", tileset: "main", tilesetData: "2-1", hp: 10, attack: 1, defense: 2, speed: 30, attackSFX: "" },
	CAIMAN: { name: "monster.caiman", tileset: "main", tilesetData: "12-2", hp: 15, attack: 2, defense: 3, speed: 10, attackSFX: "" },
	PUMA: { name: "monster.puma", tileset: "main", tilesetData: "1-1", hp: 10, attack: 2, defense: 2, speed: 30, attackSFX: "" },
	JAGUAR: { name: "monster.jaguar", tileset: "main", tilesetData: "0-1", hp: 10, attack: 2, defense: 3, speed: 30, attackSFX: "" },
	CROCODILE: { name: "monster.crocodile", tileset: "main", tilesetData: "12-1", hp: 10, attack: 3, defense: 4, speed: 10, attackSFX: "" },
}

Object.keys(races).forEach(k => races[k].id = k);

export default races;