const gameArea = document.getElementById('gameArea');
const player = document.getElementById('player');
const gameWidth = gameArea.clientWidth;
const gameHeight = gameArea.clientHeight;
let playerPosition = gameWidth / 2 - 20;
let bullets = [];
let enemies = [];
let score = 0;

// Move the player
document.addEventListener('keydown', movePlayer);
function movePlayer(e) {
    if (e.key === 'ArrowLeft' && playerPosition > 0) {
        playerPosition -= 20;
    }
    if (e.key === 'ArrowRight' && playerPosition < gameWidth - 40) {
        playerPosition += 20;
    }
    player.style.left = `${playerPosition}px`;
}

// Shoot bullets
document.addEventListener('keydown', shootBullet);
function shootBullet(e) {
    if (e.key === ' ') {
        const bullet = document.createElement('div');
        bullet.classList.add('bullet');
        bullet.style.left = `${playerPosition + 18}px`;
        bullet.style.bottom = '50px';
        gameArea.appendChild(bullet);
        bullets.push(bullet);
    }
}

// Move bullets
function moveBullets() {
    bullets.forEach((bullet, index) => {
        let bulletBottom = parseInt(bullet.style.bottom);
        if (bulletBottom >= gameHeight) {
            bullet.remove();
            bullets.splice(index, 1);
        } else {
            bullet.style.bottom = `${bulletBottom + 5}px`;
        }

        // Check for collision with enemies
        enemies.forEach((enemy, enemyIndex) => {
            if (isColliding(bullet, enemy)) {
                bullet.remove();
                bullets.splice(index, 1);
                enemy.remove();
                enemies.splice(enemyIndex, 1);
                score += 10;
                console.log(`Score: ${score}`);
            }
        });
    });
}

// Create enemies
function createEnemy() {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.style.left = `${Math.floor(Math.random() * (gameWidth - 40))}px`;
    enemy.style.top = '0px';
    gameArea.appendChild(enemy);
    enemies.push(enemy);
}

// Move enemies
function moveEnemies() {
    enemies.forEach((enemy, index) => {
        let enemyTop = parseInt(enemy.style.top);
        if (enemyTop >= gameHeight) {
            enemy.remove();
            enemies.splice(index, 1);
        } else {
            enemy.style.top = `${enemyTop + 2}px`;
        }

        // Check if enemy hits the player
        if (isColliding(player, enemy)) {
            alert("Game Over! Final Score: " + score);
            window.location.reload(); // Reload the game
        }
    });
}

// Collision detection
function isColliding(el1, el2) {
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();
    return !(
        rect1.top > rect2.bottom ||
        rect1.bottom < rect2.top ||
        rect1.right < rect2.left ||
        rect1.left > rect2.right
    );
}

// Main game loop
function gameLoop() {
    moveBullets();
    moveEnemies();
    if (Math.random() < 0.03) {
        createEnemy();
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();
