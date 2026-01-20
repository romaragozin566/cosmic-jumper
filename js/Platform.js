export class Platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = '#4ECDC4';
    }
    
    draw(ctx) {
        ctx.save();
        
        // Платформа с градиентом
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, '#4ECDC4');
        gradient.addColorStop(1, '#44A08D');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, 6);
        ctx.fill();
        
        // Верхняя грань
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(this.x, this.y, this.width, 3);
        
        ctx.restore();
    }
}