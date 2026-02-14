﻿﻿﻿﻿// Zmienna globalna dla zdarzenia instalacji PWA
let deferredPrompt;

function isAppInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBtn = document.getElementById('install-btn');
    if (installBtn && !isAppInstalled()) {
        installBtn.classList.add('visible');
    }
});

window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    const installBtn = document.getElementById('install-btn');
    if (installBtn) {
        installBtn.classList.remove('visible');
        installBtn.setAttribute('aria-hidden', 'true');
    }
});

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
       1.1 UDOSTĘPNIANIE / KOPIOWANIE LINKU
       ========================================= */
    const copyLinkBtns = document.querySelectorAll('.action-copy-link');
    
    copyLinkBtns.forEach(btn => {
        const originalLabel = btn.innerHTML;
        const resetLabel = () => {
            btn.innerHTML = originalLabel;
            btn.disabled = false;
        };

        btn.addEventListener('click', async () => {
            const url = window.location.href;
            const title = document.title;

            if (navigator.share) {
                try {
                    await navigator.share({ title, text: title, url });
                    return;
                } catch (err) {
                    // Fallback do kopiowania poniżej
                }
            }

            try {
                await navigator.clipboard.writeText(url);
                btn.innerHTML = '<i class="fas fa-check"></i> Skopiowano link';
                btn.disabled = true;
                setTimeout(resetLabel, 2000);
            } catch (err) {
                const tmp = document.createElement('input');
                tmp.value = url;
                document.body.appendChild(tmp);
                tmp.select();
                document.execCommand('copy');
                document.body.removeChild(tmp);
                btn.innerHTML = '<i class="fas fa-check"></i> Skopiowano link';
                btn.disabled = true;
                setTimeout(resetLabel, 2000);
            }
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
                    email: document.getElementById('email').value,
                    message: document.getElementById('message').value,
                    _subject: contactForm.getAttribute('data-subject') || "---> Nowe zapytanie od Prodom <---",
                    _autoresponse: "Dziękujemy za wiadomość! Otrzymaliśmy Twoje zgłoszenie i skontaktujemy się z Tobą wkrótce."
                })
            })
            .then(response => {
                if (response.ok) {
                    const originalChildren = Array.from(contactForm.children);
                    originalChildren.forEach(child => child.style.display = 'none');

                    const successDiv = document.createElement('div');
                    successDiv.className = 'form-success';
                    successDiv.innerHTML = `
                        <i class="fas fa-check-circle" style="font-size: 3rem; color: #2ecc71; margin-bottom: 20px;"></i>
                        <h3>Dziękujemy za wiadomość!</h3>
                        <p>Skontaktujemy się z Tobą.</p>
                        <button type="button" id="new-message-btn" class="btn btn-primary" style="margin-top: 20px; background-color: var(--accent-color); color: #000;">Wyślij kolejną wiadomość</button>
                    `;
                    contactForm.appendChild(successDiv);

                    document.getElementById('new-message-btn').addEventListener('click', () => {
                        successDiv.remove();
                        originalChildren.forEach(child => child.style.display = '');
                        contactForm.reset();
                        btn.innerText = originalText;
                        btn.disabled = false;
                    });
                } else {
                    throw new Error('Błąd wysyłki');
                }
            })
            .catch(() => {
                alert('Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.');
                btn.innerText = originalText;
                btn.disabled = false;
            });
        });
    }

    /* =========================================
    2.1. MINI FORMULARZ (ZLECENIA)
    ========================================= */
    const miniLeadForm = document.getElementById('mini-lead-form');
    if (miniLeadForm) {
        const phoneInput = miniLeadForm.querySelector('input[name="phone"]');
        const submitBtn = miniLeadForm.querySelector('button[type="submit"]');

        if (phoneInput && submitBtn) {
            phoneInput.addEventListener('input', function() {
                formatujTelefon(this);
                const phoneVal = this.value.replace(/[\s-]/g, '');
                
                if (phoneVal.length === 9) {
                    submitBtn.style.backgroundColor = '#2ecc71'; // Green for valid
                    submitBtn.style.borderColor = '#2ecc71';
                    submitBtn.style.color = '#fff';
                } else {
                    submitBtn.style.backgroundColor = ''; // Reset to default
                    submitBtn.style.borderColor = '';
                    submitBtn.style.color = '';
                }
            });
        }

        miniLeadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const phoneVal = phoneInput.value.replace(/[\s-]/g, '');
            if (!/^\d{9}$/.test(phoneVal)) {
                alert('Proszę podać poprawny numer telefonu (9 cyfr, bez +48).');
                return;
            }

            const originalText = submitBtn.innerText;
            
            submitBtn.innerText = 'Wysyłanie...';
            submitBtn.disabled = true;

            fetch("https://formsubmit.co/ajax/zbyszekszczesny83@gmail.com", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    name: miniLeadForm.querySelector('input[name="name"]').value,
                    phone: phoneInput.value,
                    _subject: "---> Nowe zapytanie- prośba o kontakt <---",
                    _autoresponse: "Dziękujemy za wiadomość! Otrzymaliśmy Twoje zgłoszenie i wkrótce oddzwonimy."
                })
            })
            .then(response => {
                if (response.ok) {
                    const formContent = miniLeadForm.querySelector('.mini-lead-row');
                    if (formContent) formContent.style.display = 'none';

                    const successDiv = document.createElement('div');
                    successDiv.className = 'form-success-mini';
                    successDiv.style.cssText = "text-align: center; padding: 20px; background: rgba(255,255,255,0.9); border-radius: 5px; border: 1px solid #2ecc71;";
                    successDiv.innerHTML = `
                        <h3 style="font-size: 1.2rem; margin-bottom: 10px; color: #333;">Dziękujemy!</h3>
                        <p style="color: #333;">Oddzwonimy wkrótce.</p>
                        <button type="button" id="new-call-btn" class="btn btn-outline btn-outline-strong" style="margin-top: 15px;">Poproś o kolejny telefon</button>
                    `;
                    miniLeadForm.appendChild(successDiv);

                    document.getElementById('new-call-btn').addEventListener('click', () => {
                        successDiv.remove();
                        if (formContent) formContent.style.display = '';
                        miniLeadForm.reset();
                        submitBtn.innerText = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.backgroundColor = '';
                        submitBtn.style.borderColor = '';
                        submitBtn.style.color = '';
                    });
                } else {
                    throw new Error('Błąd wysyłki');
                }
            })
            .catch(() => {
                alert('Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.');
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            });
        });
    }

    function formatujTelefon(input) {
    let numer = input.value.replace(/\D/g, '');
    
    // Jeśli numer jest dłuższy niż 9 cyfr i zaczyna się od 48, usuń prefiks
    if (numer.length > 9 && numer.startsWith('48')) {
        numer = numer.substring(2);
    }
    numer = numer.substring(0, 9);

    if (numer.length > 6) {
        input.value = numer.substring(0, 3) + ' ' + numer.substring(3, 6) + ' ' + numer.substring(6);
    } else if (numer.length > 3) {
        input.value = numer.substring(0, 3) + ' ' + numer.substring(3);
    } else {
        input.value = numer;
    }
}

    /* =========================================
       4. ANIMACJE SCROLLOWANIA (FADE IN)
       ========================================= */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Element musi być w 15% widoczny
    };

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Animacja tylko raz
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-section').forEach(section => {
        animationObserver.observe(section);
    });

    /* =========================================
        5. ANIMACJA LICZNIKÓW (O FIRMIE)
       ========================================= */
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.innerText);
                
                if (!isNaN(target)) {
                    const suffix = counter.innerText.replace(/[0-9]/g, ''); // Zachowuje znaki np. "+" lub "%"
                    const duration = 2000; // Czas trwania: 2 sekundy
                    const increment = target / (duration / 16); // Płynność ~60 FPS

                    let current = 0;
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = Math.ceil(current) + suffix;
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target + suffix; // Ustawienie końcowej wartości
                        }
                    };
                    updateCounter();
                }
                observer.unobserve(counter); // Animacja tylko raz
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

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

    /* =========================================
       6. OBSŁUGA PWA (INSTALACJA I SERVICE WORKER)
       ========================================= */
    
    // Rejestracja Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => console.log('Service Worker zarejestrowany:', reg))
            .catch(err => console.log('Błąd rejestracji Service Worker:', err));
    }

    // Obsługa przycisku instalacji
    const installBtn = document.getElementById('install-btn');
    
    // Jeśli zdarzenie wystąpiło przed załadowaniem DOM
    if (installBtn) {
        if (isAppInstalled()) {
            installBtn.classList.remove('visible');
            installBtn.setAttribute('aria-hidden', 'true');
        } else if (deferredPrompt) {
            installBtn.classList.add('visible');
        }
    }

    if (installBtn) {
        installBtn.addEventListener('click', () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    deferredPrompt = null;
                });
            }
        });
    }

    /* =========================================
       7. GOOGLE ANALYTICS EVENTS & COOKIE CONSENT
       ========================================= */
    
    // A. Śledzenie kliknięć w telefon i email (GA4)
    const trackContactClicks = () => {
        // Telefony
        document.querySelectorAll('a[href^="tel:"]').forEach(link => {
            link.addEventListener('click', () => {
                if (typeof gtag === 'function') {
                    gtag('event', 'click_phone', {
                        'event_category': 'Contact',
                        'event_label': link.href.replace('tel:', ''),
                        'value': 1
                    });
                }
            });
        });

        // Emaile
        document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
            link.addEventListener('click', () => {
                if (typeof gtag === 'function') {
                    gtag('event', 'click_email', {
                        'event_category': 'Contact',
                        'event_label': link.href.replace('mailto:', ''),
                        'value': 1
                    });
                }
            });
        });
    };

    trackContactClicks();

    // B. Cookie Consent (RODO)
    const initCookieConsent = () => {
        if (!localStorage.getItem('cookieConsent')) {
            const banner = document.createElement('div');
            banner.className = 'cookie-banner';
            banner.innerHTML = `
                <p>Ta strona korzysta z plików cookies. Dalsze korzystanie ze strony oznacza akceptację naszej <a href="polityka-prywatnosci.html" style="text-decoration: underline; color: inherit; font-weight: bold;">Polityki Prywatności</a>.</p>
                <div class="cookie-actions">
                    <button id="cookie-reject" class="cookie-btn cookie-reject">Odrzuć</button>
                    <button id="cookie-accept" class="cookie-btn cookie-accept">Akceptuję</button>
                </div>
            `;
            document.body.appendChild(banner);

            document.getElementById('cookie-accept').addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'accepted');
                banner.remove();
            });

            document.getElementById('cookie-reject').addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'rejected');
                // Wyłączenie śledzenia dla tej sesji (jeśli skrypty to obsługują)
                window['ga-disable-G-KXK83XGTXB'] = true;
                window['ga-disable-AW-17698648399'] = true;
                banner.remove();
            });
        }
    };

    initCookieConsent();

}); // KONIEC DOMContentLoaded
