/* 
 * game settings
 */

const game = {
    enemies: {
        number: 6,
        position: {
            startX: -105,
            endX: 505,
            factorXMin: 1.5,
            factorXMax: 15,
            minY: 50,
            maxY: 250
        },
        speed: {
            min: 30,
            max: 270
        },
        sprite: 'images/enemy-bug.png'
    },
    player: {
        step: 50,
        sprites: [
            'images/char-boy.png',
            'images/char-cat-girl.png',
            'images/char-horn-girl.png',
            'images/char-pink-girl.png',
            'images/char-princess-girl.png'
        ]
    },
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
};

/* 
 * functions for random settings
 */

function getRandomEnemyStartPositionY(){
    return _.random(game.enemies.position.minY, game.enemies.position.maxY);
}

function getRandomEnemyStartPositionX() {
    return game.enemies.position.startX + _.random(game.enemies.position.factorXMin, game.enemies.position.factorXMax) * game.enemies.position.startX;
}

function getRandomEnemySpeed() {
    return _.random(game.enemies.speed.min, game.enemies.speed.max);
}

function randomizeCharacter(object) {
    object.x = getRandomEnemyStartPositionX();
    object.y = getRandomEnemyStartPositionY();
    object.speed = getRandomEnemySpeed();
}

// function getRandomPlayerSprite() {
//     let rnd = _.random(0, game.player.sprites.length - 1);
//     return game.player.sprites[rnd];
// }

/* 
 * game entities
 */

/* enemies */

const Enemy = function() {
    randomizeCharacter(this);
    this.sprite = game.enemies.sprite;
};

Enemy.prototype.update = function(dt) {
    if (this.x > game.enemies.position.endX) {
        randomizeCharacter(this);
    } else {
        this.x += this.speed * dt;
    }
};

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

function makeEnemies(n) {
    const allEnemies = [];
    for (let i = 0; i < n; ++i) {
        allEnemies[i] = new Enemy();
    }
    return allEnemies;
}

/* player */

const Player = function (x, y) {
    this.x = x;
    this.y = y;
    this.sprite = game.player.sprites[0];
};

Player.prototype.update = function (dt) {
    this.speed * dt;
};

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function (direction) {
    if (direction == 'left' && this.x > game.boundaries.left) {
        this.x -= game.player.step;
    } else if (direction == 'right' && this.x < game.boundaries.right) {
        this.x += game.player.step;
    } else if (direction == 'up' && this.y > game.boundaries.top) {
        this.y -= game.player.step;
    } else if (direction == 'down' && this.y < game.boundaries.bottom) {
        this.y += game.player.step;
    }
};

/* instanciate game entities */

const allEnemies = makeEnemies(game.enemies.number);
const player = new Player(game.boundaries.centerX, game.boundaries.bottom);

/* 
 * event handling
 */

document.addEventListener('keyup', function(e) {
    player.handleInput(game.allowedKeys[e.keyCode]);
});