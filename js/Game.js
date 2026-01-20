import { Player } from './Player.js';
import { Platform } from './Platform.js';
import { Star } from './Star.js';
import { Portal } from './Portal.js';

export class Game {
    constructor(canvas, ctx, ui) {
        console.log('Game конструктор вызван');
        this.canvas = canvas;
        this.ctx = ctx;
        this.ui = ui || {};
        
        this.player = new Player(50, 400);
        this.platforms = [];
        this.stars = [];
        this.portal = null;
        
        this.score = 0;
        this.currentLevel = 0; // начинаем с 0
        this.levels = this.createLevels();
        this.isRunning = false;
        this.isPaused = false;
        this.levelComplete = false;
        this.lastTime = 0;
        
        // Загружаем первый уровень
        this.loadLevel(this.currentLevel);
        
        console.log('Game создан успешно');
    }
    
    createLevels() {
        return [
            {
                name: "Стартовая зона",
                spawn: { x: 50, y: 400 },
                platforms: [
                    new Platform(0, 450, 300, 50),
                    new Platform(350, 380, 200, 30),
                    new Platform(600, 320, 180, 30),
                    new Platform(800, 280, 150, 30),
                    new Platform(900, 220, 80, 30),
                ],
                stars: [
                    { x: 150, y: 400 },
                    { x: 400, y: 350 },
                    { x: 650, y: 290 },
                    { x: 850, y: 250 },
                ],
                portal: { x: 920, y: 170, width: 50, height: 80 }
            },
            {
                name: "Прыжковые платформы",
                spawn: { x: 50, y: 400 },
                platforms: [
                    new Platform(0, 450, 250, 50),
                    new Platform(300, 400, 150, 30),
                    new Platform(500, 350, 120, 30),
                    new Platform(650, 300, 120, 30),
                    new Platform(800, 250, 120, 30),
                    new Platform(650, 200, 120, 30),
                    new Platform(500, 150, 120, 30),
                ],
                stars: [
                    { x: 350, y: 370 },
                    { x: 550, y: 320 },
                    { x: 700, y: 270 },
                    { x: 850, y: 220 },
                    { x: 700, y: 170 },
                    { x: 550, y: 120 },
                ],
                portal: { x: 550, y: 80, width: 50, height: 80 }
            },
            {
                name: "Мосты и пропасти",
                spawn: { x: 50, y: 400 },
                platforms: [
                    new Platform(0, 450, 150, 50),
                    new Platform(200, 400, 120, 30),
                    new Platform(370, 350, 120, 30),
                    new Platform(540, 300, 120, 30),
                    new Platform(710, 250, 120, 30),
                    new Platform(0, 200, 120, 30),
                    new Platform(200, 150, 120, 30),
                ],
                stars: [
                    { x: 250, y: 370 },
                    { x: 420, y: 320 },
                    { x: 590, y: 270 },
                    { x: 760, y: 220 },
                    { x: 50, y: 170 },
                    { x: 250, y: 120 },
                ],
                portal: { x: 250, y: 70, width: 50, height: 80 }
            },
            {
                name: "Вертикальный вызов",
                spawn: { x: 450, y: 400 },
                platforms: [
                    new Platform(400, 450, 200, 50),
                    new Platform(350, 350, 150, 30),
                    new Platform(500, 250, 150, 30),
                    new Platform(350, 150, 150, 30),
                    new Platform(500, 50, 150, 30),
                ],
                stars: [
                    { x: 450, y: 320 },
                    { x: 550, y: 220 },
                    { x: 450, y: 120 },
                    { x: 550, y: 20 },
                ],
                portal: { x: 550, y: -20, width: 50, height: 80 }
            },
            {
                name: "Финальный уровень",
                spawn: { x: 50, y: 400 },
                platforms: [
                    new Platform(0, 450, 150, 50),
                    new Platform(200, 400, 100, 30),
                    new Platform(350, 350, 100, 30),
                    new Platform(500, 300, 100, 30),
                    new Platform(650, 250, 100, 30),
                    new Platform(800, 200, 100, 30),
                    new Platform(800, 100, 100, 30),
                    new Platform(650, 50, 100, 30),
                ],
                stars: [
                    { x: 250, y: 370 },
                    { x: 400, y: 320 },
                    { x: 550, y: 270 },
                    { x: 700, y: 220 },
                    { x: 850, y: 170 },
                    { x: 850, y: 70 },
                    { x: 700, y: 20 },
                ],
                portal: { x: 700, y: -30, width: 50, height: 80 }
            }
        ];
    }
    
