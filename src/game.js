import Phaser from 'phaser'

import MainScene from './scenes/MainScene'

const config = {
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: window.innerHeight,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scene: [MainScene]
}

export default new Phaser.Game(config)
