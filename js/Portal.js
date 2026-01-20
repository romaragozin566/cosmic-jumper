export class Portal {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.animation = 0;
    }
    
    draw(ctx, active) {
        ctx.save();
        this.animation += 0.05;
        
        if (active) {
            // Активный портал
            const pulse = Math.sin(this.animation) * 5;
            
            // Внешнее свечение
            ctx.fillStyle = 'rgba(0, 255, 127, 0.3)';
            ctx.beginPath();
            ctx.arc(
                this.x + this.width / 2,
                this.y + this.height / 2,
                this.width + pulse,
                0,
                Math.PI * 2
            );
            ctx.fill();
            
            // Внутренний портал
            const gradient = ctx.createLinearGradient(
                this.x, this.y,
                this.x + this.width, this.y + this.height
            );
            gradient.addColorStop(0, '#00FF7F');
            gradient.addColorStop(0.5, '#00BFFF');
            gradient.addColorStop(1, '#00FF7F');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Анимационные круги
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.lineWidth = 2;
            
            for (let i = 0; i < 3; i++) {
                const offset = (this.animation + i * 0.3) % 1;
                const radius = offset * this.width * 0.8;
                
                ctx.beginPath();
                ctx.arc(
                    this.x + this.width / 2,
                    this.y + this.height / 2,
                    radius,
                    0,
                    Math.PI * 2
                );
                ctx.stroke();
            }
        } else {
            // Неактивный портал
            ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            ctx.fillStyle = 'rgba(150, 150, 150, 0.8)';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('???', this.x + this.width / 2, this.y + this.height / 2 + 4);
            ctx.textAlign = 'left';
        }
        
        // Рамка
        ctx.strokeStyle = active ? '#00FF7F' : '#666666';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        ctx.restore();
    }
}