    loadLevel(levelIndex) {
        console.log(`Загружаем уровень ${levelIndex + 1}`);
        const level = this.levels[levelIndex];
        
        this.platforms = level.platforms;
        this.stars = level.stars.map(pos => new Star(pos.x, pos.y));
        this.portal = new Portal(level.portal.x, level.portal.y, 
                               level.portal.width, level.portal.height);
        this.player.reset(level.spawn.x, level.spawn.y);
        
        this.levelComplete = false;
        
        // Обновляем UI
        if (this.ui.levelEl) this.ui.levelEl.textContent = levelIndex + 1;
        if (this.ui.levelInfoEl) {
            this.ui.levelInfoEl.textContent = `Уровень ${levelIndex + 1}: ${level.name}`;
        }
        if (this.ui.messageEl) {
            this.ui.messageEl.textContent = `Соберите ${this.stars.length} звезд для активации портала!`;
        }
        if (this.ui.btnNextLevel) {
            this.ui.btnNextLevel.disabled = true;
        }
        
        console.log(`Уровень ${levelIndex + 1} загружен: ${level.name}`);
    }
    
    start() {
        console.log('Game.start() вызван');
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.isPaused = false;
        this.levelComplete = false;
        this.lastTime = performance.now();
        
        // Запускаем игровой цикл
        const gameLoop = (currentTime) => {
            if (!this.isRunning || this.isPaused) return;
            
            const deltaTime = Math.min(0.033, (currentTime - this.lastTime) / 1000);
            this.lastTime = currentTime;
            
            this.update(deltaTime);
            this.render();
            
            requestAnimationFrame(gameLoop);
        };
        
        requestAnimationFrame(gameLoop);
        console.log('Игра запущена');
    }
    
    pauseToggle() {
        this.isPaused = !this.isPaused;
        console.log('Пауза:', this.isPaused);
        
        if (this.ui.btnPause) {
            this.ui.btnPause.innerHTML = this.isPaused ? 
                '<i class="fas fa-play"></i> Продолжить' : 
                '<i class="fas fa-pause"></i> Пауза';
        }
    }
    
    restart() {
        console.log('Рестарт игры');
        this.score = 0;
        this.currentLevel = 0;
        this.isRunning = false;
        this.levelComplete = false;
        
        if (this.ui.scoreEl) this.ui.scoreEl.textContent = '0';
        if (this.ui.btnNextLevel) this.ui.btnNextLevel.disabled = true;
        
        this.loadLevel(this.currentLevel);
        this.start();
    }
    
    nextLevel() {
        console.log('Переход на следующий уровень');
        if (this.currentLevel < this.levels.length - 1) {
            this.currentLevel++;
            this.loadLevel(this.currentLevel);
            this.levelComplete = false;
            this.isPaused = false;
            
            if (this.ui.btnNextLevel) {
                this.ui.btnNextLevel.disabled = true;
            }
            if (this.ui.btnPause) {
                this.ui.btnPause.innerHTML = '<i class="fas fa-pause"></i> Пауза';
            }
            
            // Автоматически продолжаем игру
            if (!this.isRunning) {
                this.start();
            }
            
            console.log(`Перешли на уровень ${this.currentLevel + 1}`);
        } else {
            console.log('Это последний уровень!');
            if (this.ui.messageEl) {
                this.ui.messageEl.textContent = '🎉 Вы прошли все уровни! Поздравляем! 🎉';
            }
            this.levelComplete = true;
        }
    }
    
