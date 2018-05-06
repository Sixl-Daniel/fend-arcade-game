/*
 * Game
 *******************/
class GameModel {

    constructor() {
        this.numberEnemies = 12;
        this.roundsMax = 10;
        this.roundInitial = 1;
        this.round = null;
    }

    init() {
        this.round = this.roundInitial;
    }

}

class GameView {

    constructor() {

        // store pointers to DOM elements
        this.lives = document.querySelector('.lives');
        this.round = document.querySelector('.round');
        this.roundsMax = document.querySelector('.roundsMax');

        // add event listeners
        document.addEventListener('keyup', function (e) {
            gameController.handleInput(e.keyCode);
        });

    }

    init() {
        // this.renderAll();
    }

    /* render methods */

    // renderLives() {
    //         this.lives.className = 'lives lives--count-' + gameController.getLives();
    // }

    // renderRound() {
    //     this.round.textContent = gameController.getRound();
    //     this.roundsMax.textContent = gameController.getRoundsMax();
    // }

    // renderAll() {
    //     this.renderLives();
    //     this.renderRound();
    // }

}

class GameController {

    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.enemies = [];
        this.player = null;
    }

    init() {
        this.model.init();
        this.view.init();
        this.audio = new Audio;
        this.enemies = Enemy.makeEnemies(this.model.numberEnemies);
        this.player = Player.makePlayer();
        console.log(this.player);
        debugger;
    }

    handleInput(keycode) {
        const direction =
            keycode == 37 || keycode == 65 ? 'left' :
            keycode == 38 || keycode == 87 ? 'up' :
            keycode == 39 || keycode == 68 ? 'right' :
            keycode == 40 || keycode == 83 ? 'down' : null;
        if(direction) {
            this.audio.step();
            this.player.move(direction);
        }    
    }

    dispatchCollision() {
        this.audio.hit();
        this.decreaseLives();
        this.player.reset();
    }

    /* lives */

    // getLives() {
    //     return this.player._lives;
    // }

    // increaseLives() {
    //     this.player._lives += 1;
    //     view.renderLives();
    // }

    // decreaseLives() {
    //     if(player._lives > 0) {
    //         player._lives -= 1;
    //         view.renderLives();
    //     } else {
    //         //this.initFailure();
    //     }
    // }

    /* rounds */

    // getRound() {
    //     return this.model.round;
    // }

    // getRoundsMax() {
    //     return this.model.roundsMax;
    // }

    // increaseRound() {
    //     if (this.model.round < this.model.roundsMax) {
    //         this.model.round += 1;
    //         view.renderRound();
    //         // TODO this.increaseRandomSpeed();
    //         this.player.reset();
    //     } else {
    //         setTimeout(function () {
    //             // TODO controller.initVictory();
    //         }, 800);
    //     }
    // }

    // decreaseRound() {
    //     this.model.round -= 1;
    //     view.renderRound();
    // }

    // resetRound() {
    //     this.model.round = this.model.roundInitial;
    //     view.renderRound();
    // }

}

/*
 * Game characters
 *******************/

class Character {

    constructor() {
        this._x = 0;
        this._y = 0;
    }

    render() {
        ctx.drawImage(Resources.get(this._sprite), this._x, this._y);
    }

    getRandomSprite() {
        return this._sprites[_.random(0, this._sprites.length - 1)];
    }

}

class Player extends Character {

    constructor() {

        super();

        this._livesInitial = 3;
                    
        this._lives = null;

        this._step = 50;

        this._sprites = [
            'images/char-boy.png',
            'images/char-cat-girl.png',
            'images/char-horn-girl.png',
            'images/char-pink-girl.png',
            'images/char-princess-girl.png'
        ];

        this._sprite = this.getRandomSprite();

        this._boundaries = {
            top: -20,
            left: 20,
            right: 384,
            bottom: 404,
            centerX: 202
        }

        this._x = this._boundaries.centerX;
        this._y = this._boundaries.bottom;

        this.init();

    }

    init() {
        this._lives = this._livesInitial;
    }

    update(dt) {
        this._step * dt;
    }

    pushAside() {
        this._x += _.random(5, 20);
        this._y += _.random(-10, 10);
    }

    reset() {
        this._x = this._boundaries.centerX;
        this._y = this._boundaries.bottom;
    }

    getCoordinates() {
      return {
          x: this._x,
          y: this._y
      }
    }

    move(direction) {
        if (direction == 'left' && this._x > this._boundaries.left) {
            this._x -= this._step;
        } else if (direction == 'right' && this._x < this._boundaries.right) {
            this._x += this._step;
        } else if (direction == 'up' && this._y > this._boundaries.top) {
            this._y -= this._step;
        } else if (direction == 'down' && this._y < this._boundaries.bottom) {
            this._y += this._step;
        }
    }

