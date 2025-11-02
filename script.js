// Основные даты
const departureDate = new Date('2025-11-07T00:00:00');
const returnDate = new Date('2026-11-07T00:00:00');
const totalDays = 365;

// Статистика для достижений
let stats = JSON.parse(localStorage.getItem('stats') || JSON.stringify({
    clicks: 0,
    snakeHigh: 0,
    visits: parseInt(localStorage.getItem('visits') || '0')
}));
stats.visits = parseInt(localStorage.getItem('visits') || '0') + 1;
localStorage.setItem('visits', stats.visits.toString());

// Отсчёт времени
function updateCountdown() {
    const now = new Date();
    const diff = returnDate - now;

    if (diff <= 0) {
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        const statusTextEl = document.getElementById('statusText');
        
        if (daysEl) daysEl.textContent = '0';
        if (hoursEl) hoursEl.textContent = '00';
        if (minutesEl) minutesEl.textContent = '00';
        if (secondsEl) secondsEl.textContent = '00';
        if (statusTextEl) {
            statusTextEl.textContent = '🎉 ЕГОР ВЕРНУЛСЯ! 🎉';
        }
        
        const progressEl = document.getElementById('progress');
        if (progressEl) progressEl.style.width = '100%';
        
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // Обновляем с анимацией
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    if (daysEl) {
        const newDays = days.toString();
        if (daysEl.textContent !== newDays) {
            animateCountdownNumber('days', days);
            daysEl.textContent = newDays;
            const daysUnit = daysEl.closest('.time-unit');
            if (daysUnit) {
                daysUnit.classList.add('scale-animate');
                setTimeout(() => daysUnit.classList.remove('scale-animate'), 500);
            }
        }
    }
    
    if (hoursEl) {
        const newHours = hours.toString().padStart(2, '0');
        if (hoursEl.textContent !== newHours) {
            animateCountdownNumber('hours', hours);
            hoursEl.textContent = newHours;
            const hoursUnit = hoursEl.closest('.time-unit');
            if (hoursUnit) {
                hoursUnit.classList.add('scale-animate');
                setTimeout(() => hoursUnit.classList.remove('scale-animate'), 500);
            }
        }
    }
    
    if (minutesEl) {
        const newMinutes = minutes.toString().padStart(2, '0');
        if (minutesEl.textContent !== newMinutes) {
            animateCountdownNumber('minutes', minutes);
            minutesEl.textContent = newMinutes;
            const minutesUnit = minutesEl.closest('.time-unit');
            if (minutesUnit) {
                minutesUnit.classList.add('scale-animate');
                setTimeout(() => minutesUnit.classList.remove('scale-animate'), 500);
            }
        }
    }
    
    if (secondsEl) {
        const newSeconds = seconds.toString().padStart(2, '0');
        // Обновляем секунды каждый раз (они меняются каждую секунду)
        animateCountdownNumber('seconds', seconds);
        secondsEl.textContent = newSeconds;
        const secondsUnit = secondsEl.closest('.time-unit');
        if (secondsUnit) {
            secondsUnit.classList.add('scale-animate');
            setTimeout(() => secondsUnit.classList.remove('scale-animate'), 500);
        }
    }

    // Прогресс бар
    const elapsed = now - departureDate;
    const total = returnDate - departureDate;
    const progress = Math.min(100, Math.max(0, (elapsed / total) * 100));
    const progressEl = document.getElementById('progress');
    if (progressEl) progressEl.style.width = progress + '%';

    // Обновление статуса
    const daysRemaining = days;
    const statusTextEl = document.getElementById('statusText');
    if (statusTextEl) {
        let newStatusText = '';
        if (daysRemaining > 300) {
            newStatusText = '⏳ Ещё долго ждать...';
        } else if (daysRemaining > 180) {
            newStatusText = '📅 Прошла половина пути!';
        } else if (daysRemaining > 90) {
            newStatusText = '🚀 Скоро вернётся!';
        } else if (daysRemaining > 30) {
            newStatusText = '🎯 Осталось меньше месяца!';
        } else if (daysRemaining > 7) {
            newStatusText = '🔥 Совсем скоро!';
        } else if (daysRemaining > 0) {
            newStatusText = '⚡ ОСТАЛОСЬ МЕНЬШЕ НЕДЕЛИ!!!';
        }
        
        // Обновляем статус только если он изменился
        if (statusTextEl.textContent !== newStatusText && newStatusText) {
            typeWriter(statusTextEl, newStatusText);
        }
    }
}

// След курсора
const cursorTrail = document.createElement('div');
cursorTrail.className = 'cursor-trail';
document.body.appendChild(cursorTrail);

let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
    trailX = e.clientX;
    trailY = e.clientY;
    cursorTrail.style.left = (e.clientX - 10) + 'px';
    cursorTrail.style.top = (e.clientY - 10) + 'px';
});

// ========== ГАЧИ-ИГРЫ (улучшенные версии) ==========

// Салют отключен
function showFireworks() {
    showToast('Салют отключен для производительности', 'info');
}

// Музыка
let audioContext = null;
function playMusic() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const notes = [262, 294, 330, 349, 392, 440, 494, 523];
    let noteIndex = 0;

    function playNote() {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = notes[noteIndex % notes.length];
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);

        noteIndex++;
    }

    for (let i = 0; i < 16; i++) {
        setTimeout(playNote, i * 200);
    }
}

// Шутки
const jokes = [
    'Почему Егор вернётся из армии? Потому что срок службы ограничен!',
    'Что будет, когда Егор вернётся? Домашняя еда и мягкая кровать!',
    'Почему армия закончится? Потому что даже армии нужен отпуск!',
    'Что Егор принесёт из армии? Опыт, навыки и кучу историй!',
    'Когда Егор вернётся? 7 ноября 2026 - отметьте в календаре!'
];

function showJokes() {
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    alert('😄 ' + joke);
}

// Радуга
function randomColor() {
    const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'];
    let colorIndex = 0;
    
    const interval = setInterval(() => {
        document.body.style.background = colors[colorIndex];
        colorIndex = (colorIndex + 1) % colors.length;
    }, 200);

    setTimeout(() => {
        clearInterval(interval);
        document.body.style.background = 'linear-gradient(45deg, #ff00ff, #00ffff, #ffff00, #ff00ff)';
    }, 5000);
}

// Конфетти
function createConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confetti = [];
    const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff0000', '#00ff00', '#0000ff'];
    
    for (let i = 0; i < 200; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 4,
            vy: Math.random() * 3 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 4,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confetti.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.rotation += particle.rotationSpeed;
            
            if (particle.y > canvas.height) {
                particle.y = 0;
                particle.x = Math.random() * canvas.width;
            }
            
            ctx.save();
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rotation * Math.PI / 180);
            ctx.fillStyle = particle.color;
            ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
            ctx.restore();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    setTimeout(() => {
        canvas.style.display = 'none';
    }, 5000);
}

// Мотивационные цитаты
const quotes = [
    {text: 'Терпение - ключ к победе!', author: '- Егор', icon: '💪'},
    {text: 'Каждый день - шаг ближе к дому!', author: '- Егор', icon: '🏠'},
    {text: 'Сила духа побеждает всё!', author: '- Егор', icon: '⚡'},
    {text: 'Терпение и упорство - путь к успеху!', author: '- Егор', icon: '🌟'},
    {text: 'Скоро домой, держись!', author: '- Егор', icon: '🎖️'},
    {text: 'Время идёт, возвращение близко!', author: '- Егор', icon: '⏰'},
    {text: 'Ты справишься, брат!', author: '- Егор', icon: '👊'},
    {text: 'Сила в единстве!', author: '- Егор', icon: '🤝'},
    {text: 'Дисциплина - залог победы!', author: '- Егор', icon: '🎯'},
    {text: 'Каждый миг приближает к цели!', author: '- Егор', icon: '⏳'},
    {text: 'Верь в себя и всё получится!', author: '- Егор', icon: '✨'},
    {text: 'Мужество рождается в трудностях!', author: '- Егор', icon: '🛡️'},
    {text: 'Путь в тысячу ли начинается с одного шага!', author: '- Егор', icon: '👣'},
    {text: 'Солдат не сдаётся!', author: '- Егор', icon: '⚔️'},
    {text: 'Дом близко, дружище!', author: '- Егор', icon: '🏡'},
];

let currentQuoteIndex = 0;

function changeQuote() {
    currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
    const quote = quotes[currentQuoteIndex];
    document.getElementById('quoteText').textContent = quote.text;
    document.getElementById('quoteAuthor').textContent = quote.author;
    document.getElementById('quoteCard').querySelector('.quote-icon').textContent = quote.icon;
    
    // Анимация смены
    const card = document.getElementById('quoteCard');
    card.style.transform = 'scale(0.8) rotate(5deg)';
    setTimeout(() => {
        card.style.transform = 'scale(1) rotate(0deg)';
    }, 300);
}

function showMotivationalQuote() {
    changeQuote();
    createConfetti();
}

// Анимация страницы
function animatePage() {
    document.body.style.animation = 'none';
    setTimeout(() => {
        document.body.style.animation = 'pageShake 0.5s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 500);
    }, 10);
}

// Создание частиц
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    const emojis = ['⭐', '✨', '💫', '🌟', '⚡', '🔥', '💎', '👑'];
    
    setInterval(() => {
        if (container.children.length > 30) return;
        
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 5 + 5) + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';
        
        container.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 15000);
    }, 500);
}

// Обновление статистики
function updateStats() {
    // Статистика отсчёта
    const now = new Date();
    const elapsed = now - departureDate;
    const total = returnDate - departureDate;
    const daysPassed = Math.floor(elapsed / (1000 * 60 * 60 * 24));
    const hoursPassed = Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const progressPercent = Math.min(100, Math.max(0, (elapsed / total) * 100));
    
    const daysPassedEl = document.getElementById('daysPassed');
    const hoursPassedEl = document.getElementById('hoursPassed');
    const progressPercentEl = document.getElementById('progressPercent');
    
    if (daysPassedEl) daysPassedEl.textContent = daysPassed;
    if (hoursPassedEl) hoursPassedEl.textContent = hoursPassed;
    if (progressPercentEl) progressPercentEl.textContent = progressPercent.toFixed(1) + '%';
    
    // Статистика игр
    const arenaHeroes = JSON.parse(localStorage.getItem('arenaHeroes') || '[]');
    const mushroomPower = parseInt(localStorage.getItem('mushroomPower') || '0');
    const unlockedAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');
    const playTime = parseInt(localStorage.getItem('playTime') || '0');
    
    const arenaStatEl = document.getElementById('arenaStatHeroes');
    const mushroomStatEl = document.getElementById('mushroomStatPower');
    const achievementsStatEl = document.getElementById('statAchievements');
    const playTimeStatEl = document.getElementById('statPlayTime');
    
    if (arenaStatEl) arenaStatEl.textContent = arenaHeroes.length;
    if (mushroomStatEl) mushroomStatEl.textContent = mushroomPower.toLocaleString();
    if (achievementsStatEl) achievementsStatEl.textContent = unlockedAchievements.length;
    if (playTimeStatEl) playTimeStatEl.textContent = playTime;
    
    // Общая валюта (объединяем валюту из обеих игр)
    const arenaCoins = parseInt(localStorage.getItem('arenaCoins') || '1000');
    const mushroomCoins = parseInt(localStorage.getItem('mushroomCoins') || '0');
    const totalCurrency = arenaCoins + mushroomCoins;
    const totalCurrencyEl = document.getElementById('totalCurrency');
    if (totalCurrencyEl) totalCurrencyEl.textContent = totalCurrency.toLocaleString();
}

// Трекинг времени игры
let playTimeInterval;
function startPlayTimeTracking() {
    if (playTimeInterval) return;
    
    playTimeInterval = setInterval(() => {
        const playTime = parseInt(localStorage.getItem('playTime') || '0');
        localStorage.setItem('playTime', (playTime + 1).toString());
        updateStats();
    }, 60000); // Каждую минуту
}

// ========== СИСТЕМА ТЕМ ОФОРМЛЕНИЯ ==========
const themes = [
    {
        id: 'classic',
        name: 'Классическая',
        icon: '🎨',
        price: 0,
        description: 'Стандартная ретро-тема',
        owned: true,
        styles: {}
    },
    {
        id: 'neon',
        name: 'Неоновая',
        icon: '💜',
        price: 5000,
        description: 'Неоновые цвета и эффекты',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #0a0a0a, #1a0033, #330066);',
            header: 'background: #1a0033; border-color: #ff00ff; box-shadow: 0 0 20px #ff00ff;',
            glow: 'text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff, 0 0 40px #ff00ff;'
        }
    },
    {
        id: 'space',
        name: 'Космическая',
        icon: '🚀',
        price: 10000,
        description: 'Тёмная тема с космосом',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #000428, #004e92, #000428);',
            header: 'background: #000428; border-color: #00ffff; box-shadow: 0 0 20px #00ffff;',
            glow: 'text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff;'
        }
    },
    {
        id: 'pixel',
        name: 'Пиксельная',
        icon: '🎮',
        price: 8000,
        description: '8-bit стиль',
        owned: false,
        styles: {
            body: 'background: repeating-linear-gradient(45deg, #000, #000 10px, #111 10px, #111 20px);',
            header: 'background: #000; border-color: #00ff00;',
            glow: 'text-shadow: 2px 2px 0 #00ff00, 4px 4px 0 #00ff00;'
        }
    },
    {
        id: 'japanese',
        name: 'Японская',
        icon: '🗾',
        price: 12000,
        description: 'Сакура и японский стиль',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #ff9a9e, #fecfef, #fecfef, #ffc3a0);',
            header: 'background: #fff; border-color: #ff69b4;',
            glow: 'text-shadow: 0 0 10px #ff69b4, 0 0 20px #ff69b4;'
        }
    },
    {
        id: 'matrix',
        name: 'Матрица',
        icon: '💚',
        price: 15000,
        description: 'Зелёный код как в Матрице',
        owned: false,
        styles: {
            body: 'background: #000; color: #00ff00;',
            header: 'background: #000; border-color: #00ff00; box-shadow: 0 0 20px #00ff00;',
            glow: 'text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00;'
        }
    },
    {
        id: 'rainbow',
        name: 'Радужная',
        icon: '🌈',
        price: 20000,
        description: 'Все цвета радуги',
        owned: false,
        styles: {
            body: 'background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3); background-size: 400% 400%; animation: gradientShift 3s ease infinite;',
            header: 'background: #fff; border-color: #000;',
            glow: 'text-shadow: 0 0 10px currentColor, 0 0 20px currentColor; animation: rainbowText 2s linear infinite;'
        }
    },
    {
        id: 'gold',
        name: 'Золотая',
        icon: '👑',
        price: 30000,
        description: 'Роскошная золотая тема',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #f5d76e, #f7dc6f, #f4d03f);',
            header: 'background: #ffd700; border-color: #000; box-shadow: 10px 10px 0 #000;',
            glow: 'text-shadow: 0 0 10px #ffd700, 0 0 20px #ffd700, 0 0 30px #ffd700;'
        }
    },
    {
        id: 'ocean',
        name: 'Океанская',
        icon: '🌊',
        price: 18000,
        description: 'Синие воды океана',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #006994, #0088cc, #00aaff);',
            header: 'background: #006994; border-color: #00ffff;',
            glow: 'text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff;'
        }
    },
    {
        id: 'forest',
        name: 'Лесная',
        icon: '🌲',
        price: 14000,
        description: 'Зелёный лес',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #1a5f1a, #2d8f2d, #4db84d);',
            header: 'background: #1a5f1a; border-color: #00ff00;',
            glow: 'text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00;'
        }
    },
    {
        id: 'fire',
        name: 'Огненная',
        icon: '🔥',
        price: 25000,
        description: 'Горячая огненная тема',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #ff4500, #ff6347, #ff8c00);',
            header: 'background: #ff4500; border-color: #ff0000; box-shadow: 0 0 20px #ff0000;',
            glow: 'text-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000;'
        }
    },
    {
        id: 'ice',
        name: 'Ледяная',
        icon: '❄️',
        price: 22000,
        description: 'Холодная ледяная тема',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #87ceeb, #b0e0e6, #e0f6ff);',
            header: 'background: #87ceeb; border-color: #00ffff;',
            glow: 'text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff;'
        }
    },
    {
        id: 'batman',
        name: 'Темный Рыцарь',
        icon: '🦇',
        price: 35000,
        description: 'Тёмная готика Бэтмена',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #000000, #1a1a1a, #2d2d2d);',
            header: 'background: #000000; border-color: #ffd700; box-shadow: 0 0 30px #ffd700;',
            glow: 'text-shadow: 0 0 15px #ffd700, 0 0 30px #ffd700, 0 0 45px #ffd700; color: #ffd700;'
        }
    },
    {
        id: 'bladerunner',
        name: 'Бегущий по лезвию',
        icon: '🌃',
        price: 40000,
        description: 'Киберпанк неоновая ночь',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #0a0a0f, #1a1a2e, #16213e);',
            header: 'background: #0a0a0f; border-color: #ff6b9d; box-shadow: 0 0 25px #ff6b9d, 0 0 50px #ff6b9d;',
            glow: 'text-shadow: 0 0 10px #ff6b9d, 0 0 20px #ff6b9d, 0 0 30px #ff6b9d; color: #ff6b9d;'
        }
    },
    {
        id: 'terminator',
        name: 'Терминатор',
        icon: '🤖',
        price: 38000,
        description: 'Красный глаз и огонь',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #1a0000, #330000, #4d0000);',
            header: 'background: #1a0000; border-color: #ff0000; box-shadow: 0 0 30px #ff0000, 0 0 60px #ff0000;',
            glow: 'text-shadow: 0 0 15px #ff0000, 0 0 30px #ff0000, 0 0 45px #ff0000; color: #ff4444;'
        }
    },
    {
        id: 'starwars',
        name: 'Звёздные Войны',
        icon: '⭐',
        price: 42000,
        description: 'Тёмная сторона силы',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #000000, #1a0033, #330066);',
            header: 'background: #000000; border-color: #ff0080; box-shadow: 0 0 25px #ff0080;',
            glow: 'text-shadow: 0 0 10px #ff0080, 0 0 20px #ff0080, 0 0 30px #ff0080; color: #ff0080;'
        }
    },
    {
        id: 'harrypotter',
        name: 'Гарри Поттер',
        icon: '🪄',
        price: 36000,
        description: 'Тёмная магия Хогвартса',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #1a0033, #2d004d, #4d0066);',
            header: 'background: #1a0033; border-color: #b8860b; box-shadow: 0 0 20px #b8860b;',
            glow: 'text-shadow: 0 0 10px #b8860b, 0 0 20px #b8860b; color: #d4af37;'
        }
    },
    {
        id: 'tron',
        name: 'Трон',
        icon: '💿',
        price: 45000,
        description: 'Неоновый цифровой мир',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #000000, #001122, #003344);',
            header: 'background: #000000; border-color: #00ffff; box-shadow: 0 0 30px #00ffff, 0 0 60px #00ffff;',
            glow: 'text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff, 0 0 40px #00ffff; color: #00ffff;'
        }
    },
    {
        id: 'madmax',
        name: 'Безумный Макс',
        icon: '🏜️',
        price: 40000,
        description: 'Постапокалиптическая пустошь',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #2d1a00, #4d3300, #664400);',
            header: 'background: #2d1a00; border-color: #ff8800; box-shadow: 0 0 25px #ff8800;',
            glow: 'text-shadow: 0 0 10px #ff8800, 0 0 20px #ff8800; color: #ffaa00;'
        }
    },
    {
        id: 'witcher',
        name: 'Ведьмак',
        icon: '⚔️',
        price: 44000,
        description: 'Тёмное фэнтези',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #0d0d0d, #1a1a1a, #262626);',
            header: 'background: #0d0d0d; border-color: #8b4513; box-shadow: 0 0 20px #8b4513;',
            glow: 'text-shadow: 0 0 10px #8b4513, 0 0 20px #8b4513; color: #cd853f;'
        }
    },
    {
        id: 'lotr',
        name: 'Властелин Колец',
        icon: '💍',
        price: 46000,
        description: 'Тёмное фэнтези Средиземья',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #1a1a0d, #2d2d1a, #404020);',
            header: 'background: #1a1a0d; border-color: #8b7355; box-shadow: 0 0 25px #8b7355;',
            glow: 'text-shadow: 0 0 10px #8b7355, 0 0 20px #8b7355; color: #d4a574;'
        }
    },
    {
        id: 'cyberpunk',
        name: 'Киберпанк 2077',
        icon: '🌐',
        price: 50000,
        description: 'Неоновый мегаполис будущего',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #0a0a0f, #1a0a2e, #16213e);',
            header: 'background: #0a0a0f; border-color: #ff00ff; box-shadow: 0 0 35px #ff00ff, 0 0 70px #ff00ff;',
            glow: 'text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff, 0 0 40px #ff00ff; color: #ff00ff;'
        }
    },
    {
        id: 'alien',
        name: 'Чужой',
        icon: '👽',
        price: 43000,
        description: 'Тёмный космический ужас',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #000000, #0a0a0a, #1a1a1a);',
            header: 'background: #000000; border-color: #00ff00; box-shadow: 0 0 25px #00ff00;',
            glow: 'text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00; color: #00ff00;'
        }
    },
    {
        id: 'interstellar',
        name: 'Интерстеллар',
        icon: '🌌',
        price: 48000,
        description: 'Тёмный космос и чёрная дыра',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #000000, #000033, #000066);',
            header: 'background: #000000; border-color: #ffff00; box-shadow: 0 0 30px #ffff00;',
            glow: 'text-shadow: 0 0 10px #ffff00, 0 0 20px #ffff00, 0 0 30px #ffff00; color: #ffff00;'
        }
    },
    {
        id: 'vampire',
        name: 'Вампир',
        icon: '🧛',
        price: 39000,
        description: 'Тёмная ночь вампиров',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #1a0000, #330000, #4d0000);',
            header: 'background: #1a0000; border-color: #8b0000; box-shadow: 0 0 25px #8b0000;',
            glow: 'text-shadow: 0 0 10px #8b0000, 0 0 20px #8b0000, 0 0 30px #8b0000; color: #cc0000;'
        }
    },
    {
        id: 'predator',
        name: 'Хищник',
        icon: '🎯',
        price: 41000,
        description: 'Тропический джунгли и охота',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #0d1a0d, #1a331a, #264d26);',
            header: 'background: #0d1a0d; border-color: #ffaa00; box-shadow: 0 0 25px #ffaa00;',
            glow: 'text-shadow: 0 0 10px #ffaa00, 0 0 20px #ffaa00; color: #ffcc00;'
        }
    },
    {
        id: 'zombie',
        name: 'Зомби',
        icon: '🧟',
        price: 37000,
        description: 'Апокалипсис зомби',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #1a1a0d, #2d2d1a, #404020);',
            header: 'background: #1a1a0d; border-color: #66ff00; box-shadow: 0 0 20px #66ff00;',
            glow: 'text-shadow: 0 0 10px #66ff00, 0 0 20px #66ff00; color: #88ff00;'
        }
    },
    {
        id: 'ghost',
        name: 'Призраки',
        icon: '👻',
        price: 34000,
        description: 'Тёмное привидение',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);',
            header: 'background: #1a1a2e; border-color: #ffffff; box-shadow: 0 0 30px #ffffff;',
            glow: 'text-shadow: 0 0 10px #ffffff, 0 0 20px #ffffff, 0 0 30px #ffffff; color: #ffffff;'
        }
    },
    {
        id: 'ninja',
        name: 'Ниндзя',
        icon: '🥷',
        price: 38000,
        description: 'Тёмная ночь ниндзя',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #000000, #0a0a0a, #1a1a1a);',
            header: 'background: #000000; border-color: #ff0000; box-shadow: 0 0 25px #ff0000;',
            glow: 'text-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000; color: #ff3333;'
        }
    },
    {
        id: 'anime',
        name: 'Аниме Тьма',
        icon: '🎭',
        price: 42000,
        description: 'Тёмное аниме',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #0a0a1a, #1a1a2e, #2d2d4d);',
            header: 'background: #0a0a1a; border-color: #ff69b4; box-shadow: 0 0 30px #ff69b4;',
            glow: 'text-shadow: 0 0 10px #ff69b4, 0 0 20px #ff69b4, 0 0 30px #ff69b4; color: #ff69b4;'
        }
    },
    {
        id: 'gothic',
        name: 'Готика',
        icon: '🖤',
        price: 35000,
        description: 'Тёмная готическая тема',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #000000, #1a001a, #330033);',
            header: 'background: #000000; border-color: #ff00ff; box-shadow: 0 0 30px #ff00ff;',
            glow: 'text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff; color: #ff00ff;'
        }
    },
    {
        id: 'noir',
        name: 'Нуар',
        icon: '🎩',
        price: 40000,
        description: 'Чёрно-белый нуар',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #000000, #1a1a1a, #2d2d2d);',
            header: 'background: #000000; border-color: #ffffff; box-shadow: 0 0 25px #ffffff;',
            glow: 'text-shadow: 0 0 10px #ffffff, 0 0 20px #ffffff; color: #ffffff;'
        }
    },
    {
        id: 'steampunk',
        name: 'Стимпанк',
        icon: '⚙️',
        price: 45000,
        description: 'Тёмный паровой панк',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #1a1a0d, #2d2d1a, #404020);',
            header: 'background: #1a1a0d; border-color: #d4af37; box-shadow: 0 0 30px #d4af37;',
            glow: 'text-shadow: 0 0 10px #d4af37, 0 0 20px #d4af37; color: #d4af37;'
        }
    },
    {
        id: 'void',
        name: 'Пустота',
        icon: '🌑',
        price: 55000,
        description: 'Абсолютная темнота',
        owned: false,
        styles: {
            body: 'background: #000000;',
            header: 'background: #000000; border-color: #ffffff; box-shadow: 0 0 40px #ffffff;',
            glow: 'text-shadow: 0 0 15px #ffffff, 0 0 30px #ffffff, 0 0 45px #ffffff; color: #ffffff;'
        }
    },
    {
        id: 'neon_night',
        name: 'Неоновая Ночь',
        icon: '🌙',
        price: 47000,
        description: 'Тёмная неоновая ночь',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #000033, #000066, #000099);',
            header: 'background: #000033; border-color: #00ffff; box-shadow: 0 0 35px #00ffff;',
            glow: 'text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff; color: #00ffff;'
        }
    },
    {
        id: 'dark_purple',
        name: 'Тёмная Фиолетовая',
        icon: '💜',
        price: 33000,
        description: 'Глубокая фиолетовая тьма',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #1a0033, #330066, #4d0099);',
            header: 'background: #1a0033; border-color: #cc00ff; box-shadow: 0 0 25px #cc00ff;',
            glow: 'text-shadow: 0 0 10px #cc00ff, 0 0 20px #cc00ff; color: #cc00ff;'
        }
    },
    {
        id: 'dark_blue',
        name: 'Тёмная Синяя',
        icon: '💙',
        price: 32000,
        description: 'Глубокая синяя тьма',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #000033, #000066, #000099);',
            header: 'background: #000033; border-color: #0088ff; box-shadow: 0 0 25px #0088ff;',
            glow: 'text-shadow: 0 0 10px #0088ff, 0 0 20px #0088ff; color: #0088ff;'
        }
    },
    {
        id: 'dark_green',
        name: 'Тёмная Зелёная',
        icon: '💚',
        price: 31000,
        description: 'Глубокая зелёная тьма',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #001a00, #003300, #004d00);',
            header: 'background: #001a00; border-color: #00ff00; box-shadow: 0 0 25px #00ff00;',
            glow: 'text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00; color: #00ff00;'
        }
    },
    {
        id: 'dark_red',
        name: 'Тёмная Красная',
        icon: '❤️',
        price: 34000,
        description: 'Глубокая красная тьма',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #330000, #4d0000, #660000);',
            header: 'background: #330000; border-color: #ff0000; box-shadow: 0 0 25px #ff0000;',
            glow: 'text-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000; color: #ff0000;'
        }
    },
    {
        id: 'dark_orange',
        name: 'Тёмная Оранжевая',
        icon: '🧡',
        price: 33000,
        description: 'Глубокая оранжевая тьма',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #331a00, #4d2600, #663300);',
            header: 'background: #331a00; border-color: #ff6600; box-shadow: 0 0 25px #ff6600;',
            glow: 'text-shadow: 0 0 10px #ff6600, 0 0 20px #ff6600; color: #ff6600;'
        }
    },
    {
        id: 'dark_yellow',
        name: 'Тёмная Жёлтая',
        icon: '💛',
        price: 32000,
        description: 'Глубокая жёлтая тьма',
        owned: false,
        styles: {
            body: 'background: linear-gradient(135deg, #332200, #4d3300, #664400);',
            header: 'background: #332200; border-color: #ffcc00; box-shadow: 0 0 25px #ffcc00;',
            glow: 'text-shadow: 0 0 10px #ffcc00, 0 0 20px #ffcc00; color: #ffcc00;'
        }
    }
];

