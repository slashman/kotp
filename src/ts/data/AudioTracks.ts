const AudioTracks = {
	loadAudio(game) {
		this.audio = game.audio;
		/*this.audio.registerMx({
			key: 'mx_home',
			src: 'mx_home.ogg',
			volume: 0.3,
			loop: true
		});*/
		/*
		this.audio.registerMx({
			key: 'bg_exterior_day',
			src: 'bg_exterior_day.ogg',
			volume: 1,
			loop: true
		});
		*/

		this.audio.registerSfx({ key: 'fs_grass_01', src: 'fs_grass_01.ogg', stereo: 0, volume: 0.5 });
		this.audio.registerSfx({ key: 'fs_grass_02', src: 'fs_grass_02.ogg', stereo: 0, volume: 0.5 });
		this.audio.registerSfx({ key: 'fs_grass_03', src: 'fs_grass_03.ogg', stereo: 0, volume: 0.5 });
		this.audio.registerSfx({ key: 'fs_grass_04', src: 'fs_grass_04.ogg', stereo: 0, volume: 0.5 });
		this.audio.registerSfx({ key: 'fs_grass_05', src: 'fs_grass_05.ogg', stereo: 0, volume: 0.5 });
		this.audio.registerSfx({ key: 'fs_grass_06', src: 'fs_grass_06.ogg', stereo: 0, volume: 0.5 });

		this.audio.registerSfx({ key: 'sfx_dog_bark_01', src: 'sfx_dog_bark_01.ogg', stereo: 0, volume: 0.8 });
		this.audio.registerSfx({ key: 'sfx_dog_bark_02', src: 'sfx_dog_bark_02.ogg', stereo: 0, volume: 0.8 });
		this.audio.registerSfx({ key: 'sfx_dog_bark_03', src: 'sfx_dog_bark_03.ogg', stereo: 0, volume: 0.8 });
		this.audio.registerSfx({ key: 'sfx_dog_bark_04', src: 'sfx_dog_bark_04.ogg', stereo: 0, volume: 0.8 });
		
		this.audio.registerSfx({ key: 'sfx_enemy_hit_01', src: 'sfx_enemy_hit_01.ogg', stereo: 0, volume: 0.8 });
		this.audio.registerSfx({ key: 'sfx_enemy_hit_02', src: 'sfx_enemy_hit_02.ogg', stereo: 0, volume: 0.8 });
		this.audio.registerSfx({ key: 'sfx_enemy_hit_03', src: 'sfx_enemy_hit_03.ogg', stereo: 0, volume: 0.8 });

		this.audio.registerSfx({ key: 'sfx_player_attack_01', src: 'sfx_player_attack_01.ogg', stereo: 0, volume: 1 });
		this.audio.registerSfx({ key: 'sfx_player_attack_02', src: 'sfx_player_attack_02.ogg', stereo: 0, volume: 1 });
		this.audio.registerSfx({ key: 'sfx_player_attack_03', src: 'sfx_player_attack_03.ogg', stereo: 0, volume: 1 });
		this.audio.registerSfx({ key: 'sfx_player_attack_04', src: 'sfx_player_attack_04.ogg', stereo: 0, volume: 1 });
		this.audio.registerSfx({ key: 'sfx_player_attack_05', src: 'sfx_player_attack_05.ogg', stereo: 0, volume: 1 });
		this.audio.registerSfx({ key: 'sfx_player_hurt_01', src: 'sfx_player_hurt_01.ogg', stereo: 0, volume: 1 });
		this.audio.registerSfx({ key: 'sfx_player_hurt_02', src: 'sfx_player_hurt_02.ogg', stereo: 0, volume: 1 });
		this.audio.registerSfx({ key: 'sfx_player_hurt_03', src: 'sfx_player_hurt_03.ogg', stereo: 0, volume: 1 });
		
		this.audio.registerSfx({ key: 'sfx_drink_guaro', src: 'sfx_drink_guaro.ogg', stereo: 0, volume: 1 });
		this.audio.registerSfx({ key: 'sfx_escape_prayer', src: 'sfx_escape_prayer.ogg', stereo: 0, volume: 1 });
		this.audio.registerSfx({ key: 'sfx_gameover', src: 'sfx_gameover.ogg', stereo: 0, volume: 1 });
		
		this.audio.registerSfx({ key: 'ui_inventory_open', src: 'ui_inventory_open.ogg', stereo: 0, volume: 1 });
		this.audio.registerSfx({ key: 'ui_inventory_close', src: 'ui_inventory_close.ogg', stereo: 0, volume: 1 });
		this.audio.registerSfx({ key: 'ui_inventory_move', src: 'ui_inventory_move.ogg', stereo: 0, volume: 1 });
		this.audio.registerSfx({ key: 'ui_pickup', src: 'ui_pickup.ogg', stereo: 0, volume: 1 });
		this.audio.registerSfx({ key: 'ui_select', src: 'ui_select.ogg', stereo: 0, volume: 1 });
		this.audio.registerSfx({ key: 'ui_dialogue', src: 'ui_dialogue.ogg', stereo: 0, volume: 1 });

		this.audio.registerSfx({ key: 'vo_goblin_attack_01', src: 'vo_goblin_attack_01.ogg', stereo: 0, volume: 0.9 });
		this.audio.registerSfx({ key: 'vo_goblin_attack_02', src: 'vo_goblin_attack_02.ogg', stereo: 0, volume: 0.9 });
		this.audio.registerSfx({ key: 'vo_goblin_attack_03', src: 'vo_goblin_attack_03.ogg', stereo: 0, volume: 0.9 });
		this.audio.registerSfx({ key: 'vo_goblin_attack_04', src: 'vo_goblin_attack_04.ogg', stereo: 0, volume: 0.9 });
		this.audio.registerSfx({ key: 'vo_goblin_attack_05', src: 'vo_goblin_attack_05.ogg', stereo: 0, volume: 0.9 });
		this.audio.registerSfx({ key: 'vo_goblin_grunt_01', src: 'vo_goblin_grunt_01.ogg', stereo: 0, volume: 1 });
		this.audio.registerSfx({ key: 'vo_goblin_grunt_02', src: 'vo_goblin_grunt_02.ogg', stereo: 0, volume: 1 });
		this.audio.registerSfx({ key: 'vo_goblin_grunt_03', src: 'vo_goblin_grunt_03.ogg', stereo: 0, volume: 1 });
		this.audio.registerSfx({ key: 'vo_goblin_grunt_04', src: 'vo_goblin_grunt_04.ogg', stereo: 0, volume: 1 });
	}
}

export default AudioTracks;