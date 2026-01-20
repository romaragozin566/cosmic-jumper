import { Game } from './Game.js';

// Ждем загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, инициализируем игру...');
    
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // UI элементы
    const ui = {
        // Статистика
        levelEl: document.getElementById('level'),
        scoreEl: document.getElementById('score'),
        bestEl: document.getElementById('best'),
        timerEl: document.getElementById('timer'),
        
        // Информация
        levelInfoEl: document.getElementById('levelInfo'),
        messageEl: document.getElementById('message'),
        
        // Кнопки
        btnStart: document.getElementById('btnStart'),
        btnPause: document.getElementById('btnPause'),
        btnRestart: document.getElementById('btnRestart'),
        btnNextLevel: document.getElementById('btnNextLevel')
    };
    
    console.log('Найденные элементы:', {
        canvas: !!canvas,
        level: !!ui.levelEl,
        score: !!ui.scoreEl,
        best: !!ui.bestEl,
        timer: !!ui.timerEl,
        levelInfo: !!ui.levelInfoEl,
        message: !!ui.messageEl,
        btnStart: !!ui.btnStart,
        btnPause: !!ui.btnPause,
        btnRestart: !!ui.btnRestart,
        btnNextLevel: !!ui.btnNextLevel
    });
    
    // Проверяем наличие всех элементов
    if (!canvas) {
        console.error('Canvas не найден!');
        return;
    }
    
    // Инициализируем игру
    const game = new Game(canvas, ctx, ui);
    console.log('Игра создана:', game);
    
    // Обработчики кнопок
    ui.btnStart.addEventListener('click', () => {
        console.log('Нажата кнопка Старт');
        game.start();
        ui.btnStart.disabled = true;
        ui.btnPause.disabled = false;
        ui.btnRestart.disabled = false;
        ui.messageEl.textContent = 'Игра началась! Собирайте звезды!';
    });
    
    ui.btnPause.addEventListener('click', () => {
        console.log('Нажата кнопка Пауза');
        game.togglePause();
        const isPaused = game.isPaused;
        ui.btnPause.innerHTML = isPaused ? 
            '<i class="fas fa-play"></i> Продолжить' : 
            '<i class="fas fa-pause"></i> Пауза';
        ui.messageEl.textContent = isPaused ? 'Игра на паузе' : 'Игра продолжается';
    });
    
    ui.btnRestart.addEventListener('click', () => {
        console.log('Нажата кнопка Рестарт');
        game.restart();
        ui.btnStart.disabled = true;
        ui.btnPause.disabled = false;
        ui.btnRestart.disabled = false;
        ui.btnNextLevel.disabled = true;
        ui.messageEl.textContent = 'Игра перезапущена! Удачи!';
    });
    
    ui.btnNextLevel.addEventListener('click', () => {
        console.log('Нажата кнопка Следующий уровень');
        game.nextLevel();
        ui.btnNextLevel.disabled = true;
        ui.messageEl.textContent = 'Новый уровень! Соберите все звезды!';
    });
    
    // Глобальные обработчики клавиш
    window.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        
        // Пауза на P
        if (key === 'p') {
            game.togglePause();
            const isPaused = game.isPaused;
            ui.btnPause.innerHTML = isPaused ? 
                '<i class="fas fa-play"></i> Продолжить' : 
                '<i class="fas fa-pause"></i> Пауза';
        }
    });
    
    // Для отладки
    window.game = game;
    console.log('Инициализация завершена!');
});
