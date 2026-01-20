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
    console.log('Нажата кнопка Следующий уровень');
    game.nextLevel();
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
