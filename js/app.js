/* 
 * GAME — MODEL
 */

const model = {
    
    init: function() {

        /* 
         * character entities
         */

        /* enemies */

        const Enemy = function() {
            model.enemies.randomize(this);
            this.sprite = model.enemies.sprite;
        };

        Enemy.prototype.update = function(dt) {
            if (this.x > model.enemies.position.endX) {
                model.enemies.randomize(this);
            } else {
                this.x += this.speed * dt;
                model.enemies.checkIfPlayerTooClose(this.x, this.y);
            }
        };

        Enemy.prototype.render = function() {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        };

        /* player */

        const Player = function() {
            this.x = model.game.boundaries.centerX;
            this.y = model.game.boundaries.bottom;
            this.sprite = model.player.sprites[0];
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
            } else if (direction == 'right' && this.x < model.game.boundaries.right) {
                this.x += model.player.step;
            } else if (direction == 'up' && this.y > model.game.boundaries.top) {
                this.y -= model.player.step;
            } else if (direction == 'down' && this.y < model.game.boundaries.bottom) {
                this.y += model.player.step;
            }
            // console.log("x: " + this.x + " | y: " + this.y);
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
        number: 6,
        position: {
            startX: -105,
            endX: 505,
            factorXMin: 1.5,
            factorXMax: 15,
            minY: 50,
            maxY: 300
        },
        speed: {
            min: 30,
            max: 270
        },
        sprite: 'images/enemy-bug.png',
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
        checkIfPlayerTooClose: function(x, y) {
            let h = x - player.x;
            let v = y - player.y;
            let proximity = Math.sqrt(h * h + v * v);
            if (proximity < 50) {
                controller.resetGame();
            }
        }
    },

    player: {
        step: 50,
        sprites: [
            'images/char-boy.png',
            'images/char-cat-girl.png',
            'images/char-horn-girl.png',
            'images/char-pink-girl.png',
            'images/char-princess-girl.png'
        ],
        getRandomSprite: function() {
            return this.player.sprites[_.random(0, this.player.sprites.length - 1)];
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
        }
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
    resetGame: function() {
        alert('CRASH!');
        player.x = model.game.boundaries.centerX;
        player.y = model.game.boundaries.bottom;
    }
};

/* 
 * GAME — VIEW
 */

const view = {
    init: function () {
        document.addEventListener('keyup', function (e) {
            player.handleInput(model.game.allowedKeys[e.keyCode]);
        });
    }
};

/* 
 * RUN
 */

controller.init();




