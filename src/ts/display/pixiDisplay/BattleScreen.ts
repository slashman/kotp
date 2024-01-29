import { AnimatedSprite, Container, Sprite, Text } from "pixi.js";
import Random from "../../Random";
import Being from "../../model/Being.class";
import Loc from "../../loc/Loc";

const PUNS = [
    ['What did the grape say when it got crushed?', 'Nothing, it just let out a little wine.'],
    ['Time flies like an arrow. Fruit flies like a banana.'],
    ['To the guy who invented zero,', 'thanks for nothing.'],
    ['A crazy wife says to her husband that moose are falling from the sky.', 'The husband says, it’s reindeer.'],
    ['Can February March?', 'No, but April May.'],
    ['I don’t trust stairs...', '...because they’re always up to something.'],
    ['My grandpa has the heart of the lion,', '...and a lifetime ban from the zoo.'],
    ['I was wondering why the rock was getting bigger...', '...then it hit me.'],
    ['Waking up this morning was an eye-opening experience.'],
    ['Why shouldn\'t you argue with a dinosaur? You\'ll get jurasskicked.'],
    ['Why are bananas so good? They\'ve got appeal.'],
    ['I was going to tell you a pizza joke, but it\'s too cheesy.'],
    ['Two kittens had an argument. It was a cat-astrophe.'],
    ['What do cats listen to during the holidays? Christmas mew-sic.']
];

const INSULTS = [
    ['Huh... was that a joke? You are boring.'],
    ['I don\'t have time for this nonsense. Sorry.'],
    ['I don\'t get it.'],
    ['Hmm, so?'],
    ['Are you done already?'],
    ['I guess someone would find that funny, maybe.'],
    ['Sorry fella, I don’t have the energy to pretend to like you today.'],
    ['You know they can hear you, right?'],
    ['Not too many people like you, do they?']
];

const CHEER_UPS = [
    ['Nothing is impossible. The word itself says "I\'m possible!"'],
    ["Life has got all those twists and turns.', 'You\'ve got to hold on tight and off you go."],
    ["Hang in there"],
    [" If you’ve got nothing to dance about, find a reason to sing."],
    ["Whenever you feel sad just remember that there are billions of cells in your body and all they care about is you."],
    ["When life gives you lemons, squirt someone in the eye."]
];

const PRAISE = [
    ["I must admit, that was funny!"],
    ["HAHAHAHAHAHHA !!!"],
    ["Oh come on!!! :D"],
    ["You a-moose me."],
    ["I’ve got faith in you. "],
    ["There’s ordinary. And then there’s you."],
    ["You’re more fun than a bubble wrap!!!"],
    ["In a world full of bagels, you’re a doughnut."],
    ["You are cooler than secret handshake!!!"],
    ["You’re definitely not someone who I pretend not to see in public."]
];

export default class BattleScreen {
	private rootContainer: Container;
	private playerSprites: AnimatedSprite[];
	private hpTxt: Text;
	private mpTxt: Text;
	private enemySprite: AnimatedSprite; 
	private cursorSprite: Sprite;
	private playerSprite: AnimatedSprite;
	private game: any;
	private enemy: Being;
	
	constructor (game: any, display: any /*ugh*/, parentContainer: Container) {
		this.game = game;
		this.rootContainer = new Container();
		this.rootContainer.visible = false;
		parentContainer.addChild(this.rootContainer);
		this.rootContainer.addChild(new Sprite(display.getTexture('battleBackground')));
		this.playerSprites = [];
		this.playerSprites[0] = new AnimatedSprite(display.getTextures('battle', ['0-0']));
		this.playerSprites[1] = new AnimatedSprite(display.getTextures('battle', ['0-1']));
		this.playerSprites[2] = new AnimatedSprite(display.getTextures('battle', ['0-2']));
		this.playerSprites[0].x = 200;
		this.playerSprites[0].y = 40;
		this.playerSprites[1].x = 200;
		this.playerSprites[1].y = 40 + 24 + 8;
		this.playerSprites[2].x = 200;
		this.playerSprites[2].y = 40 + (24 + 8) * 2;
		this.rootContainer.addChild(this.playerSprites[0]);
		this.rootContainer.addChild(this.playerSprites[1]);
		this.rootContainer.addChild(this.playerSprites[2]);
		this.enemySprite = new AnimatedSprite(display.getTextures('battle', ['0-3']));
		this.enemySprite.x = 64;
		this.enemySprite.y = 64;
		this.rootContainer.addChild(this.enemySprite);
		this.rootContainer.addChild(display.createTextBox(192, 152, "PUN\n\nCHEER\n\nDANCE\n\nFLEE", 200));
		this.rootContainer.addChild(display.createTextBox(24, 168, "GABY\n\nSLAS\n\nADRI", 200));
		this.rootContainer.addChild(display.createTextBox(64, 152, "Confidence      Spirit", undefined));
		this.hpTxt = display.createTextBox(80, 168, "100/100\n\n80/80\n\n70/70", undefined);
		this.mpTxt = display.createTextBox(144, 168, "10\n\n50\n\n30", undefined);
		this.updateUI();
		this.rootContainer.addChild(this.hpTxt);
		this.rootContainer.addChild(this.mpTxt);
		this.cursorSprite = new Sprite(display.pointyCursor);
		this.cursorSprite.x = 192 - 16;
		this.cursorSprite.y = 152;
		this.rootContainer.addChild(this.cursorSprite);

		this.playerSprite = new AnimatedSprite(display.getTextures('slashie', ['10-0','11-0']));
		this.playerSprite.animationSpeed = 1/16;
		this.playerSprite.play();
		this.playerSprite.x = 216 - 32;
		this.playerSprite.y = 48;
		this.rootContainer.addChild(this.playerSprite);
	}