let ownedThemes = JSON.parse(localStorage.getItem('ownedThemes') || '["classic"]');
let currentTheme = localStorage.getItem('currentTheme') || 'classic';

function getTotalCurrency() {
    const arenaCoins = parseInt(localStorage.getItem('arenaCoins') || '1000');
    const mushroomCoins = parseInt(localStorage.getItem('mushroomCoins') || '0');
    return arenaCoins + mushroomCoins;
}

function showThemeShop() {
    const modal = document.createElement('div');
    modal.className = 'theme-shop-modal';
    modal.innerHTML = `
        <h2 style="color: #000; margin-bottom: 20px; text-align: center; font-size: 2em;">🎨 МАГАЗИН ТЕМ</h2>
        <div style="margin-bottom: 20px; text-align: center; font-size: 1.2em; font-weight: bold;">
            💰 Валюта: <span style="color: #ff00ff;">${getTotalCurrency().toLocaleString()}</span>
        </div>
        <div class="theme-grid" id="themeGrid"></div>
        <button class="quote-btn" onclick="this.parentElement.remove()" style="margin-top: 20px;">ЗАКРЫТЬ</button>
    `;
    
    const grid = modal.querySelector('#themeGrid');
    themes.forEach(theme => {
        const isOwned = ownedThemes.includes(theme.id);
        const isActive = currentTheme === theme.id;
        const canBuy = !isOwned && getTotalCurrency() >= theme.price;
        
        const card = document.createElement('div');
        card.className = `theme-card ${isOwned ? 'owned' : ''} ${isActive ? 'active' : ''}`;
        card.innerHTML = `
            <div class="theme-preview" style="${theme.styles.body || ''}">
                ${theme.icon}
            </div>
            <div class="theme-name">${theme.name}</div>
            <div class="theme-description">${theme.description}</div>
            ${!isOwned ? `<div class="theme-price">${theme.price.toLocaleString()}💰</div>` : ''}
            ${!isOwned ? `<button class="theme-btn buy ${!canBuy ? 'owned' : ''}" onclick="buyTheme('${theme.id}')" ${!canBuy ? 'disabled' : ''}>
                ${canBuy ? 'КУПИТЬ' : 'НЕДОСТАТОЧНО'}
            </button>` : ''}
            ${isOwned && !isActive ? `<button class="theme-btn apply" onclick="applyTheme('${theme.id}')">
                ПРИМЕНИТЬ
            </button>` : ''}
            ${isActive ? `<div style="color: #ffd700; font-weight: bold; margin-top: 10px;">✓ АКТИВНА</div>` : ''}
        `;
        grid.appendChild(card);
    });
    
    document.body.appendChild(modal);
}

function buyTheme(themeId) {
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return;
    
    if (ownedThemes.includes(themeId)) {
        showToast('Эта тема уже куплена!', 'info', 3000);
        return;
    }
    
    const totalCurrency = getTotalCurrency();
    if (totalCurrency < theme.price) {
        showToast(`Недостаточно валюты! Нужно ${theme.price.toLocaleString()}💰`, 'error', 4000);
        return;
    }
    
    // Списываем валюту (поровну из обеих игр или только из той где есть)
    const arenaCoins = parseInt(localStorage.getItem('arenaCoins') || '1000');
    const mushroomCoins = parseInt(localStorage.getItem('mushroomCoins') || '0');
    
    let remainingCost = theme.price;
    
    if (arenaCoins > 0 && remainingCost > 0) {
        const deductArena = Math.min(arenaCoins, remainingCost);
        localStorage.setItem('arenaCoins', (arenaCoins - deductArena).toString());
        remainingCost -= deductArena;
    }
    
    if (mushroomCoins > 0 && remainingCost > 0) {
        const deductMushroom = Math.min(mushroomCoins, remainingCost);
        localStorage.setItem('mushroomCoins', (mushroomCoins - deductMushroom).toString());
        remainingCost -= deductMushroom;
    }
    
    ownedThemes.push(themeId);
    localStorage.setItem('ownedThemes', JSON.stringify(ownedThemes));
    
    showToast(`🎉 Тема "${theme.name}" куплена! Теперь вы можете её применить.`, 'success', 4000);
    updateStats();
    
    // Обновляем модальное окно
    document.querySelectorAll('.theme-shop-modal').forEach(m => m.remove());
    showThemeShop();
}

function applyTheme(themeId) {
    if (!ownedThemes.includes(themeId)) {
        if (themeId !== 'classic') {
            showToast('Сначала купите эту тему!', 'error', 3000);
            return;
        }
    }
    
    currentTheme = themeId;
    localStorage.setItem('currentTheme', themeId);
    
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return;
    
    // Применяем стили темы ко всей странице
    const body = document.body;
    const header = document.querySelector('header');
    
    // Удаляем все предыдущие классы тем
    body.className = body.className.replace(/theme-\w+/g, '');
    
    if (theme.styles.body) {
        body.setAttribute('style', theme.styles.body);
    } else {
        body.removeAttribute('style');
    }
    
    if (theme.styles.header && header) {
        header.setAttribute('style', theme.styles.header);
    } else if (header) {
        header.removeAttribute('style');
    }
    
    // Применяем стили к элементам с классом glow
    document.querySelectorAll('.glow').forEach(el => {
        if (theme.styles.glow) {
            el.setAttribute('style', theme.styles.glow + (el.getAttribute('style') || ''));
        }
    });
    
    // Добавляем класс темы для дальнейшей стилизации
    body.classList.add(`theme-${themeId}`);
    
    // Применяем специальные эффекты темы
    applyThemeFeatures(themeId);
    
    // Обновляем название текущей темы
    const themeNameEl = document.getElementById('currentThemeName');
    if (themeNameEl) themeNameEl.textContent = theme.name;
    
    if (themeId !== 'classic') {
        showToast(`✨ Тема "${theme.name}" применена! Особенность: ${getThemeFeature(themeId)}`, 'success', 4000);
    }
    
    // Перезагружаем магазин если он открыт
    const shopModal = document.querySelector('.theme-shop-modal');
    if (shopModal) {
        shopModal.remove();
        showThemeShop();
    }
}

// Получение описания особенности темы
function getThemeFeature(themeId) {
    const features = {
        'batman': '🦇 Золотое свечение, готические тени',
        'bladerunner': '🌃 Неоновые блики, киберпанк-эффекты',
        'terminator': '🤖 Пульсирующий красный свет, огненные эффекты',
        'starwars': '⭐ Мерцающие звёзды, силовая аура',
        'harrypotter': '🪄 Золотые искры, магическое свечение',
        'tron': '💿 Неоновые линии, цифровой глитч',
        'madmax': '🏜️ Песчаные частицы, жаркие волны',
        'witcher': '⚔️ Тёмное пламя, фэнтези-аура',
        'lotr': '💍 Древние руны, мистическое сияние',
        'cyberpunk': '🌐 Радужный неон, глитч-эффекты',
        'alien': '👽 Зелёное свечение, космический страх',
        'interstellar': '🌌 Чёрная дыра, звёздное мерцание',
        'vampire': '🧛 Кровавый туман, ночные тени',
        'predator': '🎯 Тепловое зрение, джунгли',
        'zombie': '🧟 Токсичный зелёный, разложение',
        'ghost': '👻 Призрачное свечение, туман',
        'ninja': '🥷 Мгновенные тени, дым',
        'anime': '🎭 Яркие блики, энергетические волны',
        'gothic': '🖤 Фиолетовое пламя, готика',
        'noir': '🎩 Чёрно-белый фильтр, дым',
        'steampunk': '⚙️ Золотые шестерни, пар',
        'void': '🌑 Полная темнота, белый свет',
        'neon_night': '🌙 Синие неоновые линии',
        'matrix': '💚 Падающий код, зелёный дождь',
        'neon': '💜 Неоновые градиенты',
        'space': '🚀 Космический туман, звёзды',
        'pixel': '🎮 Пиксельные тени, 8-bit эффекты',
        'japanese': '🗾 Лепестки сакуры, мягкое свечение',
        'rainbow': '🌈 Радужные переходы, смена цветов',
        'gold': '👑 Золотые блики, роскошь',
        'ocean': '🌊 Водные волны, пузыри',
        'forest': '🌲 Листья, природное сияние',
        'fire': '🔥 Огненные языки, жар',
        'ice': '❄️ Ледяные кристаллы, мороз',
        'dark_purple': '💜 Фиолетовое свечение',
        'dark_blue': '💙 Синяя глубина',
        'dark_green': '💚 Зелёная тьма',
        'dark_red': '❤️ Кровавое сияние',
        'dark_orange': '🧡 Огненная тьма',
        'dark_yellow': '💛 Золотая тьма'
    };
    return features[themeId] || 'Специальные эффекты';
}

// Применение специальных эффектов темы
function applyThemeFeatures(themeId) {
    // Удаляем все предыдущие классы эффектов
    document.body.className = document.body.className.replace(/theme-feature-\w+/g, '');
    
    // Удаляем все overlay эффекты предыдущих тем
    const overlays = ['matrixCode', 'particlesOverlay', 'sakuraOverlay', 'starsOverlay', 'fireOverlay', 'oceanOverlay', 'forestOverlay'];
    overlays.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.remove();
    });
    
    // Применяем уникальные эффекты для каждой темы
    const featureMap = {
        'matrix': () => {
            const code = document.createElement('div');
            code.id = 'matrixCode';
            code.className = 'matrix-code-overlay';
            document.body.appendChild(code);
            document.body.classList.add('theme-feature-matrix-rain');
        },
        'cyberpunk': () => {
            document.body.classList.add('theme-feature-scanlines', 'theme-feature-neon-pulse');
        },
        'tron': () => {
            document.body.classList.add('theme-feature-grid', 'theme-feature-tron-lines');
        },
        'void': () => {
            document.body.classList.add('theme-feature-fade', 'theme-feature-void-glow');
        },
        'rainbow': () => {
            document.body.classList.add('theme-feature-shift', 'theme-feature-rainbow-wave');
        },
        'neon': () => {
            document.body.classList.add('theme-feature-neon-glow', 'theme-feature-neon-pulse');
        },
        'space': () => {
            const stars = document.createElement('div');
            stars.id = 'starsOverlay';
            stars.className = 'space-stars-overlay';
            document.body.appendChild(stars);
            document.body.classList.add('theme-feature-stars-twinkle');
        },
        'pixel': () => {
            document.body.classList.add('theme-feature-pixel-dither', 'theme-feature-8bit');
        },
        'japanese': () => {
            const sakura = document.createElement('div');
            sakura.id = 'sakuraOverlay';
            sakura.className = 'sakura-overlay';
            document.body.appendChild(sakura);
            document.body.classList.add('theme-feature-sakura-fall');
        },
        'gold': () => {
            document.body.classList.add('theme-feature-gold-sparkle', 'theme-feature-luxury');
        },
        'ocean': () => {
            const ocean = document.createElement('div');
            ocean.id = 'oceanOverlay';
            ocean.className = 'ocean-waves-overlay';
            document.body.appendChild(ocean);
            document.body.classList.add('theme-feature-ocean-wave');
        },
        'forest': () => {
            const particles = document.createElement('div');
            particles.id = 'particlesOverlay';
            particles.className = 'forest-particles-overlay';
            document.body.appendChild(particles);
            document.body.classList.add('theme-feature-forest-breeze');
        },
        'fire': () => {
            const fire = document.createElement('div');
            fire.id = 'fireOverlay';
            fire.className = 'fire-overlay';
            document.body.appendChild(fire);
            document.body.classList.add('theme-feature-fire-flicker');
        },
        'ice': () => {
            document.body.classList.add('theme-feature-ice-crystals', 'theme-feature-frost');
        },
        'batman': () => {
            document.body.classList.add('theme-feature-bat-signal', 'theme-feature-gothic');
        },
        'bladerunner': () => {
            document.body.classList.add('theme-feature-neon-reflections', 'theme-feature-city-lights');
        },
        'terminator': () => {
            document.body.classList.add('theme-feature-red-scan', 'theme-feature-terminator-eye');
        },
        'starwars': () => {
            document.body.classList.add('theme-feature-starfield', 'theme-feature-force');
        },
        'harrypotter': () => {
            document.body.classList.add('theme-feature-magic-sparks', 'theme-feature-wand-glow');
        },
        'madmax': () => {
            document.body.classList.add('theme-feature-sandstorm', 'theme-feature-wasteland');
        },
        'witcher': () => {
            document.body.classList.add('theme-feature-dark-magic', 'theme-feature-sword-glow');
        },
        'lotr': () => {
            document.body.classList.add('theme-feature-elven-light', 'theme-feature-ring-power');
        },
        'alien': () => {
            document.body.classList.add('theme-feature-alien-pulse', 'theme-feature-acid-drip');
        },
        'interstellar': () => {
            document.body.classList.add('theme-feature-black-hole', 'theme-feature-wormhole');
        },
        'vampire': () => {
            document.body.classList.add('theme-feature-blood-mist', 'theme-feature-night-shadows');
        },
        'predator': () => {
            document.body.classList.add('theme-feature-thermal-vision', 'theme-feature-jungle');
        },
        'zombie': () => {
            document.body.classList.add('theme-feature-toxic-green', 'theme-feature-decay');
        },
        'ghost': () => {
            document.body.classList.add('theme-feature-ghost-mist', 'theme-feature-ethereal');
        },
        'ninja': () => {
            document.body.classList.add('theme-feature-shadow-strike', 'theme-feature-smoke');
        },
        'anime': () => {
            document.body.classList.add('theme-feature-energy-burst', 'theme-feature-anime-glow');
        },
        'gothic': () => {
            document.body.classList.add('theme-feature-purple-flame', 'theme-feature-gothic-architecture');
        },
        'noir': () => {
            document.body.classList.add('theme-feature-film-grain', 'theme-feature-vignette');
        },
        'steampunk': () => {
            document.body.classList.add('theme-feature-gears', 'theme-feature-steam');
        },
        'neon_night': () => {
            document.body.classList.add('theme-feature-neon-streaks', 'theme-feature-night-city');
        },
        'dark_purple': () => {
            document.body.classList.add('theme-feature-purple-void', 'theme-feature-dark-pulse');
        },
        'dark_blue': () => {
            document.body.classList.add('theme-feature-blue-depths', 'theme-feature-abyss');
        },
        'dark_green': () => {
            document.body.classList.add('theme-feature-green-shadow', 'theme-feature-forest-night');
        },
        'dark_red': () => {
            document.body.classList.add('theme-feature-red-darkness', 'theme-feature-blood-red');
        },
        'dark_orange': () => {
            document.body.classList.add('theme-feature-orange-ember', 'theme-feature-fire-dark');
        },
        'dark_yellow': () => {
            document.body.classList.add('theme-feature-yellow-glow', 'theme-feature-golden-dark');
        }
    };
    
    if (featureMap[themeId]) {
        featureMap[themeId]();
    }
}

// Ежедневный бонус
function claimDailyBonus() {
    const today = new Date().toDateString();
    const lastBonus = localStorage.getItem('lastDailyBonus');
    
    if (lastBonus === today) {
        showToast('🎁 Вы уже получили ежедневный бонус сегодня!', 'info', 3000);
        return;
    }
    
    localStorage.setItem('lastDailyBonus', today);
    
    const streak = parseInt(localStorage.getItem('dailyBonusStreak') || '0') + 1;
    localStorage.setItem('dailyBonusStreak', streak.toString());
    
    // Награда зависит от серии
    const baseReward = 1000;
    const streakBonus = Math.min(streak * 100, 5000);
    const reward = baseReward + streakBonus;
    
    // Добавляем валюту в обе игры поровну
    const arenaCoins = parseInt(localStorage.getItem('arenaCoins') || '1000');
    const mushroomCoins = parseInt(localStorage.getItem('mushroomCoins') || '0');
    
    const arenaReward = Math.floor(reward / 2);
    const mushroomReward = reward - arenaReward;
    
    localStorage.setItem('arenaCoins', (arenaCoins + arenaReward).toString());
    localStorage.setItem('mushroomCoins', (mushroomCoins + mushroomReward).toString());
    
    showToast(`🎁 Ежедневный бонус получен! +${reward.toLocaleString()}💰 (Серия: ${streak} дней)`, 'success', 5000);
    
    updateStats();
    
    // Обновляем карточку бонуса
    const bonusCard = document.getElementById('bonusCard');
    if (bonusCard) {
        bonusCard.querySelector('.event-btn').textContent = 'ПОЛУЧЕНО';
        bonusCard.querySelector('.event-btn').disabled = true;
        bonusCard.querySelector('.event-desc').textContent = `Серия: ${streak} дней`;
    }
}

