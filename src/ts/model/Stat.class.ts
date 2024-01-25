const circular = require('circular-functions');

export default class Stat {
	max: number;
	current: number;
	penalty: number;
	_c: any;

	constructor(max: number) {
		this.max = max;
		this.current = max;
		this.penalty = 0;
		this._c =  circular.register('Stat');
	}
	recoverAll(): void {
		this.current = this.currentMax();
	}
	spend(v: number): void {
		this.current -= v;
		if (this.current < 0) {
			this.current = 0;
		}
	}
	recover(v: number): void {
		this.current += v;
		if (this.current > this.currentMax()) {
			this.current = this.currentMax();
		}
	}
	replenish(): void {
		this.current = this.currentMax();
	}
	getPercentage(): number {
		return this.current / this.currentMax();
	}
	currentMax(): number {
		return this.max - this.penalty;
	}
	addPenalty(v: number): void {
		this.penalty += v;
		if (this.penalty > this.max) {
			this.penalty = this.max;
		}
		if (this.current > this.max - this.penalty) {
			this.current = this.max - this.penalty;
		}
	}
	reducePenalty(v: number): void {
		this.penalty -= v;
		if (this.penalty < 0) {
			this.penalty = 0;
		}
	}
}

circular.registerClass('Stat', Stat);