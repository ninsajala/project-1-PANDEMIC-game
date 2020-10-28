let player
let name
let canvas
let ctx
const gameBoard = document.getElementById('game-board')

const myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 500;
        this.canvas.height = 500;
        ctx = this.canvas.getContext("2d");
        gameBoard.appendChild(this.canvas)
        this.interval = setInterval(updateGameScreen, 20);
        this.frameNo = 0;
        this.spraySound = new Sound('../sound-effects/spray-effect.mp3')
        this.cleanSound = new Sound(`../sound-effects/clean-effect.mp3`)
        this.
        updateScoreScreen(player)
        updateImmunityScreen(player)
    },

    clear: function () {
        let img = new Image()
        img.src = '../images/background-option.jpeg'
        ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    }

    //stop: function clearInterval
    //score function
}


function updateScoreScreen(player) {
    ctx.font = "20px Creepster";
    ctx.fillStyle = "black";
    ctx.fillText(`Score: ${player.score}`, 400, 20);
}

function updateImmunityScreen(player) {
    ctx.font = "20px Creepster";
    ctx.fillStyle = "black";
    ctx.fillText(`Immunity: ${player.immunity}`, 400, 50);
}

function Sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
}

class Player {
    constructor() {
        this.x = 240
        this.y = 425
        this.width = 50
        this.height = 75
        this.speedX = 0
        this.score = 0
        this.immunity = 3
    }

    newPosition() {
        this.x += this.speedX
    }

    update() {
        let img = new Image()
        img.src = `../images/bottle.png`
        ctx.drawImage(img, this.x, this.y, this.width, this.height)
    }

    left() {
        return this.x
    }
    right() {
        return this.x + this.width
    }
    top() {
        return this.y
    }
    bottom() {
        return this.y + this.height
    }

    crashWith(object) {
        if (
            this.top() === object.bottom() &&
            ((this.left() >= object.left() && this.left() < object.right()) ||
                (this.right() >= object.left() && this.right() < object.right())
            )
        ) {
            return true
        }
    }

    movePlayer(keyCode) {
        switch (keyCode) {
            case 39:
                if (this.x <= 470) {
                    return this.speedX += 4
                };
                break;
            case 37:
                if (this.x >= 5) {
                    return this.speedX -= 4;
                }
        }
    }

    decreaseImmunity() {
        return this.immunity -= 1
    }

    increaseScore(speed) {
        return this.score += speed
    }
}

document.addEventListener('keydown', function (e) {
    player.movePlayer(e.keyCode)
})

document.addEventListener('keyup', (e) => {
    switch (e.keyCode) {
        case 39:
            return player.speedX = 0
            break;
        case 37:
            return player.speedX = 0
    }
})

//SANITIZER
class Sanitizer {
    constructor(x) {
        this.x = x
        this.y = 500
        this.width = 30
        this.height = 30
        this.speedY = 5
    }

    newPosition() {
        this.y -= this.speedY
    }

    update() {
        let img = new Image()
        img.src = `../images/sanitizercloud.png`
        ctx.drawImage(img, this.x, this.y, this.width, this.height)
    }

    left() {
        return this.x
    }
    right() {
        return this.x + this.width
    }
    top() {
        return this.y
    }
    bottom() {
        return this.y + this.height
    }

    crashWith(object) {
        if (
            this.top() === (object.y + object.speed) &&
            ((this.left() >= (object.x + object.radius) && this.left() < (object.x + object.radius)) ||
                (this.right() >= (object.x + object.radius) && this.right() < (object.x + object.radius))
            )
        ) {
            return true
        }
    }
}

const allSanitizers = []

function newSanitizerSpray() {
    myGameArea.spraySound.play()
    let sanitizer = new Sanitizer(player.x)
    allSanitizers.push(sanitizer)
}

document.addEventListener('keydown', function (e) {
    e.preventDefault()
    if (e.keyCode === 32) {
        newSanitizerSpray()
    }
})

function checkIfSanitized() {
    for (let i = 0; i < allSanitizers.length; i++) {
        for (let j = 0; j < coronas.length; j++) {
            if (allSanitizers[i].crashWith(coronas[j])) {
                myGameArea.cleanSound.play()
                player.increaseScore(5)
                coronas[j].speed = 0
                coronas[j].x = 0
                coronas[j].radius = 0
            }
        }
    }
}

function updateSanitizers() {
    for (let i = 0; i < allSanitizers.length; i++) {
        allSanitizers[i].newPosition()
        allSanitizers[i].update()
    }
}

function updateGameScreen() {
    myGameArea.clear(); //clears the canvas to print new graphic
    player.newPosition(); //places player on new coordinates
    player.update(); //puts canvas of player on screen
    //checkGameOver(); // immunity=0
    updateScoreScreen(player);
    updateImmunityScreen(player);
    updateSanitizers();
    updateCoronas()
    checkIfSanitized()
}

const coronas = [];

function updateCoronas() {
    for (let i = 0; i < coronas.length; i++) {
        let oneCorona = coronas[i];
        oneCorona.y += 1;
        // creating circles
        ctx.beginPath();
        // color the circles
        ctx.fillStyle = "rgb(255,127,80)";
        // drawing circle
        ctx.arc(oneCorona.x, oneCorona.y += oneCorona.speed / 2, oneCorona.speed * 0.8, 0, oneCorona.radius);
        ctx.fill();
    }

    myGameArea.frameNo += 1
    if (myGameArea.frameNo % 120 === 0) {
        let x = Math.floor(Math.random() * 500);
        let speed = Math.floor(Math.random() * 5);
        let radius = 10 * Math.PI;

        coronas.push({
            x: x,
            y: 0,
            speed: speed,
            radius: radius
        })
    }
}

const startButton = document.getElementById('start-button')

startButton.addEventListener('click', function () {
    startButton.innerHTML = 'Restart'
    player = new Player()
    myGameArea.start()
})

//To do:
//Write game over function that checks if immunity is 0 and stops interval if true
//Player crash with corona function --> call decrease immunity