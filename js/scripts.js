/*!
* Start Bootstrap - Personal v1.0.1 (https://startbootstrap.com/template-overviews/personal)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-personal/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

const supportApiBase = window.location.protocol === 'file:' ? 'http://localhost:3000' : '';

window.addEventListener('DOMContentLoaded', () => {
    const supportButton = document.getElementById('supportButton');
    const supportButtonLabel = supportButton?.querySelector('.support-button-label');
    const supportCount = document.getElementById('supportCount');
    const supportMessage = document.getElementById('supportMessage');

    if (!supportButton) {
        return;
    }

    let currentSupportCount = Number(supportCount?.textContent || 516);
    let clickCount = 0;
    const supportMessages = [
        '민심이 움직였습니다.',
        '근본당에 합류했습니다.',
        '버컴퍼니 2인자 체제가 강화되었습니다.',
        '수장님의 선택에 힘을 보탰습니다.',
        '오늘도 민심은 유설아 쪽으로 기울었습니다.'
    ];

    loadSupportCount(supportCount).then((count) => {
        if (typeof count === 'number') {
            currentSupportCount = count;
        }
    });

    supportButton.addEventListener('click', async (event) => {
        event.preventDefault();
        supportButton.classList.add('is-supported');

        try {
            supportButton.setAttribute('aria-busy', 'true');
            const nextCount = await saveSupportClick();

            if (typeof nextCount === 'number') {
                animateSupportCount(supportCount, currentSupportCount, nextCount);
                currentSupportCount = nextCount;
            } else {
                currentSupportCount += 1;
                animateSupportCount(supportCount, currentSupportCount - 1, currentSupportCount);
            }

            clickCount += 1;

            if (supportButtonLabel) {
                supportButtonLabel.textContent = clickCount === 1 ? '근본당 입당 완료!' : '지지 추가 완료!';
            }

            showSupportMessage(supportMessage, supportMessages);
        } catch {
            currentSupportCount += 1;
            animateSupportCount(supportCount, currentSupportCount - 1, currentSupportCount);

            if (supportButtonLabel) {
                supportButtonLabel.textContent = '응원 접수 완료!';
            }

            if (supportMessage) {
                supportMessage.textContent = '서버 연결 없이 화면에서만 응원이 반영되었습니다.';
            }
        } finally {
            supportButton.removeAttribute('aria-busy');
            showSupportCheer();
            launchConfetti();
        }
    });
});

async function loadSupportCount(element) {
    try {
        const response = await fetch(supportApiBase + '/api/support', { cache: 'no-store' });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        const count = Number(data.count);

        if (!Number.isFinite(count)) {
            return null;
        }

        if (element) {
            element.textContent = count.toLocaleString('ko-KR');
        }

        return count;
    } catch {
        return null;
    }
}

async function saveSupportClick() {
    const response = await fetch(supportApiBase + '/api/support', {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    const count = Number(data.count);

    return Number.isFinite(count) ? count : null;
}

function animateSupportCount(element, startValue, targetValue) {
    if (!element) {
        return;
    }

    const duration = 520;
    const startTime = performance.now();

    function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(startValue + (targetValue - startValue) * easedProgress);

        element.textContent = value.toLocaleString('ko-KR');

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function showSupportMessage(element, messages) {
    if (!element) {
        return;
    }

    const message = messages[Math.floor(Math.random() * messages.length)];

    element.textContent = message;
    element.classList.remove('is-flashing');
    void element.offsetWidth;
    element.classList.add('is-flashing');
}

function showSupportCheer() {
    const cheer = document.createElement('div');

    cheer.className = 'support-cheer';
    cheer.textContent = '기호 4번 유설아!';
    document.body.appendChild(cheer);
    cheer.addEventListener('animationend', () => cheer.remove(), { once: true });
}

function launchConfetti() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const colors = ['#1e30f3', '#507BCD', '#83A2DC', '#2f9a8f', '#c96f54', '#ffffff', '#f7d154'];
    const textPieces = ['4', '유', '근본', 'V'];
    const pieces = [];
    const duration = 2100;
    const startTime = performance.now();
    const pieceCount = 150;

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
            color: colors[Math.floor(Math.random() * colors.length)],
            text: Math.random() > 0.78 ? textPieces[Math.floor(Math.random() * textPieces.length)] : ''
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

            if (piece.text) {
                context.font = `900 ${piece.size * 1.8}px sans-serif`;
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillText(piece.text, 0, 0);
            } else {
                context.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.55);
            }

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