    static makePlayer() {
        return new Player();
    }

}

class Enemy extends Character {

    constructor() {

        super();

        this._sprites = [
            'images/enemy-bug-0.png',
            'images/enemy-bug-1.png',
            'images/enemy-bug-2.png',
            'images/enemy-bug-3.png',
            'images/enemy-bug-4.png',
            'images/enemy-bug-5.png',
            'images/enemy-bug-6.png',
            'images/enemy-bug-7.png',
            'images/enemy-bug-8.png',
            'images/enemy-bug-9.png',
            'images/enemy-bug-10.png',
            'images/enemy-bug-11.png',
            'images/enemy-bug-12.png',
        ];

        this._sprite = this.getRandomSprite();

        this._position = {
            startX: -105,
            endX: 505,
            factorXMin: 1.1,
            factorXMax: 15,
            minY: 50,
            maxY: 320
        };

        this._collisionDistance = 50;

        this._speed = {
            minInitial: 40,
            maxInitial: 150,
            increaseAmount: 100,
            min: null,
            max: null,
            current: null
        };

        this.init()

    }

    init() {
        this._speed.min = this._speed.minInitial;
        this._speed.max = this._speed.maxInitial;
        this._speed.current = this._speed.minInitial;
        this.randomize();
    }

    update(dt) {
        if (this._x > this._position.endX) {
            this.randomize();
        } else {
            this._x += this._speed.current * dt;
            this.checkCollision();
        }
    }

    randomize() {
        this._x = this.getRandomStartPositionX();
        this._y = this.getRandomStartPositionY();
        this._speed.current = this.getRandomSpeed();
    }

    checkCollision() {
        const dh = this._x - player.getCoordinates().x;
        const dv = this._y - player.getCoordinates().y;
        const proximity = Math.sqrt(dh * dh + dv * dv);
        if (proximity < this._collisionDistance) {
            this._speed.current = this._speed.min;
            gameController.dispatchCollision();
        }
    }

    getRandomStartPositionX() {
        return this._position.startX + _.random(this._position.factorXMin, this._position.factorXMax) * this._position.startX;
    }

    getRandomStartPositionY() {
        return _.random(this._position.minY, this._position.maxY);
    }

    getRandomSpeed() {
        return _.random(this._speed.min, this._speed.max);
    }

    static makeEnemies(number) {
        const enemyCue = [];
        for (let enemy = 0; enemy < number; ++enemy) {
            enemyCue[enemy] = new Enemy();
        }
       return enemyCue;
    }

}

/*
 * Game audio
 *************************************/

class Audio {

    constructor() {

        this._audioPath = './audio/';

        this._volumeBackgroundMusic = 0.3;
        this._volumeCollision = 0.5;
        this._volumeGameEnd = 0.8;

        this._sounds = {
            step: new Howl({
                src: [this._audioPath + 'step.webm', this._audioPath + 'step.mp3', this._audioPath + 'step.wav'],
            }),
            background: new Howl({
                src: [this._audioPath + 'background.webm', this._audioPath + 'background.mp3', this._audioPath + 'background.wav'],
                loop: true,
                autoplay: true,
                volume: 0
            }),
            hit: new Howl({
                src: [this._audioPath + 'hit.webm', this._audioPath + 'hit.mp3', this._audioPath + 'hit.wav'],
                volume: this._volumeCollision
            }),
            failure: new Howl({
                src: [this._audioPath + 'failure.webm', this._audioPath + 'failure.mp3', this._audioPath + 'failure.wav'],
                volume: this._volumeGameEnd
            }),
            victory: new Howl({
                src: [this._audioPath + 'victory.webm', this._audioPath + 'victory.mp3', this._audioPath + 'victory.wav'],
                volume: this._volumeGameEnd
            })
        };

        this.init();

    }

    init() {
        this.fadeMusicIn();
    }

    /* methods sound effects */

    step() {
        this._sounds.step.play();
    }

    hit() {
        this._sounds.hit.play();
    }

    failure() {
        this._sounds.failure.play();
    }

    victory() {
        this._sounds.victory.play();
    }

    /* methods background music */

    fadeMusicIn() {
        this._sounds.background.fade(0, this._volumeBackgroundMusic, 6000);
    }

    fadeMusicOut() {
        this._sounds.background.fade(this._volumeBackgroundMusic, 0, 6000);
    }

    fadeMusicOutFast() {
        this._sounds.background.fade(this._volumeBackgroundMusic, 0, 1000);
    }

    setSpeedMusic(round) {
        this._sounds.background.rate(1 + (round - 1) * 0.01);
    }

    resetSpeedMusic() {
        this._sounds['background'].rate(1);
    }

}

/*
 * Run
 *************************************/

const gameModel = new GameModel;
const gameView = new GameView;
const gameController = new GameController(gameModel, gameView);

gameController.init();
