class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        this.frogVelocity = 700
        this.frogMaxVelocity = 800
        this.frogBounce = 0.5

        //lily pads
        this.lilyPadSpeed = -150
        this.lilyPadStartSpawnDelay = 1000
        this.lilyPadSpawnDelay = 2000
        this.lilyPadPos = new Phaser.Math.Vector2()
        this.lilyPadRandom = 0
        this.onLilyPad = false
        this.lilyCounter = 0
        this.currentLilyPad

        //enemy
        this.enemySpeed = -100
        this.enemyStartSpawnDelay = 1000
        this.enemySpawnDelay = 1500
        this.enemyPos = new Phaser.Math.Vector2()
        this.enemyRandom = 0
        this.tempEnemy = 0
        // projectile
        this.projectileSpeed = -200
        this.frogProjectileSpeed = 300 // frog projectile speed
        this.projectileStartSpawnDelay = 3000
        this.projectileSpawnDelay = 6000
        this.projectilePos = new Phaser.Math.Vector2()
        this.projectileRandom = 0
        this.projectileEaten = false

        // hop points
        this.hopPoint = new Phaser.Math.Vector2()
        this.canHop = true

        // out of bounds
        this.outBounds = false
    }

    create() {

        // set up cursor keys
        cursors = this.input.keyboard.createCursorKeys()

        //creation of frog and its properties
        this.frog = this.physics.add.sprite(250, 375, 'frog').setOrigin(0.5).setScale(0.5)
        this.frog.setImmovable()
        this.frog.setMaxVelocity(this.frogMaxVelocity, this.frogMaxVelocity )
        this.frog.setDragY(this.frogDragY)
        this.frog.setDepth(1)
        this.frog.destroyed = false 

        // set up lily pad group
        this.lilyPadGroup = this.add.group({
            runChildUpdate: true // make sure update runs on group children
        })
        this.time.delayedCall(this.lilyPadStartSpawnDelay, () => { 
            //this.addLilyPad()
        })

        // set up enemy group
        this.enemyGroup = this.add.group({
            runChildUpdate: true // make sure update runs on group children
        })

        // set up projectile group
        this.projectileGroup = this.add.group({
            runChildUpdate: true // make sure update runs on group children
        })

        //set up frog projectile group
        this.frogProjectileGroup = this.add.group({
            runChildUpdate: true // make sure update runs on group children
        })

        // Create the attack sprite, but set it initially inactive
        this.attack = this.physics.add.sprite(-300, 0).setOrigin(0.5).setActive(false)
        this.attack.setSize(150, 75)

         // Handle overlap between attack and enemy
        this.physics.add.overlap(this.attack, this.enemyGroup, this.attackEnemyCollision, null, this)

        //create the eat sprite, but set it initially inactive
        this.eat = this.physics.add.sprite(-300, 0).setOrigin(0.5).setActive(false)
        this.eat.setSize(300, 75)

        // Handle overlap between eat and projectile
        this.physics.add.overlap(this.eat, this.projectileGroup, this.eatProjectileCollision, null, this)
         
        // spawn lily pads every X seconds
        this.lilyPadSpawnTimer = this.time.addEvent({
            delay: this.lilyPadSpawnDelay,
            callback: this.addLilyPad,
            callbackScope: this,
            repeat: 15
        })

        /*
        // challenge timer that increases spawn rate of enemies and projectiles
        this.challengeTimer = this.time.addEvent({
            delay: 15000,
            callback: this.addChallenge,
            callbackScope: this,
            loop: true
        })

        // spawn enemies every X seconds
        this.enemySpawnTimer = this.time.addEvent({
            delay: this.enemySpawnDelay,
            callback: this.addEnemy,
            callbackScope: this,
            loop: true
        })

        // spawn projectiles every 5 seconds
        this.projectileSpawnTimer = this.time.addEvent({
            delay: this.projectileSpawnDelay,
            callback: this.addProjectile,
            callbackScope: this,
            loop: true
        }) */
    }

    update() {

        if(this.frog.x > game.config.width || this.frog.x < 0) {
            this.canHop = false
            this.outBounds = true
            console.log('out of bounds')
        }
        else if(this.outBounds && (this.frog.x < game.config.width || this.frog.x > 0)){
            this.canHop = true
            this.outBounds = false
            console.log('in bounds')
        }

        // movement inputs
        if(Phaser.Input.Keyboard.JustDown(cursors.down)) {
            if(this.frog.y < 525 && this.canHop) {
                //hop to test
                this.canHop = false
                this.hopPoint.x = this.frog.x
                this.hopPoint.y = this.frog.y + 150
                this.physics.moveToObject(this.frog, this.hopPoint, this.frogVelocity)
                this.onLilyPad = false
                this.currentLilyPad = 0
                
            }
            if(this.outBounds){
                console.log('cant hop')
            }
        }
        else if(Phaser.Input.Keyboard.JustDown(cursors.up)) {
            if(this.frog.y > 75 && this.canHop) {
                //hop to test
                this.canHop = false
                this.hopPoint.x = this.frog.x
                this.hopPoint.y = this.frog.y - 150
                this.physics.moveToObject(this.frog, this.hopPoint, this.frogVelocity)
                this.onLilyPad = false
                this.currentLilyPad = 0
            }
            if(this.outBounds){
                console.log('cant hop')
            }
        }

        // attack input
        if(Phaser.Input.Keyboard.JustDown(cursors.right)) {
            
            this.attack.setPosition(this.frog.x + 75, this.frog.y).setActive(true)
            this.time.delayedCall(100, () => { 
                this.attack.setPosition(-300, 0) // remove sprite from canvas until called again
            })
        }

        // eat input
        if(Phaser.Input.Keyboard.JustDown(cursors.left)) {
            
            /*
            if(!this.projectileEaten) {
                this.eat.setPosition(this.frog.x + 150, this.frog.y).setActive(true)
                this.time.delayedCall(100, () => { // wait 1 tenth of a second
                    this.eat.setPosition(-300, 0) // remove sprite from canvas until called again
                })
            }

            else if (this.projectileEaten) {
                this.addFrogProjectile()
                this.projectileEaten = false
            }*/

            this.attack.setPosition(this.frog.x - 75, this.frog.y).setActive(true)
            this.time.delayedCall(100, () => { 
                this.attack.setPosition(-300, 0) // remove sprite from canvas until called again
            })

        }


        // check to see if frog has reached hop point
        const tolerance = 4;

        const distance = Phaser.Math.Distance.BetweenPoints(this.frog, this.hopPoint)
        
        if (distance < tolerance && !this.canHop)
        {
            this.frog.body.reset(this.hopPoint.x, this.hopPoint.y)
            this.canHop = true
            //console.log('on hop point')
        }

        /*
        if(this.frog.x < -128) {
            this.frog.setPosition(this.currentLilyPad.x, this.currentLilyPad.y)
            console.log('went left')
        }
        else if(this.frog.x > game.config.width + 128) {
            this.frog.setPosition(this.currentLilyPad.x, this.currentLilyPad.y)
            console.log('went right')
        }*/

        // collisions
        this.physics.world.collide(this.frog, this.enemyGroup, this.enemyCollision, null, this) //enemy vs frog
        this.physics.world.collide(this.frogProjectileGroup, this.enemyGroup, this.frogProjectileEnemyCollision, null, this) //frog projectile vs enemy
        this.physics.world.collide(this.frogProjectileGroup, this.projectileGroup, this.frogProjectileEnemyCollision, null, this) //frog projectile vs projectile
        
        // if not already on lily pad and isn't hopping off lily pad
        if(!this.onLilyPad && this.canHop){
            this.physics.world.collide(this.frog, this.lilyPadGroup, this.frogLilyPadCollision, null, this) // frog vs lily pad
        }
        
    }

    addLilyPad() {
        //console.log('lily spawn')

        // random spawns
        /*
        this.lilyPadRandom = Phaser.Math.Between(0, 3)

        if(this.lilyPadRandom == 0){
            this.lilyPadPos.x = game.config.width + 100
            this.lilyPadPos.y = 75
            this.lilyDir = this.lilyPadSpeed
        }
        else if(this.lilyPadRandom == 1) {
            this.lilyPadPos.x = -100
            this.lilyPadPos.y = 225
            this.lilyDir = -this.lilyPadSpeed
        }
        else if(this.lilyPadRandom == 2) {
            this.lilyPadPos.x = game.config.width + 100
            this.lilyPadPos.y = 375
            this.lilyDir = this.lilyPadSpeed
        }
        else if(this.lilyPadRandom == 3) {
            this.lilyPadPos.x = -100
            this.lilyPadPos.y = 525
            this.lilyDir = -this.lilyPadSpeed
        }*/

        if(this.lilyCounter < 4){
            this.lilyPadPos.x = game.config.width + 100
            this.lilyPadPos.y = 75
            this.lilyDir = this.lilyPadSpeed
        }

        else if(this.lilyCounter < 8){
            this.lilyPadPos.x = -100
            this.lilyPadPos.y = 225
            this.lilyDir = -this.lilyPadSpeed
        }

        else if(this.lilyCounter < 12){
            this.lilyPadPos.x = game.config.width + 100
            this.lilyPadPos.y = 375
            this.lilyDir = this.lilyPadSpeed
        }

        else if(this.lilyCounter < 16){
            this.lilyPadPos.x = -100
            this.lilyPadPos.y = 525
            this.lilyDir = -this.lilyPadSpeed
        }

        this.lilyPad = new LilyPad(this, this.lilyDir, this.lilyPadPos.x, this.lilyPadPos.y).setScale(0.5)
        this.lilyPad.body.setSize(80, 80)

        this.lilyPadGroup.add(this.lilyPad)

        this.lilyCounter++
        //console.log(this.lilyCounter)
    }

    frogLilyPadCollision(frog, lilyPad) {
        if(this.frog.y == 75 || this.frog.y == 225 || this.frog.y == 375 || this.frog.y == 525 ){
            this.onLilyPad = true
            this.currentLilyPad = lilyPad
            //console.log('lily pad!')
            this.frog.setVelocityY(0)

            if(lilyPad.body.velocity.x > 0){
                this.frog.setVelocityX(-this.lilyPadSpeed)
            }
            else{
                this.frog.setVelocityX(this.lilyPadSpeed)
            }
            
        }
    }

    addEnemy() {

        this.enemyRandom = Phaser.Math.Between(0, 3)

        if(this.enemyRandom == 0){
            this.enemyPos.y = 75
        }
        else if(this.enemyRandom == 1) {
            this.enemyPos.y = 225
        }
        else if(this.enemyRandom == 2) {
            this.enemyPos.y = 375
        }
        else if(this.enemyRandom == 3) {
            this.enemyPos.y = 525
        }

        this.enemy = new Enemy(this, this.enemySpeed, this.enemyPos.y).setScale(0.5)

        this.enemyGroup.add(this.enemy)
    }

    attackEnemyCollision(attack, enemy) {

        //console.log('enemy hit')

        // Destroy the enemy
        enemy.destroy()
        
    }

    enemyCollision(frog, enemy) {
        //console.log('Frog Hit!')

    }

    addProjectile() {
        
        this.projectileRandom = Phaser.Math.Between(0, 3)

        if(this.projectileRandom == 0){
            this.projectilePos.y = 75
        }
        else if(this.projectileRandom == 1) {
            this.projectilePos.y = 225
        }
        else if(this.projectileRandom == 2) {
            this.projectilePos.y = 375
        }
        else if(this.projectileRandom == 3) {
            this.projectilePos.y = 525
        }

        this.projectile = new Projectile(this, this.projectileSpeed, this.projectilePos.y).setScale(0.5)

        this.projectileGroup.add(this.projectile)
    }

    eatProjectileCollision(eat, projectile) {
        //console.log('projectile hit')
        this.projectileEaten = true
        projectile.destroy()
    }

    addFrogProjectile() {
        
        this.frogProjectile = new FrogProjectile(this, this.frogProjectileSpeed, this.frog.x, this.frog.y).setScale(0.5)
        this.frogProjectileGroup.add(this.frogProjectile)
        //console.log('add frog projectile')
    }

    frogProjectileEnemyCollision(frogProjectile, enemy) {
        frogProjectile.destroy() // can turn this off to make it go through enemies!
        enemy.destroy()
    }

    addChallenge() {
        // spawn faster
        if(this.projectileSpawnDelay > 2000){
            this.projectileSpawnDelay -= 250
            this.projectileSpawnTimer.delay = this.projectileSpawnDelay
        }
        if(this.enemySpawnDelay > 500) {
            this.enemySpawnDelay -= 100
            this.enemySpawnTimer.delay = this.enemySpawnDelay
        }
    }
}