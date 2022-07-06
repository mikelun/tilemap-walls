import Phaser from 'phaser'
import { initializeCameraController } from '../utils/cameraController';
import { isButtonActive } from './GameUI';

var lines = [];

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


        // get lines from local storage
        if (localStorage.getItem('lines')) {
            const linesData = JSON.parse(localStorage.getItem('lines'));
            linesData.lines.forEach(lineData => {
                console.log(lineData);
                const line = this.add.line(0, 0, lineData.x1, lineData.y1, lineData.x2, lineData.y2, 0xffffff).setOrigin(0, 0);
                line.setLineWidth(1);
                lines.push(line);
            });
        }
        // if player touch the scene
        var startPosition = null;
        var line;
        this.input.on('pointerdown', function (pointer) {
            if (startPosition) {
                lines.push(line);
                line = null;
                startPosition = null;
                return;
            }
            if (isButtonActive()) {
                startPosition = {
                    x: pointer.worldX,
                    y: pointer.worldY
                }
            }
        });

        // when player drag the scene
        this.input.on('pointermove', function (pointer) {
            if (isButtonActive() && startPosition) {
                if (line) line.destroy();
                line = window.scene.add.line(0, 0, startPosition.x, startPosition.y, pointer.worldX, pointer.worldY, 0x00ff00).setOrigin(0);
                // add physics for line
                window.scene.physics.add.existing(line);
                line.setLineWidth(1);
            }
        });

        // if ctrl z
        this.input.keyboard.on('keydown-Z', function (event) {
            if (event.ctrlKey) {
                if (lines.length > 0) {
                    lines.pop().destroy();
                }
            }
        });

        // if ctrl s
        this.input.keyboard.on('keydown-S', function (event) {
            if (event.ctrlKey) {
                // save the file to assets
                var data = {
                    lines: lines.map(line => {
                        return {
                            x1: line.geom.x1,
                            y1: line.geom.y1,
                            x2: line.geom.x2,   
                            y2: line.geom.y2
                        }
                    })
                };

                // save the file to local storage
                localStorage.setItem('lines', JSON.stringify(data));

                // copy json to clipboard
                var textarea = document.createElement('textarea');
                textarea.value = JSON.stringify(data);
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);

            }
        });
    }

    update() {

    }
}
