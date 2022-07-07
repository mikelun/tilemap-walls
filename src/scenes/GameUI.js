import Phaser from "phaser";
import { blockCameraMovement, unblockCameraMovement } from "../utils/cameraController";

var lineButton, eraseButton;

export class GameUi extends Phaser.Scene {
    constructor() {
        super({ key: "GameUI" });
    }

    create() {
        lineButton = this.add.rectangle(20, 20, 50, 50, 0xffffff).setOrigin(0, 0).setInteractive();
        lineButton.on("pointerdown", () => {
            if (lineButton.fillColor === 0xffffff) {
                setLineButtonActive(true);
            } else {
                setLineButtonActive(false);
            }
        });

        eraseButton = this.add.rectangle(20, 80, 50, 50, 0xffffff).setOrigin(0, 0).setInteractive();
        eraseButton.on("pointerdown", () => {
            if (eraseButton.fillColor === 0xffffff) {
                setEraseButtonActive(true);
            } else {
                setEraseButtonActive(false);
            }
        });
    }

    update() {
        
    }
}

export function isLineButtonActive() {
    return lineButton?.fillColor === 0x00ff00;
}

export function setLineButtonActive(active) {
    if (active) {
        blockCameraMovement();
        setEraseButtonActive(false);
        lineButton.setFillStyle(0x00ff00);
    } else {
        unblockCameraMovement();
        lineButton.setFillStyle(0xffffff);
    }
}

export function isEraseButtonActive() {
    return eraseButton?.fillColor === 0xff0000;
}

export function setEraseButtonActive(active) {
    if (active) {
        setLineButtonActive(false);
        eraseButton.setFillStyle(0xff0000);
    } else {
        eraseButton.setFillStyle(0xffffff);
    }
}