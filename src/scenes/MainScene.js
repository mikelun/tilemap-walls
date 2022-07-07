import Phaser from 'phaser'
import { initializeCameraController } from '../utils/cameraController';
import { isEraseButtonActive, isLineButtonActive, setEraseButtonActive, setLineButtonActive } from './GameUI';

var lines = [];
var cachedLines = [];

export default class HelloWorldScene extends Phaser.Scene {
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
                const line = this.add.rectangle(lineData.x, lineData.y, lineData.width, lineData.height, 0xffffff).setOrigin(0, 0);
                lines.push(line);
                window.scene.physics.add.existing(line);
                this.addPointerEventsToObject(line);
            });
        }
        // if player touch the scene
        var startPosition = null;
        var object;
        this.input.on('pointerdown', function (pointer) {
            if (startPosition) {
                lines.push(object);
                window.scene.addPointerEventsToObject(object);
                object = null;
                startPosition = null;
                return;
            }
            if (isLineButtonActive()) {
                if (window.scene.pointPicker) {
                    startPosition = {
                        x: window.scene.pointPicker.x,
                        y: window.scene.pointPicker.y
                    }
                    window.scene.pointPicker = null;
                } else {
                    startPosition = {
                        x: pointer.worldX,
                        y: pointer.worldY
                    }
                }
            }
        });

        // when player drag the scene
        this.input.on('pointermove', function (pointer) {
            if (startPosition) {
                if (object) object.destroy();
                const rotation = Phaser.Math.Angle.Between(startPosition.x, startPosition.y, pointer.worldX, pointer.worldY);
                const length = Phaser.Math.Distance.Between(startPosition.x, startPosition.y, pointer.worldX, pointer.worldY);
                const { height, width } = window.scene.getHeightAndWidth(length, rotation);

                object = window.scene.add.rectangle(startPosition.x, startPosition.y, height, width, 0xffffff).setOrigin(0, 0);
                window.scene.physics.add.existing(object);
                // if pointer is moving top
            }
        });

        // if ctrl z
        this.input.keyboard.on('keydown-Z', function (event) {
            if (event.ctrlKey) {
                if (lines.length > 0) {
                    window.scene.destroyLineByIndex(lines.length - 1);
                }
            }
            // if shift
            if (event.shiftKey) {
                if (cachedLines.length > 0) {
                    lines.push(window.scene.add.rectangle(cachedLines[cachedLines.length - 1].x, cachedLines[cachedLines.length - 1].y, cachedLines[cachedLines.length - 1].width, cachedLines[cachedLines.length - 1].height, 0xffffff).setOrigin(0, 0));
                    window.scene.physics.add.existing(lines[lines.length - 1]);
                    cachedLines.pop();
                }
            };
        });

        this.input.keyboard.on('keydown-B', function (event) {
            setLineButtonActive(!isLineButtonActive());
        });
        this.input.keyboard.on('keydown-E', function (event) {
            setEraseButtonActive(!isEraseButtonActive());
        });

        // if ctrl s
        this.input.keyboard.on('keydown-S', function (event) {
            if (event.ctrlKey) {
                // save the file to assets
                var data = {
                    lines: lines.map(line => {
                        return {
                            x: line.x,
                            y: line.y,
                            width: line.width,
                            height: line.height,
                        }
                    })
                };
                data.lines.forEach(line => {
                    if (line.width < 0) {
                        // change position
                        line.width = -line.width;
                        line.x -= line.width;
                    }
                    if (line.height < 0) {
                        // change position
                        line.height = -line.height;
                        line.y -= line.height;
                    }
                });
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

    addPointerEventsToObject(object) {

        // add rectangle to start and end point
        const startPoint = this.add.rectangle(object.x, object.y, 3, 3, 0x00ff00).setOrigin(0);
        const endPoint = this.add.rectangle(object.x + object.width - 3, object.y + object.height - 3, 3, 3, 0x00ff00).setOrigin(0);
        startPoint.setInteractive().on('pointerdown', function (pointer) {
            window.scene.pointPicker = {
                x: startPoint.x,
                y: startPoint.y
            }
        });
        endPoint.setInteractive().on('pointerdown', function (pointer) {
            window.scene.pointPicker = {
                x: endPoint.x,
                y: endPoint.y
            }
        });

        object.startPoint = startPoint;
        object.endPoint = endPoint;

        object.setInteractive();

        object.on('pointerover', function (pointer) {
            if (isEraseButtonActive()) {
                object.setFillStyle(0xff0000);
            }
        });

        object.on('pointerout', function (pointer) {
            if (isEraseButtonActive()) {
                object.setFillStyle(0xffffff);
            }
        });

        object.on('pointerdown', function (pointer) {
            if (isEraseButtonActive()) {
                const index = lines.indexOf(object);
                window.scene.destroyLineByIndex(index);
            }
        });
    }

    destroyLineByIndex(index) {
        lines[index].startPoint.destroy();
        lines[index].endPoint.destroy();
        lines[index].destroy();
        cachedLines.push({
            x: lines[index].x,
            y: lines[index].y,
            width: lines[index].width,
            height: lines[index].height
        });
        lines.splice(index, 1);
    }

    getHeightAndWidth(length, rotation) {
        var height, width;
        if (rotation > -Math.PI / 4 && rotation < Math.PI / 4) {
            height = length;
            width = 3;
        }
        if (rotation >= Math.PI / 4 && rotation <= 3 * Math.PI / 4) {
            height = 3;
            width = length;
        }
        if (rotation <= -Math.PI / 4 && rotation >= -3 * Math.PI / 4) {
            height = 3;
            width = -length;
        }
        if (rotation > 3 * Math.PI / 4 || rotation < -3 * Math.PI / 4) {
            height = -length;
            width = 3;
        }
        return { height, width };
    }
}
