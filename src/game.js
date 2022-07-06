import Phaser from 'phaser'
import { GameUi } from './scenes/GameUI'

import MainScene from './scenes/MainScene'

const config = {
	type: Phaser.AUTO,
	backgroundColor: '#000000',
	pixelArt: true, // Prevent pixel art from becoming blurred when scaled.
	scale: {
		mode: Phaser.Scale.ScaleModes.RESIZE,
		width: window.innerWidth,
		height: window.innerHeight,
	},
	autoFocus: true,
	physics: {
		default: 'arcade',
		arcade: {
			debug: false,
			gravity: { y: 0 }
		}
	},
	scene: [MainScene, GameUi],
}

export default new Phaser.Game(config)
