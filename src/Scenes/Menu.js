class Menu extends Phaser.Scene{ //Menu class becomes a child of Phaser.Scene
    constructor(){
        super("menuScene")
    }

    preload() {
        this.load.path = './assets/'
        this.load.image('flytrap', 'flytrap.png')
        this.load.image('frog', 'Frog.png')
        this.load.image('enemy', 'Enemy.png')
        this.load.image('projectile', 'Projectile.png')
        this.load.image('lilypad', 'Lilypad.png')
    }

    create() {
        this.scene.start('playScene')
    }
}