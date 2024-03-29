class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity, spawnY) {
        // call Phaser Physics Sprite constructor
        super(scene, game.config.width + 100, spawnY, 'projectile')
        
        this.parentScene = scene               

        // set up physics sprite
        this.parentScene.add.existing(this)    
        this.parentScene.physics.add.existing(this) 
        this.setVelocityX(velocity)         
        this.setImmovable()                    
        this.newProjectile = true
    }

    update() {

        if(this.x < 0) {
            this.destroy()
        }
    }
}