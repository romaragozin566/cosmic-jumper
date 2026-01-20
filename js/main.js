import { Game } from './Game.js';

console.log('Начинаем загрузку игры...');

const canvas = document.getElementById('gameCanvas');
console.log('Canvas найден:', canvas);

if (!canvas) {
    alert('Ошибка: Canvas не найден!');
    throw new Error('Canvas element not found');
}

const ctx = canvas.getContext('2d');
console.log('Контекст создан:', ctx);

// Простой объект UI с проверкой
const ui = {
    levelEl: document.getElementById('level'),
    scoreEl: document.getElementById('score'),
    bestEl: document.getElementById('best'),
    timerEl: document.getElementById('timer'),
    levelInfoEl: document.getElementById('levelInfo'),
    messageEl: document.getElementById('message'),
    btnStart: document.getElementById('btnStart'),
    btnPause: document.getElementById('btnPause'),
    btnRestart: document.getElementById('btnRestart'),
    btnNextLevel: document.getElementById('btnNextLevel')
};

// Проверяем все элементы
console.log('Проверка элементов UI:');
for (const [key, element] of Object.entries(ui)) {
    console.log(`  ${key}:`, element ? '✓' : '✗');
}

// Создаем игру
console.log('Создаем игру...');
const game = new Game(canvas, ctx, ui);
console.log('Игра создана:', game);

// Простые обработчики
ui.btnStart.addEventListener('click', () => {
    console.log('Старт игры');
    game.start();
    ui.btnStart.disabled = true;
    ui.btnPause.disabled = false;
    ui.btnRestart.disabled = false;
    ui.messageEl.textContent = 'Игра началась! Собирайте звезды!';
});

ui.btnPause.addEventListener('click', () => {
    console.log('Пауза/Продолжить');
    game.pauseToggle();
});

ui.btnRestart.addEventListener('click', () => {
    console.log('Рестарт');
    game.restart();
    ui.btnStart.disabled = true;
    ui.btnPause.disabled = false;
    ui.btnRestart.disabled = false;
    ui.btnNextLevel.disabled = true;
    ui.messageEl.textContent = 'Игра перезапущена!';
});

// ВАЖНО: Обработчик для кнопки "Следующий"
ui.btnNextLevel.addEventListener('click', () => {
    console.log('🎮 ========== НАЖАТА КНОПКА "СЛЕДУЮЩИЙ" ==========');
    console.log('Текущее состояние игры:');
    console.log('- Текущий уровень:', game.currentLevel + 1);
    console.log('- Всего уровней:', game.levels.length);
    console.log('- Игра запущена?:', game.isRunning);
    console.log('- Игра на паузе?:', game.isPaused);
    console.log('- Уровень завершен?:', game.levelComplete);
    
    // Вызываем переход
    game.nextLevel();
    
    // Проверяем через секунду
    setTimeout(() => {
        console.log('Проверка через 1 секунду:');
        console.log('- Новый уровень:', game.currentLevel + 1);
        console.log('- Игра запущена?:', game.isRunning);
        console.log('- Холст виден?:', canvas.width > 0 && canvas.height > 0);
    }, 1000);
});

// Клавиша P для паузы
document.addEventListener('keydown', (e) => {
    if (e.key === 'p' || e.key === 'P') {
        game.pauseToggle();
    }
});

console.log('Игра готова! Нажмите Старт.');

// Для отладки
window.game = game;