    completeLevel() {
        console.log(`Уровень ${this.currentLevel + 1} пройден!`);
        this.levelComplete = true;
        this.isPaused = true;
        
        if (this.ui.messageEl) {
            this.ui.messageEl.textContent = `Уровень ${this.currentLevel + 1} пройден! Нажмите "Следующий"`;
        }
        if (this.ui.btnNextLevel) {
            this.ui.btnNextLevel.disabled = false;
        }
        if (this.ui.btnPause) {
            this.ui.btnPause.innerHTML = '<i class="fas fa-play"></i> Продолжить';
        }
        
        console.log('Уровень завершен, ждем нажатия "Следующий"');
    }
    
    update(deltaTime) {
        // Если уровень завершен, не обновляем
        if (this.levelComplete) return;
        
        // Обновляем игрока
        this.player.update(deltaTime, this.platforms);
        
        // Проверяем сбор звезд
        let starsCollected = 0;
        for (const star of this.stars) {
            if (!star.collected) {
                // Простая проверка коллизии
                const dx = (this.player.x + this.player.width/2) - star.x;
                const dy = (this.player.y + this.player.height/2) - star.y;
                const distance = Math.sqrt(dx*dx + dy*dy);
                
                if (distance < 30) { // радиус сбора
                    star.collected = true;
                    this.score += 10;
                    starsCollected++;
                    console.log('Звезда собрана! Очки:', this.score);
                    
                    if (this.ui.scoreEl) {
                        this.ui.scoreEl.textContent = this.score;
                    }
                }
            } else {
                starsCollected++;
            }
        }
        
        // Проверка портала (если все звезды собраны)
        const allCollected = starsCollected === this.stars.length;
        if (allCollected && this.portal && !this.levelComplete) {
            const inPortal = 
                this.player.x < this.portal.x + this.portal.width &&
                this.player.x + this.player.width > this.portal.x &&
                this.player.y < this.portal.y + this.portal.height &&
                this.player.y + this.player.height > this.portal.y;
            
            if (inPortal) {
                console.log('Игрок вошел в портал!');
                this.completeLevel();
            }
        }
        
        // Проверка падения
        if (this.player.y > this.canvas.height + 100) {
            console.log('Игрок упал, респавн');
            const currentLevel = this.levels[this.currentLevel];
            this.player.reset(currentLevel.spawn.x, currentLevel.spawn.y);
        }
    }
    
    render() {
        const ctx = this.ctx;
        
        // Очищаем экран
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Рисуем фон
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Звезды на фоне
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * 2 + 1;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Рисуем платформы
        this.platforms.forEach(p => p.draw(ctx));
        
        // Рисуем звезды
        this.stars.forEach(s => s.draw(ctx));
        
        // Рисуем портал
        if (this.portal) {
            const allCollected = this.stars.every(star => star.collected);
            this.portal.draw(ctx, allCollected);
        }
        
        // Рисуем игрока
        this.player.draw(ctx);
        
        // Отладочная информация
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        const collected = this.stars.filter(s => s.collected).length;
        const total = this.stars.length;
        ctx.fillText(`Звезд: ${collected}/${total}`, 20, 30);
        ctx.fillText(`Очки: ${this.score}`, 20, 60);
        ctx.fillText(`Уровень: ${this.currentLevel + 1}`, 20, 90);
        
        // Если уровень завершен
        if (this.levelComplete) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            ctx.fillStyle = 'white';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('УРОВЕНЬ ПРОЙДЕН!', this.canvas.width / 2, this.canvas.height / 2);
            ctx.font = '24px Arial';
            ctx.fillText('Нажмите "Следующий"', this.canvas.width / 2, this.canvas.height / 2 + 50);
            ctx.textAlign = 'left';
        }
        
        // Если игра на паузе
        if (this.isPaused && !this.levelComplete) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            ctx.fillStyle = 'white';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('ПАУЗА', this.canvas.width / 2, this.canvas.height / 2);
            ctx.textAlign = 'left';
        }
    }
}
