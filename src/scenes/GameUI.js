import Phaser from "phaser";
import { blockCameraMovement, unblockCameraMovement } from "../utils/cameraController";

var lineButton;

export class GameUi extends Phaser.Scene {
    constructor() {
        super({ key: "GameUI" });
    }

    create() {
        lineButton = this.add.rectangle(20, 20, 50, 50, 0xffffff).setOrigin(0, 0).setInteractive();
        lineButton.on("pointerdown", () => {
            if (lineButton.fillColor === 0xffffff) {
                lineButton.setFillStyle(0x00ff00);
                blockCameraMovement();
            } else {
                lineButton.setFillStyle(0xffffff);
                unblockCameraMovement();
            }
        });
    }

    update() {
        
    }
}

export function isButtonActive() {
    return lineButton?.fillColor === 0x00ff00;
}