console.log("Flappy Bird")

let frames = 0
const hit = new Audio()
hit.src = './sounds/hit.wav'

const sprites = new Image()
sprites.src = './sprites/sprites.png'

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

const background = {
    spriteX: 390,
    spriteY: 0,
    width: 275,
    height: 204,
    x: 0,
    y: canvas.height - 204,
    draw() {
        context.fillStyle = '#70c5ce'
        context.fillRect(0, 0, canvas.width, canvas.height)
        
        context.drawImage(
            sprites,
            this.spriteX, this.spriteY,
            this.width, this.height,
            this.x, this.y,
            this.width, this.height,
        )
        context.drawImage(
            sprites,
            this.spriteX, this.spriteY,
            this.width, this.height,
            this.x+this.width, this.y,
            this.width, this.height,
        )
    }
}

function createGround() {
    const ground = {
        spriteX: 0,
        spriteY: 610,
        width: 224,
        height: 112,
        x: 0,
        y: canvas.height - 112,
        draw() {
            context.drawImage(
                sprites,
                this.spriteX, this.spriteY,
                this.width, this.height,
                this.x, this.y,
                this.width, this.height,
            )
      
            context.drawImage(
                sprites,
                this.spriteX, this.spriteY,
                this.width, this.height,
                (this.x+this.width), this.y,
                this.width, this.height,
            )
        },
        refresh() {
            const groundMovement = 1
            const repete = ground.width/2
            const move = ground.x - groundMovement

            ground.x = move % repete
        }
    }
    return ground
}

function createFlappyBird() {
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        width: 33,
        height: 24,
        x: 10,
        y: canvas.height/2 - 24,
        speed: 0,
        gravity: 0.25,
        jumpSpeed: 4.6,
        moves: [
            { spriteX: 0, spriteY: 0, }, // asa pra cima
            { spriteX: 0, spriteY: 26, }, // asa no meio 
            { spriteX: 0, spriteY: 52, }, // asa pra baixo
            { spriteX: 0, spriteY: 26, }, // asa no meio 
          ],
        frame: 0,
        setFrame() {
            if(frames % 10 == 0) {
                this.frame = (this.frame + 1) % this.moves.length
            }
        },
        draw() {
            this.setFrame()
            const { spriteX, spriteY } = this.moves[this.frame]
            context.drawImage(
            sprites,
            spriteX, spriteY,
            this.width, this.height,
            this.x, this.y,
            this.width, this.height,
        )
        },
        jump() {
            flappyBird.speed = -this.jumpSpeed
        },
        refresh() {

            this.speed += this.gravity
            this.y += this.speed
        }
    }
    return flappyBird
}

function createPipes() {
    const pipes = {
        top: {
            spriteX: 52,
            spriteY: 169,
        },
        bottom: {
            spriteX: 0,
            spriteY: 169,
        },
        width: 52,
        height: 400,
        space: 100,
        colided: false,
        colision(pair) {
            bird = globais.flappyBird.x + globais.flappyBird.width
            return bird >= pair.x ? true : false
        },
        draw() {
            pipes.pairs.forEach( pairs => {
                const random = pairs.y

                const pipeTopX = pairs.x
                const pipeTopY = 0 + random
                context.drawImage(
                    sprites,
                    this.top.spriteX, this.top.spriteY,
                    this.width, this.height,
                    pipeTopX, pipeTopY,
                    this.width, this.height,
                )
        
                const pipeBottomX = pairs.x
                const pipeBottomY = random + this.height + this.space
                context.drawImage(
                    sprites,
                    this.bottom.spriteX, this.bottom.spriteY,
                    this.width, this.height,
                    pipeBottomX, pipeBottomY,
                    this.width, this.height,
                )
            })
        },
        pairs: [],
        refresh() {
            this.pairs.forEach( pair => {
                pair.x -= 1
                // if(this.colision(pair)) {
                //     console.log('Bateu no cano')
                // }
                pair.x + this.width <= 0 ? this.pairs.shift() : undefined
            })
            
            const isPassedFrames = frames % 200 === 0
            if(isPassedFrames) {
                this.pairs.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1)
                })
            }
            
        }
    }
    return pipes
}

const startScreen = {
    spriteX: 134,
    spriteY: 0,
    width: 174,
    height: 152,
    x: (canvas.width/2) - 174/2,
    y: canvas.height/2 -152,
    draw() {
        context.drawImage(
            sprites,
            this.spriteX, this.spriteY,
            this.width, this.height,
            this.x, this.y,
            this.width, this.height
        )
    }
}

const gameOverScreen = {
    spriteX: 134,
    spriteY: 153,
    width: 226,
    height: 200,
    x: (canvas.width/2) - 226/2,
    y: 50,
    draw() {
        context.drawImage(
            sprites,
            this.spriteX, this.spriteY,
            this.width, this.height,
            this.x, this.y,
            this.width, this.height
        )
    }
}

const globais = {}

const Screens = {
    Start: {
        inicialize() {
            globais.flappyBird = createFlappyBird()
            globais.ground = createGround()
            globais.pipes = createPipes()
        },
        draw() {
            background.draw()
            globais.flappyBird.draw()
            globais.ground.draw()
            startScreen.draw()
        },
        click() {
            changeScreen(Screens.Game)
        },
        refresh() {
            globais.ground.refresh()
        }
    },
    Game: {
        draw() {
            background.draw()
            globais.flappyBird.draw()
            globais.pipes.draw()
            globais.ground.draw()
        },
        click() {
            globais.flappyBird.jump()
        },
        refresh() {
            globais.flappyBird.refresh()
            globais.ground.refresh()
            globais.pipes.refresh()
        }
    },
    GameOver: {
        draw() {
            background.draw()
            globais.flappyBird.draw()
            globais.pipes.draw()
            globais.ground.draw()
            gameOverScreen.draw()
        },
        click() {
            changeScreen(Screens.Start)
        }
    }
}

let activeScreen

function changeScreen(newScreen) {
    activeScreen = newScreen
    activeScreen.inicialize ? activeScreen.inicialize() : null
}

function colision(flappyBird, ground) {
    const flappyBirdHead = flappyBird.y
    const flappyBirdFoot = flappyBird.y+flappyBird.height
    const flappyBirdBeak = flappyBird.x + flappyBird.width
    const groundY = ground.y
    const pipeX = globais.pipes.pairs.length>0 ? globais.pipes.pairs[0].x : canvas.width
    const pipeY = globais.pipes.pairs.length>0 ? globais.pipes.pairs[0].y : canvas.height


    const colidedWithGround = flappyBirdFoot >= groundY
    const colidedWithPipe = flappyBirdBeak >= pipeX && (flappyBirdHead <= pipeY+globais.pipes.height || flappyBirdFoot>= pipeY+globais.pipes.height+globais.pipes.space)
    return colidedWithGround || colidedWithPipe ? true : false
}

function loop() {
    activeScreen.draw()
    if (activeScreen== Screens.Game && colision(globais.flappyBird, globais.ground)) {
        console.log('Bateu no chão')
        hit.play()
        setTimeout(()=>{
            changeScreen(Screens.GameOver)
        },500)
    } else {
        activeScreen.refresh ? activeScreen.refresh() : null
    }

    frames += 1
    requestAnimationFrame(loop)
}

window.addEventListener('click', () => {
    activeScreen.click ? activeScreen.click() : null
})

changeScreen(Screens.Start)
loop()