// Обновление серии входов
function updateLoginStreak() {
    const today = new Date().toDateString();
    const lastLogin = localStorage.getItem('lastLogin');
    const loginStreak = parseInt(localStorage.getItem('loginStreak') || '0');
    
    if (lastLogin !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastLogin === yesterday.toDateString()) {
            // Продолжаем серию
            localStorage.setItem('loginStreak', (loginStreak + 1).toString());
            localStorage.setItem('lastLogin', today);
        } else {
            // Сбрасываем серию
            localStorage.setItem('loginStreak', '1');
            localStorage.setItem('lastLogin', today);
        }
    }
    
    const currentStreak = parseInt(localStorage.getItem('loginStreak') || '1');
    const streakEl = document.getElementById('loginStreak');
    if (streakEl) streakEl.textContent = `Дней подряд: ${currentStreak}`;
    
    // Бонус к валюте
    const bonus = 1 + (currentStreak * 0.1); // +10% за каждый день серии, максимум +100%
    return Math.min(bonus, 2.0); // Максимум x2
}

// ========== СИСТЕМА ДОСТИЖЕНИЙ ==========
const achievements = [
    {id: 'day1', icon: '🌅', title: 'Первый день', desc: 'Прошёл первый день! Теперь только 364 дня до возвращения!', days: 1},
    {id: 'week1', icon: '📅', title: 'Неделя работяги', desc: 'Вы завершили одну рабочую неделю простого работяги!', days: 7},
    {id: 'week2', icon: '💪', title: 'Две недели стойкости', desc: 'Две недели позади! Егор становится сильнее!', days: 14},
    {id: 'month1', icon: '📆', title: 'Месяц в строю', desc: 'Целый месяц! Егор уже опытный солдат!', days: 30},
    {id: 'month2', icon: '🎯', title: 'Два месяца дисциплины', desc: '60 дней службы! Дисциплина на высоте!', days: 60},
    {id: 'quarter1', icon: '🏆', title: 'Квартал чемпиона', desc: 'Первые 90 дней! Четверть пути пройдена!', days: 90},
    {id: 'day100', icon: '💯', title: 'Сотня дней', desc: '100 дней службы! Сотка - это круто!', days: 100},
    {id: 'halfway', icon: '🎪', title: 'Полпути пройдено', desc: '182 дня! Ровно половина пути до возвращения!', days: 182},
    {id: 'month6', icon: '🌟', title: 'Полгода героя', desc: '6 месяцев службы! Егор настоящий герой!', days: 183},
    {id: 'day200', icon: '🔥', title: 'Двухсотка', desc: '200 дней! Всё ближе к дому!', days: 200},
    {id: 'month7', icon: '⚔️', title: '7 месяцев воина', desc: '7 месяцев! Воинский дух крепнет!', days: 210},
    {id: 'day250', icon: '🎊', title: 'Четверть тысячелетия', desc: '250 дней! Осталось меньше четверти!', days: 250},
    {id: 'month9', icon: '🗾', title: '9 месяцев самурая', desc: '9 месяцев! Японский дух самурая просыпается!', days: 270},
    {id: 'day300', icon: '🏅', title: 'Трёхсотка', desc: '300 дней! Три сотни позади, осталось совсем немного!', days: 300},
    {id: 'month10', icon: '🎌', title: '10 месяцев мудрости', desc: '10 месяцев! Мудрость накапливается!', days: 304},
    {id: 'day330', icon: '🚀', title: 'Финальная прямая', desc: '330 дней! Финальная прямая началась!', days: 330},
    {id: 'month11', icon: '⚡', title: '11 месяцев силы', desc: '11 месяцев! Почти финиш!', days: 334},
    {id: 'day350', icon: '🎯', title: '350 дней пройдено', desc: '350 дней! Осталось всего 15 дней!', days: 350},
    {id: 'day360', icon: '🏁', title: 'Финальный рывок', desc: '360 дней! Последние 5 дней до возвращения!', days: 360},
    {id: 'day364', icon: '🎉', title: 'Последний день', desc: '364 дня! Завтра Егор вернётся домой!', days: 364},
    {id: 'day365', icon: '🎊', title: 'ДЕНЬ ВОЗВРАЩЕНИЯ', desc: '365 дней! ЕГОР ВЕРНУЛСЯ ДОМОЙ!!!', days: 365},
    {id: 'click100', icon: '🖱️', title: 'Кликер-энтузиаст', desc: 'Сделано 100 кликов по Егору!', type: 'clicks', value: 100},
    {id: 'click500', icon: '👆', title: 'Кликер-мастер', desc: '500 кликов! Рука устала, но не сдаёмся!', type: 'clicks', value: 500},
    {id: 'click1000', icon: '🔥', title: 'Кликер-легенда', desc: '1000 кликов! Это уже зависимость!', type: 'clicks', value: 1000},
    {id: 'snake10', icon: '🐍', title: 'Змейка-новичок', desc: 'Счёт 10 в змейке! Начало пути!', type: 'snake', value: 10},
    {id: 'snake50', icon: '🐉', title: 'Змейка-профи', desc: 'Счёт 50! Змейка стала длинной!', type: 'snake', value: 50},
    {id: 'visit1', icon: '👁️', title: 'Первый визит', desc: 'Первый раз на сайте! Добро пожаловать!', type: 'visits', value: 1},
    {id: 'visit10', icon: '🔄', title: 'Постоянный гость', desc: '10 визитов на сайт! Ты верный друг!', type: 'visits', value: 10},
    {id: 'visit100', icon: '👑', title: 'Фанат Егора', desc: '100 визитов! Ты настоящий фанат!', type: 'visits', value: 100},
    {id: 'arena_hero1', icon: '⚔️', title: 'Первый герой', desc: 'Призвали первого героя в AFK Arena!', type: 'arena_heroes', value: 1},
    {id: 'arena_hero10', icon: '👥', title: 'Команда героев', desc: '10 героев в коллекции!', type: 'arena_heroes', value: 10},
    {id: 'arena_hero50', icon: '🏰', title: 'Армия героев', desc: '50 героев! Настоящая армия!', type: 'arena_heroes', value: 50},
    {id: 'arena_stage10', icon: '📖', title: '10 стадий пройдено', desc: 'Победили на 10 стадиях!', type: 'arena_stage', value: 10},
    {id: 'arena_stage50', icon: '🎯', title: '50 стадий пройдено', desc: '50 стадий позади!', type: 'arena_stage', value: 50},
    {id: 'arena_legendary', icon: '🌟', title: 'Легендарный герой', desc: 'Получили легендарного героя!', type: 'arena_legendary', value: 1},
    {id: 'arena_tournament10', icon: '🏆', title: 'Мастер турниров', desc: '10 побед в турнирах!', type: 'arena_tournament', value: 10},
    {id: 'arena_raid1', icon: '🐉', title: 'Победитель драконов', desc: 'Победили первого рейд-босса!', type: 'arena_raid', value: 1},
    {id: 'mushroom_1000', icon: '🍄', title: 'Грибная коллекция', desc: 'Собрали 1000 монет в грибах!', type: 'mushroom_coins', value: 1000},
    {id: 'mushroom_10000', icon: '💰', title: 'Грибной миллионер', desc: '10000 монет грибов!', type: 'mushroom_coins', value: 10000},
    {id: 'mushroom_summon1', icon: '🎴', title: 'Первый гриб', desc: 'Призвали первого гриба!', type: 'mushroom_summon', value: 1},
    {id: 'mushroom_summon10', icon: '🍄', title: 'Коллекция грибов', desc: '10 грибов в коллекции!', type: 'mushroom_summon', value: 10},
    {id: 'mushroom_evolve', icon: '✨', title: 'Эволюция грибов', desc: 'Провели первую эволюцию!', type: 'mushroom_evolve', value: 1},
    {id: 'mushroom_skill1', icon: '⚡', title: 'Первый навык', desc: 'Изучили первый навык!', type: 'mushroom_skills', value: 1},
    {id: 'arena_prestige', icon: '👑', title: 'Престиж AFK', desc: 'Первый престиж в AFK Arena!', type: 'arena_prestige', value: 1},
    {id: 'mushroom_prestige', icon: '👑', title: 'Престиж грибов', desc: 'Первый престиж в грибах!', type: 'mushroom_prestige', value: 1},
];

let unlockedAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');

function checkAchievements() {
    const now = new Date();
    const elapsed = Math.floor((now - departureDate) / (1000 * 60 * 60 * 24));
    
    achievements.forEach(achievement => {
        if (unlockedAchievements.includes(achievement.id)) return;
        
        let unlocked = false;
        if (achievement.days !== undefined) {
            unlocked = elapsed >= achievement.days;
        } else if (achievement.type === 'clicks') {
            unlocked = stats.clicks >= achievement.value;
        } else if (achievement.type === 'snake') {
            unlocked = stats.snakeHigh >= achievement.value;
        } else if (achievement.type === 'visits') {
            unlocked = stats.visits >= achievement.value;
        } else if (achievement.type === 'arena_heroes') {
            unlocked = arenaHeroes.length >= achievement.value;
        } else if (achievement.type === 'arena_stage') {
            unlocked = arenaStage >= achievement.value;
        } else if (achievement.type === 'arena_legendary') {
            unlocked = arenaHeroes.some(h => h.rarity === 'legendary');
        } else if (achievement.type === 'arena_tournament') {
            unlocked = arenaTournamentWins >= achievement.value;
        } else if (achievement.type === 'arena_raid') {
            unlocked = arenaRaidBosses.filter(b => b.defeated).length >= achievement.value;
        } else if (achievement.type === 'mushroom_coins') {
            unlocked = mushroomCoins >= achievement.value;
        } else if (achievement.type === 'mushroom_summon') {
            unlocked = mushroomCollection.length >= achievement.value;
        } else if (achievement.type === 'mushroom_evolve') {
            unlocked = (stats.mushroomEvolves || 0) >= achievement.value;
        } else if (achievement.type === 'mushroom_skills') {
            unlocked = mushroomSkillPoints >= achievement.value;
        } else if (achievement.type === 'arena_prestige') {
            unlocked = arenaPrestige >= achievement.value;
        } else if (achievement.type === 'mushroom_prestige') {
            unlocked = mushroomPrestige >= achievement.value;
        }
        
        if (unlocked) {
            unlockAchievement(achievement);
        }
    });
}

function unlockAchievement(achievement) {
    if (unlockedAchievements.includes(achievement.id)) return;
    
    unlockedAchievements.push(achievement.id);
    localStorage.setItem('achievements', JSON.stringify(unlockedAchievements));
    
    // Анимация разблокировки
    showAchievementNotification(achievement);
    renderAchievements();
}

function showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #ffff00, #ff00ff);
        border: 5px solid #000;
        padding: 30px;
        z-index: 10001;
        text-align: center;
        box-shadow: 20px 20px 0 #000;
        animation: modalPop 0.5s ease-out;
    `;
    notification.innerHTML = `
        <pre style="font-family: 'Courier New', monospace; font-size: 0.4em; color: #000; text-align: center; margin-bottom: 10px; line-height: 1.2;">
╔═══════════════════════════════════╗
║                                   ║
║    🏆 ДОСТИЖЕНИЕ РАЗБЛОКИРОВАНО! 🏆 ║
║                                   ║
╚═══════════════════════════════════╝
        </pre>
        <div style="font-size: 4em; margin-bottom: 20px;">${achievement.icon}</div>
        <div style="font-size: 1.5em; font-weight: bold; margin-bottom: 10px;">🏆 ДОСТИЖЕНИЕ РАЗБЛОКИРОВАНО!</div>
        <div style="font-size: 1.2em; margin-bottom: 10px;">${achievement.title}</div>
        <div style="font-size: 1em;">${achievement.desc}</div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'modalPop 0.5s ease-out reverse';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

