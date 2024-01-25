export default interface IPosition {
	x: number,
	y: number,
	_c: any
}

export const PositionUtils = {
	nearest (points: IPosition[], reference: IPosition): any {
		let distance = this.distance(points[0], reference);
		let nearest = points[0];
		for (let i = 1; i < points.length; i++) {
			const newDistance = this.distance(points[i], reference);
			if (newDistance < distance) {
				nearest = points[i];
				distance = newDistance;
			}
		}
		return nearest;
	},
	distance (a: IPosition, b: IPosition) {
		const aa = a.x - b.x;
		const bb = a.y - b.y;
		return Math.sqrt(aa*aa + bb*bb);
	}
}