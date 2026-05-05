/*!
* Start Bootstrap - Personal v1.0.1 (https://startbootstrap.com/template-overviews/personal)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-personal/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

window.addEventListener('DOMContentLoaded', () => {
    const supportButton = document.getElementById('supportButton');
    const supportButtonLabel = supportButton?.querySelector('.support-button-label');
    const supportMessage = document.getElementById('supportMessage');

    setupPosterPreview();
    setupSupportersMarquee();
    setupResponsiveCafeLinks();

    if (!supportButton) {
        return;
    }

    let clickCount = 0;
    let lastSupportClickTime = 0;
    const supportSounds = [
        'assets/dalcom.mp3',
        'assets/goso.mp3',
        'assets/cocoa.mp3',
        'assets/daldal.mp3',
        'assets/basak.mp3',
        'assets/heangbok.mp3'
    ].map((source) => {
        const audio = new Audio(source);
        audio.preload = 'auto';
        return audio;
    });
    const supportMessages = [
        '민심이 움직였습니다.',
        '근본당에 합류했습니다.',
        '버컴퍼니 2인자 체제가 강화되었습니다.',
        '수장님의 선택에 힘을 보탰습니다.',
        '오늘도 민심은 유설아 쪽으로 기울었습니다.'
    ];

    supportButton.addEventListener('click', (event) => {
        event.preventDefault();

        const now = performance.now();

        if (now - lastSupportClickTime < 1000) {
            return;
        }

        lastSupportClickTime = now;
        clickCount += 1;
        supportButton.classList.add('is-supported');

        if (supportButtonLabel) {
            supportButtonLabel.textContent = clickCount === 1 ? '근본당 입당 완료!' : '이미 근본당원입니다!';
        }

        showSupportMessage(supportMessage, supportMessages);
        showSupportCheer();
        playSupportSound(supportSounds, clickCount);
        launchConfetti();
    });
});


function setupResponsiveCafeLinks() {
    const links = document.querySelectorAll('.responsive-cafe-link');

    if (!links.length) {
        return;
    }

    const isMobile = () => window.matchMedia('(max-width: 767.98px)').matches || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

    links.forEach((link) => {
        link.addEventListener('click', () => {
            const desktopUrl = link.getAttribute('data-desktop-url') || link.href;
            const mobileUrl = link.getAttribute('data-mobile-url') || desktopUrl;
            link.href = isMobile() ? mobileUrl : desktopUrl;
        });
    });
}

function playSupportSound(sounds, clickCount) {
    if (!sounds.length) {
        return;
    }

    const sound = sounds[(clickCount - 1) % sounds.length];

    sounds.forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
    });

    sound.play().catch(() => {
        // Browsers can reject playback if the click gesture is interrupted.
    });
}

function setupSupportersMarquee() {
    const marquee = document.querySelector('.supporters-marquee');
    const track = marquee?.querySelector('.supporters-track');
    const directionButtons = document.querySelectorAll('[data-supporters-direction]');

    if (!marquee || !track || !directionButtons.length) {
        return;
    }

    let direction = marquee.classList.contains('is-scroll-left') ? 1 : -1;
    let offset = 0;
    let halfWidth = 0;
    let lastTime = performance.now();
    let isPaused = false;
    const pixelsPerSecond = 42;

    function measureTrack() {
        halfWidth = track.scrollWidth / 2;
        offset = halfWidth ? ((offset % halfWidth) + halfWidth) % halfWidth : 0;
    }

    function animate(currentTime) {
        const elapsed = (currentTime - lastTime) / 1000;
        lastTime = currentTime;

        if (!isPaused && halfWidth > 0) {
            offset = (offset + direction * pixelsPerSecond * elapsed) % halfWidth;

            if (offset < 0) {
                offset += halfWidth;
            }

            track.style.transform = `translateX(${-halfWidth + offset}px)`;
        }

        requestAnimationFrame(animate);
    }

    measureTrack();
    window.addEventListener('resize', measureTrack);
    track.addEventListener('mouseenter', () => {
        isPaused = true;
    });
    track.addEventListener('mouseleave', () => {
        isPaused = false;
    });

    directionButtons.forEach((button) => {
        const changeDirection = () => {
            const nextDirection = button.getAttribute('data-supporters-direction');

            marquee.classList.toggle('is-scroll-left', nextDirection === 'left');
            marquee.classList.toggle('is-scroll-right', nextDirection !== 'left');
            direction = nextDirection === 'left' ? 1 : -1;
        };

        button.addEventListener('mouseenter', changeDirection);
        button.addEventListener('focus', changeDirection);
        button.addEventListener('click', changeDirection);
    });

    requestAnimationFrame(animate);
}

function setupPosterPreview() {
    const posterButtons = document.querySelectorAll('.campaign-poster-open');
    const previewModalElement = document.getElementById('posterPreviewModal');
    const previewImage = document.getElementById('posterPreviewImage');

    if (!posterButtons.length || !previewModalElement || !previewImage || !window.bootstrap) {
        return;
    }

    const previewModal = new bootstrap.Modal(previewModalElement);

    posterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const posterSrc = button.getAttribute('data-poster-src');
            const posterAlt = button.getAttribute('data-poster-alt') || '선거 포스터';

            if (!posterSrc) {
                return;
            }

            previewImage.src = posterSrc;
            previewImage.alt = posterAlt;
            previewModal.show();
        });
    });

    previewModalElement.addEventListener('hidden.bs.modal', () => {
        previewImage.src = '';
        previewImage.alt = '';
    });
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
    cheer.textContent = '기호 D 유설아!';
    document.body.appendChild(cheer);
    cheer.addEventListener('animationend', () => cheer.remove(), { once: true });
}

function launchConfetti() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const colors = ['#064e3b', '#047857', '#059669', '#10b981', '#34d399', '#ffffff', '#f7d154'];
    const textPieces = ['D', '유설아', '근본', '키키','🐰'];
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
        const speed = 4 + Math.random() * 7;

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
                context.font = `900 ${piece.size * 2.05}px "Malgun Gothic", "Apple SD Gothic Neo", sans-serif`;
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillStyle = '#ffffff';
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














