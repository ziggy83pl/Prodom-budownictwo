document.addEventListener('DOMContentLoaded', function() {
    
    /* =========================================
       1. NAWIGACJA MOBILE & STICKY HEADER
       ========================================= */
    const header = document.querySelector('.header');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = "0 2px 20px rgba(0,0,0,0.1)";
        } else {
            header.style.boxShadow = "none";
        }
    });

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            const icon = menuBtn.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            const icon = menuBtn.querySelector('i');
            icon.classList.replace('fa-times', 'fa-bars');
        });
    });

   /* =========================================
       2. FORMULARZ KONTAKTOWY
       ========================================= */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            
            btn.innerText = 'Wysyłanie...';
            btn.disabled = true;

            fetch("https://formsubmit.co/ajax/zbyszekszczesny83@gmail.com", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    name: document.getElementById('name').value,
                    phone: document.getElementById('phone').value,
                    message: document.getElementById('message').value,
                    _subject: "Nowe zapytanie Prodom"
                })
            })
            .then(() => {
                alert('Wiadomość wysłana!');
                contactForm.reset();
            })
            .catch(() => alert('Błąd wysyłki.'))
            .finally(() => {
                btn.innerText = originalText;
                btn.disabled = false;
            });
        });
    }

    /* =========================================
       3. KALKULATORY
       ========================================= */
    function getVal(id) {
        const el = document.getElementById(id);
        return el ? parseFloat(el.value.replace(',', '.')) : 0;
    }

    const btnArea = document.getElementById('calculate-area-button');
    if (btnArea) {
        btnArea.addEventListener('click', () => {
            const area = (getVal('length') * getVal('width')).toFixed(2);
            document.getElementById('total-area').innerText = area;
        });
    }

    // Pozostałe kalkulatory (Beton, Stal) działają na tej samej zasadzie...

    /* =========================================
   INTELIGENTNY SYSTEM ŚWIĄTECZNY 2026
   ========================================= */
function manageHolidayDecorations() {
    const now = new Date();
    const month = now.getMonth(); // 0-styczeń, 3-kwiecień, 4-maj, 11-grudzień
    const date = now.getDate();

    let holiday = null;

    // Definicje Świąt 2026
    if ((month === 11 && date === 31) || (month === 0 && date === 1)) {
        holiday = {
            type: 'sylwester',
            text: '🎉 Szczęśliwego Nowego Roku 2026 życzy zespół PRODOM! 🥂',
            icon: '🥳',
            effect: 'confetti'
        };
    } else if (month === 3 && (date === 5 || date === 6)) { // 5-6 Kwietnia
        holiday = {
            type: 'easter',
            text: '🐣 Radosnych Świąt Wielkanocnych życzy zespół PRODOM! 🌷',
            icon: '🐰',
            effect: 'flowers'
        };
    } else if (month === 4 && (date >= 1 && date <= 3)) { // 1-3 Maja
        holiday = {
            type: 'majowka',
            text: '🇵🇱 Udanej Majówki! Biuro czynne od 4 maja. Zapraszamy!',
            icon: '🏗️',
            effect: 'none'
        };
    } else if (month === 11 && (date >= 24 && date <= 26)) { // 24-26 Grudnia
        holiday = {
            type: 'christmas',
            text: '🎄 Wesołych Świąt i sukcesów w budowie marzeń życzy PRODOM! 🎁',
            icon: '🎅',
            effect: 'snow'
        };
    }

    if (holiday) {
        showHolidayDecorations(holiday);
    }
}

function showHolidayDecorations(h) {
    document.body.classList.add('holiday-mode', h.type + '-mode');

    const greetingBar = document.createElement('div');
    greetingBar.className = 'holiday-banner ' + h.type + '-banner';
    greetingBar.innerHTML = `<div class="container"><span>${h.text}</span></div>`;
    document.body.prepend(greetingBar);

    const logo = document.querySelector('.logo');
    if (logo) {
        const span = document.createElement('span');
        span.innerHTML = ' ' + h.icon;
        logo.appendChild(span);
    }

    if (h.effect === 'confetti' || h.effect === 'snow') {
        createParticles(h.effect);
    }
}

function createParticles(type) {
    for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.className = type;
        p.style.left = Math.random() * 100 + 'vw';
        p.style.animationDelay = Math.random() * 5 + 's';
        if (type === 'confetti') {
            p.style.backgroundColor = ['#FFD700', '#FFF', '#FFA500'][Math.floor(Math.random() * 3)];
        }
        document.body.appendChild(p);
    }
}

window.addEventListener('load', manageHolidayDecorations);

}); // KONIEC DOMContentLoaded