function renderAchievements() {
    const container = document.getElementById('achievementsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    const unlocked = unlockedAchievements.length;
    const total = achievements.length;
    
    document.getElementById('achievementsCount').textContent = unlocked;
    document.getElementById('achievementsTotal').textContent = total;
    document.getElementById('achievementsProgress').style.width = (unlocked / total * 100) + '%';
    
    achievements.forEach(achievement => {
        const card = document.createElement('div');
        card.className = `achievement-card ${unlockedAchievements.includes(achievement.id) ? 'unlocked' : 'locked'}`;
        card.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-title">${achievement.title}</div>
            <div class="achievement-desc">${achievement.desc}</div>
        `;
        container.appendChild(card);
    });
}

// ========== ГАЧИ-ИГРЫ ==========

// AFK Arena - Расширенная версия для долгой игры
let arenaHeroes = JSON.parse(localStorage.getItem('arenaHeroes') || '[]');
let arenaCoins = parseInt(localStorage.getItem('arenaCoins') || '1000');
let arenaStage = parseInt(localStorage.getItem('arenaStage') || '1');
let arenaXP = parseInt(localStorage.getItem('arenaXP') || '0');
let arenaXPToNext = parseInt(localStorage.getItem('arenaXPToNext') || '100');
let arenaCrystals = parseInt(localStorage.getItem('arenaCrystals') || '0');
let arenaTeam = JSON.parse(localStorage.getItem('arenaTeam') || '[]');
let arenaArtefacts = JSON.parse(localStorage.getItem('arenaArtefacts') || '[]');
let arenaTournamentWins = parseInt(localStorage.getItem('arenaTournamentWins') || '0');
let arenaPrestige = parseInt(localStorage.getItem('arenaPrestige') || '0');
let arenaAutoBattleEnabled = localStorage.getItem('arenaAutoBattleEnabled') === 'true';
let arenaEquipment = JSON.parse(localStorage.getItem('arenaEquipment') || '[]');
let arenaMissions = JSON.parse(localStorage.getItem('arenaMissions') || '[]');
let arenaRaidBosses = JSON.parse(localStorage.getItem('arenaRaidBosses') || '[]');
let arenaGuildPoints = parseInt(localStorage.getItem('arenaGuildPoints') || '0');
let arenaEventActive = localStorage.getItem('arenaEventActive') === 'true';
let arenaHeroStarLevel = JSON.parse(localStorage.getItem('arenaHeroStarLevel') || '{}');
let arenaFusionPoints = parseInt(localStorage.getItem('arenaFusionPoints') || '0');
let arenaDailyReward = JSON.parse(localStorage.getItem('arenaDailyReward') || '{"lastDate": "", "streak": 0}');
let arenaQuests = JSON.parse(localStorage.getItem('arenaQuests') || '[]');
let mushroomDailyReward = JSON.parse(localStorage.getItem('mushroomDailyReward') || '{"lastDate": "", "streak": 0}');
let mushroomQuests = JSON.parse(localStorage.getItem('mushroomQuests') || '[]');

function startArena() {
    const gameArea = document.getElementById('gameArea');
    gameArea.classList.remove('hidden');
    gameArea.className = 'game-area arena-game';
    
    if (arenaHeroes.length === 0) {
        arenaHeroes = [
            {id: 1, name: 'Самурай', level: 1, power: 100, hp: 500, maxHp: 500, avatar: '⚔️', rarity: 'common', type: 'tank', xp: 0},
            {id: 2, name: 'Ниндзя', level: 1, power: 150, hp: 300, maxHp: 300, avatar: '🗡️', rarity: 'rare', type: 'dps', xp: 0},
        ];
    }
    
    const playerLevel = Math.floor(arenaXP / arenaXPToNext) + 1;
    const currentXP = arenaXP % arenaXPToNext;
    
    const isMobile = window.innerWidth <= 480;
    const gridCols = isMobile ? '1fr' : '1fr 1fr 1fr';
    gameArea.innerHTML = `
        <div style="display: grid; grid-template-columns: ${gridCols}; gap: 15px; margin-bottom: 20px;">
            <div class="hero-card">
                <h3>💰 РЕСУРСЫ</h3>
                <div>💰 Монеты: <span id="arenaCoins">${arenaCoins.toLocaleString()}</span></div>
                <div>💎 Кристаллы: <span id="arenaCrystals">${arenaCrystals}</span></div>
                <div>⭐ Уровень: <span id="playerLevel">${playerLevel}</span></div>
                <div>📊 Опыт: <span id="playerXP">${currentXP}</span> / ${arenaXPToNext}</div>
                <div style="background: #000; height: 10px; border: 2px solid #00ff00; margin-top: 5px;">
                    <div style="background: #00ff00; height: 100%; width: ${(currentXP / arenaXPToNext * 100)}%;"></div>
                </div>
                ${arenaPrestige > 0 ? `<div style="color: #ffd700; margin-top: 10px;">👑 Престиж: ${arenaPrestige}</div>` : ''}
            </div>
            <div class="hero-card">
                <h3>🎮 ДЕЙСТВИЯ</h3>
                <button class="music-btn" onclick="arenaSummon()" style="width: 100%; margin-bottom: 5px; font-size: 0.9em;">🎴 ПРИЗВАТЬ (100💰)</button>
                <button class="music-btn" onclick="arenaSummonX10()" style="width: 100%; margin-bottom: 5px; font-size: 0.9em;">🎴 x10 (900💰)</button>
                <button class="music-btn" onclick="arenaSummonX100()" style="width: 100%; margin-bottom: 5px; font-size: 0.9em;">🎴 x100 (9000💰)</button>
                <button class="music-btn" onclick="arenaSummonPremium()" style="width: 100%; margin-bottom: 5px; font-size: 0.9em;">💎 ПРЕМИУМ (10💎)</button>
                <button class="music-btn" onclick="arenaSummonPremiumX10()" style="width: 100%; margin-bottom: 5px; font-size: 0.9em;">💎 x10 (90💎)</button>
                <button class="music-btn" onclick="arenaSummonPremiumX100()" style="width: 100%; margin-bottom: 5px; font-size: 0.9em;">💎 x100 (900💎)</button>
                <button class="music-btn" onclick="startArenaBattle()" style="width: 100%; margin-bottom: 5px; font-size: 0.9em;">⚔️ БИТВА</button>
                <button class="music-btn" onclick="showArenaTeam()" style="width: 100%; margin-bottom: 5px; font-size: 0.9em;">👥 КОМАНДА</button>
                <button class="music-btn" onclick="showArenaTournament()" style="width: 100%; margin-bottom: 5px; font-size: 0.9em;">🏆 ТУРНИР</button>
                <button class="music-btn" onclick="showArenaMissions()" style="width: 100%; margin-bottom: 5px; font-size: 0.9em;">📋 МИССИИ</button>
                <button class="music-btn" onclick="showArenaRaid()" style="width: 100%; margin-bottom: 5px; font-size: 0.9em;">🐉 РЕЙД БОССЫ</button>
                <button class="music-btn" onclick="showArenaEquipment()" style="width: 100%; margin-bottom: 5px; font-size: 0.9em;">⚔️ ЭКИПИРОВКА</button>
                <button class="music-btn" onclick="showArenaFusion()" style="width: 100%; margin-bottom: 5px; font-size: 0.9em;">✨ СЛИЯНИЕ</button>
                <button class="music-btn" onclick="showArenaDailyReward()" style="width: 100%; margin-bottom: 5px; font-size: 0.9em; background: #ffd700; color: #000;">🎁 ЕЖЕДНЕВНАЯ НАГРАДА</button>
                <button class="music-btn" onclick="showArenaQuests()" style="width: 100%; font-size: 0.9em;">📜 КВЕСТЫ</button>
            </div>
            <div class="hero-card">
                <h3>⚡ ДОПОЛНИТЕЛЬНО</h3>
                <div>👥 Героев: ${arenaHeroes.length}</div>
                <div>🏆 Турниров: ${arenaTournamentWins}</div>
                <div>🐉 Боссов: ${arenaRaidBosses.filter(b => b.defeated).length}</div>
                <div>📖 Стадия: ${arenaStage}</div>
                <div>⚔️ Очки слияния: ${arenaFusionPoints}</div>
                ${arenaEventActive ? `<div style="color: #ffd700;">🎉 СОБЫТИЕ АКТИВНО!</div>` : ''}
                ${playerLevel >= 50 ? `<button class="music-btn" onclick="arenaPrestigeReset()" style="width: 100%; margin-top: 10px; background: #ffd700; color: #000;">👑 ПРЕСТИЖ (x${arenaPrestige + 1})</button>` : ''}
                <button class="music-btn" onclick="sellDuplicateHeroes()" style="width: 100%; margin-top: 5px; font-size: 0.9em;">💸 Продать дубликаты</button>
                <button class="music-btn" onclick="startArenaEvent()" style="width: 100%; margin-top: 5px; font-size: 0.9em; background: ${arenaEventActive ? '#00ff00' : '#ff00ff'};">
                    ${arenaEventActive ? '🎉 СОБЫТИЕ' : '🎪 ЗАПУСТИТЬ СОБЫТИЕ'}
                </button>
            </div>
        </div>
        <div style="margin-bottom: 20px;">
            <h3>📖 СТАДИЯ ${arenaStage}</h3>
            <button class="music-btn" onclick="showArenaStages()">📜 ВЫБРАТЬ СТАДИЮ</button>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px;" id="heroesList"></div>
        <div style="margin-top: 20px;">
            <h3>⚔️ Авто-битва</h3>
            <div id="battleLog" style="background: #000; padding: 15px; max-height: 200px; overflow-y: auto; font-size: 0.9em;"></div>
        </div>
        <button class="fun-btn" onclick="document.getElementById('gameArea').classList.add('hidden')">ЗАКРЫТЬ</button>
    `;
    
    renderArenaHeroes();
    startAutoBattle();
    updateArenaUI();
    generateArenaMissions();
    saveArenaData();
}

function renderArenaHeroes() {
    const container = document.getElementById('heroesList');
    if (!container) return;
    
    container.innerHTML = '';
    arenaHeroes.forEach(hero => {
        const isInTeam = arenaTeam.includes(hero.id);
        const stars = hero.stars || 1;
        const card = document.createElement('div');
        card.className = 'hero-card';
        const typeName = hero.type === 'tank' ? '🛡️ Танк' : hero.type === 'dps' ? '⚔️ ДПС' : hero.type === 'support' ? '💚 Поддержка' : '❓';
        const asciiHero = getHeroAscii(hero.type, hero.rarity);
        card.innerHTML = `
            <pre style="font-family: 'Courier New', monospace; font-size: 0.5em; color: #00ff00; text-align: center; margin: 5px 0; line-height: 1.1; background: #000; padding: 5px; border: 1px solid #00ff00;">${asciiHero}</pre>
            <div class="hero-avatar">${hero.avatar}</div>
            <div style="font-weight: bold; margin-bottom: 5px;">${hero.name}</div>
            <div>⭐ Звёзд: ${'⭐'.repeat(stars)}</div>
            <div>Уровень: ${hero.level}</div>
            <div>⚔️ Атака: ${hero.power.toLocaleString()}</div>
            <div>❤️ Здоровье: ${(hero.maxHp || hero.power * 3).toLocaleString()}</div>
            <div style="margin: 5px 0;">${typeName}</div>
            <div style="color: ${hero.rarity === 'legendary' ? '#ffd700' : hero.rarity === 'epic' ? '#ff00ff' : hero.rarity === 'rare' ? '#00ffff' : '#00ff00'}; font-size: 0.9em;">
                ${hero.rarity === 'legendary' ? '🌟 Легендарный' : hero.rarity === 'epic' ? '💜 Эпический' : hero.rarity === 'rare' ? '💎 Редкий' : '⚪ Обычный'}
            </div>
            ${hero.equipment && hero.equipment.length > 0 ? `<div style="font-size: 0.8em; color: #aaa;">⚔️ Экипировка: ${hero.equipment.length}/3</div>` : ''}
            <div style="background: #000; height: 8px; border: 1px solid #00ff00; margin: 5px 0;">
                <div style="background: #00ff00; height: 100%; width: ${Math.min(100, ((hero.xp || 0) / (hero.level * 50)) * 100)}%;"></div>
            </div>
            <button class="music-btn" onclick="upgradeHero(${hero.id})" style="width: 100%; margin-top: 5px; font-size: 0.75em; padding: 5px;">
                ⬆ Улучшить (${(hero.level * 50).toLocaleString()}💰)
            </button>
            ${stars < 5 ? `<button class="music-btn" onclick="upgradeHeroStar(${hero.id})" style="width: 100%; margin-top: 5px; font-size: 0.75em; padding: 5px; background: #ffd700; color: #000;">
                ⭐ Звезда (${stars * 200}💎)
            </button>` : ''}
            ${!isInTeam && arenaTeam.length < 5 ? `<button class="music-btn" onclick="addToTeam(${hero.id})" style="width: 100%; margin-top: 5px; font-size: 0.75em; padding: 5px; background: #ff00ff;">+ В КОМАНДУ</button>` : ''}
            ${isInTeam ? `<div style="color: #00ff00; margin-top: 5px;">✓ В КОМАНДЕ</div>` : ''}
        `;
        container.appendChild(card);
    });
    
    updateArenaUI();
}

function getHeroAscii(type, rarity) {
    const tankArt = {
        common: [
            '   ╔═══╗',
            '   ║🛡️ ║',
            '  ╔╬═══╬╗',
            ' ╔╝│ │ │╚╗',
            '╔╝ │ │ │ ╚╗',
            '║  │ │ │  ║',
            '║  │ │ │  ║',
            '║  ║ ║ ║  ║',
            '╚══╝ ╝ ╝══╝'
        ],
        rare: [
            '   ╔═══╗',
            '  ║🛡️🛡️║',
            ' ╔╬═══╬╗',
            '╔╝││ ││╚╗',
            '║ ││ ││ ║',
            '║ ││ ││ ║',
            '║ ║║ ║║ ║',
            '╚═╝╚═╝╚═╝'
        ],
        epic: [
            '  ╔═════╗',
            ' ║🛡️🛡️🛡️║',
            '╔╬═════╬╗',
            '║││ │ ││║',
            '║││ │ ││║',
            '║││ │ ││║',
            '║║║ ║ ║║║',
            '╚╝╚═╝═╝╚╝'
        ],
        legendary: [
            '  ╔══════╗',
            ' ║🛡️🛡️🛡️🛡️║',
            '╔╬══════╬╗',
            '║│││ │ │││║',
            '║│││ │ │││║',
            '║│││ │ │││║',
            '║║║║ ║ ║║║║',
            '╚╝╝╚══╝╚╝╚╝'
        ]
    };
    
    const dpsArt = {
        common: [
            '   ╔═══╗',
            '   ║⚔️ ║',
            '  ╔╬═══╬╗',
            ' ╔╝│ │ │╚╗',
            '╔╝ │ │ │ ╚╗',
            '║  │ │ │  ║',
            '║  │ │ │  ║',
            '║  ║ ║ ║  ║',
            '╚══╝ ╝ ╝══╝'
        ],
        rare: [
            '   ╔═══╗',
            '  ║⚔️⚔️║',
            ' ╔╬═══╬╗',
            '╔╝││ ││╚╗',
            '║ ││ ││ ║',
            '║ ││ ││ ║',
            '║ ║║ ║║ ║',
            '╚═╝╚═╝╚═╝'
        ],
        epic: [
            '  ╔═════╗',
            ' ║⚔️⚔️⚔️║',
            '╔╬═════╬╗',
            '║││ │ ││║',
            '║││ │ ││║',
            '║││ │ ││║',
            '║║║ ║ ║║║',
            '╚╝╚═╝═╝╚╝'
        ],
        legendary: [
            '  ╔══════╗',
            ' ║⚔️⚔️⚔️⚔️║',
            '╔╬══════╬╗',
            '║│││ │ │││║',
            '║│││ │ │││║',
            '║│││ │ │││║',
            '║║║║ ║ ║║║║',
            '╚╝╝╚══╝╚╝╚╝'
        ]
    };
    
    const supportArt = {
        common: [
            '   ╔═══╗',
            '   ║✨ ║',
            '  ╔╬═══╬╗',
            ' ╔╝│ │ │╚╗',
            '╔╝ │ │ │ ╚╗',
            '║  │ │ │  ║',
            '║  │ │ │  ║',
            '║  ║ ║ ║  ║',
            '╚══╝ ╝ ╝══╝'
        ],
        rare: [
            '   ╔═══╗',
            '  ║✨✨║',
            ' ╔╬═══╬╗',
            '╔╝││ ││╚╗',
            '║ ││ ││ ║',
            '║ ││ ││ ║',
            '║ ║║ ║║ ║',
            '╚═╝╚═╝╚═╝'
        ],
        epic: [
            '  ╔═════╗',
            ' ║✨✨✨║',
            '╔╬═════╬╗',
            '║││ │ ││║',
            '║││ │ ││║',
            '║││ │ ││║',
            '║║║ ║ ║║║',
            '╚╝╚═╝═╝╚╝'
        ],
        legendary: [
            '  ╔══════╗',
            ' ║✨✨✨✨║',
            '╔╬══════╬╗',
            '║│││ │ │││║',
            '║│││ │ │││║',
            '║│││ │ │││║',
            '║║║║ ║ ║║║║',
            '╚╝╝╚══╝╚╝╚╝'
        ]
    };
    
    const arts = type === 'tank' ? tankArt : type === 'dps' ? dpsArt : supportArt;
    return arts[rarity] ? arts[rarity].join('\n') : arts.common.join('\n');
}

function getMushroomAscii(rarity) {
    const commonArt = [
        '  ╱   ╲',
        ' ╱ 🍄 ╲',
        '╱ ╱ ╲ ╲',
        '│╱   ╲│',
        '││    ││',
        '││    ││',
        '││    ││',
        '││    ││'
    ];
    
    const rareArt = [
        '  ╱╲  ╱╲',
        ' ╱🔴🍄╲',
        '╱╱ ╲ ╲╲',
        '│╱╲ ╱╲│',
        '││    ││',
        '││    ││',
        '││    ││',
        '││    ││'
    ];
    
    const epicArt = [
        '  ╱╲★╱╲',
        ' ╱🟣🍄╲',
        '╱╱ ╲ ╲╲',
        '│╱╲ ╱╲│',
        '││ ★ ││',
        '││    ││',
        '││    ││',
        '││    ││'
    ];
    
    const legendaryArt = [
        ' ╱╲★★╱╲',
        '╱🌟🍄🌟╲',
        '╱╱ ╲ ╲╲',
        '│╱╲★╱╲│',
        '││★★││',
        '││    ││',
        '││    ││',
        '││    ││'
    ];
    
    if (rarity === 'legendary') return legendaryArt.join('\n');
    if (rarity === 'epic') return epicArt.join('\n');
    if (rarity === 'rare') return rareArt.join('\n');
    return commonArt.join('\n');
}

function getBossAscii(bossId) {
    const bossArts = {
        1: [
            '    ╔═══╗',
            '   ║🐉 ║',
            '  ╔╬═══╬╗',
            ' ╔╝│🔥││╚╗',
            '╔╝ ││ ││ ╚╗',
            '║  ││ ││  ║',
            '║  ║║ ║║  ║',
            '╚══╝╚═╝╚══╝'
        ],
        2: [
            '   ╔════╗',
            '  ║🛡️🛡️║',
            ' ╔╬════╬╗',
            '╔╝│💎💎│╚╗',
            '║ ││  ││ ║',
            '║ ║║  ║║ ║',
            '║ ║║  ║║ ║',
            '╚═╝╚══╝╚═╝'
        ],
        3: [
            '   ╔═══╗',
            '  ║👹 ║',
            ' ╔╬═══╬╗',
            '╔╝│⚡⚡│╚╗',
            '║ ││💀││ ║',
            '║ ║║💀║║ ║',
            '║ ║║  ║║ ║',
            '╚═╝╚══╝╚═╝'
        ],
        4: [
            '  ╔═════╗',
            ' ║👑👑👑║',
            '╔╬═════╬╗',
            '║│⚡⚡⚡│║',
            '║││👁️👁️││║',
            '║║║    ║║║',
            '║║║    ║║║',
            '╚╝╚════╝╚╝'
        ]
    };
    return bossArts[bossId] ? bossArts[bossId].join('\n') : bossArts[1].join('\n');
}

function getEquipmentAscii(itemType) {
    const equipArts = {
        '⚔️': [
            '    ╔═╗',
            '    ║ ║',
            '    ║ ║',
            '   ╔╝ ╚╗',
            '  ╔╝   ╚╗',
            ' ╔╝     ╚╗',
            '╔╝       ╚╗',
            '╚═════════╝'
        ],
        '🛡️': [
            '  ╔═════╗',
            ' ╔╝  │  ╚╗',
            '╔╝   │   ╚╗',
            '║    │    ║',
            '║    │    ║',
            '╚╗   │   ╔╝',
            ' ╚╗  │  ╔╝',
            '  ╚═════╝'
        ],
        '👑': [
            '   ╔═══╗',
            '  ╔╝ ⭐ ╚╗',
            ' ╔╝ ╔═══╗ ╚╗',
            '╔╝  ║ 👑 ║  ╚╗',
            '║   ╚═══╝   ║',
            '║            ║',
            '╚════════════╝'
        ],
        '💍': [
            '   ╔═══╗',
            '  ╔╝   ╚╗',
            ' ╔╝  ╔═╗ ╚╗',
            '╔╝   ║💎║  ╚╗',
            '║    ╚═╝   ║',
            '╚══════════╝'
        ],
        '🧙': [
            '    ╔═╗',
            '   ╔╝⭐╚╗',
            '  ╔╝ ═══ ╚╗',
            ' ╔╝  ╔═╗  ╚╗',
            '╔╝   ║🧙║   ╚╗',
            '║    ╚═╝    ║',
            '╚═══════════╝'
        ],
        '🏹': [
            '     ╔═╗',
            '    ╔╝ ╚╗',
            '   ╔╝   ╚╗',
            '  ╔╝─────╚╗',
            ' ╔╝       ╚╗',
            '╔╝         ╚╗',
            '╚═══════════╝'
        ]
    };
    return equipArts[itemType] ? equipArts[itemType].join('\n') : equipArts['⚔️'].join('\n');
}

function getEnemyAscii(stage, isBoss) {
    if (isBoss) {
        return [
            '  ╔═══════╗',
            ' ╔╝ ╔═══╗ ╚╗',
            '╔╝  ║👑║  ╚╗',
            '║   ║💀║   ║',
            '║   ╚═══╝   ║',
            '║            ║',
            '╚════════════╝'
        ].join('\n');
    }
    return [
        '   ╔═══╗',
        '  ╔╝ ║ ╚╗',
        ' ╔╝  ║  ╚╗',
        '╔╝   ║   ╚╗',
        '║    ║    ║',
        '╚════╚════╝'
    ].join('\n');
}

function updateArenaUI() {
    const coinsEl = document.getElementById('arenaCoins');
    const crystalsEl = document.getElementById('arenaCrystals');
    const levelEl = document.getElementById('playerLevel');
    const xpEl = document.getElementById('playerXP');
    
    if (coinsEl) coinsEl.textContent = arenaCoins;
    if (crystalsEl) crystalsEl.textContent = arenaCrystals;
    if (levelEl) {
        const playerLevel = Math.floor(arenaXP / arenaXPToNext) + 1;
        levelEl.textContent = playerLevel;
    }
    if (xpEl) {
        const currentXP = arenaXP % arenaXPToNext;
        xpEl.textContent = currentXP;
    }
}

function arenaSummon() {
    if (arenaCoins < 100) {
        alert('Недостаточно монет!');
        return;
    }
    
    arenaCoins -= 100;
    summonHero(false);
    
    // Обновление миссий и квестов
    arenaMissions.forEach(m => {
        if (m.type === 'summon' && !m.completed) {
            m.current++;
        }
    });
    arenaQuests.forEach(q => {
        if (q.type === 'summon' && !q.completed) {
            q.current = (q.current || 0) + 1;
        }
    });
    checkAchievements();
    saveArenaData();
}

function arenaSummonPremium() {
    if (arenaCrystals < 10) {
        alert('Недостаточно кристаллов!');
        return;
    }
    
    arenaCrystals -= 10;
    summonHero(true);
    checkAchievements();
}

function arenaSummonX10() {
    const cost = 900; // Скидка за массовую покупку
    if (arenaCoins < cost) {
        alert(`Недостаточно монет! Нужно ${cost}💰`);
        return;
    }
    
    arenaCoins -= cost;
    for (let i = 0; i < 10; i++) {
        summonHero(false);
    }
    
    // Обновление миссий и квестов
    arenaMissions.forEach(m => {
        if (m.type === 'summon' && !m.completed) {
            m.current += 10;
        }
    });
    arenaQuests.forEach(q => {
        if (q.type === 'summon' && !q.completed) {
            q.current = (q.current || 0) + 10;
        }
    });
    checkAchievements();
    saveArenaData();
    updateArenaUI();
    renderArenaHeroes();
    alert('🎴 Призвано 10 героев!');
}

function arenaSummonX100() {
    const cost = 9000; // Скидка за массовую покупку
    if (arenaCoins < cost) {
        alert(`Недостаточно монет! Нужно ${cost}💰`);
        return;
    }
    
    arenaCoins -= cost;
    for (let i = 0; i < 100; i++) {
        summonHero(false);
    }
    
    // Обновление миссий и квестов
    arenaMissions.forEach(m => {
        if (m.type === 'summon' && !m.completed) {
            m.current += 100;
        }
    });
    arenaQuests.forEach(q => {
        if (q.type === 'summon' && !q.completed) {
            q.current = (q.current || 0) + 100;
        }
    });
    checkAchievements();
    saveArenaData();
    updateArenaUI();
    renderArenaHeroes();
    alert('🎴 Призвано 100 героев!');
}

function arenaSummonPremiumX10() {
    const cost = 90; // Скидка за массовую покупку
    if (arenaCrystals < cost) {
        alert(`Недостаточно кристаллов! Нужно ${cost}💎`);
        return;
    }
    
    arenaCrystals -= cost;
    for (let i = 0; i < 10; i++) {
        summonHero(true);
    }
    checkAchievements();
    updateArenaUI();
    renderArenaHeroes();
    alert('💎 Призвано 10 премиум героев!');
}

function arenaSummonPremiumX100() {
    const cost = 900; // Скидка за массовую покупку
    if (arenaCrystals < cost) {
        alert(`Недостаточно кристаллов! Нужно ${cost}💎`);
        return;
    }
    
    arenaCrystals -= cost;
    for (let i = 0; i < 100; i++) {
        summonHero(true);
    }
    checkAchievements();
    updateArenaUI();
    renderArenaHeroes();
    alert('💎 Призвано 100 премиум героев!');
}

function summonHero(isPremium) {
    const rarities = ['common', 'rare', 'epic', 'legendary'];
    const weights = isPremium ? [40, 35, 20, 5] : [60, 30, 8, 2];
    let rand = Math.random() * 100;
    let rarity = 'common';
    let cumWeight = 0;
    
    for (let i = 0; i < weights.length; i++) {
        cumWeight += weights[i];
        if (rand <= cumWeight) {
            rarity = rarities[i];
            break;
        }
    }
    
    const types = ['tank', 'dps', 'support'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const avatars = {
        common: {tank: ['🛡️', '⚔️'], dps: ['🗡️', '🏹'], support: ['💚', '✨']},
        rare: {tank: ['⚡', '🔥'], dps: ['💫', '🌟'], support: ['💎', '💍']},
        epic: {tank: ['🎴', '🎯'], dps: ['🏆', '⚡'], support: ['👑', '💫']},
        legendary: {tank: ['🐉', '👑'], dps: ['⚡', '🔥'], support: ['🌟', '✨']}
    };
    
    const names = {
        common: {tank: ['Воин', 'Страж', 'Защитник'], dps: ['Боец', 'Солдат', 'Наёмник'], support: ['Жрец', 'Лекарь', 'Мудрец']},
        rare: {tank: ['Герой', 'Ветеран', 'Рыцарь'], dps: ['Мастер', 'Элита', 'Асассин'], support: ['Шаман', 'Монах', 'Бард']},
        epic: {tank: ['Легенда', 'Титан', 'Защитник Богов'], dps: ['Миф', 'Чемпион', 'Повелитель Теней'], support: ['Архимаг', 'Архангел', 'Верховный Жрец']},
        legendary: {tank: ['Император', 'Страж Вечности', 'Божественный Защитник'], dps: ['Бог Войны', 'Повелитель Смерти', 'Легендарный Воин'], support: ['Бог Света', 'Верховный Мудрец', 'Творец Миров']}
    };
    
    const basePower = rarity === 'legendary' ? 500 : rarity === 'epic' ? 300 : rarity === 'rare' ? 200 : 100;
    const powerMultiplier = type === 'tank' ? 0.8 : type === 'support' ? 0.7 : 1.2;
    const hpMultiplier = type === 'tank' ? 5 : type === 'support' ? 3 : 2.5;
    
    const hero = {
        id: Date.now(),
        name: names[rarity][type][Math.floor(Math.random() * names[rarity][type].length)],
        level: 1,
        power: Math.floor(basePower * powerMultiplier),
        maxHp: Math.floor(basePower * hpMultiplier),
        hp: Math.floor(basePower * hpMultiplier),
        avatar: avatars[rarity][type][Math.floor(Math.random() * avatars[rarity][type].length)],
        rarity: rarity,
        type: type,
        xp: 0,
        stars: 1,
        equipment: []
    };
    
    // Проверка на автоматическое слияние дубликатов
    const duplicate = arenaHeroes.find(h => h.name === hero.name && h.id !== hero.id && h.rarity === hero.rarity && (h.stars || 1) < 5);
    if (duplicate) {
        duplicate.stars = (duplicate.stars || 1) + 1;
        duplicate.power = Math.floor(duplicate.power * 1.5);
        duplicate.maxHp = Math.floor(duplicate.maxHp * 1.3);
        duplicate.hp = duplicate.maxHp;
        alert(`⭐ Автоматическое слияние! ${duplicate.name} получил ${duplicate.stars}-ю звезду!`);
        renderArenaHeroes();
        saveArenaData();
        return;
    }
    
    arenaHeroes.push(hero);
    renderArenaHeroes();
    saveArenaData();
    
    const rarityColor = rarity === 'legendary' ? '#ffd700' : rarity === 'epic' ? '#ff00ff' : rarity === 'rare' ? '#00ffff' : '#00ff00';
    const notification = document.createElement('div');
    notification.style.cssText = `position: fixed; top: 20px; right: 20px; background: ${rarityColor}; border: 3px solid #000; padding: 15px; z-index: 10000; font-weight: bold;`;
    notification.innerHTML = `🎴 Получен ${hero.name}! ${hero.avatar}<br>${hero.rarity === 'legendary' ? '🌟 Легендарный' : hero.rarity === 'epic' ? '💜 Эпический' : hero.rarity === 'rare' ? '💎 Редкий' : '⚪ Обычный'}`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
}

function upgradeHero(id) {
    const hero = arenaHeroes.find(h => h.id === id);
    if (!hero) return;
    
    const cost = hero.level * 50;
    if (arenaCoins < cost) {
        alert('Недостаточно монет!');
        return;
    }
    
    arenaCoins -= cost;
    hero.level++;
    hero.power = Math.floor(hero.power * 1.2);
    hero.maxHp = Math.floor((hero.maxHp || hero.power * 3) * 1.15);
    hero.hp = hero.maxHp;
    
    // Обновление квестов
    arenaQuests.forEach(q => {
        if (q.type === 'upgrade' && !q.completed) {
            q.current = (q.current || 0) + 1;
        }
    });
    
    renderArenaHeroes();
    saveArenaData();
}

function addToTeam(heroId) {
    if (arenaTeam.length >= 5) {
        alert('Команда уже полная! (Максимум 5 героев)');
        return;
    }
    if (!arenaTeam.includes(heroId)) {
        arenaTeam.push(heroId);
        saveArenaData();
        renderArenaHeroes();
    }
}

function showArenaTeam() {
    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #111; border: 4px solid #00ff00; padding: 20px; z-index: 10000; max-width: 500px; max-height: 80vh; overflow-y: auto;';
    modal.innerHTML = `
        <h2 style="color: #00ff00; margin-bottom: 15px;">👥 КОМАНДА</h2>
        <div id="teamList" style="margin-bottom: 15px;"></div>
        <button class="music-btn" onclick="this.parentElement.remove()">ЗАКРЫТЬ</button>
    `;
    
    const teamList = modal.querySelector('#teamList');
    if (arenaTeam.length === 0) {
        teamList.innerHTML = '<div style="color: #888;">Команда пуста. Добавьте героев!</div>';
    } else {
        arenaTeam.forEach((heroId, index) => {
            const hero = arenaHeroes.find(h => h.id === heroId);
            if (hero) {
                const card = document.createElement('div');
                card.style.cssText = 'background: #222; border: 2px solid #00ff00; padding: 10px; margin: 5px 0; display: flex; justify-content: space-between; align-items: center;';
                const heroAscii = getHeroAscii(hero.type, hero.rarity);
                card.innerHTML = `
                    <div>
                        <pre style="font-family: 'Courier New', monospace; font-size: 0.35em; color: #00ff00; text-align: center; margin: 5px 0; line-height: 1.1; background: #000; padding: 5px; border: 1px solid #00ff00; display: inline-block;">${heroAscii}</pre>
                        <div style="font-size: 1.5em;">${hero.avatar}</div>
                        <div>${hero.name} (Ур. ${hero.level})</div>
                    </div>
                    <button class="music-btn" onclick="removeFromTeam(${heroId})" style="padding: 5px 10px; font-size: 0.8em;">Убрать</button>
                `;
                teamList.appendChild(card);
            }
        });
    }
    
    document.body.appendChild(modal);
}

function removeFromTeam(heroId) {
    arenaTeam = arenaTeam.filter(id => id !== heroId);
    saveArenaData();
    renderArenaHeroes();
    document.querySelectorAll('div').forEach(div => {
        if (div.textContent && div.textContent.includes('КОМАНДА') && div.style.position === 'fixed') {
            div.remove();
        }
    });
    showArenaTeam();
}

function startArenaBattle() {
    if (arenaTeam.length === 0) {
        alert('Соберите команду из героев!');
        return;
    }
    
    const prestigeBonus = arenaPrestige + 1;
    const stagePower = arenaStage * 500;
    const teamPower = arenaTeam.reduce((sum, id) => {
        const hero = arenaHeroes.find(h => h.id === id);
        return sum + (hero ? hero.power : 0);
    }, 0);
    
    const isBoss = arenaStage % 10 === 0;
    const enemyPower = isBoss ? stagePower * 3 : stagePower;
    const enemyName = isBoss ? `БОСС СТАДИИ ${arenaStage}` : `Враг Стадии ${arenaStage}`;
    
    if (teamPower > enemyPower) {
        const xpGain = Math.floor(enemyPower / 20 * prestigeBonus);
        const coinGain = Math.floor(enemyPower / 10 * prestigeBonus);
        
        arenaXP += xpGain;
        arenaCoins += coinGain;
        
        // Награды за босса
        if (isBoss) {
            arenaCrystals += 5 + arenaPrestige;
            arenaCoins += coinGain * 2;
        }
        
        // Опыт героям команды
        arenaTeam.forEach(id => {
            const hero = arenaHeroes.find(h => h.id === id);
            if (hero) {
                hero.xp = (hero.xp || 0) + Math.floor(xpGain / arenaTeam.length);
                if (hero.xp >= hero.level * 50) {
                    hero.level++;
                    hero.xp = 0;
                    hero.power = Math.floor(hero.power * 1.2);
                    hero.maxHp = Math.floor((hero.maxHp || hero.power * 3) * 1.15);
                    hero.hp = hero.maxHp;
                }
            }
        });
        
        // Обновление миссий
        arenaMissions.forEach(m => {
            if (m.type === 'stage' && !m.completed) {
                m.current = arenaStage;
            }
        });
        
        // Повышение стадии
        if (Math.random() > 0.7 || isBoss) {
            arenaStage++;
            alert(`🎉 Победа над ${enemyName}! Стадия ${arenaStage} открыта!`);
            
            // Обновление квестов
            arenaQuests.forEach(q => {
                if (q.type === 'stage' && !q.completed) {
                    q.current = (q.current || 0) + 1;
                }
            });
            checkAchievements();
        }
        
        const log = document.getElementById('battleLog');
        if (log) {
            log.innerHTML = `<div style="color: #00ff00;">⚔️ Победа над ${enemyName}! +${xpGain} опыта, +${coinGain}💰${isBoss ? ', +' + (5 + arenaPrestige) + '💎' : ''}</div>` + log.innerHTML;
        }
        
        renderArenaHeroes();
        updateArenaUI();
        saveArenaData();
    } else {
        alert(`💀 Поражение! ${enemyName} слишком силён (${enemyPower} vs ${teamPower}). Прокачайте героев!`);
    }
}

function showArenaStages() {
    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #111; border: 4px solid #00ff00; padding: 20px; z-index: 10000; max-width: 400px; max-height: 80vh; overflow-y: auto;';
    modal.innerHTML = `
        <h2 style="color: #00ff00; margin-bottom: 15px;">📜 ВЫБОР СТАДИИ</h2>
        <div style="color: #888; margin-bottom: 10px;">Текущая стадия: ${arenaStage}</div>
        <div id="stagesList"></div>
        <button class="music-btn" onclick="this.parentElement.remove()" style="margin-top: 15px;">ЗАКРЫТЬ</button>
    `;
    
    const stagesList = modal.querySelector('#stagesList');
    for (let i = Math.max(1, arenaStage - 5); i <= arenaStage + 5; i++) {
        const stageDiv = document.createElement('div');
        const isBoss = i % 10 === 0;
        const isCurrent = i === arenaStage;
        const isLocked = i > arenaStage;
        
        stageDiv.style.cssText = `background: ${isCurrent ? '#00ff00' : isLocked ? '#444' : '#222'}; border: 2px solid ${isCurrent ? '#ffff00' : '#00ff00'}; padding: 10px; margin: 5px 0; cursor: ${isLocked ? 'not-allowed' : 'pointer'};`;
        const enemyAscii = getEnemyAscii(i, isBoss);
        stageDiv.innerHTML = `
            <pre style="font-family: 'Courier New', monospace; font-size: 0.4em; color: ${isBoss ? '#ff0000' : '#00ff00'}; text-align: center; margin: 5px 0; line-height: 1.1; background: #000; padding: 5px; border: 1px solid ${isBoss ? '#ff0000' : '#00ff00'};">${enemyAscii}</pre>
            <div style="font-weight: bold;">${isBoss ? '👑 БОСС ' : ''}Стадия ${i}${isCurrent ? ' (ТЕКУЩАЯ)' : ''}${isLocked ? ' (ЗАБЛОКИРОВАНА)' : ''}</div>
            <div style="font-size: 0.9em; color: #aaa;">Сила врагов: ${i * 500}${isBoss ? ' (x3)' : ''}</div>
        `;
        
        if (!isLocked) {
            stageDiv.onclick = () => {
                arenaStage = i;
                saveArenaData();
                document.querySelectorAll('div').forEach(div => {
                    if (div.textContent && div.textContent.includes('ВЫБОР СТАДИИ') && div.style.position === 'fixed') {
                        div.remove();
                    }
                });
                startArena();
            };
        }
        
        stagesList.appendChild(stageDiv);
    }
    
    document.body.appendChild(modal);
}

function startAutoBattle() {
    if (!document.getElementById('battleLog')) return;
    
    setInterval(() => {
        const teamPower = arenaTeam.reduce((sum, id) => {
            const hero = arenaHeroes.find(h => h.id === id);
            return sum + (hero ? hero.power : 0);
        }, 0);
        
        if (teamPower === 0) return;
        
        const enemyPower = Math.floor((arenaStage * 300) * (0.8 + Math.random() * 0.4));
        const log = document.getElementById('battleLog');
        if (!log) return;
        
        if (teamPower > enemyPower) {
            const coins = Math.floor(enemyPower / 15);
            const xpGain = Math.floor(enemyPower / 25);
            
            arenaCoins += coins;
            arenaXP += xpGain;
            
            // Опыт героям
            arenaTeam.forEach(id => {
                const hero = arenaHeroes.find(h => h.id === id);
                if (hero) {
                    hero.xp = (hero.xp || 0) + Math.floor(xpGain / arenaTeam.length);
                    if (hero.xp >= hero.level * 50) {
                        hero.level++;
                        hero.xp = 0;
                        hero.power = Math.floor(hero.power * 1.2);
                        hero.maxHp = Math.floor((hero.maxHp || hero.power * 3) * 1.15);
                        hero.hp = hero.maxHp;
                    }
                }
            });
            
            log.innerHTML = `<div style="color: #00ff00;">⚔️ Авто-битва: Победа! +${coins}💰, +${xpGain} опыта</div>` + log.innerHTML;
            updateArenaUI();
            renderArenaHeroes();
            saveArenaData();
        } else {
            log.innerHTML = `<div style="color: #ff0000;">💀 Авто-битва: Поражение! Враги слишком сильны...</div>` + log.innerHTML;
        }
        
        if (log.children.length > 8) {
            log.removeChild(log.lastChild);
        }
    }, 5000);
}

function showArenaTournament() {
    const teamPower = arenaTeam.reduce((sum, id) => {
        const hero = arenaHeroes.find(h => h.id === id);
        return sum + (hero ? hero.power : 0);
    }, 0);
    
    if (teamPower === 0) {
        alert('Соберите команду для участия в турнире!');
        return;
    }
    
    const tournamentTier = Math.floor(arenaTournamentWins / 10) + 1;
    const enemyPower = tournamentTier * 2000 + Math.floor(Math.random() * 1000);
    
    if (teamPower > enemyPower) {
        arenaTournamentWins++;
        const reward = tournamentTier * 500;
        arenaCoins += reward;
        arenaCrystals += Math.floor(tournamentTier / 2);
        alert(`🏆 Победа в турнире! +${reward}💰, +${Math.floor(tournamentTier / 2)}💎\nВсего побед: ${arenaTournamentWins}`);
        
        // Обновление квестов
        arenaQuests.forEach(q => {
            if (q.type === 'tournament' && !q.completed) {
                q.current = (q.current || 0) + 1;
            }
        });
        checkAchievements();
        saveArenaData();
        updateArenaUI();
        startArena();
    } else {
        alert(`💀 Поражение в турнире! Враги слишком сильны (${enemyPower} vs ${teamPower})`);
    }
}

function arenaPrestigeReset() {
    if (confirm(`Престиж даст бонус x${arenaPrestige + 1} к опыту и монетам, но сбросит прогресс. Продолжить?`)) {
        arenaPrestige++;
        arenaCoins = 0;
        arenaCrystals = 0;
        arenaXP = 0;
        arenaStage = 1;
        arenaHeroes.forEach(hero => {
            hero.level = 1;
            hero.xp = 0;
            const basePower = hero.rarity === 'legendary' ? 500 : hero.rarity === 'epic' ? 300 : hero.rarity === 'rare' ? 200 : 100;
            const powerMultiplier = hero.type === 'tank' ? 0.8 : hero.type === 'support' ? 0.7 : 1.2;
            const hpMultiplier = hero.type === 'tank' ? 5 : hero.type === 'support' ? 3 : 2.5;
            hero.power = Math.floor(basePower * powerMultiplier * (arenaPrestige + 1));
            hero.maxHp = Math.floor(basePower * hpMultiplier * (arenaPrestige + 1));
            hero.hp = hero.maxHp;
        });
        alert(`👑 Престиж ${arenaPrestige}! Бонус x${arenaPrestige + 1} активирован!`);
        checkAchievements();
        saveArenaData();
        startArena();
    }
}

function sellDuplicateHeroes() {
    const duplicates = [];
    const seen = {};
    
    arenaHeroes.forEach(hero => {
        const key = `${hero.name}_${hero.rarity}`;
        if (seen[key]) {
            duplicates.push(hero);
        } else {
            seen[key] = true;
        }
    });
    
    if (duplicates.length === 0) {
        alert('Нет дубликатов для продажи!');
        return;
    }
    
    const totalValue = duplicates.reduce((sum, hero) => sum + hero.level * 25, 0);
    arenaCoins += totalValue;
    arenaHeroes = arenaHeroes.filter(hero => !duplicates.includes(hero));
    
    alert(`💸 Продано ${duplicates.length} дубликатов за ${totalValue}💰!`);
    saveArenaData();
    renderArenaHeroes();
    updateArenaUI();
}

function generateArenaMissions() {
    if (arenaMissions.length === 0) {
        arenaMissions = [
            {id: 1, type: 'stage', target: arenaStage + 5, current: arenaStage, reward: 500, completed: false, desc: 'Пройти 5 стадий'},
            {id: 2, type: 'summon', target: 10, current: 0, reward: 200, completed: false, desc: 'Призвать 10 героев'},
            {id: 3, type: 'tournament', target: 5, current: arenaTournamentWins, reward: 300, completed: false, desc: 'Выиграть 5 турниров'},
        ];
    }
}

function showArenaMissions() {
    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #111; border: 4px solid #00ff00; padding: 20px; z-index: 10000; max-width: 500px; max-height: 80vh; overflow-y: auto;';
    
    let missionsHtml = '<h2 style="color: #00ff00; margin-bottom: 15px;">📋 МИССИИ</h2>';
    
    arenaMissions.forEach(mission => {
        const progress = Math.min(mission.current, mission.target);
        const percent = (progress / mission.target * 100).toFixed(0);
        const isCompleted = mission.completed || progress >= mission.target;
        
        missionsHtml += `
            <div style="background: #222; border: 2px solid ${isCompleted ? '#00ff00' : '#444'}; padding: 10px; margin: 10px 0;">
                <div style="font-weight: bold; margin-bottom: 5px;">${mission.desc}</div>
                <div style="font-size: 0.9em; color: #aaa;">${progress} / ${mission.target}</div>
                <div style="background: #000; height: 8px; border: 1px solid #00ff00; margin: 5px 0;">
                    <div style="background: #00ff00; height: 100%; width: ${percent}%;"></div>
                </div>
                <div>Награда: ${mission.reward}💰</div>
                ${isCompleted && !mission.completed ? `<button class="music-btn" onclick="claimArenaMission(${mission.id})" style="width: 100%; margin-top: 5px;">Получить награду</button>` : ''}
            </div>
        `;
    });
    
    missionsHtml += '<button class="music-btn" onclick="this.parentElement.remove()" style="margin-top: 15px;">ЗАКРЫТЬ</button>';
    modal.innerHTML = missionsHtml;
    document.body.appendChild(modal);
}

function claimArenaMission(id) {
    const mission = arenaMissions.find(m => m.id === id);
    if (!mission || mission.completed) return;
    
    arenaCoins += mission.reward;
    mission.completed = true;
    alert(`🎉 Миссия выполнена! +${mission.reward}💰`);
    
    saveArenaData();
    updateArenaUI();
    showArenaMissions();
}

function upgradeHeroStar(id) {
    const hero = arenaHeroes.find(h => h.id === id);
    if (!hero) return;
    
    const stars = hero.stars || 1;
    if (stars >= 5) {
        alert('Герой уже максимального уровня звезд!');
        return;
    }
    
    const cost = stars * 200;
    if (arenaCrystals < cost) {
        alert('Недостаточно кристаллов!');
        return;
    }
    
    arenaCrystals -= cost;
    hero.stars = stars + 1;
    hero.power = Math.floor(hero.power * 1.5);
    hero.maxHp = Math.floor(hero.maxHp * 1.3);
    hero.hp = hero.maxHp;
    
    alert(`⭐ ${hero.name} получил ${hero.stars}-ю звезду! Сила увеличена!`);
    renderArenaHeroes();
    saveArenaData();
}

function showArenaRaid() {
    if (arenaRaidBosses.length === 0) {
        arenaRaidBosses = [
            {id: 1, name: 'Дракон Пустоты', power: 50000, maxHp: 50000, hp: 50000, defeated: false, reward: 5000},
            {id: 2, name: 'Титановый Страж', power: 100000, maxHp: 100000, hp: 100000, defeated: false, reward: 10000},
            {id: 3, name: 'Демон Хаоса', power: 200000, maxHp: 200000, hp: 200000, defeated: false, reward: 20000},
            {id: 4, name: 'Архидемон', power: 500000, maxHp: 500000, hp: 500000, defeated: false, reward: 50000},
        ];
    }
    
    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #111; border: 4px solid #ff0000; padding: 20px; z-index: 10000; max-width: 600px; max-height: 80vh; overflow-y: auto;';
    modal.innerHTML = `
        <h2 style="color: #ff0000; margin-bottom: 15px;">🐉 РЕЙД БОССЫ</h2>
        <div id="raidBossesList"></div>
        <button class="music-btn" onclick="this.parentElement.remove()" style="margin-top: 15px;">ЗАКРЫТЬ</button>
    `;
    
    const list = modal.querySelector('#raidBossesList');
    arenaRaidBosses.forEach(boss => {
        const teamPower = arenaTeam.reduce((sum, id) => {
            const hero = arenaHeroes.find(h => h.id === id);
            return sum + (hero ? hero.power : 0);
        }, 0);
        
        const percent = Math.min(100, (boss.hp / boss.maxHp) * 100);
        const isDefeated = boss.defeated || boss.hp <= 0;
        
        const card = document.createElement('div');
        card.style.cssText = `background: #222; border: 3px solid ${isDefeated ? '#00ff00' : '#ff0000'}; padding: 15px; margin: 10px 0;`;
        const bossAscii = getBossAscii(boss.id);
        card.innerHTML = `
            <pre style="font-family: 'Courier New', monospace; font-size: 0.5em; color: #ff0000; text-align: center; margin: 5px 0; line-height: 1.1; background: #000; padding: 5px; border: 1px solid #ff0000;">${bossAscii}</pre>
            <div style="font-weight: bold; font-size: 1.2em; margin-bottom: 10px;">🐉 ${boss.name}</div>
            <div>❤️ Здоровье: ${boss.hp.toLocaleString()} / ${boss.maxHp.toLocaleString()}</div>
            <div style="background: #000; height: 15px; border: 2px solid #ff0000; margin: 10px 0;">
                <div style="background: #ff0000; height: 100%; width: ${percent}%;"></div>
            </div>
            <div>⚔️ Сила: ${boss.power.toLocaleString()}</div>
            <div>💰 Награда: ${boss.reward.toLocaleString()}💰, ${boss.reward / 10}💎</div>
            ${!isDefeated ? `<button class="music-btn" onclick="fightRaidBoss(${boss.id})" style="width: 100%; margin-top: 10px;">
                ⚔️ АТАКОВАТЬ (Команда: ${teamPower.toLocaleString()})
            </button>` : '<div style="color: #00ff00; margin-top: 10px;">✓ ПОБЕЖДЁН</div>'}
        `;
        list.appendChild(card);
    });
    
    document.body.appendChild(modal);
    saveArenaData();
}

function fightRaidBoss(bossId) {
    const boss = arenaRaidBosses.find(b => b.id === bossId);
    if (!boss || boss.defeated) return;
    
    const teamPower = arenaTeam.reduce((sum, id) => {
        const hero = arenaHeroes.find(h => h.id === id);
        return sum + (hero ? hero.power : 0);
    }, 0);
    
    if (teamPower === 0) {
        alert('Соберите команду!');
        return;
    }
    
    const damage = Math.floor(teamPower * (0.5 + Math.random() * 0.5));
    boss.hp = Math.max(0, boss.hp - damage);
    
    if (boss.hp <= 0) {
        boss.defeated = true;
        arenaCoins += boss.reward;
        arenaCrystals += Math.floor(boss.reward / 10);
        alert(`🎉 БОСС ${boss.name} ПОБЕЖДЁН! +${boss.reward.toLocaleString()}💰, +${Math.floor(boss.reward / 10)}💎`);
        
        // Обновление квестов
        arenaQuests.forEach(q => {
            if (q.type === 'raid' && !q.completed) {
                q.current = (q.current || 0) + 1;
            }
        });
        checkAchievements();
    } else {
        alert(`⚔️ Нанесено ${damage.toLocaleString()} урона! Осталось ${boss.hp.toLocaleString()} HP`);
    }
    
    saveArenaData();
    showArenaRaid();
}

function showArenaEquipment() {
    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #111; border: 4px solid #00ff00; padding: 20px; z-index: 10000; max-width: 700px; max-height: 80vh; overflow-y: auto;';
    modal.innerHTML = `
        <h2 style="color: #00ff00; margin-bottom: 15px;">⚔️ ЭКИПИРОВКА</h2>
        <div style="margin-bottom: 20px;">
            <button class="music-btn" onclick="craftEquipment()" style="width: 100%; margin-bottom: 10px;">🔨 Создать экипировку (500💰)</button>
            <div>Всего экипировки: ${arenaEquipment.length}</div>
        </div>
        <div id="equipmentList" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; margin-bottom: 20px;"></div>
        <h3 style="color: #00ff00; margin-top: 20px;">👥 ГЕРОИ</h3>
        <div id="heroesForEquipment"></div>
        <button class="music-btn" onclick="this.parentElement.remove()" style="margin-top: 15px;">ЗАКРЫТЬ</button>
    `;
    
    const equipList = modal.querySelector('#equipmentList');
    if (arenaEquipment.length === 0) {
        equipList.innerHTML = '<div style="color: #888;">Нет экипировки. Создайте её!</div>';
    } else {
        arenaEquipment.forEach((item, index) => {
            const card = document.createElement('div');
            card.style.cssText = 'background: #222; border: 2px solid #00ff00; padding: 10px; text-align: center;';
            const equipAscii = getEquipmentAscii(item.icon);
            card.innerHTML = `
                <pre style="font-family: 'Courier New', monospace; font-size: 0.4em; color: #00ff00; text-align: center; margin: 5px 0; line-height: 1.1; background: #000; padding: 5px; border: 1px solid #00ff00;">${equipAscii}</pre>
                <div style="font-size: 2em;">${item.icon}</div>
                <div style="font-size: 0.9em; margin-top: 5px;">${item.name}</div>
                <div style="font-size: 0.8em; color: #aaa;">+${item.powerBonus}⚔️</div>
                <button class="music-btn" onclick="deleteEquipment(${index})" style="width: 100%; margin-top: 5px; font-size: 0.8em; padding: 3px;">Удалить</button>
            `;
            equipList.appendChild(card);
        });
    }
    
    const heroesList = modal.querySelector('#heroesForEquipment');
    arenaHeroes.forEach(hero => {
        const heroCard = document.createElement('div');
        heroCard.style.cssText = 'background: #222; border: 2px solid #00ff00; padding: 10px; margin: 5px 0;';
        heroCard.innerHTML = `
            <div style="font-weight: bold;">${hero.avatar} ${hero.name}</div>
            <div style="font-size: 0.9em;">Экипировка: ${(hero.equipment || []).length}/3</div>
            ${arenaEquipment.length > 0 ? `<select id="equipSelect${hero.id}" style="width: 100%; margin-top: 5px; padding: 5px;">
                <option value="">Выбрать экипировку</option>
                ${arenaEquipment.map((item, idx) => `<option value="${idx}">${item.icon} ${item.name}</option>`).join('')}
            </select>
            <button class="music-btn" onclick="equipHero(${hero.id})" style="width: 100%; margin-top: 5px; font-size: 0.8em;">Надеть</button>` : ''}
        `;
        heroesList.appendChild(heroCard);
    });
    
    document.body.appendChild(modal);
}

function craftEquipment() {
    if (arenaCoins < 500) {
        alert('Недостаточно монет!');
        return;
    }
    
    arenaCoins -= 500;
    
    const types = ['⚔️', '🛡️', '👑', '💍', '🧙', '🏹'];
    const names = ['Меч', 'Щит', 'Корона', 'Кольцо', 'Посох', 'Лук'];
    const rarities = ['common', 'rare', 'epic'];
    const weights = [70, 25, 5];
    let rand = Math.random() * 100;
    let rarity = 'common';
    let cumWeight = 0;
    
    for (let i = 0; i < weights.length; i++) {
        cumWeight += weights[i];
        if (rand <= cumWeight) {
            rarity = rarities[i];
            break;
        }
    }
    
    const powerBonus = rarity === 'epic' ? 500 : rarity === 'rare' ? 200 : 100;
    
    const equipment = {
        id: Date.now(),
        icon: types[Math.floor(Math.random() * types.length)],
        name: names[Math.floor(Math.random() * names.length)] + (rarity === 'epic' ? ' Легенды' : rarity === 'rare' ? ' Редкий' : ''),
        powerBonus: powerBonus,
        rarity: rarity
    };
    
    arenaEquipment.push(equipment);
    alert(`⚔️ Создана экипировка: ${equipment.icon} ${equipment.name}! +${powerBonus}⚔️`);
    saveArenaData();
    showArenaEquipment();
}

function deleteEquipment(index) {
    arenaEquipment.splice(index, 1);
    saveArenaData();
    showArenaEquipment();
}

function equipHero(heroId) {
    const hero = arenaHeroes.find(h => h.id === heroId);
    if (!hero) return;
    
    const select = document.getElementById(`equipSelect${heroId}`);
    if (!select || !select.value) return;
    
    const itemIndex = parseInt(select.value);
    const item = arenaEquipment[itemIndex];
    if (!item) return;
    
    if (!hero.equipment) hero.equipment = [];
    if (hero.equipment.length >= 3) {
        alert('Максимум 3 предмета экипировки!');
        return;
    }
    
    hero.equipment.push(item);
    arenaEquipment.splice(itemIndex, 1);
    hero.power += item.powerBonus;
    
    alert(`⚔️ ${hero.name} надел ${item.icon} ${item.name}! +${item.powerBonus}⚔️`);
    saveArenaData();
    showArenaEquipment();
}

function showArenaFusion() {
    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #111; border: 4px solid #00ff00; padding: 20px; z-index: 10000; max-width: 600px;';
    modal.innerHTML = `
        <h2 style="color: #00ff00; margin-bottom: 15px;">✨ СЛИЯНИЕ ГЕРОЕВ</h2>
        <div style="margin-bottom: 15px;">Очки слияния: ${arenaFusionPoints}</div>
        <div style="margin-bottom: 15px;">Объедините двух героев одного типа и редкости для получения бонуса!</div>
        <div id="fusionHeroesList" style="max-height: 300px; overflow-y: auto;"></div>
        <button class="music-btn" onclick="this.parentElement.remove()">ЗАКРЫТЬ</button>
    `;
    
    const list = modal.querySelector('#fusionHeroesList');
    const heroesByType = {};
    arenaHeroes.forEach(hero => {
        const key = `${hero.type}_${hero.rarity}`;
        if (!heroesByType[key]) heroesByType[key] = [];
        heroesByType[key].push(hero);
    });
    
    Object.keys(heroesByType).forEach(key => {
        const heroes = heroesByType[key];
        if (heroes.length >= 2) {
            const [hero1, hero2] = heroes;
            const card = document.createElement('div');
            card.style.cssText = 'background: #222; border: 2px solid #00ff00; padding: 10px; margin: 5px 0;';
                const hero1Ascii = getHeroAscii(hero1.type, hero1.rarity);
                const hero2Ascii = getHeroAscii(hero2.type, hero2.rarity);
                card.innerHTML = `
                    <pre style="font-family: 'Courier New', monospace; font-size: 0.3em; color: #00ff00; text-align: center; margin: 5px 0; line-height: 1.1; background: #000; padding: 5px; border: 1px solid #00ff00; display: inline-block;">${hero1Ascii}</pre>
                    <span style="font-size: 1.5em; margin: 0 10px;">+</span>
                    <pre style="font-family: 'Courier New', monospace; font-size: 0.3em; color: #00ff00; text-align: center; margin: 5px 0; line-height: 1.1; background: #000; padding: 5px; border: 1px solid #00ff00; display: inline-block;">${hero2Ascii}</pre>
                    <div style="margin-top: 10px;">${hero1.avatar} ${hero1.name} + ${hero2.avatar} ${hero2.name}</div>
                    <button class="music-btn" onclick="fuseHeroes(${hero1.id}, ${hero2.id})" style="width: 100%; margin-top: 5px;">
                        ✨ СЛИТЬ (Получите ${hero1.level + hero2.level} очков слияния)
                    </button>
                `;
            list.appendChild(card);
        }
    });
    
    if (list.innerHTML === '') {
        list.innerHTML = '<div style="color: #888;">Нет подходящих пар для слияния. Нужно 2+ героя одного типа и редкости.</div>';
    }
    
    document.body.appendChild(modal);
}

function fuseHeroes(id1, id2) {
    const hero1 = arenaHeroes.find(h => h.id === id1);
    const hero2 = arenaHeroes.find(h => h.id === id2);
    
    if (!hero1 || !hero2) return;
    
    const fusionPoints = hero1.level + hero2.level;
    arenaFusionPoints += fusionPoints;
    
    // Удаляем второго героя, усиливаем первого
    hero1.power = Math.floor((hero1.power + hero2.power) * 1.2);
    hero1.maxHp = Math.floor((hero1.maxHp + hero2.maxHp) * 1.2);
    hero1.hp = hero1.maxHp;
    
    arenaHeroes = arenaHeroes.filter(h => h.id !== id2);
    arenaTeam = arenaTeam.filter(id => id !== id2);
    
    alert(`✨ Слияние! ${hero1.name} усилился! +${fusionPoints} очков слияния!`);
    saveArenaData();
    renderArenaHeroes();
    showArenaFusion();
}

function startArenaEvent() {
    if (arenaEventActive) {
        alert('🎉 Событие уже активно! Бонусы: +50% опыта и монет!');
        return;
    }
    
    arenaEventActive = true;
    alert('🎪 СОБЫТИЕ АКТИВИРОВАНО!\n+50% к опыту и монетам на 1 час!\nБонусные кристаллы из боссов!');
    
    setTimeout(() => {
        arenaEventActive = false;
        alert('⏰ Событие закончилось. Спасибо за участие!');
        saveArenaData();
    }, 3600000);
    
    saveArenaData();
    startArena();
}

function saveArenaData() {
    localStorage.setItem('arenaHeroes', JSON.stringify(arenaHeroes));
    localStorage.setItem('arenaCoins', arenaCoins.toString());
    localStorage.setItem('arenaStage', arenaStage.toString());
    localStorage.setItem('arenaXP', arenaXP.toString());
    localStorage.setItem('arenaXPToNext', arenaXPToNext.toString());
    localStorage.setItem('arenaCrystals', arenaCrystals.toString());
    localStorage.setItem('arenaTeam', JSON.stringify(arenaTeam));
    localStorage.setItem('arenaArtefacts', JSON.stringify(arenaArtefacts));
    localStorage.setItem('arenaTournamentWins', arenaTournamentWins.toString());
    localStorage.setItem('arenaPrestige', arenaPrestige.toString());
    localStorage.setItem('arenaEquipment', JSON.stringify(arenaEquipment));
    localStorage.setItem('arenaMissions', JSON.stringify(arenaMissions));
    localStorage.setItem('arenaRaidBosses', JSON.stringify(arenaRaidBosses));
    localStorage.setItem('arenaGuildPoints', arenaGuildPoints.toString());
    localStorage.setItem('arenaEventActive', arenaEventActive.toString());
    localStorage.setItem('arenaFusionPoints', arenaFusionPoints.toString());
    localStorage.setItem('arenaDailyReward', JSON.stringify(arenaDailyReward));
    localStorage.setItem('arenaQuests', JSON.stringify(arenaQuests));
}

// Legends of Mushrooms - Расширенная версия для долгой игры
let mushroomLevel = parseInt(localStorage.getItem('mushroomLevel') || '1');
let mushroomCoins = parseInt(localStorage.getItem('mushroomCoins') || '0');
let mushroomPower = parseInt(localStorage.getItem('mushroomPower') || '1');
let mushroomAutoClick = parseInt(localStorage.getItem('mushroomAutoClick') || '0');
let mushroomCollection = JSON.parse(localStorage.getItem('mushroomCollection') || '[]');
let mushroomAdventureStage = parseInt(localStorage.getItem('mushroomAdventureStage') || '1');
let mushroomSkillPoints = parseInt(localStorage.getItem('mushroomSkillPoints') || '0');
let mushroomPrestige = parseInt(localStorage.getItem('mushroomPrestige') || '0');
let mushroomTournamentWins = parseInt(localStorage.getItem('mushroomTournamentWins') || '0');
let mushroomAutoAdventure = localStorage.getItem('mushroomAutoAdventure') === 'true';
let mushroomUpgrades = JSON.parse(localStorage.getItem('mushroomUpgrades') || '{"clickMultiplier": 1, "autoMultiplier": 1, "coinMultiplier": 1}');

function startMushrooms() {
    const gameArea = document.getElementById('gameArea');
    gameArea.classList.remove('hidden');
    gameArea.className = 'game-area mushroom-game';
    
    const totalPower = mushroomCollection.reduce((sum, m) => sum + (m.power || 0), 0) + mushroomPower;
    
    const isMobile = window.innerWidth <= 480;
    const gridCols = isMobile ? '1fr' : '1fr 1fr';
    gameArea.innerHTML = `
        <div style="display: grid; grid-template-columns: ${gridCols}; gap: 15px; margin-bottom: 20px;">
            <div class="mushroom-card">
                <h3>💰 СТАТИСТИКА</h3>
                <div>💰 Монеты: <span id="mushroomCoins">${mushroomCoins.toLocaleString()}</span></div>
                <div>⚡ Сила: <span id="mushroomPower">${totalPower.toLocaleString()}</span></div>
                <div>🤖 Авто: <span id="mushroomAuto">${(mushroomAutoClick * mushroomUpgrades.autoMultiplier * (mushroomPrestige + 1)).toLocaleString()}</span>/сек</div>
                <div>⭐ Уровень: <span id="mushroomLevel">${mushroomLevel}</span></div>
                <div>🎯 Стадия: ${mushroomAdventureStage}</div>
                <div>🏆 Турниров: ${mushroomTournamentWins}</div>
                ${mushroomPrestige > 0 ? `<div style="color: #ffd700;">👑 Престиж: ${mushroomPrestige} (x${mushroomPrestige + 1})</div>` : ''}
            </div>
            <div class="mushroom-card">
                <h3>🎮 ДЕЙСТВИЯ</h3>
                <button class="music-btn" onclick="showMushroomCollection()" style="width: 100%; margin-bottom: 5px; font-size: 0.9em;">📚 КОЛЛЕКЦИЯ</button>
                <button class="music-btn" onclick="startMushroomAdventure()" style="width: 100%; margin-bottom: 5px; font-size: 0.9em;">🗺️ ПРИКЛЮЧЕНИЕ</button>
                <button class="music-btn" onclick="showMushroomSkills()" style="width: 100%; margin-bottom: 5px; font-size: 0.9em;">⚡ НАВЫКИ</button>
                <button class="music-btn" onclick="startMushroomTournament()" style="width: 100%; margin-bottom: 5px; font-size: 0.9em;">🏆 ТУРНИР</button>
                <button class="music-btn" onclick="showMushroomDailyReward()" style="width: 100%; margin-bottom: 5px; font-size: 0.9em; background: #ffd700; color: #000;">🎁 ЕЖЕДНЕВНАЯ НАГРАДА</button>
                <button class="music-btn" onclick="showMushroomQuests()" style="width: 100%; margin-bottom: 5px; font-size: 0.9em;">📜 КВЕСТЫ</button>
                ${mushroomLevel >= 100 ? `<button class="music-btn" onclick="mushroomPrestigeReset()" style="width: 100%; background: #ffd700; color: #000; font-size: 0.9em;">👑 ПРЕСТИЖ (x${mushroomPrestige + 1})</button>` : ''}
            </div>
        </div>
        <div style="text-align: center; margin-bottom: 30px;">
            <pre style="font-family: 'Courier New', monospace; font-size: 0.6em; color: #00ff00; text-align: center; margin: 10px auto; line-height: 1.2; background: #000; padding: 10px; border: 2px solid #00ff00; display: inline-block; cursor: pointer;" onclick="clickMushroom()" id="mushroomAscii">
     ╔═══════╗
     ║   ╱╲   ║
     ║  ╱ 🍄 ╲  ║
     ║ ╱  ╱╲  ╲ ║
     ║│  ╱  ╲  │║
     ║│ ╱    ╲ │║
     ║││      ││║
     ║││      ││║
     ║││      ││║
     ║║│      │║║
     ╚╝╚══════╝╚╝
            </pre>
            <div style="font-size: 6em; cursor: pointer;" onclick="clickMushroom()" id="mushroom">🍄</div>
            <div style="font-size: 1em; margin-top: 10px; color: #aaa;">Кликай для монет!</div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            <div class="mushroom-card">
                <h3>⬆ Улучшения</h3>
                <button class="music-btn" onclick="upgradeMushroomPower()" style="width: 100%; margin-bottom: 5px; font-size: 0.85em;">
                    ⚡ Сила (+1) - ${Math.floor(mushroomPower * 10)}💰
                </button>
                <button class="music-btn" onclick="buyAutoClick()" style="width: 100%; margin-bottom: 5px; font-size: 0.85em;">
                    🤖 Авто-клик (+1) - ${Math.floor((mushroomAutoClick + 1) * 50)}💰
                </button>
                <button class="music-btn" onclick="buyMushroomSkillPoint()" style="width: 100%; margin-bottom: 5px; font-size: 0.85em;">
                    ⭐ Навыки - ${(mushroomSkillPoints * 100 + 100).toLocaleString()}💰
                </button>
                <button class="music-btn" onclick="upgradeClickMultiplier()" style="width: 100%; margin-bottom: 5px; font-size: 0.85em;">
                    💥 x2 Клик - ${Math.floor(mushroomUpgrades.clickMultiplier * 1000)}💰
                </button>
                <button class="music-btn" onclick="upgradeAutoMultiplier()" style="width: 100%; font-size: 0.85em;">
                    ⚡ x2 Авто - ${Math.floor(mushroomUpgrades.autoMultiplier * 2000)}💰
                </button>
            </div>
            <div class="mushroom-card">
                <h3>🎴 Призывы</h3>
                <button class="music-btn" onclick="summonMushroom()" style="width: 100%; margin-bottom: 5px; font-size: 0.9em;">
                    🍄 Призвать гриб - 100💰
                </button>
                <button class="music-btn" onclick="summonMushroomX10()" style="width: 100%; margin-bottom: 5px; font-size: 0.9em;">
                    🍄 x10 - 900💰
                </button>
                <button class="music-btn" onclick="summonMushroomX100()" style="width: 100%; margin-bottom: 10px; font-size: 0.9em;">
                    🍄 x100 - 9000💰
                </button>
                <button class="music-btn" onclick="evolveMushrooms()" style="width: 100%;">
                    ✨ Эволюция (${mushroomCollection.length} шт.)
                </button>
            </div>
        </div>
        <button class="fun-btn" onclick="document.getElementById('gameArea').classList.add('hidden')" style="margin-top: 20px;">ЗАКРЫТЬ</button>
    `;
    
    startMushroomAutoClick();
    saveMushroomData();
}

function clickMushroom() {
    const prestigeBonus = (mushroomPrestige + 1);
    const coins = Math.floor((mushroomPower * mushroomUpgrades.clickMultiplier) * prestigeBonus);
    mushroomCoins += coins;
    
    // Обновление квестов
    mushroomQuests.forEach(q => {
        if (q.type === 'click' && !q.completed) {
            q.current = (q.current || 0) + 1;
        }
        if (q.type === 'coins' && !q.completed) {
            q.current = mushroomCoins;
        }
    });
    
    checkAchievements();
    updateMushroomUI();
    saveMushroomData();
    
    const mushroom = document.getElementById('mushroom');
    const mushroomAscii = document.getElementById('mushroomAscii');
    if (mushroom) mushroom.style.transform = 'scale(1.2)';
    if (mushroomAscii) {
        mushroomAscii.style.transform = 'scale(1.1)';
        mushroomAscii.style.filter = 'brightness(1.5)';
    }
    setTimeout(() => {
        if (mushroom) mushroom.style.transform = 'scale(1)';
        if (mushroomAscii) {
            mushroomAscii.style.transform = 'scale(1)';
            mushroomAscii.style.filter = 'brightness(1)';
        }
    }, 100);
}

function upgradeMushroomPower() {
    const cost = Math.floor(mushroomPower * 10);
    if (mushroomCoins < cost) {
        alert('Недостаточно монет!');
        return;
    }
    mushroomCoins -= cost;
    mushroomPower++;
    updateMushroomUI();
    saveMushroomData();
}

function buyAutoClick() {
    const cost = Math.floor((mushroomAutoClick + 1) * 50);
    if (mushroomCoins < cost) {
        alert('Недостаточно монет!');
        return;
    }
    mushroomCoins -= cost;
    mushroomAutoClick++;
    updateMushroomUI();
    saveMushroomData();
}

function summonMushroom() {
    if (mushroomCoins < 100) {
        alert('Недостаточно монет!');
        return;
    }
    mushroomCoins -= 100;
    
    const types = ['🍄', '🍄', '🍄', '🍄', '🍄', '🟫', '🔴', '🟣', '🟡', '🔵'];
    const names = ['Обычный гриб', 'Коричневый гриб', 'Красный гриб', 'Фиолетовый гриб', 'Жёлтый гриб', 'Синий гриб'];
    const powerBonus = Math.floor(Math.random() * 20) + 5;
    
    const typeIndex = Math.random() < 0.7 ? 0 : Math.floor(Math.random() * (types.length - 1)) + 1;
    const mushroom = {
        id: Date.now(),
        type: types[typeIndex],
        name: names[typeIndex] || 'Редкий гриб',
        power: powerBonus,
        level: 1,
        rarity: typeIndex === 0 ? 'common' : typeIndex < 3 ? 'rare' : typeIndex < 5 ? 'epic' : 'legendary'
    };
    
    mushroomCollection.push(mushroom);
    mushroomPower += powerBonus;
    
    // Обновление квестов
    mushroomQuests.forEach(q => {
        if (q.type === 'summon' && !q.completed) {
            q.current = (q.current || 0) + 1;
        }
    });
    checkAchievements();
    updateMushroomUI();
    saveMushroomData();
    
    const rarityEmoji = mushroom.rarity === 'legendary' ? '🌟' : mushroom.rarity === 'epic' ? '💜' : mushroom.rarity === 'rare' ? '💎' : '⚪';
    alert(`${mushroom.type} Получен ${mushroom.name}! ${rarityEmoji}\n+${powerBonus} к силе!`);
}

function summonMushroomX10() {
    const cost = 900; // Скидка за массовую покупку
    if (mushroomCoins < cost) {
        alert(`Недостаточно монет! Нужно ${cost}💰`);
        return;
    }
    
    mushroomCoins -= cost;
    let totalPower = 0;
    let legendaryCount = 0;
    let epicCount = 0;
    let rareCount = 0;
    
    for (let i = 0; i < 10; i++) {
        const types = ['🍄', '🍄', '🍄', '🍄', '🍄', '🟫', '🔴', '🟣', '🟡', '🔵'];
        const names = ['Обычный гриб', 'Коричневый гриб', 'Красный гриб', 'Фиолетовый гриб', 'Жёлтый гриб', 'Синий гриб'];
        const powerBonus = Math.floor(Math.random() * 20) + 5;
        
        const typeIndex = Math.random() < 0.7 ? 0 : Math.floor(Math.random() * (types.length - 1)) + 1;
        const mushroom = {
            id: Date.now() + i,
            type: types[typeIndex],
            name: names[typeIndex] || 'Редкий гриб',
            power: powerBonus,
            level: 1,
            rarity: typeIndex === 0 ? 'common' : typeIndex < 3 ? 'rare' : typeIndex < 5 ? 'epic' : 'legendary'
        };
        
        mushroomCollection.push(mushroom);
        mushroomPower += powerBonus;
        totalPower += powerBonus;
        
        if (mushroom.rarity === 'legendary') legendaryCount++;
        else if (mushroom.rarity === 'epic') epicCount++;
        else if (mushroom.rarity === 'rare') rareCount++;
    }
    
    // Обновление квестов
    mushroomQuests.forEach(q => {
        if (q.type === 'summon' && !q.completed) {
            q.current = (q.current || 0) + 10;
        }
    });
    checkAchievements();
    updateMushroomUI();
    saveMushroomData();
    
    alert(`🍄 Призвано 10 грибов!\n+${totalPower} к силе!\n🌟 Легендарных: ${legendaryCount}\n💜 Эпических: ${epicCount}\n💎 Редких: ${rareCount}`);
}

function summonMushroomX100() {
    const cost = 9000; // Скидка за массовую покупку
    if (mushroomCoins < cost) {
        alert(`Недостаточно монет! Нужно ${cost}💰`);
        return;
    }
    
    mushroomCoins -= cost;
    let totalPower = 0;
    let legendaryCount = 0;
    let epicCount = 0;
    let rareCount = 0;
    
    for (let i = 0; i < 100; i++) {
        const types = ['🍄', '🍄', '🍄', '🍄', '🍄', '🟫', '🔴', '🟣', '🟡', '🔵'];
        const names = ['Обычный гриб', 'Коричневый гриб', 'Красный гриб', 'Фиолетовый гриб', 'Жёлтый гриб', 'Синий гриб'];
        const powerBonus = Math.floor(Math.random() * 20) + 5;
        
        const typeIndex = Math.random() < 0.7 ? 0 : Math.floor(Math.random() * (types.length - 1)) + 1;
        const mushroom = {
            id: Date.now() + i,
            type: types[typeIndex],
            name: names[typeIndex] || 'Редкий гриб',
            power: powerBonus,
            level: 1,
            rarity: typeIndex === 0 ? 'common' : typeIndex < 3 ? 'rare' : typeIndex < 5 ? 'epic' : 'legendary'
        };
        
        mushroomCollection.push(mushroom);
        mushroomPower += powerBonus;
        totalPower += powerBonus;
        
        if (mushroom.rarity === 'legendary') legendaryCount++;
        else if (mushroom.rarity === 'epic') epicCount++;
        else if (mushroom.rarity === 'rare') rareCount++;
    }
    
    // Обновление квестов
    mushroomQuests.forEach(q => {
        if (q.type === 'summon' && !q.completed) {
            q.current = (q.current || 0) + 100;
        }
    });
    checkAchievements();
    updateMushroomUI();
    saveMushroomData();
    
    alert(`🍄 Призвано 100 грибов!\n+${totalPower} к силе!\n🌟 Легендарных: ${legendaryCount}\n💜 Эпических: ${epicCount}\n💎 Редких: ${rareCount}`);
}

function showMushroomCollection() {
    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #111; border: 4px solid #00ff00; padding: 20px; z-index: 10000; max-width: 600px; max-height: 80vh; overflow-y: auto;';
    modal.innerHTML = `
        <h2 style="color: #00ff00; margin-bottom: 15px;">📚 КОЛЛЕКЦИЯ ГРИБОВ (${mushroomCollection.length})</h2>
        <div id="collectionList" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px;"></div>
        <button class="music-btn" onclick="this.parentElement.remove()" style="margin-top: 15px;">ЗАКРЫТЬ</button>
    `;
    
    const list = modal.querySelector('#collectionList');
    if (mushroomCollection.length === 0) {
        list.innerHTML = '<div style="color: #888;">Коллекция пуста. Призовите грибов!</div>';
    } else {
        mushroomCollection.forEach((mushroom, index) => {
            const card = document.createElement('div');
            card.style.cssText = 'background: #222; border: 2px solid #00ff00; padding: 10px; text-align: center;';
            const mushroomAscii = getMushroomAscii(mushroom.rarity);
            const rarityColor = mushroom.rarity === 'legendary' ? '#ffd700' : mushroom.rarity === 'epic' ? '#ff00ff' : mushroom.rarity === 'rare' ? '#00ffff' : '#00ff00';
            card.innerHTML = `
                <pre style="font-family: 'Courier New', monospace; font-size: 0.35em; color: ${rarityColor}; text-align: center; margin: 5px 0; line-height: 1.1; background: #000; padding: 5px; border: 1px solid ${rarityColor};">${mushroomAscii}</pre>
                <div style="font-size: 2em;">${mushroom.type}</div>
                <div style="font-size: 0.9em; margin-top: 5px;">${mushroom.name}</div>
                <div style="font-size: 0.8em; color: #aaa;">⚡ +${mushroom.power}</div>
                <div style="font-size: 0.8em; color: #aaa;">⭐ Ур. ${mushroom.level}</div>
            `;
            list.appendChild(card);
        });
    }
    
    document.body.appendChild(modal);
}

function evolveMushrooms() {
    if (mushroomCollection.length < 3) {
        alert('Нужно минимум 3 гриба для эволюции!');
        return;
    }
    
    const totalPower = mushroomCollection.reduce((sum, m) => sum + m.power, 0);
    const evolvedPower = Math.floor(totalPower * 1.5);
    
    // Удаляем 3 гриба
    mushroomCollection.splice(0, 3);
    
    // Создаём эволюционированный гриб
    const evolved = {
        id: Date.now(),
        type: '✨',
        name: 'Эволюционированный гриб',
        power: evolvedPower,
        level: 2,
        rarity: 'epic'
    };
    
    mushroomCollection.push(evolved);
    mushroomPower = mushroomPower - totalPower + evolvedPower;
    
    // Обновление статистики для достижений
    if (!stats.mushroomEvolves) stats.mushroomEvolves = 0;
    stats.mushroomEvolves++;
    localStorage.setItem('stats', JSON.stringify(stats));
    
    updateMushroomUI();
    saveMushroomData();
    checkAchievements();
    alert(`✨ Эволюция! Получен ${evolved.type} ${evolved.name}!\n+${evolvedPower} силы!`);
    startMushrooms();
}

function startMushroomAdventure() {
    const requiredPower = mushroomAdventureStage * 1000;
    const totalPower = mushroomCollection.reduce((sum, m) => sum + (m.power || 0), 0) + mushroomPower;
    
    if (totalPower < requiredPower) {
        alert(`💀 Недостаточно силы! Нужно ${requiredPower}, у вас ${totalPower}`);
        return;
    }
    
    const isBoss = mushroomAdventureStage % 5 === 0;
    const reward = Math.floor(requiredPower * (isBoss ? 3 : 1.5));
    
    mushroomCoins += reward;
    mushroomLevel++;
    
    if (isBoss) {
        mushroomSkillPoints++;
        alert(`👑 Победа над БОССОМ стадии ${mushroomAdventureStage}!\n+${reward}💰, +1 очко навыков!`);
    } else {
        alert(`🎉 Победа на стадии ${mushroomAdventureStage}!\n+${reward}💰`);
    }
    
    mushroomAdventureStage++;
    
    // Обновление квестов
    mushroomQuests.forEach(q => {
        if (q.type === 'adventure' && !q.completed) {
            q.current = (q.current || 0) + 1;
        }
    });
    
    checkAchievements();
    updateMushroomUI();
    saveMushroomData();
    startMushrooms();
}

function showMushroomSkills() {
    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #111; border: 4px solid #00ff00; padding: 20px; z-index: 10000; max-width: 500px;';
    modal.innerHTML = `
        <h2 style="color: #00ff00; margin-bottom: 15px;">⚡ НАВЫКИ</h2>
        <div style="color: #aaa; margin-bottom: 15px;">Очки навыков: <span id="skillPointsDisplay">${mushroomSkillPoints}</span></div>
        <div style="margin-bottom: 15px;">
            <div style="margin-bottom: 10px;">⚡ Усиление клика (+10% силы) - 1 очко</div>
            <button class="music-btn" onclick="buyMushroomSkill('click')" style="width: 100%;">Купить</button>
        </div>
        <div style="margin-bottom: 15px;">
            <div style="margin-bottom: 10px;">🤖 Усиление авто-клика (+20% скорости) - 1 очко</div>
            <button class="music-btn" onclick="buyMushroomSkill('auto')" style="width: 100%;">Купить</button>
        </div>
        <div style="margin-bottom: 15px;">
            <div style="margin-bottom: 10px;">💎 Удвоение наград (+100% монет) - 2 очка</div>
            <button class="music-btn" onclick="buyMushroomSkill('coins')" style="width: 100%;">Купить</button>
        </div>
        <button class="music-btn" onclick="this.parentElement.remove()">ЗАКРЫТЬ</button>
    `;
    
    document.body.appendChild(modal);
}

function buyMushroomSkill(skillType) {
    const costs = {click: 1, auto: 1, coins: 2};
    const cost = costs[skillType];
    
    if (mushroomSkillPoints < cost) {
        alert('Недостаточно очков навыков!');
        return;
    }
    
    mushroomSkillPoints -= cost;
    
    if (skillType === 'click') {
        mushroomPower = Math.floor(mushroomPower * 1.1);
        alert('⚡ Навык "Усиление клика" куплен!');
    } else if (skillType === 'auto') {
        mushroomAutoClick = Math.floor(mushroomAutoClick * 1.2);
        alert('🤖 Навык "Усиление авто-клика" куплен!');
    } else if (skillType === 'coins') {
        // Умножение наград сохраняется глобально
        alert('💎 Навык "Удвоение наград" куплен!');
    }
    
    saveMushroomData();
    updateMushroomUI();
    showMushroomSkills();
}

function buyMushroomSkillPoint() {
    const cost = mushroomSkillPoints * 100 + 100;
    if (mushroomCoins < cost) {
        alert('Недостаточно монет!');
        return;
    }
    mushroomCoins -= cost;
    mushroomSkillPoints++;
    updateMushroomUI();
    saveMushroomData();
    startMushrooms();
}

function updateMushroomUI() {
    const coinsEl = document.getElementById('mushroomCoins');
    const powerEl = document.getElementById('mushroomPower');
    const autoEl = document.getElementById('mushroomAuto');
    const totalPower = mushroomCollection.reduce((sum, m) => sum + (m.power || 0), 0) + mushroomPower;
    const autoValue = Math.floor(mushroomAutoClick * mushroomUpgrades.autoMultiplier * (mushroomPrestige + 1));
    
    if (coinsEl) coinsEl.textContent = mushroomCoins.toLocaleString();
    if (powerEl) powerEl.textContent = totalPower.toLocaleString();
    if (autoEl) autoEl.textContent = autoValue.toLocaleString();
}

function startMushroomAutoClick() {
    setInterval(() => {
        if (mushroomAutoClick > 0 && document.getElementById('mushroomCoins')) {
            const prestigeBonus = (mushroomPrestige + 1);
            const coins = Math.floor((mushroomAutoClick * mushroomUpgrades.autoMultiplier) * prestigeBonus);
            mushroomCoins += coins;
            updateMushroomUI();
            saveMushroomData();
        }
    }, 1000);
}

function upgradeClickMultiplier() {
    const cost = Math.floor(mushroomUpgrades.clickMultiplier * 1000);
    if (mushroomCoins < cost) {
        alert('Недостаточно монет!');
        return;
    }
    mushroomCoins -= cost;
    mushroomUpgrades.clickMultiplier *= 2;
    saveMushroomData();
    startMushrooms();
}

function upgradeAutoMultiplier() {
    const cost = Math.floor(mushroomUpgrades.autoMultiplier * 2000);
    if (mushroomCoins < cost) {
        alert('Недостаточно монет!');
        return;
    }
    mushroomCoins -= cost;
    mushroomUpgrades.autoMultiplier *= 2;
    saveMushroomData();
    startMushrooms();
}

function startMushroomTournament() {
    const totalPower = mushroomCollection.reduce((sum, m) => sum + (m.power || 0), 0) + mushroomPower;
    
    if (totalPower < 5000) {
        alert('Нужно минимум 5000 силы для участия в турнире!');
        return;
    }
    
    const tournamentTier = Math.floor(mushroomTournamentWins / 5) + 1;
    const enemyPower = tournamentTier * 3000 + Math.floor(Math.random() * 2000);
    
    if (totalPower > enemyPower) {
        mushroomTournamentWins++;
        const reward = tournamentTier * 1000;
        mushroomCoins += reward;
        mushroomSkillPoints += Math.floor(tournamentTier / 3);
        alert(`🏆 Победа в турнире грибов! +${reward}💰, +${Math.floor(tournamentTier / 3)} очков навыков!\nВсего побед: ${mushroomTournamentWins}`);
        
        // Обновление квестов
        mushroomQuests.forEach(q => {
            if (q.type === 'tournament' && !q.completed) {
                q.current = (q.current || 0) + 1;
            }
        });
        
        saveMushroomData();
        updateMushroomUI();
        startMushrooms();
    } else {
        alert(`💀 Поражение в турнире! Враги слишком сильны (${enemyPower} vs ${totalPower})`);
    }
}

function mushroomPrestigeReset() {
    if (confirm(`Престиж даст бонус x${mushroomPrestige + 1} ко всем наградам, но сбросит уровень и монеты. Продолжить?`)) {
        mushroomPrestige++;
        const bonus = mushroomPrestige;
        mushroomCoins = 0;
        mushroomLevel = 1;
        mushroomPower = 1 * bonus;
        mushroomAutoClick = 0;
        mushroomCollection = [];
        mushroomAdventureStage = 1;
        alert(`👑 Престиж ${mushroomPrestige}! Бонус x${mushroomPrestige + 1} активирован!`);
        checkAchievements();
        saveMushroomData();
        startMushrooms();
    }
}

function saveMushroomData() {
    localStorage.setItem('mushroomLevel', mushroomLevel.toString());
    localStorage.setItem('mushroomCoins', mushroomCoins.toString());
    localStorage.setItem('mushroomPower', mushroomPower.toString());
    localStorage.setItem('mushroomAutoClick', mushroomAutoClick.toString());
    localStorage.setItem('mushroomCollection', JSON.stringify(mushroomCollection));
    localStorage.setItem('mushroomAdventureStage', mushroomAdventureStage.toString());
    localStorage.setItem('mushroomSkillPoints', mushroomSkillPoints.toString());
    localStorage.setItem('mushroomPrestige', mushroomPrestige.toString());
    localStorage.setItem('mushroomTournamentWins', mushroomTournamentWins.toString());
    localStorage.setItem('mushroomUpgrades', JSON.stringify(mushroomUpgrades));
    localStorage.setItem('mushroomDailyReward', JSON.stringify(mushroomDailyReward));
    localStorage.setItem('mushroomQuests', JSON.stringify(mushroomQuests));
}

// ========== МУЗЫКАЛЬНЫЙ ПЛЕЕР ==========
const musicTracks = [
    {title: '8-bit Adventure', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'},
    {title: 'Retro Game', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'},
    {title: 'Pixel Dreams', url: 'https://freepd.com/upfiles/Four_Seasons.mp3'},
];

let currentTrack = 0;
let isPlaying = false;

function toggleMusic() {
    const audio = document.getElementById('backgroundMusic');
    const btn = document.getElementById('musicToggle');
    
    if (isPlaying) {
        audio.pause();
        btn.textContent = '▶️ ВКЛЮЧИТЬ';
        isPlaying = false;
    } else {
        audio.play().catch(e => console.log('Автозапуск музыки заблокирован'));
        btn.textContent = '⏸️ ПАУЗА';
        isPlaying = true;
    }
}

function changeTrack() {
    currentTrack = (currentTrack + 1) % musicTracks.length;
    const audio = document.getElementById('backgroundMusic');
    const title = document.getElementById('musicTitle');
    
    audio.src = musicTracks[currentTrack].url;
    if (title) title.textContent = musicTracks[currentTrack].title;
    
    if (isPlaying) {
        audio.play().catch(e => console.log('Ошибка воспроизведения'));
    }
}

function setVolume(value) {
    const audio = document.getElementById('backgroundMusic');
    audio.volume = value / 100;
    document.getElementById('volumeValue').textContent = value + '%';
}


// ========== НОВЫЕ СЕКЦИИ КОНТЕНТА ==========

// Коллекция тем
function renderThemeCollection() {
    const grid = document.getElementById('themeCollectionGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    themes.forEach(theme => {
        const isOwned = ownedThemes.includes(theme.id);
        const card = document.createElement('div');
        card.className = `theme-collection-item ${isOwned ? 'owned' : 'locked'}`;
        card.innerHTML = `
            <div class="theme-collection-icon" style="${theme.styles.body || ''}">${theme.icon}</div>
            <div class="theme-collection-name">${theme.name}</div>
            ${isOwned ? '<div class="theme-collection-check">✓</div>' : '<div class="theme-collection-lock">🔒</div>'}
        `;
        grid.appendChild(card);
    });
}

// Мини-игры
let clickerScore = 0;
let clickerTimer = 10;

function startClickerMiniGame() {
    clickerScore = 0;
    clickerTimer = 10;
    const area = document.getElementById('minigameArea');
    area.classList.remove('hidden');
    area.innerHTML = `
        <h3>🖱️ КЛИКЕР - Кликайте как можно быстрее!</h3>
        <div style="text-align: center;">
            <div style="font-size: 3em; margin: 20px 0;">Счёт: <span id="clickerScore">0</span></div>
            <div style="font-size: 2em;">Время: <span id="clickerTimer">10</span></div>
            <button class="minigame-click-btn" onclick="clickerClick()" style="font-size: 2em; padding: 20px 50px; margin: 20px;">КЛИК!</button>
        </div>
        <button class="fun-btn" onclick="document.getElementById('minigameArea').classList.add('hidden')">ЗАКРЫТЬ</button>
    `;
    
    const timer = setInterval(() => {
        clickerTimer--;
        const timerEl = document.getElementById('clickerTimer');
        if (timerEl) timerEl.textContent = clickerTimer;
        
        if (clickerTimer <= 0) {
            clearInterval(timer);
            alert(`Игра окончена! Ваш счёт: ${clickerScore}`);
            const reward = Math.floor(clickerScore / 10);
            if (reward > 0) {
                const arenaCoins = parseInt(localStorage.getItem('arenaCoins') || '1000');
                localStorage.setItem('arenaCoins', (arenaCoins + reward).toString());
                alert(`Награда: +${reward}💰`);
                updateStats();
            }
            area.classList.add('hidden');
        }
    }, 1000);
}

function clickerClick() {
    clickerScore++;
    const scoreEl = document.getElementById('clickerScore');
    if (scoreEl) scoreEl.textContent = clickerScore;
}

function startMemoryGame() {
    const cards = ['🎮', '🎮', '🎯', '🎯', '🏆', '🏆', '⭐', '⭐'];
    cards.sort(() => Math.random() - 0.5);
    let flipped = [];
    let matched = 0;
    
    const area = document.getElementById('minigameArea');
    area.classList.remove('hidden');
    area.innerHTML = `
        <h3>🧠 ИГРА НА ПАМЯТЬ</h3>
        <div class="memory-grid" id="memoryGrid"></div>
        <div>Пар найдено: <span id="memoryMatches">0</span>/4</div>
        <button class="fun-btn" onclick="document.getElementById('minigameArea').classList.add('hidden')">ЗАКРЫТЬ</button>
    `;
    
    const grid = document.getElementById('memoryGrid');
    cards.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'memory-card';
        cardEl.dataset.index = index;
        cardEl.dataset.card = card;
        cardEl.textContent = '?';
        cardEl.onclick = () => {
            if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;
            cardEl.classList.add('flipped');
            cardEl.textContent = card;
            flipped.push({element: cardEl, card: card});
            
            if (flipped.length === 2) {
                if (flipped[0].card === flipped[1].card) {
                    flipped[0].element.classList.add('matched');
                    flipped[1].element.classList.add('matched');
                    matched++;
                    document.getElementById('memoryMatches').textContent = matched;
                    if (matched === 4) {
                        const reward = 100;
                        const arenaCoins = parseInt(localStorage.getItem('arenaCoins') || '1000');
                        localStorage.setItem('arenaCoins', (arenaCoins + reward).toString());
                        alert(`Победа! Награда: +${reward}💰`);
                        updateStats();
                    }
                } else {
                    setTimeout(() => {
                        flipped[0].element.classList.remove('flipped');
                        flipped[0].element.textContent = '?';
                        flipped[1].element.classList.remove('flipped');
                        flipped[1].element.textContent = '?';
                    }, 1000);
                }
                flipped = [];
            }
        };
        grid.appendChild(cardEl);
    });
}

function startReactionGame() {
    const area = document.getElementById('minigameArea');
    area.classList.remove('hidden');
    area.innerHTML = `
        <h3>⚡ ТЕСТ РЕАКЦИИ</h3>
        <div style="text-align: center; margin: 50px 0;">
            <div id="reactionBox" style="width: 200px; height: 200px; margin: 0 auto; background: #ccc; border: 5px solid #000; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 2em;">ЖДИ...</div>
        </div>
        <div>Реакция: <span id="reactionTime">-</span> мс</div>
        <button class="fun-btn" onclick="document.getElementById('minigameArea').classList.add('hidden')">ЗАКРЫТЬ</button>
    `;
    
    const box = document.getElementById('reactionBox');
    let startTime;
    let waiting = true;
    
    setTimeout(() => {
        box.style.background = '#00ff00';
        box.textContent = 'КЛИК!';
        startTime = Date.now();
        waiting = false;
        box.onclick = () => {
            if (!waiting) {
                const reactionTime = Date.now() - startTime;
                document.getElementById('reactionTime').textContent = reactionTime;
                if (reactionTime < 300) {
                    const reward = 50;
                    const arenaCoins = parseInt(localStorage.getItem('arenaCoins') || '1000');
                    localStorage.setItem('arenaCoins', (arenaCoins + reward).toString());
                    alert(`Отлично! Награда: +${reward}💰`);
                    updateStats();
                }
                waiting = true;
                box.style.background = '#ccc';
                box.textContent = 'ЖДИ...';
                setTimeout(() => {
                    box.style.background = '#00ff00';
                    box.textContent = 'КЛИК!';
                    startTime = Date.now();
                    waiting = false;
                }, Math.random() * 3000 + 1000);
            }
        };
    }, Math.random() * 3000 + 1000);
}

function startNumberGuess() {
    const target = Math.floor(Math.random() * 100) + 1;
    let attempts = 0;
    
    const area = document.getElementById('minigameArea');
    area.classList.remove('hidden');
    area.innerHTML = `
        <h3>🔢 УГАДАЙ ЧИСЛО (1-100)</h3>
        <input type="number" id="numberGuess" min="1" max="100" style="font-size: 2em; padding: 10px; text-align: center; margin: 20px;">
        <button class="fun-btn" onclick="checkGuess(${target})">ПРОВЕРИТЬ</button>
        <div id="guessHint" style="margin: 20px; font-size: 1.5em;"></div>
        <button class="fun-btn" onclick="document.getElementById('minigameArea').classList.add('hidden')">ЗАКРЫТЬ</button>
    `;
    
    window.checkGuess = (targetNum) => {
        attempts++;
        const guess = parseInt(document.getElementById('numberGuess').value);
        const hint = document.getElementById('guessHint');
        
        if (guess === targetNum) {
            const reward = Math.max(100 - attempts * 10, 20);
            const arenaCoins = parseInt(localStorage.getItem('arenaCoins') || '1000');
            localStorage.setItem('arenaCoins', (arenaCoins + reward).toString());
            hint.textContent = `Угадали! Попыток: ${attempts}. Награда: +${reward}💰`;
            updateStats();
            setTimeout(() => startNumberGuess(), 2000);
        } else if (guess < targetNum) {
            hint.textContent = 'Больше!';
        } else {
            hint.textContent = 'Меньше!';
        }
    };
}

function startColorMatch() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    let targetColor = colors[Math.floor(Math.random() * colors.length)];
    let score = 0;
    let timeLeft = 30;
    
    const area = document.getElementById('minigameArea');
    area.classList.remove('hidden');
    area.innerHTML = `
        <h3>🎨 СООТВЕТСТВИЕ ЦВЕТОВ</h3>
        <div style="text-align: center;">
            <div style="width: 200px; height: 200px; margin: 20px auto; background: ${targetColor}; border: 5px solid #000;"></div>
            <div>Время: <span id="colorTimer">30</span> | Счёт: <span id="colorScore">0</span></div>
            <div class="color-options" id="colorOptions"></div>
        </div>
        <button class="fun-btn" onclick="document.getElementById('minigameArea').classList.add('hidden')">ЗАКРЫТЬ</button>
    `;
    
    const options = document.getElementById('colorOptions');
    colors.forEach(color => {
        const btn = document.createElement('button');
        btn.style.cssText = `width: 80px; height: 80px; background: ${color}; border: 3px solid #000; margin: 5px; cursor: pointer;`;
        btn.onclick = () => {
            if (color === targetColor) {
                score++;
                document.getElementById('colorScore').textContent = score;
                const newColor = colors[Math.floor(Math.random() * colors.length)];
                document.querySelector('div[style*="width: 200px"]').style.background = newColor;
                targetColor = newColor;
            }
        };
        options.appendChild(btn);
    });
    
    const timer = setInterval(() => {
        timeLeft--;
        document.getElementById('colorTimer').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            const reward = score * 10;
            if (reward > 0) {
                const arenaCoins = parseInt(localStorage.getItem('arenaCoins') || '1000');
                localStorage.setItem('arenaCoins', (arenaCoins + reward).toString());
                alert(`Игра окончена! Счёт: ${score}. Награда: +${reward}💰`);
                updateStats();
            }
            area.classList.add('hidden');
        }
    }, 1000);
}

