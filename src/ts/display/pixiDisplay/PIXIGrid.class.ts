import { Container, Sprite, Texture } from "pixi.js";

export default class PIXIGrid {
	private x: number;
	private y: number;

	private cursorX: number;
	private cursorY: number;

	private rowHeight: number;
	private columnWidth: number;

	private rows: number;
	private columns: number;

	private icons: Sprite[][];

	private cursor: Sprite;

	container: Container;
	onBrowse: (item: any) => {};

	private data: {
		dataItem: any,
		text: string,
		tint: number,
		renderData?: {
			texture: Texture,
			offsetX: number,
			offsetY: number
		}
	} [];

	constructor (x: number, y: number, columns: number, rows: number, columnWidth: number, rowHeight: number, cursorTexture: Texture) {
		this.x = x;
		this.y = y;
		this.rowHeight = rowHeight;
		this.columnWidth = columnWidth;

		this.rows = rows;
		this.columns = columns;

		this.container = new Container();
		this.icons = [];
		for (let xx = 0; xx < this.columns; xx++) {
			this.icons.push([]);
		}
		for (let yy = 0; yy < this.rows; yy++) {
			for (let xx = 0; xx < this.columns; xx++) {
				const icon = new Sprite();
				icon.position.x = x + xx * columnWidth;
				icon.position.y = y + yy * rowHeight;
				this.container.addChild(icon);
				this.icons[xx].push(icon);
			}
		}
		this.cursor = new Sprite(cursorTexture);
		this.container.addChild(this.cursor);
	}

	setData (data: {
		dataItem: any,
		text: string,
		tint: number,
		renderData?: {
			texture: Texture,
			offsetX: number,
			offsetY: number
		}
	}[]) {
		this.data = data;
	}

	update () {
		for (let y = 0; y < this.rows; y++) {
			for (let x = 0; x < this.columns; x++) {
				const dataItem = this.data[y * this.columns + x];
				const sprite = this.icons[x][y];
				if (dataItem) {
					sprite.texture = dataItem.renderData?.texture;
					sprite.tint = dataItem.tint || 0xffffff;
					sprite.position.x = this.x + x * this.columnWidth + dataItem.renderData?.offsetX;
					sprite.position.y = this.y + y * this.rowHeight + dataItem.renderData?.offsetY;
				} else {
					this.icons[x][y].texture = null;
				}
			}
		}
		if (this.cursorY * this.columns + this.cursorX >= this.data.length) {
			this.resetSelection();
		}
	}
	resetSelection () {
		this.cursorX = 0;
		this.cursorY = 0;
		this.landCursor();
	}
	emitSelection (): void{
		this.onBrowse(this.getSelected());
	}
	getSelected () {
		return this.data[this.cursorY * this.columns + this.cursorX].dataItem;
	}
	moveCursor (dir) {
		if (!this.data[(this.cursorY + dir.y) * this.columns + this.cursorX + dir.x]) {
			return;
		}
		this.cursorX += dir.x;
		this.cursorY += dir.y;
		this.landCursor();
	}
	landCursor() {
		if (this.cursorX >= this.columns - 1) {
			this.cursorX = this.columns - 1;
		}
		if (this.cursorY >= this.rows - 1) {
			this.cursorY = this.rows - 1;
		}
		if (this.cursorX < 0) {
			this.cursorX = 0;
		}
		if (this.cursorY < 0) {
			this.cursorY = 0;
		}
		this.cursor.x = this.x + this.cursorX * this.columnWidth;
		this.cursor.y = this.y + this.cursorY * this.rowHeight;
		if (this.data) {
			this.emitSelection();
		}
	}
}
