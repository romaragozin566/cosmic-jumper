import { Player } from './Player.js';
import { Platform } from './Platform.js';
import { Star } from './Star.js';
import { Portal } from './Portal.js';

export class Game {
    constructor(canvas, ctx, ui) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.ui = ui;
        
        console.log('Game initialized with UI:', ui); // Отладка
        
        this.player = new Player(50, 400);
        this.platforms = [];
        this.stars = [];
        this.portal = null;
        
        this.currentLevel = 0;
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('cosmic_jumper_best') || 0);
        this.timeElapsed = 0;
        this.timerInterval = null;
        
        this.isRunning = false;
        this.isPaused = false;
        this.lastTime = 0;
        
        this.levels = this.createLevels();
        this.loadLevel(this.currentLevel);
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
        const level = this.levels[levelIndex];
        
        this.platforms = level.platforms;
        this.stars = level.stars.map(pos => new Star(pos.x, pos.y));
        this.portal = new Portal(level.portal.x, level.portal.y, 
                               level.portal.width, level.portal.height);
        this.player.reset(level.spawn.x, level.spawn.y);
        
        // ИСПРАВЛЕНО: levelEl, а не levelE1
        this.ui.levelEl.textContent = levelIndex + 1;
        this.ui.levelInfoEl.textContent = `Уровень ${levelIndex + 1}: ${level.name}`;
        this.ui.messageEl.textContent = `Соберите ${this.stars.length} звезд для активации портала!`;
    }
    
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.isPaused = false;
        this.timeElapsed = 0;
        
        // Запуск таймера
        this.timerInterval = setInterval(() => {
            if (!this.isPaused) {
                this.timeElapsed++;
                const minutes = Math.floor(this.timeElapsed / 60).toString().padStart(2, '0');
                const seconds = (this.timeElapsed % 60).toString().padStart(2, '0');
                this.ui.timerEl.textContent = `${minutes}:${seconds}`;
            }
        }, 1000);
        
        // Запуск игрового цикла
        this.lastTime = performance.now();
        this.gameLoop();
    }
    
    togglePause() {
        if (!this.isRunning) return;
        this.isPaused = !this.isPaused;
    }
    
    restart() {
        clearInterval(this.timerInterval);
        this.score = 0;
        this.currentLevel = 0;
        this.timeElapsed = 0;
        this.ui.scoreEl.textContent = '0';
        this.ui.timerEl.textContent = '00:00';
        this.ui.btnNextLevel.disabled = true;
        
        this.loadLevel(this.currentLevel);
        this.start();
    }
    
    nextLevel() {
        if (this.currentLevel < this.levels.length - 1) {
            this.currentLevel++;
            this.loadLevel(this.currentLevel);
            this.ui.btnNextLevel.disabled = true;
            this.ui.messageEl.textContent = `Уровень ${this.currentLevel + 1}! Соберите все звезды!`;
        }
    }
    
    gameLoop(currentTime = this.lastTime) {
        if (!this.isRunning || this.isPaused) return;
        
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.render();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update(deltaTime) {
        this.player.update(deltaTime, this.platforms);
        
        // Проверка сбора звезд
        for (let i = 0; i < this.stars.length; i++) {
            const star = this.stars[i];
            if (!star.collected) {
                // Упрощенная проверка коллизии для звезд
                const playerCenterX = this.player.x + this.player.width / 2;
                const playerCenterY = this.player.y + this.player.height / 2;
                
                const dx = playerCenterX - star.x;
                const dy = playerCenterY - star.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Увеличенная зона сбора для удобства
                if (distance < 30) { // 30 пикселей - радиус сбора
                    star.collected = true;
                    this.score += 10;
                    this.ui.scoreEl.textContent = this.score;
                    
                    // Обновление лучшего результата
                    if (this.score > this.bestScore) {
                        this.bestScore = this.score;
                        localStorage.setItem('cosmic_jumper_best', this.bestScore);
                        this.ui.bestEl.textContent = this.bestScore;
                    }
                    console.log('Звезда собрана! Очков:', this.score);
                }
            }
        }
        
        // Проверка входа в портал
        const allStarsCollected = this.stars.every(star => star.collected);
        
        if (allStarsCollected) {
            // Упрощенная проверка коллизии с порталом
            const playerRect = {
                x: this.player.x,
                y: this.player.y,
                width: this.player.width,
                height: this.player.height
            };
            
            const portalRect = {
                x: this.portal.x,
                y: this.portal.y,
                width: this.portal.width,
                height: this.portal.height
            };
            
            // Проверка пересечения прямоугольников
            const collision = 
                playerRect.x < portalRect.x + portalRect.width &&
                playerRect.x + playerRect.width > portalRect.x &&
                playerRect.y < portalRect.y + portalRect.height &&
                playerRect.y + playerRect.height > portalRect.y;
            
            if (collision) {
                console.log('Портал активирован!');
                if (this.currentLevel < this.levels.length - 1) {
                    this.ui.messageEl.textContent = `Уровень ${this.currentLevel + 1} пройден! Нажмите "Следующий" для продолжения.`;
                    this.ui.btnNextLevel.disabled = false;
                    this.isPaused = true;
                } else {
                    this.ui.messageEl.textContent = '🎉 Поздравляем! Вы прошли все уровни! 🎉';
                    this.isRunning = false;
                    clearInterval(this.timerInterval);
                }
            }
        }
        
        // Проверка падения
        if (this.player.y > this.canvas.height + 100) {
            this.player.reset(this.levels[this.currentLevel].spawn.x, 
                            this.levels[this.currentLevel].spawn.y);
        }
    }
    
    render() {
        // Очистка холста
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Рисование фона
        this.drawBackground();
        
        // Рисование всех объектов
        this.platforms.forEach(platform => platform.draw(this.ctx));
        this.stars.forEach(star => star.draw(this.ctx));
        this.portal.draw(this.ctx, this.stars.every(star => star.collected));
        this.player.draw(this.ctx);
        
        // Отображение количества оставшихся звезд
        const remainingStars = this.stars.filter(star => !star.collected).length;
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`Звезд осталось: ${remainingStars}`, 20, 30);
        
        // Отображение паузы
        if (this.isPaused) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = 'white';
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('ПАУЗА', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.textAlign = 'left';
        }
    }
    
    drawBackground() {
        // Градиентный фон
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#0a0a1a');
        gradient.addColorStop(1, '#1a1a2e');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Звезды на фоне
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * 2 + 1;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
}
