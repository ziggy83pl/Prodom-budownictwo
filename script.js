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
       4. AUTOMATYCZNE DEKORACJE NOWOROCZNE
       ========================================= */
    function checkNewYear() {
        const now = new Date();
        const month = now.getMonth(); 
        const date = now.getDate();

        // TEST: Możesz zmienić na (true) aby wymusić pokazanie teraz
        if ((month === 11 && date === 31) || (month === 0 && date === 1)) {
            showNewYearDecorations();
        }
    }

    function showNewYearDecorations() {
        document.body.classList.add('sylwester-mode');

        const greetingBar = document.createElement('div');
        greetingBar.className = 'new-year-banner';
        greetingBar.innerHTML = `
            <div style="background: #d4af37; color: #000; text-align: center; padding: 12px; font-weight: bold; position: fixed; top: 0; left: 0; width: 100%; z-index: 10001;">
                🎉 Szczęśliwego Nowego Roku 2026 życzy zespół PRODOM! 🥂
            </div>
        `;
        document.body.prepend(greetingBar);

        // Przesunięcie reszty strony w dół, żeby pasek nic nie zasłaniał
        document.body.style.paddingTop = "45px";

        const logo = document.querySelector('.logo');
        if (logo) {
            const hat = document.createElement('span');
            hat.innerHTML = ' 🥳';
            logo.appendChild(hat);
        }
        
        createConfetti();
    }

    function createConfetti() {
        for (let i = 0; i < 40; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.cssText = `
                position: fixed; top: -10px; width: 8px; height: 8px; 
                background: ${['#FFD700', '#FFF', '#FFA500'][Math.floor(Math.random() * 3)]};
                left: ${Math.random() * 100}vw; z-index: 10000;
                animation: fall ${2 + Math.random() * 3}s linear infinite;
                pointer-events: none;
            `;
            document.body.appendChild(confetti);
        }
    }

    // Wywołujemy od razu, bo jesteśmy już w DOMContentLoaded
    checkNewYear();

}); // KONIEC DOMContentLoaded
