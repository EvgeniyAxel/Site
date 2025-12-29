/* Кликер с меняющимся текстом */
const clickScreen = document.getElementById('clickScreen');
const mainContent = document.getElementById('mainContent');
const music = document.getElementById('bgMusic');
const clickImage = document.getElementById('clickImage');
const clickHint = document.getElementById('clickHint');

let clicksNeeded = 7;
let currentClicks = 0;

const hintTexts = [
    "Кликни на фото несколько раз... ✨",
    "Ещё 6 разочков... ❤️",
    "Ты молодец! Ещё 5 ✨",
    "Продолжай... Ещё 4 😊",
    "Уже близко! Ещё 3 🎄",
    "Ещё чуть-чуть... 2 ❤️",
    "Последний раз... ✨",
    "Ура! Магия начинается... 🎉"
];

clickImage.addEventListener('click', (e) => {
    currentClicks++;

    // Анимация нажатия
    clickImage.style.transform = 'scale(1.1)';
    setTimeout(() => { clickImage.style.transform = ''; }, 200);

    // Эффекты сердечек/звёздочек
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    effect.innerHTML = Math.random() > 0.5 ? '❤️' : '✨';
    effect.style.left = (e.clientX - 20) + 'px';
    effect.style.top = (e.clientY - 20) + 'px';
    document.body.appendChild(effect);
    setTimeout(() => effect.remove(), 1000);

    // Обновление подсказки
    if (currentClicks < hintTexts.length) {
        clickHint.textContent = hintTexts[currentClicks];
    }

    // Финал
    if (currentClicks >= clicksNeeded) {
        clickHint.textContent = hintTexts[hintTexts.length - 1];
        setTimeout(() => {
            clickScreen.classList.add('fade-out');
            launchConfetti();
            setTimeout(() => {
                clickScreen.style.display = 'none';
                mainContent.classList.remove('hidden');
                music.volume = 0.5;
                music.play();
                startRevealAnimation();
                initQuiz(); // Запуск викторины после открытия
            }, 800);
        }, 800);
    }
});

/* Конфетти (без изменений) */
function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#ffd700', '#ff0000', '#00ff00', '#00ffff', '#ff69b4', '#ffffff'];

    for (let i = 0; i < 150; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 10 + 5,
            speedY: Math.random() * 5 + 2,
            speedX: Math.random() * 4 - 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            shape: Math.random() > 0.3 ? 'circle' : (Math.random() > 0.5 ? 'heart' : 'star'),
            rotation: Math.random() * 360,
            spin: Math.random() * 10 - 5
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.fillStyle = p.color;

            if (p.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                ctx.fill();
            } else if (p.shape === 'heart') {
                ctx.font = `${p.size * 2}px Arial`;
                ctx.fillText('❤️', -p.size, p.size / 2);
            } else {
                ctx.font = `${p.size * 2}px Arial`;
                ctx.fillText('⭐', -p.size, p.size / 2);
            }
            ctx.restore();

            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += p.spin;
        });

        if (particles.some(p => p.y < canvas.height)) {
            requestAnimationFrame(draw);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    draw();
}

/* Плавное появление контента (добавил викторину в анимацию) */
function startRevealAnimation() {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('visible');
        }, 400 + index * 800);
    });
}

