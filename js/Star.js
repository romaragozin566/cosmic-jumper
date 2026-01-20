export class Star {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 12;
        this.collected = false;
        this.rotation = 0;
        this.pulse = 0;
    }
    
    collect() {
        this.collected = true;
    }
    
    collidesWith(object) {
        if (this.collected) return false;
        
        // Упрощенная проверка коллизии - работает с прямоугольными объектами
        const playerCenterX = object.x + object.width / 2;
        const playerCenterY = object.y + object.height / 2;
        
        const dx = playerCenterX - this.x;
        const dy = playerCenterY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Увеличиваем радиус для более легкого сбора
        return distance < (this.radius + 15);
    }
    
    draw(ctx) {
        if (this.collected) return;
        
        ctx.save();
        this.rotation += 0.05;
        this.pulse = Math.sin(Date.now() * 0.005) * 2;
        
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Эффект свечения
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius + this.pulse);
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius + this.pulse, 0, Math.PI * 2);
        ctx.fill();
        
        // Звезда
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
            const radius = this.radius;
            
            // Внешняя точка
            const x1 = Math.cos(angle) * radius;
            const y1 = Math.sin(angle) * radius;
            
            // Внутренняя точка
            const innerAngle = angle + Math.PI / 5;
            const x2 = Math.cos(innerAngle) * (radius / 2);
            const y2 = Math.sin(innerAngle) * (radius / 2);
            
            if (i === 0) {
                ctx.moveTo(x1, y1);
            } else {
                ctx.lineTo(x1, y1);
            }
            ctx.lineTo(x2, y2);
        }
        ctx.closePath();
        ctx.fill();
        
        // Блики
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(-3, -3, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    // Метод для отладки (опционально)
    debugDraw(ctx) {
        if (this.collected) return;
        
        // Рисуем хитбокс для отладки
        ctx.save();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 15, 0, Math.PI * 2); // +15 - увеличенная зона
        ctx.stroke();
        
        // Центр
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
