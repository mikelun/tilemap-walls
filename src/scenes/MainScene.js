import Phaser from 'phaser'

export default class HelloWorldScene extends Phaser.Scene
{
	constructor()
	{
		super('hello-world')
	}

	preload()
    {
        this.load.image('map', 'assets/map.png');
        this.load.image('map-fg', 'assets/map-fg.png');
    }

    create()
    {
        this.add.image(0, 0, 'map').setOrigin(0, 0);
        this.add.image(0, 0, 'map-fg').setOrigin(0, 0);
    }
}