function startTypingGame() {
    const words = ['ЕГОР', 'СОЛДАТ', 'АРМИЯ', 'ДОМ', 'ВОЗВРАЩЕНИЕ', 'ПОБЕДА', 'СИЛА', 'МУЖЕСТВО'];
    let currentWord = words[Math.floor(Math.random() * words.length)];
    let score = 0;
    
    const area = document.getElementById('minigameArea');
    area.classList.remove('hidden');
    area.innerHTML = `
        <h3>⌨️ ПЕЧАТЬ - Напечатайте слово!</h3>
        <div id="typingWord" style="text-align: center; font-size: 2em; margin: 20px 0;">${currentWord}</div>
        <input type="text" id="typingInput" style="font-size: 1.5em; padding: 10px; text-align: center; width: 300px;">
        <div>Счёт: <span id="typingScore">0</span></div>
        <button class="fun-btn" onclick="document.getElementById('minigameArea').classList.add('hidden')">ЗАКРЫТЬ</button>
    `;
    
    const input = document.getElementById('typingInput');
    input.oninput = () => {
        if (input.value.toUpperCase() === currentWord) {
            score++;
            document.getElementById('typingScore').textContent = score;
            input.value = '';
            currentWord = words[Math.floor(Math.random() * words.length)];
            document.getElementById('typingWord').textContent = currentWord;
            
            if (score > 0 && score % 5 === 0) {
                const reward = score * 5;
                const arenaCoins = parseInt(localStorage.getItem('arenaCoins') || '1000');
                localStorage.setItem('arenaCoins', (arenaCoins + reward).toString());
                alert(`Награда: +${reward}💰`);
                updateStats();
            }
        }
    };
}

