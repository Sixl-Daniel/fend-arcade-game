/* 
 * GAME — MODEL
 */

const model = {
    
    init: function() {

        /*
         * set initial model values
         */

        this.game.round = this.game.roundInitial;
        this.player.lives = this.player.livesInitial;
        this.enemies.speed.min = this.enemies.speed.minInitial;
        this.enemies.speed.max = this.enemies.speed.maxInitial;

        /* 
         * character entities
         */

        // enemies

        const Enemy = function() {
            model.enemies.randomize(this);
            this.sprite = model.enemies.getRandomSprite();
        };

        Enemy.prototype.update = function(dt) {
            if (this.x > model.enemies.position.endX) {
                model.enemies.randomize(this);
            } else {
                this.x += this.speed * dt;
                model.enemies.checkPlayerPosition(this.x, this.y);
            }
        };

        Enemy.prototype.render = function() {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        };

        // player

        const Player = function() {
            this.x = model.game.boundaries.centerX;
            this.y = model.game.boundaries.bottom;
            this.sprite = model.player.getRandomSprite();
        };

        Player.prototype.update = function(dt) {
            this.speed * dt;
        };

        Player.prototype.render = function() {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        };

        Player.prototype.handleInput = function(direction) {
            if (direction == 'left' && this.x > model.game.boundaries.left) {
                this.x -= model.player.step;
                controller.playerHasMoved();
            } else if (direction == 'right' && this.x < model.game.boundaries.right) {
                this.x += model.player.step;
                controller.playerHasMoved();
            } else if (direction == 'up' && this.y > model.game.boundaries.top) {
                this.y -= model.player.step;
                controller.playerHasMoved();
            } else if (direction == 'down' && this.y < model.game.boundaries.bottom) {
                this.y += model.player.step;
                controller.playerHasMoved();
            }
        };

        /* 
         * instanciate global model entities 
         */

        function makeEnemies(number) {
            const allEnemies = [];
            for (let i = 0; i < number; ++i) {
                allEnemies[i] = new Enemy();
            }
            return allEnemies;
        }

        window.allEnemies = makeEnemies(model.enemies.number);
        window.player = new Player();

    },

    enemies: {
        number: 12,
        position: {
            startX: -105,
            endX: 505,
            factorXMin: 1.5,
            factorXMax: 15,
            minY: 50,
            maxY: 300
        },
        speed: {
            minInitial: 40,
            maxInitial: 160,
            min: null,
            max: null,
            increaseAmount: 100
        },
        sprite: 'images/enemy-bug-0.png',
        sprites: [
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
        ],
        getRandomSprite: function () {
            return model.enemies.sprites[_.random(0, model.enemies.sprites.length - 1)];
        },
        getRandomStartPositionY: function() {
            return _.random(model.enemies.position.minY, model.enemies.position.maxY);
        },
        getRandomStartPositionX: function() {
            return model.enemies.position.startX + _.random(model.enemies.position.factorXMin, model.enemies.position.factorXMax) * model.enemies.position.startX;
        },
        getRandomSpeed: function() {
            return _.random(model.enemies.speed.min, model.enemies.speed.max);
        },
        randomize: function(object) {
            object.x = model.enemies.getRandomStartPositionX();
            object.y = model.enemies.getRandomStartPositionY();
            object.speed = model.enemies.getRandomSpeed();
        },
        checkPlayerPosition: function(x, y) {
            let h = x - player.x;
            let v = y - player.y;
            let proximity = Math.sqrt(h * h + v * v);
            if (proximity < 50) {
                controller.playerHasCrashed();
            }
        }
    },

    player: {
        livesInitial: 3,
        lives: null,
        step: 50,
        sprites: [
            'images/char-boy.png',
            'images/char-cat-girl.png',
            'images/char-horn-girl.png',
            'images/char-pink-girl.png',
            'images/char-princess-girl.png'
        ],
        getRandomSprite: function() {
            return model.player.sprites[_.random(0, model.player.sprites.length - 1)];
        }
    },

    game: {
        boundaries: {
            top: -20,
            left: 20,
            right: 384,
            bottom: 404,
            centerX: 202
        },
        allowedKeys: {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        },
        roundsMax: 10,
        roundInitial: 1,
        round: null,
        status: 'start'
    }

};

/* 
 * GAME — CONTROLLER
 */

