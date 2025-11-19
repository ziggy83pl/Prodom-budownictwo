document.addEventListener('DOMContentLoaded', function() {
    
    /* =========================================
       1. NAWIGACJA MOBILE & STICKY HEADER
       ========================================= */
    const header = document.querySelector('.header');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky Header (Cień przy przewijaniu)
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = "0 2px 20px rgba(0,0,0,0.1)";
        } else {
            header.style.boxShadow = "none";
        }
    });

    // Otwieranie/Zamykanie Menu
    menuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
        const icon = menuBtn.querySelector('i');
        if (nav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Zamknij menu po kliknięciu w link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            menuBtn.querySelector('i').classList.remove('fa-times');
            menuBtn.querySelector('i').classList.add('fa-bars');
        });
    });

   /* =========================================
       2. WALIDACJA I WYSYŁKA FORMULARZA (FormSubmit.co)
       ========================================= */
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Zatrzymujemy standardowe wysyłanie

            // Pobranie wartości
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;

            // Walidacja
            if (name.length < 2) {
                alert('Proszę podać poprawne imię.');
                return;
            }
            if (phone.length < 9) {
                alert('Proszę podać poprawny numer telefonu.');
                return;
            }

            // Zmiana przycisku na stan ładowania
            btn.innerText = 'Wysyłanie...';
            btn.disabled = true;

            // Wysyłanie danych do FormSubmit.co za pomocą Fetch API
            // Używamy końcówki /ajax/ aby otrzymać odpowiedź JSON zamiast przekierowania
            fetch("https://formsubmit.co/ajax/zbyszekszczesny83@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    phone: phone,
                    message: message,
                    _subject: "Nowe zapytanie ze strony Prodom!",
                    _template: "table"
                })
            })
            .then(response => response.json())
            .then(data => {
                // SUKCES
                alert('Dziękujemy! Wiadomość została wysłana pomyślnie.');
                contactForm.reset();
                
                // Śledzenie konwersji Google Ads (jeśli używasz)
                if(typeof gtag === 'function') {
                    gtag('event', 'conversion', {'send_to': 'AW-17698648399/hu7tCPfRhL8bEM_ir_dB'});
                }
            })
            .catch(error => {
                // BŁĄD
                console.error('Błąd:', error);
                alert('Wystąpił błąd podczas wysyłania. Spróbuj ponownie lub zadzwoń do nas.');
            })
            .finally(() => {
                // Przywrócenie przycisku
                btn.innerText = originalText;
                btn.disabled = false;
            });
        });
    }

    /* =========================================
       3. KALKULATORY BUDOWLANE
       ========================================= */
    
    // Funkcja pomocnicza do pobierania wartości float
    function getVal(id) {
        const val = document.getElementById(id).value;
        return val ? parseFloat(val.replace(',', '.')) : 0;
    }

    // --- A. Kalkulator Powierzchni Stropu ---
    const btnArea = document.getElementById('calculate-area-button');
    if (btnArea) {
        btnArea.addEventListener('click', () => {
            const length = getVal('length');
            const width = getVal('width');
            const resultSpan = document.getElementById('total-area');
            const infoSpan = document.getElementById('typing-text');

            if (length > 0 && width > 0) {
                const area = (length * width).toFixed(2);
                resultSpan.innerText = area;
                infoSpan.innerText = `Obliczono dla wymiarów: ${length}m x ${width}m`;
            } else {
                infoSpan.innerText = "Wprowadź poprawne wymiary.";
            }
        });
    }

    // --- B. Kalkulator Objętości Betonu ---
    const btnVolume = document.getElementById('calculate-volume-button');
    if (btnVolume) {
        btnVolume.addEventListener('click', () => {
            const l = getVal('volume-length');
            const w = getVal('volume-width');
            const h = getVal('volume-height');
            const resultSpan = document.getElementById('total-volume');
            const infoSpan = document.getElementById('typing-text-volume');

            if (l > 0 && w > 0 && h > 0) {
                const vol = (l * w * h).toFixed(2);
                resultSpan.innerText = vol;
                infoSpan.innerText = "Wartość nie uwzględnia strat materiałowych.";
            } else {
                infoSpan.innerText = "Wypełnij wszystkie pola.";
            }
        });
    }

    // --- C. Kalkulator Stali (Zbrojenia) ---
    const btnSteel = document.getElementById('calculate-steel-button');
    if (btnSteel) {
        btnSteel.addEventListener('click', () => {
            const length = getVal('strop-length');
            const width = getVal('strop-width');
            const spacing = getVal('rozstaw-pretow'); // w cm
            const weightPerMeter = getVal('srednica-preta'); // kg/m (z value selecta)
            const layers = getVal('liczba-warstw');
            const overlap = getVal('dlugosc-zakladu'); // w cm
            
            const resultSpan = document.getElementById('total-steel');
            const infoSpan = document.getElementById('typing-text-steel');

            if (length > 0 && width > 0 && spacing > 0) {
                // Konwersja cm na m
                const spacingM = spacing / 100;
                const overlapM = overlap / 100;

                // Ilość prętów wzdłuż długości (układane na szerokości)
                const rodsAlongLength = Math.ceil(width / spacingM);
                // Ilość prętów wzdłuż szerokości (układane na długości)
                const rodsAlongWidth = Math.ceil(length / spacingM);

                // Całkowita długość prętów w jednej warstwie
                // (Ilość prętów * długość pręta) + uwzględnienie zakładów (uproszczone dodanie długości na zakład na każdy pręt jeśli > 12m, ale tu robimy proste dodanie zakładu na łączenie)
                // Uproszczony wzór: (Ilość * Długość)
                let totalLengthM = (rodsAlongLength * length) + (rodsAlongWidth * width);

                // Jeśli podano zakład, dodajemy go arbitralnie jako % lub stałą wartość do każdego pręta (zakładamy 1 łączenie na pręt dla bezpieczeństwa przy dużych stropach)
                if (overlapM > 0) {
                    const totalRods = rodsAlongLength + rodsAlongWidth;
                    totalLengthM += (totalRods * overlapM);
                }

                // Mnożymy razy warstwy
                totalLengthM = totalLengthM * layers;

                // Wynik w kg
                const totalWeight = (totalLengthM * weightPerMeter).toFixed(1);

                resultSpan.innerText = totalWeight;
                infoSpan.innerText = `Przyjęto wagę: ${weightPerMeter} kg/mb`;
            } else {
                infoSpan.innerText = "Uzupełnij wszystkie dane.";
            }
        });
    }
});