// Рейтинг
function showLeaderboard(type) {
    const content = document.getElementById('leaderboardContent');
    const tabs = document.querySelectorAll('.leaderboard-tab');
    
    tabs.forEach(t => {
        t.classList.remove('active');
        if (t.dataset.type === type) {
            t.classList.add('active');
        }
    });
    
    const arenaHeroes = JSON.parse(localStorage.getItem('arenaHeroes') || '[]');
    const mushroomPower = parseInt(localStorage.getItem('mushroomPower') || '0');
    const arenaCoins = parseInt(localStorage.getItem('arenaCoins') || '1000');
    const mushroomCoins = parseInt(localStorage.getItem('mushroomCoins') || '0');
    const unlockedAchievementsList = JSON.parse(localStorage.getItem('achievements') || '[]');
    
    let data = [];
    if (type === 'total') {
        data = [
            {label: 'Общая валюта', value: (arenaCoins + mushroomCoins).toLocaleString(), icon: '💰'},
            {label: 'Героев в AFK', value: arenaHeroes.length, icon: '⚔️'},
            {label: 'Сила грибов', value: mushroomPower.toLocaleString(), icon: '🍄'},
            {label: 'Достижения', value: unlockedAchievementsList.length, icon: '🏆'},
        ];
    } else if (type === 'arena') {
        data = [
            {label: 'Героев', value: arenaHeroes.length, icon: '👥'},
            {label: 'Монет', value: arenaCoins.toLocaleString(), icon: '💰'},
            {label: 'Стадий', value: parseInt(localStorage.getItem('arenaStage') || '1'), icon: '📖'},
            {label: 'Турниров', value: parseInt(localStorage.getItem('arenaTournamentWins') || '0'), icon: '🏆'},
        ];
    } else if (type === 'mushroom') {
        data = [
            {label: 'Сила', value: mushroomPower.toLocaleString(), icon: '⚡'},
            {label: 'Монет', value: mushroomCoins.toLocaleString(), icon: '💰'},
            {label: 'Уровень', value: parseInt(localStorage.getItem('mushroomLevel') || '1'), icon: '⭐'},
            {label: 'Коллекция', value: JSON.parse(localStorage.getItem('mushroomCollection') || '[]').length, icon: '🍄'},
        ];
    } else {
        data = [
            {label: 'Разблокировано', value: unlockedAchievementsList.length, icon: '🏆'},
            {label: 'Всего достижений', value: achievements.length, icon: '📊'},
            {label: 'Прогресс', value: Math.floor((unlockedAchievementsList.length / achievements.length) * 100) + '%', icon: '📈'},
        ];
    }
    
    content.innerHTML = data.map((item, index) => `
        <div class="leaderboard-item">
            <span class="leaderboard-rank">${index + 1}</span>
            <span class="leaderboard-icon">${item.icon}</span>
            <span class="leaderboard-label">${item.label}</span>
            <span class="leaderboard-value">${item.value}</span>
        </div>
    `).join('');
}

