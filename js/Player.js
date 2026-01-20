export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 60;
        
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 300;
        this.jumpPower = 500;
        this.gravity = 1200;
        this.onGround = false;
        
        this.color = '#FF6B6B';
        this.animation = 0;
    }
    
    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.onGround = false;
    }
    
    update(deltaTime, platforms) {
        this.handleInput();
        
        // Гравитация
        this.velocityY += this.gravity * deltaTime;
        if (this.velocityY > 800) this.velocityY = 800;
        
        // Обновление позиции
        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;
        
        // Анимация
        this.animation += deltaTime * 10;
        
        // Проверка коллизий с платформами
        this.onGround = false;
        this.checkCollisions(platforms);
        
        // Ограничение по краям
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > 1000) this.x = 1000 - this.width;
    }
    
    handleInput() {
        this.velocityX = 0;
        
        if (this.isKeyPressed('ArrowLeft') || this.isKeyPressed('KeyA')) {
            this.velocityX = -this.speed;
        }
        if (this.isKeyPressed('ArrowRight') || this.isKeyPressed('KeyD')) {
            this.velocityX = this.speed;
        }
        if ((this.isKeyPressed('Space') || this.isKeyPressed('ArrowUp') || 
             this.isKeyPressed('KeyW')) && this.onGround) {
            this.velocityY = -this.jumpPower;
            this.onGround = false;
        }
    }
    
    isKeyPressed(key) {
        return window.keys && window.keys[key];
    }
    
    checkCollisions(platforms) {
        for (const platform of platforms) {
            if (this.collidesWith(platform)) {
                // Определяем сторону столкновения
                const playerBottom = this.y + this.height;
                const playerRight = this.x + this.width;
                const platformBottom = platform.y + platform.height;
                const platformRight = platform.x + platform.width;
                
                const bottomOverlap = playerBottom - platform.y;
                const topOverlap = platformBottom - this.y;
                const rightOverlap = playerRight - platform.x;
                const leftOverlap = platformRight - this.x;
                
                const minOverlap = Math.min(
                    bottomOverlap, topOverlap, rightOverlap, leftOverlap
                );
                
                if (minOverlap === bottomOverlap) {
                    // Сверху платформы
                    this.y = platform.y - this.height;
                    this.velocityY = 0;
                    this.onGround = true;
                } else if (minOverlap === topOverlap) {
                    // Снизу платформы
                    this.y = platformBottom;
                    this.velocityY = 0;
                } else if (minOverlap === rightOverlap) {
                    // Справа от платформы
                    this.x = platform.x - this.width;
                } else if (minOverlap === leftOverlap) {
                    // Слева от платформы
                    this.x = platformRight;
                }
            }
        }
    }
    
    // ПРОСТАЯ И РАБОЧАЯ ФУНКЦИЯ КОЛЛИЗИИ
    collidesWith(object) {
        // Проверка столкновения с прямоугольником
        return this.x < object.x + object.width &&
               this.x + this.width > object.x &&
               this.y < object.y + object.height &&
               this.y + this.height > object.y;
    }
    
    draw(ctx) {
        ctx.save();
        
        // Тело игрока
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, 8);
        ctx.fill();
        
        // Глаза
        ctx.fillStyle = 'white';
        const eyeX = this.velocityX > 0 ? this.x + this.width - 15 : this.x + 15;
        ctx.beginPath();
        ctx.arc(eyeX, this.y + 20, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Ноги
        if (this.velocityX !== 0) {
            const legY = Math.sin(this.animation) * 5;
            ctx.fillStyle = '#FF8E8E';
            ctx.beginPath();
            ctx.arc(this.x + 10, this.y + this.height - 5 + legY, 6, 0, Math.PI * 2);
            ctx.arc(this.x + this.width - 10, this.y + this.height - 5 - legY, 6, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillStyle = '#FF8E8E';
            ctx.beginPath();
            ctx.arc(this.x + 10, this.y + this.height - 5, 6, 0, Math.PI * 2);
            ctx.arc(this.x + this.width - 10, this.y + this.height - 5, 6, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}

// Инициализация глобального объекта для хранения состояния клавиш
window.keys = {};

window.addEventListener('keydown', (e) => {
    window.keys[e.code] = true;
});

window.addEventListener('keyup', (e) => {
    window.keys[e.code] = false;
});
