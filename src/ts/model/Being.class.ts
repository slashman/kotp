/**
 * Represent an "alive" entity that moves around the world
 * and can be interacted with by the player.
 * 
 */

import { Sprite } from 'pixi.js';
import RacesData from '../data/Races.data';
import Loc from '../loc/Loc';
import Random from '../Random';
import Level from './Level.class';
import { PositionUtils } from './Position';
import Stat from './Stat.class';

const circular = require('circular-functions');

export default class Being {
	_c: any;
	__serialData: any;

	private game: any;
	private level: Level;
	sprite: Sprite; // TODO: When backporting to JSRL, this should be in PIXIDisplay as a map indexed by an unique beingId
	spriteOffsetX: number;
	spriteOffsetY: number;
	private tileName: string;
	
	private xPosition: number;
	private yPosition: number;
	private intent: string;
	eventId: string;
	interacted: boolean;
	race: any;
	currentMessage: number = 0;
	hp: Stat;
	aggresion: number;
	defense: number;
	evade: number;

	get x(): number {
		return this.xPosition;
	}

	get y(): number {
		return this.yPosition;
	}

	constructor () {
		this._c =  circular.register('Being');
	}
	
	init (game: any, level: Level, race: any, depthModifier: number): void{
		this.game = game;
		this.level = level;
		const tileset = race.tileset || 'main';
		this.sprite = game.display.createSprite(tileset, race.tilesetData);
		this.sprite.visible = false;
		this.spriteOffsetX = game.display.tilesets[tileset].offsetX;
		this.spriteOffsetY = game.display.tilesets[tileset].offsetY;
		this.tileName = race.name;
		this.race = race;
		this.hp = new Stat(Math.floor(race.hp * (1 + depthModifier * 0.3)));
		this.aggresion = race.attack * (1 + depthModifier * 0.3);
		this.defense = race.defense * (1 + depthModifier * 0.3);
		this.evade = race.speed;
		this.xPosition = 0;
		this.yPosition = 0;
		this.intent = 'CHASE';
	}

	async act () {
		switch (this.intent){
			case 'RANDOM':
				await this.actRandom();
				break;
			case 'CHASE':
				await this.actChase();
				break;
			case 'WAIT':
				this.actWait();
				break;
		}
	}

	async actRandom () {
		if (Random.n(0, 100) < 70) {
			return;
		}
		var dx = Random.n(-1, 1);
		var dy = Random.n(-1, 1);
		if (!this.level.canWalkTo(this.x+dx,this.y+dy)){
			return;
		}
		// TODO: Make this so is random grunt sound and be set on Races.data
		// this.game.audio.playSfx('vo_goblin_grunt_01,vo_goblin_grunt_02,vo_goblin_grunt_03,vo_goblin_grunt_04');
		await this.moveTo(dx, dy);
	}

	actWait () {
		// Do nothing.
	}


	async actChase () {
		const chaseTarget = this.getChaseTarget();
		if (!chaseTarget){
			return;
		}
		var dx = Math.sign(chaseTarget.x - this.x);
		var dy = Math.sign(chaseTarget.y - this.y);
		if (this.isAggressive() && this.x + dx === chaseTarget.x && this.y + dy === chaseTarget.y) {
			await this.game.display.springBeing(this, dx, dy, async () => await this.attack(chaseTarget));
			return;
		}
		if (!this.level.canWalkTo(this.x+dx,this.y+dy)){
			// At least act random, man.
			dx = Random.n(-1, 1);
			dy = Random.n(-1, 1);
			if (!this.level.canWalkTo(this.x+dx,this.y+dy)){
				return;
			}
		}
		await this.moveTo(dx, dy);
	}

	async attack (player) {
		const damage = Random.n(1, this.aggresion);
		if (this.race.attackSFX && this.race.attackSFX !== "")
			this.game.audio.playSfx(this.race.attackSFX);
		if (!player.checkEvade()) {
			await player.damage(damage);
		} else {
			// TODO: Enemy missed attack Sound Effect
			this.game.display.showFloatingText(player.x, player.y, `Miss`, 0xffffff);
		}
	}

	getChaseTarget () {
		if (this.race.chaseRaceId) {
			const targets = this.level.getBeingsByRaceId(this.race.chaseRaceId);
			if (targets.length === 0) {
				return null;
			}
			if (targets.length === 1) {
				return targets[0];
			}
			return PositionUtils.nearest(targets, this);
		}
		return this.game.player;
	}

	async moveTo (dx: number, dy: number) {
		this.level.moveBeing(this, dx, dy);
		this.xPosition = this.x + dx;
		this.yPosition = this.y + dy;
		if (this.level.safe)
			return;
		await this.game.display.moveBeing(this, dx, dy);
	}

	placeOn (x: number, y: number) {
		this.xPosition = x;
		this.yPosition = y;
	}

	setIntent (intent: string) {
		this.intent = intent;
	}

	getName (): string {
		if (this.race.unique) {
			return this.race.name;
		}
		return Loc.loc(this.race.name + '.the');
	}

	checkEvade (blessed: boolean): boolean {
		const evadeChance = this.evade - (blessed ? 10 : 0);
		if (evadeChance < 0) {
			return false;
		}
		return Random.n(0, 100) <= evadeChance;
	}

	damage (damage: number): void {
		const effectiveDefense = Random.n(0, this.defense);
		damage -= effectiveDefense;
		if (damage < 0) {
			damage = 0;
		}
		if (damage > 0){
			this.game.audio.playSfx('sfx_enemy_hit_01,sfx_enemy_hit_02,sfx_enemy_hit_03');
		}
		this.hp.spend(damage);
		if (this.hp.current <= 0) {
			this.die();
		}
	}

	die (): void {
		this.level.removeBeing(this);
		if (this.race.onKill) {
			this.race.onKill(this.game);
		}

	}

	async tryDodge () {
		const dx = Random.n(-1,1);
		const dy = Random.n(-1,1);
		const tx = this.x + dx;
		const ty = this.y + dy;
		if (this.game.world.level.canWalkTo(tx, ty)) {
			await this.moveTo (dx, dy);
		}
	}

	reviveSprite (game: any) {
		const tileset = this.race.tileset || 'main';
		this.sprite = game.display.createSprite(tileset, this.race.tilesetData);
		this.sprite.visible = false;
		this.spriteOffsetX = game.display.tilesets[tileset].offsetX;
		this.spriteOffsetY = game.display.tilesets[tileset].offsetY;
	}

	isAggressive (): boolean {
		return !!!this.race.isPeaceful;
	}
}

circular.registerClass('Being', Being, {
	transients: {
		race: true,
		sprite: true,
		spriteOffsetX: true,
		spriteOffsetY: true
	},
	reviver(object: Being, game: any) {
		object.race = RacesData[object.__serialData.raceId];
		object.reviveSprite(game);
	},
	prepare(object: Being) {
		return {
			raceId: object.race.id
		}
	}
});