// Галерея прогресса
function renderProgressGallery() {
    const gallery = document.getElementById('progressGallery');
    if (!gallery) return;
    
    const milestones = [
        {icon: '🌅', title: 'Начало пути', desc: 'Первый день'},
        {icon: '📅', title: 'Неделя', desc: '7 дней'},
        {icon: '📆', title: 'Месяц', desc: '30 дней'},
        {icon: '🎯', title: '100 дней', desc: 'Сотня!'},
        {icon: '🎪', title: 'Полпути', desc: '182 дня'},
        {icon: '🌟', title: 'Полгода', desc: '183 дня'},
    ];
    
    gallery.innerHTML = '';
    const now = new Date();
    const elapsed = Math.floor((now - departureDate) / (1000 * 60 * 60 * 24));
    
    milestones.forEach(milestone => {
        const days = milestone.desc.match(/\d+/);
        const achieved = days && elapsed >= parseInt(days[0]);
        
        const card = document.createElement('div');
        card.className = `gallery-card ${achieved ? 'achieved' : ''}`;
        card.innerHTML = `
            <div class="gallery-icon">${milestone.icon}</div>
            <div class="gallery-title">${milestone.title}</div>
            <div class="gallery-desc">${milestone.desc}</div>
            ${achieved ? '<div class="gallery-check">✓</div>' : '<div class="gallery-lock">🔒</div>'}
        `;
        gallery.appendChild(card);
    });
}

