import { AnimatedSprite, Texture } from "pixi.js";
import Loc from "../loc/Loc";
import Random from "../Random";
import Being from "./Being.class";
import Item from "./Item.class";
import IPosition from "./Position";
import Stat from "./Stat.class";

const circular = require('circular-functions');

/**
 * Object that contains the state of the player, as well as functions for it
 * to interact with the world.
 * 
 * Contains the player inventory and functions to grab and drop.
 * 
 * Contains the player memory (tiles he has seen previously per level)
 * 
 * Contains the field of view logic using simple raycasting.
 */

const MAX_SIGHT_RANGE = 11;

export default class Player {
	_c: any;
	private game: any;

	x: number;
	y: number;
	dead: boolean;

	private visible: boolean[][];
	private items: Item[];
	private money: number;
	private macheteLevel: number;
	private ruanaLevel: number;
	private carrielLevel: number;
	hp: Stat;
	drunkness: Stat;
	private guts: Stat;
	private holyMachete: boolean;
	

	lastMoveDir: IPosition;
	private lastAction: 'move'|'attack';
	

	// Used to return on death
	lastRespawn: string;
	// Escape Prayer
	private escapeTurns: number;
	private currentDungeonEntranceId: string;
	// Onboarding flags
	private hasPickedTreasure: boolean;
	private advisedToWarp: boolean;
	combatOnboarded: boolean;
	fireWarpAdvise: boolean;

