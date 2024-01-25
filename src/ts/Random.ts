export default {
	n: (a: number, b: number) => {
		return Math.floor(Math.random() * (b - a + 1)) + a;
	},
	from: function(array){
		return array[this.n(0, array.length-1)];
	},
	shuffle (array) {
		let currentIndex = array.length, randomIndex;
		// While there remain elements to shuffle.
		while (currentIndex != 0) {
			// Pick a remaining element.
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;
			// And swap it with the current element.
			[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
		}
		return array;
	}
}