const controller = {
    init: function() {
        model.init();
        view.init();
    },
    playerHasMoved: function() {
        view.sounds['step'].play();
        if (player.y <= -46) {
            this.increaseRound();
        }
    },
    playerHasCrashed: function () {
        view.sounds['hit'].play();
        this.resetPlayerPosition();
        this.decreaseLives();
        
    },
    resetPlayerPosition: function () {
        player.x = model.game.boundaries.centerX;
        player.y = model.game.boundaries.bottom;
    },
    resetGame: function() {
        view.resetSpeedMusic();
        this.resetRandomSpeed();
        this.resetLives();
        this.resetRound();
        this.resetPlayerPosition();
    },
    getLives: function () {
        return model.player.lives;
    },
    increaseLives: function () {
        model.player.lives += 1;
        view.renderLives();
    },
    decreaseLives: function () {
        if(model.player.lives>0) {
            model.player.lives -= 1;
            view.renderLives();
        } else {
            this.initFailure();
        } 
    },
    resetLives: function () {
        model.player.lives = model.player.livesInitial;
        view.renderLives();
    },
    getRound: function () {
        return model.game.round;
    },
    getRoundsMax: function () {
        return model.game.roundsMax;
    },
    increaseRound: function () {
        if (model.game.round < model.game.roundsMax) {
            model.game.round += 1;
            view.renderRound();
            this.increaseRandomSpeed();
            this.resetPlayerPosition();
        } else {
            setTimeout(function () { controller.initVictory(); }, 1000);
        }
    },
    decreaseRound: function () {
        model.game.round -= 1;
        view.renderRound();
    },
    resetRound: function () {
        model.game.round = model.game.roundInitial;
        view.renderRound();
    },
    increaseRandomSpeed: function () {
        model.enemies.speed.min = model.enemies.speed.minInitial + model.enemies.speed.increaseAmount;
        model.enemies.speed.max = model.enemies.speed.maxInitial + model.enemies.speed.increaseAmount;
    },
    resetRandomSpeed: function () {
        model.enemies.speed.min = model.enemies.speed.minInitial;
        model.enemies.speed.max = model.enemies.speed.maxInitial;
    },
    initVictory: function () {
        view.sounds['victory'].play();
        swal({
            title: 'Victory',
            text: 'You did it. Now do it again.',
            type: 'success',
            backdrop: '#4e66d2'
        });
        this.resetGame();
    },
    initFailure: function () {
        view.sounds['failure'].play();
        swal({
            title: 'Game Over',
            text:'The bugs got you. Try again.',
            type: 'error',
            backdrop: '#262a4f'
        });
        this.resetGame();
    },
};

/* 
 * GAME — VIEW
 */

const view = {
    init: function () {

        // store pointers to DOM elements

        this.lives = document.querySelector('.lives');
        this.round = document.querySelector('.round');
        this.roundsMax = document.querySelector('.roundsMax');

        // add event listeners

        document.addEventListener('keyup', function (e) {
            player.handleInput(model.game.allowedKeys[e.keyCode]);
        });

        // prepare audio

        const audioPath = './audio/';

        this.sounds = {
            step: new Howl({
                src: [audioPath + 'step.webm', audioPath + 'step.mp3', audioPath + 'step.wav'],
            }),
            background: new Howl({
                src: [audioPath + 'background.webm', audioPath + 'background.mp3', audioPath + 'background.wav'],
                loop: true,
                autoplay: true,
                volume: 0
            }),
            hit: new Howl({
                src: [audioPath + 'hit.webm', audioPath + 'hit.mp3', audioPath + 'hit.wav'],
                volume: 0.6
            }),
            failure: new Howl({
                src: [audioPath + 'failure.webm', audioPath + 'failure.mp3', audioPath + 'failure.wav']
            }),
            victory: new Howl({
                src: [audioPath + 'victory.webm', audioPath + 'victory.mp3', audioPath + 'victory.wav']
            })
        };

        // render all elements on init

        this.renderAll();

        // fade in background music on start

        this.sounds['background'].fade(0, 0.3, 6000);

    },

    /*
     * render functions
     */

    renderLives: function () {      
        this.lives.className = 'lives lives--count-' + controller.getLives();
    },

    renderRound: function () {
        const round = controller.getRound();
        this.round.textContent = round;
        this.sounds['background'].rate(1 + (round-1)*0.01);
        this.roundsMax.textContent = controller.getRoundsMax();
    },

    renderAll: function () {
        this.renderLives();
        this.renderRound();
    },

    /*
     * miscellaneous functions
     */

    resetSpeedMusic: function () {
        this.sounds['background'].rate(1);
    },

};

/* 
 * RUN
 */

controller.init();

/*
 * HELPER FUNCTIONS
 */

/* shuffle function from http://stackoverflow.com/a/2450976 */

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// class helpers from https://jaketrent.com/post/addremove-classes-raw-javascript/

function hasClass(el, className) {
    if (el.classList) {
        return el.classList.contains(className);
    } else {
        return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    }
}

function addClass(el, className) {
    if (el.classList) {
        el.classList.add(className);
    } else if (!hasClass(el, className)) {
        el.className += ' ' + className;
    }
}

function removeClass(el, className) {
    if (el.classList) {
        el.classList.remove(className);
    } else if (hasClass(el, className)) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        el.className = el.className.replace(reg, ' ');
    }
}