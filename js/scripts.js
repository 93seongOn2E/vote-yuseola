/*!
* Start Bootstrap - Personal v1.0.1 (https://startbootstrap.com/template-overviews/personal)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-personal/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

window.addEventListener('DOMContentLoaded', () => {
    const supportButton = document.getElementById('supportButton');

    if (!supportButton) {
        return;
    }

    supportButton.addEventListener('click', (event) => {
        event.preventDefault();
        launchConfetti();
    });
});

function launchConfetti() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const colors = ['#1e30f3', '#507BCD', '#83A2DC', '#2f9a8f', '#c96f54', '#ffffff'];
    const pieces = [];
    const duration = 1500;
    const startTime = performance.now();
    const pieceCount = 120;

    canvas.className = 'confetti-canvas';
    document.body.appendChild(canvas);

    function resizeCanvas() {
        canvas.width = window.innerWidth * window.devicePixelRatio;
        canvas.height = window.innerHeight * window.devicePixelRatio;
        context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (let index = 0; index < pieceCount; index += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 4 + Math.random() * 8;

        pieces.push({
            x: window.innerWidth / 2,
            y: window.innerHeight * 0.62,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 6,
            size: 6 + Math.random() * 8,
            rotation: Math.random() * Math.PI,
            spin: (Math.random() - 0.5) * 0.25,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }

    function animate(now) {
        const elapsed = now - startTime;

        context.clearRect(0, 0, window.innerWidth, window.innerHeight);

        pieces.forEach((piece) => {
            piece.x += piece.vx;
            piece.y += piece.vy;
            piece.vy += 0.18;
            piece.vx *= 0.99;
            piece.rotation += piece.spin;

            context.save();
            context.translate(piece.x, piece.y);
            context.rotate(piece.rotation);
            context.fillStyle = piece.color;
            context.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.55);
            context.restore();
        });

        if (elapsed < duration) {
            requestAnimationFrame(animate);
            return;
        }

        window.removeEventListener('resize', resizeCanvas);
        canvas.remove();
    }

    requestAnimationFrame(animate);
}
