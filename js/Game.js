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
        this.level = 1;
        this.isRunning = false;
        this.isPaused = false;
        this.lastTime = 0;
        
        // Создаем уровни
        this.createLevel1();
        
        console.log('Game создан успешно');
    }
    
    createLevel1() {
        console.log('Создаем уровень 1');
        
        // Платформы
        this.platforms = [
            new Platform(0, 450, 300, 50),   // земля
            new Platform(350, 380, 200, 30),  // платформа 1
            new Platform(600, 320, 180, 30),  // платформа 2
            new Platform(800, 280, 150, 30),  // платформа 3
            new Platform(900, 220, 80, 30),   // платформа 4
        ];
        
        // Звезды
        this.stars = [
            new Star(150, 400),
            new Star(400, 350),
            new Star(650, 290),
            new Star(850, 250),
        ];
        
        // Портал
        this.portal = new Portal(920, 170, 50, 80);
        
        // Сброс игрока
        this.player.reset(50, 400);
        
        // Обновляем UI
        if (this.ui.levelEl) this.ui.levelEl.textContent = this.level;
        if (this.ui.scoreEl) this.ui.scoreEl.textContent = this.score;
        if (this.ui.levelInfoEl) this.ui.levelInfoEl.textContent = 'Уровень 1: Стартовая зона';
        if (this.ui.messageEl) this.ui.messageEl.textContent = 'Соберите все звезды!';
    }
    
    start() {
        console.log('Game.start() вызван');
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.isPaused = false;
        this.lastTime = performance.now();
        
        // Запускаем игровой цикл
        const gameLoop = (currentTime) => {
            if (!this.isRunning || this.isPaused) return;
            
            const deltaTime = (currentTime - this.lastTime) / 1000;
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
    }
    
    restart() {
        console.log('Рестарт игры');
        this.score = 0;
        this.level = 1;
        this.createLevel1();
        this.start();
    }
    
    nextLevel() {
        console.log('Следующий уровень');
        // Пока оставим только 1 уровень для простоты
        if (this.ui.messageEl) {
            this.ui.messageEl.textContent = 'Это последний уровень!';
        }
    }
    
    update(deltaTime) {
        // Обновляем игрока
        this.player.update(deltaTime, this.platforms);
        
        // Проверяем сбор звезд
        for (const star of this.stars) {
            if (!star.collected) {
                // Простая проверка коллизии
                const dx = (this.player.x + this.player.width/2) - star.x;
                const dy = (this.player.y + this.player.height/2) - star.y;
                const distance = Math.sqrt(dx*dx + dy*dy);
                
                if (distance < 30) { // радиус сбора
                    star.collected = true;
                    this.score += 10;
                    console.log('Звезда собрана! Очки:', this.score);
                    
                    if (this.ui.scoreEl) {
                        this.ui.scoreEl.textContent = this.score;
                    }
                }
            }
        }
        
        // Проверка портала (если все звезды собраны)
        const allCollected = this.stars.every(star => star.collected);
        if (allCollected && this.portal) {
            const inPortal = 
                this.player.x < this.portal.x + this.portal.width &&
                this.player.x + this.player.width > this.portal.x &&
                this.player.y < this.portal.y + this.portal.height &&
                this.player.y + this.player.height > this.portal.y;
            
            if (inPortal) {
                console.log('Уровень пройден!');
                if (this.ui.messageEl) {
                    this.ui.messageEl.textContent = 'Уровень пройден! Поздравляем!';
                }
                this.isRunning = false;
            }
        }
    }
    
    render() {
        const ctx = this.ctx;
        
        // Очищаем экран
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Рисуем фон
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
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
        ctx.fillText(`Очки: ${this.score}`, 20, 30);
        ctx.fillText(`Звезд собрано: ${this.stars.filter(s => s.collected).length}/${this.stars.length}`, 20, 60);
    }
}