	display (enemy: Being) {
		this.rootContainer.visible = true;
		this.enemy = enemy;
	}

	hide () {
		this.rootContainer.visible = false;
	}

	private currentIndex: number = 0;

	move (dir) {
		this.currentIndex += dir.y;
		if (this.currentIndex > 3) {
			this.currentIndex = 0;
		}
		if (this.currentIndex < 0) {
			this.currentIndex = 3;
		}
		this.updateCursorPosition();
	}

	selectOption () {
		switch (this.currentIndex) {
			case 0: // Pun
				this.game.display.showDialogs(this.getPun(), () => this.sayPun())
				break;
			case 1: // Cheer
				this.game.display.showDialogs(this.getCheer(), () => this.sayCheer())
				break;
			case 2: // Dance
				this.game.display.showDialogs(["You perform a funny dance. The spirits rise!"], () => this.doDance())
				break;
			case 3: // Flee
				this.game.display.exitBattleMode();
		}
	}

	private getPun(): string[] {
		return Random.from(PUNS);
	}

	private getPraise(): string[] {
		return Random.from(PRAISE);
	}

	private getCheer(): string[] {
		return Random.from(CHEER_UPS);
	}

	private getInsult(): string[] {
		return Random.from(INSULTS);
	}

	private sayPun(): void {
		this.enemy.hp.spend(Random.n(4, 8));
		this.game.player.partyMembers[this.playerIndex].mp.spend(3);
		if (this.enemy.hp.current > 0) {
			const insult = this.getInsult();
			insult[0] = `${Loc.loc("dialog.says", this.enemy.getName())}\n` + insult[0];
			this.game.display.showDialogs(insult, () => this.injureCurrentPlayer())
		} else {
			const praise = this.getPraise();
			praise[0] = `${Loc.loc("dialog.says", this.enemy.getName())}\n` + praise[0];
			this.game.display.showDialogs(praise, () => this.victory())
		}
	}

	private injureCurrentPlayer() {
		this.game.player.partyMembers[this.playerIndex].hp.spend(Random.n(5, 15));
		this.updateUI();
		this.nextTurn();
	}

	private updateUI() {
		const player = this.game.player;
		this.hpTxt.text = player.partyMembers[0].hp.getString() +
			"\n\n" +
			player.partyMembers[1].hp.getString() +
			"\n\n" +
			player.partyMembers[2].hp.getString();
		this.mpTxt.text = player.partyMembers[0].mp.getString() +
		"\n\n" +
		player.partyMembers[1].mp.getString() +
		"\n\n" +
		player.partyMembers[2].hp.getString();
		
	}

	private doDance(): void {
		const partyMembers = this.game.player.partyMembers;
		partyMembers.forEach(p => {
			p.mp.recover(Random.n(1, 20));
		});
		this.updateUI();
		this.nextTurn();
	}

	private sayCheer(): void {
		const partyMembers = this.game.player.partyMembers;
		let weakerPartyMemberIndex = 0;
		let higherRemaining = partyMembers[0].hp.remaining();
		partyMembers.forEach((p, i) => {
			if (p.hp.remaining() > higherRemaining) {
				weakerPartyMemberIndex = i;
				higherRemaining = p.hp.remaining();
			}
		});
		partyMembers[weakerPartyMemberIndex].hp.recover(Random.n(5, 15));
		partyMembers[this.playerIndex].mp.spend(5);
		this.updateUI();
		this.nextTurn();
	}

	playerIndex = 0;
	private nextTurn() {
		this.game.input.mode = 'BATTLE';
		this.playerIndex++;
		if (this.playerIndex == 3) {
			this.playerIndex = 0;
		}
		this.playerSprite.y = 48 + this.playerIndex * 32;
	}

	private victory() {
		this.game.player.confidence++;
		this.enemy.defeated = true;
		this.game.display.exitBattleMode();
	}

	private updateCursorPosition() {
		this.cursorSprite.y = 152 + this.currentIndex * 20;
	}
}