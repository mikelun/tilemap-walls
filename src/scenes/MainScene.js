import Phaser from 'phaser'
import { initializeCameraController } from '../utils/cameraController';
import { isButtonActive } from './GameUI';

export default class HelloWorldScene extends Phaser.Scene
{
	constructor() {
		super('MainScene');
	}

	preload() {

        // LOAD YOUR MAP
        this.load.image('map', 'assets/map.png');
        this.load.image('map-fg', 'assets/map-fg.png');

        // LOAD PLUGINS
        this.load.plugin('rexpinchplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexpinchplugin.min.js', true);
    }

    create() {
        window.scene = this;
        this.scene.run('GameUI');

        // LOAD MAPS
        this.add.image(0, 0, 'map').setOrigin(0, 0);
        this.add.image(0, 0, 'map-fg').setOrigin(0, 0);
        
        initializeCameraController();

        // if player touch the scene
        var startPosition = null;
        var line;
        this.input.on('pointerdown', function (pointer) {
            if (isButtonActive()) {
                startPosition = pointer.position;
            }
        });

        // when player drag the scene
        this.input.on('pointermove', function (pointer) {
            if (isButtonActive() && startPosition) {
                // draw the line
                if (!line) {
                    line = window.scene.add.graphics();
                }
                line.clear();
                line.lineStyle(20, 0xffffff, 10);
                line.strokePath();
                line.moveTo(startPosition.x, startPosition.y);
                line.lineTo(pointer.position.x, pointer.position.y);
                line.closePath();
            }
        });
    }

    update() {

    }
}
