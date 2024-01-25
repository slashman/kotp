import Loc from "./loc/Loc";

const ut = (window as any).ut;

/**
 * Single object that receives keypresses from the player and
 * executes actions based on them.
 */

export default {
	inputEnabled: true,
	init: function(game){
		this.game = game;
		ut.initInput(this.onKeyDown.bind(this), this.onKeyUp.bind(this));
		this.mode = 'NONE';
		this.hookVirtualKeys();
	},
	movedir: { x: 0, y: 0 },
	hookVirtualKeys () {
		this.softKeysPressed = {};
		this.softKeyUp = {};
		this.hook('button7', ut.KEY_NUMPAD7);
		this.hook('button8', ut.KEY_UP);
		this.hook('button9', ut.KEY_NUMPAD9);
		this.hook('button4', ut.KEY_LEFT);
		this.hook('button6', ut.KEY_RIGHT);
		this.hook('button1', ut.KEY_NUMPAD1);
		this.hook('button2', ut.KEY_DOWN);
		this.hook('button3', ut.KEY_NUMPAD3);
		this.hook('buttonA', ut.KEY_SPACE);
		this.hook('buttonB', ut.KEY_ESCAPE);
		this.hook('buttonStart', ut.KEY_I);
		this.hook('buttonSelect', ut.KEY_R);
	},
	hook (id: string, keycode: number) {
		//document.getElementById(id).addEventListener("mousedown",
		document.getElementById(id).addEventListener("touchstart",
			(ev: TouchEvent) => {
				this.softKeysPressed[keycode] = true;
				if (this.softKeyUp[keycode]) {
					this.onKeyDown(keycode);
				}
				this.currentSoftKey = keycode;
				this.continuousInputInterval = setInterval(()=> {
					if (this.softKeysPressed[this.currentSoftKey]) {
						this.onKeyDown(this.currentSoftKey);
					} else {
						this.currentSoftKey = -1;
					}
				}, 200);
				ev.preventDefault();
				return true;
			}
		);
		this.softKeyUp[keycode] = true;
		//document.getElementById(id).addEventListener("mouseup",
		document.getElementById(id).addEventListener("touchend",
			(ev: MouseEvent) => {
				this.softKeysPressed[keycode] = false;
				if (this.softKeyUp[keycode]) {
					this.onKeyUp(keycode);
				}
				this.currentSoftKey = -1;
				clearInterval(this.continuousInputInterval);
				return true;
			}
		);
		/*document.getElementById(id).addEventListener("mouseout",
			(ev: MouseEvent) => {
				if (!this.softKeysPressed[keycode]) {
					return;
				}
				this.softKeysPressed[keycode] = false;
				if (this.softKeyUp[keycode]) {
					this.onKeyUp(keycode);
				}
				this.currentSoftKey = -1;
				return true;
			}
		);*/
	},
	onKeyUp: function(k){
		if (!this.inputEnabled){
			if (this.mode === 'MOVEMENT') {
				this.queuedMovement = null;
			}
			return;
		} else if (this.mode === 'TITLE'){
			if (k === ut.KEY_SPACE || k === ut.KEY_ENTER){
				this.game.display.selectTitleOption();
			}
		} else if (this.mode === 'DIALOG') {
			if (k === ut.KEY_SPACE || k === ut.KEY_ESCAPE || k === ut.KEY_ENTER){
				this.game.display.hideDialog();
				this.mode = 'MOVEMENT';
				if (this.dialogCallback) {
					this.dialogCallback();
				}
			}
		} else if (this.mode === 'PROMPT') {
			if (k === ut.KEY_Y || k === ut.KEY_SPACE){
				this.promptCallback(true);
			} else if (k === ut.KEY_N || k === ut.KEY_ESCAPE){
				this.promptCallback(false);
			}
		} else if (this.mode === 'EVENT'){
			const options = this.game.display.eventOptions;
			if (k >= ut.KEY_A && k <= ut.KEY_A + options.length){
				this.game.display.selectOption(k - ut.KEY_A);
			}
		} else if (this.mode === 'MOVEMENT'){
			if (k === ut.KEY_I){
				this.mode = 'INVENTORY';
				this.game.audio.playSfx("ui_inventory_open");
				this.game.display.showInventory();
				return;
			}
			if (k === ut.KEY_ENTER || k === ut.KEY_SPACE) {
				this.inputEnabled = false;
				this.game.player.passTurn();
				return;
			}
			if (k === ut.KEY_QUESTION_MARK) {
				this.mode = 'HELP';
				this.game.display.showHelp();
			}
			if (k === ut.KEY_R) { // TODO: Add Add Actions Menu
				this.prompt(Loc.loc("save.prompt"), yes => {
					if (yes) {
						this.game.display.showDialog(Loc.loc("save.saving"), true);
						setTimeout(() => {
							this.game.persistence.saveGame(this.game);
							this.game.display.showDialog(Loc.loc("save.saved"));
						}, 10);
					} else if (this.game.display.isMobile()) {
						this.game.display.hideDialog();
						this.mode = 'HELP';
						this.game.display.showHelp();
					} else {
						this.game.display.hideDialog();
						this.mode = 'MOVEMENT';
					}
				});
				return;
			}
		} else if (this.mode === 'HELP'){
			if (k === ut.KEY_ESCAPE){
				this.mode = 'MOVEMENT';
				this.game.display.hideHelp();
				return;
			}
			if (k === ut.KEY_SPACE){
				this.game.display.showTips();
				return;
			}
		} else if (this.mode === 'LANGUAGE'){
			if (k === ut.KEY_ENTER || k === ut.KEY_SPACE) {
				this.game.languageSelected(this.game.display.languageIndex);
			}
		} else if (this.mode === 'INVENTORY'){
			if (k === ut.KEY_ESCAPE || k === ut.KEY_I){
				this.game.display.hideInventory();
				this.mode = 'MOVEMENT';
				if (this.game.display.inventoryMode === 'BUY') {
					this.game.display.refresh();
				}
			} else if (k === ut.KEY_R && this.game.display.inventoryMode === 'USE'){
				this.game.player.tryDrop(this.game.display.getSelectedItem());
				this.game.display.hideInventory();
			} else if (k === ut.KEY_ENTER || k === ut.KEY_SPACE){
				const selectedItem = this.game.display.getSelectedItem();
				if (this.game.display.inventoryMode === 'USE') {
					if (selectedItem.def.targetted){
						this.game.display.message("Select a direction.");
						this.game.display.hideInventory();
						this.mode = 'SELECT_DIRECTION';
						this.directionAction = 'USE_ITEM';
					} else {
						this.game.player.tryUse(selectedItem);
						this.game.display.hideInventory();
						if (this.mode !== 'PROMPT' && this.mode !== 'DIALOG') {
							this.mode = 'MOVEMENT';
						}
					}
				} else if (this.game.display.inventoryMode === 'BUY') {
					this.game.player.tryBuy(selectedItem);
				}
			}
		} else if (this.mode === 'SELECT_DIRECTION'){
			if (k === ut.KEY_ESCAPE){
				this.mode = 'INVENTORY';
				this.game.display.showInventory();
				this.game.display.message("Cancelled.");
				return;
			}
			this.movedir.x = 0;
			this.movedir.y = 0;
			if (k === ut.KEY_LEFT || k === ut.KEY_H) this.movedir.x = -1;
			else if (k === ut.KEY_RIGHT || k === ut.KEY_L) this.movedir.x = 1;
			else if (k === ut.KEY_UP || k === ut.KEY_K) this.movedir.y = -1;
			else if (k === ut.KEY_DOWN || k === ut.KEY_J) this.movedir.y = 1;
			else return;
			this.game.player.tryUse(this.game.display.getSelectedItem(), this.movedir.x, this.movedir.y);
			this.mode = 'MOVEMENT';
		}
	},
	prompt (message: string, callback: (yes: boolean) => {}) {
		if (this.game.display.isMobile()) {
			this.game.display.showDialog(message + ' ' + Loc.loc('ui.prompt.mobile'));
		} else {
			this.game.display.showDialog(message + ' ' + Loc.loc('ui.prompt.desktop'));
		}
		this.mode = 'PROMPT';
		this.inputEnabled = true;
		this.promptCallback = callback;
	},
	onKeyDown: function(k){
		if (!this.inputEnabled) {
			if (this.mode === 'MOVEMENT') {
				const moveDir = this.getMoveDir(k);
				if (this.movedir.x === 0 && this.movedir.y === 0){
					return;
				}
				this.queuedMovement = moveDir;
			}
			return;
		}
		if (this.mode === 'MOVEMENT'){
			this.movedir = this.getMoveDir(k);
			if (this.movedir.x === 0 && this.movedir.y === 0){
				return;
			}
			this.inputEnabled = false;
			this.game.player.tryMove(this.movedir); // async...
		} else if (this.mode === 'INVENTORY'){
			this.game.display.moveInventory(this.getMoveDir(k));
			this.game.audio.playSfx("ui_inventory_move");
		} else if (this.mode === 'LANGUAGE'){
			this.game.display.moveLanguage(this.getMoveDir(k));
			this.game.audio.playSfx("ui_inventory_move");
		} else if (this.mode === 'TITLE'){
			this.game.display.moveTitleOption(this.getMoveDir(k));
			this.game.audio.playSfx("ui_inventory_move");
		}
	},
	getMoveDir (k) {
		const moveDir = {x: 0, y: 0};
		if (k === ut.KEY_LEFT || 
			k === ut.KEY_NUMPAD4 || k === ut.KEY_NUMPAD1 || k === ut.KEY_NUMPAD7 ||
			k === ut.KEY_HOME || k === ut.KEY_END ||
			k === ut.KEY_Q || k === ut.KEY_A || k === ut.KEY_Z
			) {
			moveDir.x = -1;
		}
		if (k === ut.KEY_RIGHT || 
			k === ut.KEY_NUMPAD6 || k === ut.KEY_NUMPAD9 || k === ut.KEY_NUMPAD3 ||
			k === ut.KEY_PAGE_UP || k === ut.KEY_PAGE_DOWN ||
			k === ut.KEY_E || k === ut.KEY_D || k === ut.KEY_C
			) {
			moveDir.x = 1;
		}
		if (k === ut.KEY_UP || 
			k === ut.KEY_NUMPAD8 || k === ut.KEY_NUMPAD7 || k === ut.KEY_NUMPAD9 ||
			k === ut.KEY_PAGE_UP || k === ut.KEY_HOME ||
			k === ut.KEY_Q || k === ut.KEY_W || k === ut.KEY_E
			) {
			moveDir.y = -1;
		}
		if (k === ut.KEY_DOWN || 
			k === ut.KEY_NUMPAD2 || k === ut.KEY_NUMPAD1 || k === ut.KEY_NUMPAD3 ||
			k === ut.KEY_PAGE_DOWN || k === ut.KEY_END ||
			k === ut.KEY_Z || k === ut.KEY_S || k === ut.KEY_C
			) {
			moveDir.y = 1;
		}
		return moveDir;
	},
	processQueuedMovement () {
		if (this.queuedMovement) {
			this.inputEnabled = false;
			const moveTo = this.queuedMovement;
			this.queuedMovement = null;
			setTimeout(() => {
				this.game.player.tryMove(moveTo);
			}, 0);
		}
	},
	clearQueuedMovement () {
		this.queuedMovement = null;
	},
	getButtonAName () {
		if (this.game.display.isMobile()) {
			return 'A';
		} else {
			return Loc.loc('key.space');
		}
	}
}