/* Викторина */
function initQuiz() {
    const quizQuestion = document.getElementById('quizQuestion');
    const quizOptions = document.getElementById('quizOptions');
    const quizFeedback = document.getElementById('quizFeedback');
    const giftSection = document.getElementById('giftSection');
    const giftLetter = document.getElementById('giftLetter');

    // Вопросы (ты можешь поменять)
    let questions = [
        {
            question: "Какой год считается началом традиции ставить ёлку на Новый год в России?",
            options: ["1700", "1800", "1900", "1600"],
            correct: "1700"
        },
        {
            question: "Сколько примерно снежинок падает на Землю каждый год?",
            options: ["1 квинтиллион", "1 миллиард", "1 триллион", "1 квадриллион"],
            correct: "1 квинтиллион"
        },
        {
            question: "В какой стране Новый год отмечают с 13 апреля?",
            options: ["Таиланд", "Индия", "Китай", "Япония"],
            correct: "Таиланд"
        },
        {
            question: "Как зовут помощника Деда Мороза в русской традиции?",
            options: ["Снегурочка", "Эльф", "Олень Рудольф", "Баба Яга"],
            correct: "Снегурочка"
        },
        {
            question: "Сколько шампанского в среднем выпивается в мире на Новый год?",
            options: ["360 миллионов бутылок", "100 миллионов бутылок", "500 миллионов бутылок", "200 миллионов бутылок"],
            correct: "360 миллионов бутылок"
        }
    ];

    let currentQuestionIndex = 0;

    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function startQuiz() {
        questions = shuffle(questions); // Перемешиваем вопросы
        currentQuestionIndex = 0;
        quizFeedback.textContent = '';
        showQuestion();
    }

    function showQuestion() {
        const q = questions[currentQuestionIndex];
        quizQuestion.textContent = q.question;
        const shuffledOptions = shuffle([...q.options]); // Перемешиваем ответы
        quizOptions.innerHTML = '';
        shuffledOptions.forEach(opt => {
            const button = document.createElement('div');
            button.className = 'quiz-option';
            button.textContent = opt;
            button.addEventListener('click', () => checkAnswer(opt, q.correct));
            quizOptions.appendChild(button);
        });
    }

    function checkAnswer(selected, correct) {
        if (selected === correct) {
            currentQuestionIndex++;
            if (currentQuestionIndex >= questions.length) {
                // Успех
                document.getElementById('quizSection').classList.add('hidden');
                giftSection.classList.remove('hidden');
                launchConfetti(); // Ещё конфетти для радости
            } else {
                showQuestion();
            }
        } else {
            quizFeedback.textContent = 'Ой, неверно! Начинаем сначала... 😊';
            setTimeout(startQuiz, 1500);
        }
    }

    // Открытие письма
    giftLetter.addEventListener('click', () => {
        giftLetter.classList.add('open');
        giftLetter.querySelector('.gift-content').classList.remove('hidden');
    });

    startQuiz(); // Старт
}

/* Слайдер фото (без изменений) */
const slides = document.querySelectorAll('.slider img');
let index = 0;

function updateSlider() {
    slides.forEach((slide, i) => {
        slide.classList.remove('active', 'prev');
        if (i === index) slide.classList.add('active');
        else if (i === (index - 1 + slides.length) % slides.length) slide.classList.add('prev');
    });
}

updateSlider();
setInterval(() => {
    index = (index + 1) % slides.length;
    updateSlider();
}, 4000);

/* Свайп на мобильных */
let startX = 0;
const slider = document.querySelector('.slider');
slider.addEventListener('touchstart', e => startX = e.touches[0].clientX);
slider.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) { index = (index + 1) % slides.length; updateSlider(); }
    if (endX - startX > 50) { index = (index - 1 + slides.length) % slides.length; updateSlider(); }
});

/* Снежинки (без изменений) */
const snowLayer = document.querySelector('.snow-layer');
const snowSvgs = [
`<svg viewBox="0 0 24 24"><path fill="white" d="M12 2v20M2 12h20M4 4l16 16M20 4L4 20"/></svg>`,
`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="2" fill="white"/><path fill="white" d="M12 2v6M12 16v6M2 12h6M16 12h6"/></svg>`,
`<svg viewBox="0 0 24 24"><path fill="white" d="M6 6l12 12M18 6L6 18"/></svg>`,
`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="none" stroke="white" stroke-width="1"/></svg>`,
`<svg viewBox="0 0 24 24"><path fill="white" d="M12 1l3 5h-6l3-5z"/></svg>`,
`<svg viewBox="0 0 24 24"><path fill="white" d="M12 23l-3-5h6l-3 5z"/></svg>`
];

for (let i = 0; i < 50; i++) {
    const flake = document.createElement('div');
    flake.className = 'snowflake';
    flake.innerHTML = snowSvgs[Math.floor(Math.random() * snowSvgs.length)];
    flake.style.left = Math.random() * 100 + 'vw';
    const size = 10 + Math.random() * 25;
    flake.style.width = size + 'px';
    flake.style.height = size + 'px';
    flake.style.opacity = 0.3 + Math.random() * 0.5;
    const fallDuration = 8 + Math.random() * 12;
    const spinDuration = 3 + Math.random() * 7;
    flake.style.animation = `snow-fall ${fallDuration}s linear infinite, snow-spin ${spinDuration}s linear infinite`;
    flake.style.animationDelay = Math.random() * 10 + 's';
    snowLayer.appendChild(flake);
}