	constructor () {
		this.visible = [];
		this.items = [];
		this.money = 50;
		this.macheteLevel = 1;
		this.ruanaLevel = 1;
		this.carrielLevel = 1;
		this.lastMoveDir = { x: 0, y: 1, _c: circular.setSafe()};
		this.hp = new Stat(5);
		this.drunkness = new Stat(5);
		this.guts = new Stat(50);
		this._c = circular.register('Player');

		this.partyMembers = [
			new PartyMember(50, 30),
			new PartyMember(80, 40),
			new PartyMember(20, 80)
		]
	}
	private upTextures: Texture[];
	private downTextures: Texture[];
	private leftTextures: Texture[];
	private rightTextures: Texture[];
	sprite: AnimatedSprite;
	init (game: any) {
		this.game = game;
		for (var j = -MAX_SIGHT_RANGE; j <= MAX_SIGHT_RANGE; j++){
			this.visible[j] = [];
		}
		this.upTextures = game.display.getTextures('main', ['1-13', '6-13']);
		this.downTextures = game.display.getTextures('main', ['0-13', '5-13']);
		this.leftTextures = game.display.getTextures('main', ['2-13', '3-13']);
		this.rightTextures = game.display.getTextures('main', ['4-13', '7-13']);
		this.sprite = game.display.createAnimatedSprite(true, this.downTextures);
		this.updateSprite(0, 1);
	}
	addMoney (howMuch: number) {
		this.money += howMuch;
	}
	spendMoney (howMuch: number) {
		this.money -= howMuch;
		if (this.money < 0) {
			this.money = 0;
		}
	}
	interactWithItem (item: Item, x: number, y: number): boolean {
		if (item.def.interact) {
			item.def.interact(this.game, item);
			return true;
		}
		return this.tryPickup(item, x, y);
	}
	async interactWithBeing (being: Being, dx: number, dy: number) {
		if (being.race.interact) {
			return being.race.interact(this.game);
		} else if (being.race.dialogs) {
			if (being.defeated) {
				return false;
			}
			being.currentMessage++;
			if (being.currentMessage >= being.race.dialogs.length) {
				being.currentMessage = 0;
			}
			this.game.display.showDialog(
				`${Loc.loc("dialog.says", being.getName())}\n${Loc.loc(being.race.dialogs[being.currentMessage])}`,
				() => being.afterDialog()
			);
			return true;
		} else {
			//this.game.display.updatePlayerSprite();
			await this.game.display.springPlayer(dx, dy, async () => await this.attack(being));
			return true;
		}
	}
	passTurn () {
		this.endTurn();
	}
	async tryMove (dir: IPosition) {
		this.lastAction = 'move';
		//if (this.lastMoveDir.x != dir.x || this.lastMoveDir.y != dir.y) {
			this.updateSprite(dir.x, dir.y);
		//}
		this.sprite.play();
		this.lastMoveDir.x = dir.x;
		this.lastMoveDir.y = dir.y;
		const being = this.game.world.level.getBeing(this.x + dir.x, this.y + dir.y);
		if (being) {
			this.sprite.gotoAndStop(0);
			const interacted = await this.interactWithBeing(being, dir.x, dir.y);
			if (interacted) {
				if (this.game.input.mode === 'MOVEMENT') {
					this.endTurn();
				}
				return;
			}
		}
		const item = this.game.world.level.getItem(this.x + dir.x, this.y + dir.y);
		if (item) {
			const interacted = this.interactWithItem(item, this.x + dir.x, this.y + dir.y);
			if (interacted) {
				this.endTurn();
				return;
			} else {
				return;
			}
		}
		const tile = this.game.world.level.getTile(this.x + dir.x, this.y + dir.y);
		if (tile?.interact) {
			tile.interact(this.game);
			this.endTurn();
			return;
		}

		if (!this.game.world.level.canWalkTo(this.x+dir.x, this.y+dir.y)){
			this.endTurn();
			return;
		}
		//this.game.audio.playSfx('fs_grass_01,fs_grass_02,fs_grass_03,fs_grass_04,fs_grass_05,fs_grass_06');
		await this.game.display.scroll(dir.x, dir.y, 300);
		this.sprite.gotoAndStop(0);
		this.x += dir.x;
		this.y += dir.y;
		this.land();
	}
	private updateSprite(dx: number, dy: number): void {
		let textures = this.downTextures;
		if (dy === 1) {
			textures = this.downTextures;
		} else if (dy === -1) {
			textures = this.upTextures;
		} else if (dx === -1) {
			textures = this.leftTextures;
		} else {
			textures = this.rightTextures;
		}
		this.sprite.textures = textures;
	}
	tryBuy (itemDef: any) {
		if (itemDef.goldValue > this.money) {
			this.game.display.showDialog(Loc.loc("dialog.merchant.noMoney"), () => {
				this.game.input.mode = 'INVENTORY';
			});
		} else if (!this.canPick()) {
			this.game.display.showDialog(Loc.loc("dialog.merchant.burdened"), () => {
				this.game.input.mode = 'INVENTORY';
			});
		} else {
			this.spendMoney (itemDef.goldValue);
			const newItem = new Item();
			newItem.init(itemDef);
			this.addItem(newItem);
			this.game.display.showItemInfo(itemDef, true)
		}
	}
	getMacheteDamage() {
		return Math.floor(15 * (1 + (this.macheteLevel-1) * 0.25));
	}
	async attack (enemy: Being) {
		this.lastAction = 'attack';
		if (enemy.race.isLordOfHell && !this.holyMachete) {
			this.game.display.showFloatingText(enemy.x, enemy.y, `Ha!`, 0xffffff);
			return;
		}
		const maxDamage = this.getMacheteDamage();
		const crit = Random.n(0, 100) < 15;
		let damage = Random.n(Math.floor(maxDamage / 2), maxDamage);
		if (crit) {
			damage *= 2;
		}
		if (this.guts.current <= 0) {
			damage = 1;
		}
		this.guts.spend(1);
		if (enemy.checkEvade(this.holyMachete)) {
			// TODO: "Miss" SFX?
			this.game.display.showFloatingText(enemy.x, enemy.y, `Miss`, 0xffffff);
			await enemy.tryDodge();
		} else {
			enemy.damage(damage);
			this.game.audio.playSfx('sfx_player_attack_01,sfx_player_attack_02,sfx_player_attack_03,sfx_player_attack_04,sfx_player_attack_05');
			this.game.display.showFloatingText(enemy.x, enemy.y, `-${damage}${crit?"!":""}`, 0xff0000);
		}
	}
	land () {
		if (this.game.world.level.exits[this.x] && this.game.world.level.exits[this.x][this.y]){
			const exit = this.game.world.level.exits[this.x][this.y];
			if (this.game.world.level.id === 'overworld') {
				this.currentDungeonEntranceId = exit;
			}
			this.game.world.loadLevel(exit);
			this.updateFOV();
			this.game.display.refresh();
			this.game.input.inputEnabled = true;
			return;
		}
		this.endTurn();
	}
	startEscape(): void{
		if (this.game.world.level.safe)
			return;
		this.escapeTurns = Random.n(10, 15);
	}
	escape(): void{
		this.escapeTurns = -1;
		if (this.game.world.level.safe)
			return;
		this.game.display.showDialog(Loc.loc("action.use.prayer.escaped"));
		this.game.audio.playSfx("sfx_escape_prayer");
		this.game.world.loadLevel('overworld', this.currentDungeonEntranceId);
	}
	async endTurn () {
		if (this.escapeTurns > 0) {
			this.escapeTurns--;
			if (this.escapeTurns == 0) {
				this.escape();
			}
		}
		this.updateFOV();
		this.game.display.refresh();
		this.sprite.gotoAndStop(0);
		await this.game.world.level.beingsTurn();
	}
	canSee (dx: number, dy: number, physically?: boolean) {
		if (physically) {
			if (dx <= -this.game.display.semiViewportCountX || dx >= this.game.display.semiViewportCountX ||
				dy <= -this.game.display.semiViewportCountY || dy >= this.game.display.semiViewportCountY) {
					return false;
			}
		}
		try {
			return this.visible[dx][dy] === true;
		} catch(err) {
			// Catch OOB
			return false; 
		}
	}
	getSightRange () {
		return MAX_SIGHT_RANGE;
	}
	updateFOV () {
		/*
		 * This function uses simple raycasting, 
		 * use something better for longer ranges
		 * or increased performance
		 */
		for (var j = -MAX_SIGHT_RANGE; j <= MAX_SIGHT_RANGE; j++)
			for (var i = -MAX_SIGHT_RANGE; i <= MAX_SIGHT_RANGE; i++)
				this.visible[i][j] = false;
		var step = Math.PI * 2.0 / 1080;
		for (var a = 0; a < Math.PI * 2; a += step)
			this.shootRay(a);
	}
	private shootRay (a: number): void {
		var step = 0.3333;
		var maxdist = this.getSightRange() < MAX_SIGHT_RANGE ? this.getSightRange() : MAX_SIGHT_RANGE;
		maxdist /= step;
		var dx = Math.cos(a) * step;
		var dy = -Math.sin(a) * step;
		var xx = this.x, yy = this.y;
		for (var i = 0; i < maxdist; ++i) {
			var testx = Math.round(xx);
			var testy = Math.round(yy);
			this.visible[testx-this.x][testy-this.y] = true;
			try { 
				if (this.game.world.level.map[testx][testy].opaque && !(testx == this.x && testy == this.y))
					return;
			} catch(err) {
				// Catch OOB
				return; 
			}
			xx += dx; yy += dy;
		}
	}
	canPick (): boolean {
		return this.items.length < this.getCarryCapacity() - 1;
	}
	getCarryCapacity (): number {
		return this.carrielLevel * 8;
	}
	addItem (item: Item): void {
		if (this.items.length === 24){
			return;
		}
		this.items.push(item);
	}
	removeItem (item: Item): void {
		this.items.splice(this.items.indexOf(item), 1);
	}
	tryPickup (item: Item, x: number, y: number): boolean {
		if (!this.canPick()){
			if (this.game.display.isMobile()) {
				this.game.display.showDialog(Loc.loc('action.pick.cant.mobile', item.getName()));
			} else {
				this.game.display.showDialog(Loc.loc('action.pick.cant.desktop', item.getName()));
			}
			return true;
		} else {
			this.game.world.level.removeItem(x, y);
			this.addItem(item);
			if (this.hasPickedTreasure || !item.def.treasure) {
				this.game.display.showDialog(Loc.loc('action.pick', item.getName()), () => {this.endTurn();});
			} else {
				this.hasPickedTreasure = true;
				this.game.display.showDialogs(Loc.locAll(
					[
						"action.pick.first.1",
						"action.pick.first.2",
						"action.pick.first.3",
						"action.pick.first.4",
						"action.pick.first.5",
					], item.getName()), () => {
						this.endTurn();
					});
			}
			return false;
		}
	}
	tryDrop(item: Item): boolean {
		if (item.def.fixed) {
			this.game.display.showDialog(Loc.loc("action.drop.not"));
			return false;
		}

		var underItem = this.game.world.level.items[this.x] && this.game.world.level.items[this.x][this.y];
		if (underItem){
			this.game.display.showDialog(Loc.loc("action.drop.cannot", item.getName()));
		} else {
			this.game.world.level.addItem(item, this.x, this.y);
			this.removeItem(item);
			this.game.display.showDialog(Loc.loc("action.drop", item.getName()), () => {
				this.endTurn();
			});
		}
		return false;
	}
	tryUse (item: Item, dx: number, dy: number): void {
		if (item.def.useFunction) {
			item.def.useFunction(this.game, () => { this.endTurn(); }, item, dx, dy);
			if (!item.def.infinite) {
				this.removeItem(item);
			}
			return;
		} else {
			this.game.display.showDialog(Loc.loc("action.use.how"));
		}
	}
	checkEvade (): boolean {
		return Random.n(0, 100) <= this.getEvadeChance();
	}
	getEvadeChance(): number {
		return this.ruanaLevel * 10;
	}
	async damage (damage: number): Promise<void> {
		if (this.guts.current <= 0 || Random.n(0, 100) < 5) {
			this.game.audio.playSfx('sfx_player_hurt_01,sfx_player_hurt_02,sfx_player_hurt_03');
			this.hp.spend(1);
			this.game.display.showFloatingText(this.x, this.y, `-1`, 0xff0000);
			if (this.hp.current <= 0) {
				this.die();
			}
		}  else {
			// TODO: "Dodge" Sound Effect?
			this.guts.spend(damage);
			if (this.lastAction === 'attack') {
				const dx = Random.n(-1,1);
				const dy = Random.n(-1,1);
				const tx = this.x + dx;
				const ty = this.y + dy;
				if (this.game.world.level.canWalkTo(tx, ty)) {
					await this.game.display.scroll(dx, dy, 200);
					this.x = tx;
					this.y = ty;
					this.updateFOV();
					this.game.display.refresh();
				}
			}
			this.game.display.showFloatingText(this.x, this.y, `-${damage}`, 0xff00ff);
			if (this.guts.current < 20 && !this.advisedToWarp) {
				this.advisedToWarp = true;
				this.fireWarpAdvise = true;
			}
		}
	}
	die (): void {
		this.game.audio.playSfx("sfx_gameover");
		this.escapeTurns = -1;
		this.game.world.loadLevel(this.lastRespawn, 'overworld');
		this.game.display.showDialogs(Loc.locAll(["fainted.1", "fainted.2", "fainted.3"]));
		this.hp.recoverAll();
		this.drunkness.recoverAll();
		this.guts.current = 25;
		this.money = 0;
		this.items = [];
	}
	petDog (): void {
		this.game.display.showDialog(Loc.loc("dialog.petDog"));
		this.game.audio.playSfx('sfx_dog_bark_01,sfx_dog_bark_02,sfx_dog_bark_03,sfx_dog_bark_04');
	}
	petRosita (): void {
		this.game.display.showDialog(Loc.loc("dialog.petRosita"));
	}

	partyMembers: PartyMember[];
}

class PartyMember {
	hp: Stat;
	mp: Stat;
	constructor (maxHP: number, maxMP: number) {
		this.hp = new Stat(maxHP);
		this.mp = new Stat(maxMP);
	}
}

circular.registerClass('Player', Player, 
	{
		transients: {
			visible: true
		},
		reviver (object: any) {
			object.visible = [];
			for (var j = -MAX_SIGHT_RANGE; j <= MAX_SIGHT_RANGE; j++){
				object.visible[j] = [];
			}
		}
		
	}
);