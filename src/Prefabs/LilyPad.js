class LilyPad extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity, spawnX, spawnY) {
        // call Phaser Physics Sprite constructor
        super(scene, spawnX, spawnY, 'lilypad')
        
        this.parentScene = scene               

        this.lilyVelocity = velocity

        // set up physics sprite
        this.parentScene.add.existing(this)    
        this.parentScene.physics.add.existing(this) 
        this.setVelocityX(velocity)         
        this.setImmovable()                    
        this.newLilyPad = true
        this.frogPadDif = 0
    }

    update() {

        if(this.x < -64 && this.lilyVelocity < 0) {
            this.setPosition(game.config.width + 64, this.y)

            if(this.parentScene.currentLilyPad == this){
                this.parentScene.frog.setPosition(this.x + this.frogPadDif, this.y)
            }
            
        }
        else if(this.x > game.config.width + 64 && this.lilyVelocity > 0) {
            this.setPosition(-64, this.y)
            if(this.parentScene.currentLilyPad == this){
                this.parentScene.frog.setPosition(this.x + this.frogPadDif, this.y)
            }
        }
        else {
            this.frogPadDif = this.parentScene.frog.x - this.x
        }
    }
}