// История активности
function renderActivityHistory() {
    const timeline = document.getElementById('historyTimeline');
    if (!timeline) return;
    
    const activities = JSON.parse(localStorage.getItem('activityHistory') || '[]');
    if (activities.length === 0) {
        timeline.innerHTML = '<p style="text-align: center; padding: 20px;">История пуста. Начните играть!</p>';
        return;
    }
    
    timeline.innerHTML = activities.slice(-10).reverse().map(activity => `
        <div class="history-item">
            <div class="history-icon">${activity.icon || '📝'}</div>
            <div class="history-content">
                <div class="history-text">${activity.text}</div>
                <div class="history-time">${activity.time}</div>
            </div>
        </div>
    `).join('');
}

// Еженедельные задания
function renderWeeklyQuests() {
    const grid = document.getElementById('weeklyQuestsGrid');
    if (!grid) return;
    
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekKey = weekStart.toDateString();
    
    let weeklyQuests = JSON.parse(localStorage.getItem('weeklyQuests') || '[]');
    if (!weeklyQuests.length || weeklyQuests[0].weekKey !== weekKey) {
        weeklyQuests = [
            {id: 1, text: 'Получить 5 достижений', progress: 0, target: 5, reward: 500, icon: '🏆'},
            {id: 2, text: 'Играть 60 минут', progress: 0, target: 60, reward: 300, icon: '⏱️'},
            {id: 3, text: 'Собрать 10000 валюты', progress: 0, target: 10000, reward: 1000, icon: '💰'},
            {id: 4, text: 'Заходить 7 дней подряд', progress: 0, target: 7, reward: 700, icon: '📅'},
        ];
        weeklyQuests.forEach(q => q.weekKey = weekKey);
    }
    
    grid.innerHTML = '';
    let totalProgress = 0;
    
    weeklyQuests.forEach(quest => {
        const progress = (quest.progress / quest.target) * 100;
        totalProgress += progress;
        
        const card = document.createElement('div');
        card.className = `weekly-quest-card ${quest.progress >= quest.target ? 'completed' : ''}`;
        card.innerHTML = `
            <div class="weekly-quest-icon">${quest.icon}</div>
            <div class="weekly-quest-text">${quest.text}</div>
            <div class="weekly-quest-progress">${quest.progress}/${quest.target}</div>
            <div class="weekly-quest-reward">Награда: ${quest.reward}💰</div>
            ${quest.progress >= quest.target ? '<button class="weekly-claim-btn" onclick="claimWeeklyQuest(' + quest.id + ')">ПОЛУЧИТЬ</button>' : ''}
        `;
        grid.appendChild(card);
    });
    
    const avgProgress = totalProgress / weeklyQuests.length;
    document.getElementById('weeklyProgress').style.width = avgProgress + '%';
    document.getElementById('weeklyProgressText').textContent = Math.floor(avgProgress) + '%';
    
    localStorage.setItem('weeklyQuests', JSON.stringify(weeklyQuests));
}

function claimWeeklyQuest(questId) {
    const weeklyQuests = JSON.parse(localStorage.getItem('weeklyQuests') || '[]');
    const quest = weeklyQuests.find(q => q.id === questId);
    if (!quest || quest.progress < quest.target) return;
    
    const arenaCoins = parseInt(localStorage.getItem('arenaCoins') || '1000');
    localStorage.setItem('arenaCoins', (arenaCoins + quest.reward).toString());
    
    quest.claimed = true;
    localStorage.setItem('weeklyQuests', JSON.stringify(weeklyQuests));
    alert(`Награда получена: +${quest.reward}💰`);
    updateStats();
    renderWeeklyQuests();
}

// Специальные события
function renderSpecialEvents() {
    const grid = document.getElementById('specialEventsGrid');
    if (!grid) return;
    
    const events = [
        {icon: '🎄', name: 'Новогоднее событие', desc: 'Двойные награды!', active: false},
        {icon: '💝', name: 'День святого Валентина', desc: 'Бонусная валюта', active: false},
        {icon: '🎃', name: 'Хэллоуин', desc: 'Особые темы', active: false},
    ];
    
    grid.innerHTML = events.map(event => `
        <div class="special-event-card ${event.active ? 'active' : ''}">
            <div class="special-event-icon">${event.icon}</div>
            <div class="special-event-name">${event.name}</div>
            <div class="special-event-desc">${event.desc}</div>
            ${event.active ? '<div class="special-event-active">АКТИВНО</div>' : '<div class="special-event-coming">СКОРО</div>'}
        </div>
    `).join('');
}

// ========== UX/UI УЛУЧШЕНИЯ ==========

// Улучшенные уведомления (Toast)
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toastSlideIn 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Индикатор загрузки
function showLoading(text = 'Загрузка...') {
    const indicator = document.getElementById('loadingIndicator');
    if (!indicator) return;
    
    const textEl = indicator.querySelector('.loading-text');
    if (textEl) textEl.textContent = text;
    
    indicator.classList.remove('hidden');
}

function hideLoading() {
    const indicator = document.getElementById('loadingIndicator');
    if (indicator) indicator.classList.add('hidden');
}

// Кнопка "Наверх"
function initScrollToTop() {
    const btn = document.getElementById('scrollToTop');
    if (!btn) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            btn.classList.remove('hidden');
        } else {
            btn.classList.add('hidden');
        }
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Прокрутка к секции
function scrollToSection(sectionId) {
    const sections = {
        'countdown': '#countdown-section',
        'achievements': '#achievements',
        'gacha': '#gacha',
        'shop': '#shop',
        'minigames': '#minigames'
    };
    
    const selector = sections[sectionId];
    if (!selector) return;
    
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Визуальная индикация активной секции
        element.style.animation = 'highlightSection 1s ease-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 1000);
    }
}

// Добавление подсказок ко всем кнопкам
function addTooltips() {
    document.querySelectorAll('button').forEach(btn => {
        if (!btn.title && btn.textContent.trim()) {
            btn.setAttribute('data-tooltip', btn.textContent.trim());
        }
    });
}

// Улучшенные alert заменяем на Toast
const originalAlert = window.alert;
window.alert = function(message) {
    if (message.includes('💰') || message.includes('Награда') || message.includes('получен')) {
        showToast(message, 'success', 4000);
    } else if (message.includes('Ошибка') || message.includes('Недостаточно')) {
        showToast(message, 'error', 4000);
    } else {
        showToast(message, 'info', 3000);
    }
    // Также показываем оригинальный alert для важных сообщений
    // originalAlert(message);
};

// Улучшенная визуальная обратная связь для кликов
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        // Эффект пульсации
        e.target.style.transform = 'scale(0.95)';
        setTimeout(() => {
            e.target.style.transform = '';
        }, 150);
        
        // Эффект частиц при клике отключен
    }
});

// Создание частиц при клике
function createClickParticles(x, y) {
    const particles = ['✨', '⭐', '💫', '🌟', '🎆'];
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.className = 'click-particle';
        particle.textContent = particles[Math.floor(Math.random() * particles.length)];
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        const angle = (Math.PI * 2 * i) / 5;
        const distance = 50 + Math.random() * 50;
        particle.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
        particle.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
        
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }
}

// Улучшенная анимация чисел отсчета
let lastCountdownValues = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function animateCountdownNumber(id, newValue) {
    const element = document.getElementById(id);
    if (!element) return;
    
    const type = id.replace(/[0-9]/g, '');
    const lastValue = lastCountdownValues[type] || 0;
    
    if (newValue !== lastValue) {
        element.classList.add('number-pop');
        setTimeout(() => {
            element.classList.remove('number-pop');
        }, 400);
        
        lastCountdownValues[type] = newValue;
    }
}

// Улучшенный эффект печатания для статуса
function typeWriter(element, text, speed = 50) {
    if (!element) return;
    
    element.textContent = '';
    element.classList.add('typewriter');
    
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
            setTimeout(() => {
                element.classList.remove('typewriter');
            }, 1000);
        }
    }, speed);
}

// Параллакс эффект при прокрутке
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Scroll reveal эффекты
function initScrollReveal() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1
    });
    
    reveals.forEach(reveal => observer.observe(reveal));
}

// Отслеживание активной секции для навигации
let currentSection = '';
function updateActiveSection() {
    const sections = document.querySelectorAll('main > div');
    const scrollPos = window.pageYOffset + 100;
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const top = rect.top + window.pageYOffset;
        const bottom = top + rect.height;
        
        if (scrollPos >= top && scrollPos < bottom) {
            const id = section.id || section.className.split(' ')[0];
            if (id && id !== currentSection) {
                currentSection = id;
                // Можно добавить визуальную индикацию активной секции
            }
        }
    });
}

// Плавное появление элементов при прокрутке
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('card-fade-in');
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('main > div').forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
        observer.observe(section);
    });
}

// Улучшенная анимация для карточек достижений
function enhanceAchievementCards() {
    const cards = document.querySelectorAll('.achievement-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05) rotate(1deg)';
            card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Добавление эффекта "нового" для непросмотренных элементов
function markNewElements() {
    const newItems = document.querySelectorAll('[data-new]');
    newItems.forEach(item => {
        item.classList.add('highlight-glow');
        item.addEventListener('click', () => {
            item.classList.remove('highlight-glow');
            item.removeAttribute('data-new');
        }, { once: true });
    });
}

// ========== ЯПОНСКИЕ АНИМАЦИИ ==========
// Анимация сакуры отключена для производительности
function initSakuraAnimation() {
    // Отключено
}

// Инициализация
// Accordion функциональность для мобильных устройств
function initAccordions() {
    if (window.innerWidth <= 768) {
        const accordionSections = document.querySelectorAll('.accordion-section');
        
        accordionSections.forEach(section => {
            // Добавляем начальное состояние - все свернуты, кроме countdown
            if (!section.classList.contains('countdown-section')) {
                section.classList.add('collapsed');
            }
            
            const header = section.querySelector('.accordion-header');
            if (header) {
                header.addEventListener('click', () => {
                    section.classList.toggle('collapsed');
                });
            }
        });
    }
}

// Переинициализация accordion при изменении размера окна
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        initAccordions();
    }, 250);
});

window.addEventListener('load', () => {
    // Таймер уже запущен выше, просто обновляем при загрузке
    updateCountdown();
    renderAchievements();
    checkAchievements();
    
    // Инициализация accordion для мобильных
    initAccordions();
    
    // Летающие эффекты отключены
    
    // Обновляем статистику
    updateStats();
    setInterval(updateStats, 1000);
    
    // Трекинг времени игры
    startPlayTimeTracking();
    
    // Инициализация цитат
    changeQuote();
    setInterval(changeQuote, 10000); // Меняем цитату каждые 10 секунд
    
    // Рендеринг новых секций
    renderThemeCollection();
    renderProgressGallery();
    renderActivityHistory();
    renderWeeklyQuests();
    renderSpecialEvents();
    showLeaderboard('total');
    
    // UX/UI улучшения
    initScrollToTop();
    addTooltips();
    initScrollAnimations();
    enhanceAchievementCards();
    markNewElements();
    initParallaxEffects();
    initScrollReveal();
    
    // Добавляем классы для анимаций
    document.querySelectorAll('h2.glow').forEach(el => {
        el.setAttribute('data-text', el.textContent);
    });
    
    // Отслеживание прокрутки для активной секции
    window.addEventListener('scroll', () => {
        updateActiveSection();
    });
    
    // Обновление карточек достижений при изменении
    const achievementsObserver = new MutationObserver(() => {
        enhanceAchievementCards();
    });
    
    const achievementsContainer = document.getElementById('achievementsList');
    if (achievementsContainer) {
        achievementsObserver.observe(achievementsContainer, {
            childList: true,
            subtree: true
        });
    }
    
    // Обновление новых секций периодически
    setInterval(() => {
        renderThemeCollection();
        renderProgressGallery();
        renderActivityHistory();
        renderWeeklyQuests();
    }, 30000);
    
    // Применяем текущую тему (без алерта при первой загрузке)
    const savedTheme = localStorage.getItem('currentTheme') || 'classic';
    const theme = themes.find(t => t.id === savedTheme);
    if (theme) {
        currentTheme = savedTheme;
        const body = document.body;
        const header = document.querySelector('header');
        
        if (theme.styles.body) {
            body.setAttribute('style', theme.styles.body);
        }
        
        if (theme.styles.header && header) {
            header.setAttribute('style', theme.styles.header);
        }
        
        // Применяем стили к элементам с классом glow
        document.querySelectorAll('.glow').forEach(el => {
            if (theme.styles.glow) {
                el.setAttribute('style', theme.styles.glow);
            }
        });
        
        body.className = body.className.replace(/theme-\w+/g, '');
        body.classList.add(`theme-${savedTheme}`);
        
        // Применяем специальные эффекты темы
        applyThemeFeatures(savedTheme);
        
        const themeNameEl = document.getElementById('currentThemeName');
        if (themeNameEl && theme) themeNameEl.textContent = theme.name;
    }
    
    // Обновление серии входов
    updateLoginStreak();
    
    // Обновление ежедневного бонуса
    const today = new Date().toDateString();
    const lastBonus = localStorage.getItem('lastDailyBonus');
    const bonusCard = document.getElementById('bonusCard');
    if (bonusCard && lastBonus !== today) {
        bonusCard.querySelector('.event-btn').textContent = 'ПОЛУЧИТЬ';
        bonusCard.querySelector('.event-btn').disabled = false;
    } else if (bonusCard) {
        const streak = parseInt(localStorage.getItem('dailyBonusStreak') || '0');
        bonusCard.querySelector('.event-btn').textContent = 'ПОЛУЧЕНО';
        bonusCard.querySelector('.event-btn').disabled = true;
        bonusCard.querySelector('.event-desc').textContent = `Серия: ${streak} дней`;
    }
    
    // Периодическая проверка достижений
    setInterval(() => {
        checkAchievements();
        updateCountdown();
    }, 60000);
    
    // Периодическая проверка даты
    setInterval(() => {
        const now = new Date();
        if (now >= returnDate) {
            document.body.innerHTML = `
                <div style="text-align: center; padding: 50px; font-size: 5em; color: #ff0000;">
                    <h1 class="blink">🎉 ЕГОР ВЕРНУЛСЯ! 🎉</h1>
                    <p style="font-size: 0.5em; margin-top: 30px;">Долгожданное возвращение состоялось!</p>
                </div>
            `;
        }
    }, 60000);
});
