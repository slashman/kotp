const circular = require('circular-functions');
const LZString = require('lz-string');

const storageKey = "mayed_saveGame";

export default class Persistence {
	saveGame(game) {
		const saveObject = {
			game,
			_c: circular.register('savegame')
		}
		const serializedData = circular.serialize(saveObject);
		var compressedData = LZString.compressToUTF16(serializedData);
		localStorage.setItem(storageKey, compressedData);
	}

	hasSaveGame() {
		return localStorage.getItem(storageKey) != null;
	}

	loadIntoGame(game) {
		const compressedData = localStorage.getItem(storageKey);
		const serializedData = LZString.decompressFromUTF16(compressedData);
		let loaded: any;
		try {
			loaded = circular.parse(serializedData, game);
		} catch (parseError) {
			throw {
				code: 'parseError',
				parseError: parseError
			}
		}
		if (game.modelVersion != loaded.game.modelVersion) {
			throw {
				code: 'versionMismatch',
				version: loaded.game.modelVersion
			}
		}
		game.world = loaded.game.world;
		game.player = loaded.game.player;
	}
}