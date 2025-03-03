document.addEventListener('DOMContentLoaded', function() {
    // Hamburger menu toggle
    const nav = document.querySelector('nav ul');
    const burger = document.createElement('div');
    burger.classList.add('burger');
    burger.innerHTML = '&#9776;'; // Unicode for hamburger icon
    document.querySelector('nav').prepend(burger);

    burger.addEventListener('click', function() {
        nav.classList.toggle('show');
    });

    // Smooth scroll to sections
    const links = document.querySelectorAll('nav a');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Ignoruj linki z href zaczynającym się od "tel:"
            if (this.getAttribute('href').startsWith('tel:')) {
                return; // Nie blokuj domyślnego zachowania dla linków telefonicznych
            }

            // Blokuj domyślne zachowanie tylko dla linków wewnętrznych
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
                nav.classList.remove('show'); // Close menu after click
            } else {
                console.warn(`Section with id "${targetId}" not found.`);
            }
        });
    });

    // Share button functionality
    const shareButton = document.getElementById('share-button');
    shareButton.addEventListener('click', function() {
        if (navigator.share) {
            navigator.share({
                title: 'Prodom Budownictwo',
                text: 'Sprawdź Prodom Budownictwo - kompleksowe usługi budowlane!',
                url: window.location.href
            }).then(() => {
                console.log('Udostępniono pomyślnie');
            }).catch((error) => {
                console.error('Błąd podczas udostępniania', error);
            });
        } else {
            alert('Twoje urządzenie nie obsługuje funkcji udostępniania.');
        }
    });

    // Scroll to contact section
    document.getElementById('contact-button').addEventListener('click', function() {
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    });

    // JavaScript to dynamically load images into the carousel
    const imageFolder = 'images/';
    const imageFiles = [
        'photo1.webp', 'photo2.webp', 'photo3.webp', 'photo4.webp', 'photo5.webp', 
        'photo6.webp', 'photo7.webp', 'photo8.webp', 'photo9.webp', 'photo10.webp',
        'photo11.webp', 'photo12.webp', 'photo13.webp', 'photo14.webp', 'photo15.webp',
        'photo16.webp', 'photo17.webp', 'photo18.webp', 'photo19.webp', 'photo20.webp', 
        'photo21.webp'
    ];
    const carouselInner = document.getElementById('carousel-inner');
    const carouselIndicators = document.getElementById('carousel-indicators');

    const chunkSize = 4;
    for (let i = 0; i < imageFiles.length; i += chunkSize) {
        const chunk = imageFiles.slice(i, i + chunkSize);
        const isActive = i === 0 ? 'active' : null;

        const indicator = document.createElement('li');
        indicator.setAttribute('data-target', '#carouselExampleIndicators');
        indicator.setAttribute('data-slide-to', i / chunkSize);
        if (isActive) indicator.classList.add('active');
        carouselIndicators.appendChild(indicator);

        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');
        if (isActive) carouselItem.classList.add('active');

        const row = document.createElement('div');
        row.classList.add('row');

        chunk.forEach((file, index) => {
            const col = document.createElement('div');
            col.classList.add('col-md-3');
            const img = document.createElement('img');
            img.src = `${imageFolder}${file}`;
            img.classList.add('d-block', 'w-100');
            img.alt = `Zdjęcie ${i + index + 1}`;
            col.appendChild(img);
            row.appendChild(col);
        });

        carouselItem.appendChild(row);
        carouselInner.appendChild(carouselItem);
    }

    // Initialize the carousel
    $('.carousel').carousel();

    // Kalkulator powierzchni stropu
    const calculateAreaButton = document.getElementById('calculate-area-button');
    const lengthInput = document.getElementById('length');
    const widthInput = document.getElementById('width');
    const totalAreaSpan = document.getElementById('total-area');

    calculateAreaButton.addEventListener('click', function() {
        const length = parseFloat(lengthInput.value);
        const width = parseFloat(widthInput.value);

        // Walidacja
        if (isNaN(length) || isNaN(width) || length <= 0 || width <= 0) {
            alert('Proszę wpisać poprawne wartości długości i szerokości (większe niż 0).');
            return;
        }

        const totalArea = length * width;
        totalAreaSpan.textContent = totalArea.toFixed(2);
    });

    // Kalkulator objętości betonu
    const calculateVolumeButton = document.getElementById('calculate-volume-button');
    const volumeLengthInput = document.getElementById('volume-length');
    const volumeWidthInput = document.getElementById('volume-width');
    const volumeHeightInput = document.getElementById('volume-height');
    const totalVolumeSpan = document.getElementById('total-volume');

    calculateVolumeButton.addEventListener('click', function() {
        const length = parseFloat(volumeLengthInput.value);
        const width = parseFloat(volumeWidthInput.value);
        const height = parseFloat(volumeHeightInput.value);

        // Walidacja
        if (isNaN(length) || isNaN(width) || isNaN(height) || length <= 0 || width <= 0 || height <= 0) {
            alert('Proszę wpisać poprawne wartości długości, szerokości i wysokości (większe niż 0).');
            return;
        }

        const totalVolume = length * width * height;
        totalVolumeSpan.textContent = totalVolume.toFixed(2);
    });

    // Kalkulator stali
    const calculateSteelButton = document.getElementById('calculate-steel-button');
    const stropLengthInput = document.getElementById('strop-length');
    const stropWidthInput = document.getElementById('strop-width');
    const rozstawPretowInput = document.getElementById('rozstaw-pretow');
    const srednicaPretaSelect = document.getElementById('srednica-preta');
    const liczbaWarstwInput = document.getElementById('liczba-warstw');
    const dlugoscZakladuInput = document.getElementById('dlugosc-zakladu');
    const totalSteelSpan = document.getElementById('total-steel');

    calculateSteelButton.addEventListener('click', function() {
        const stropLength = parseFloat(stropLengthInput.value);
        const stropWidth = parseFloat(stropWidthInput.value);
        const rozstawPretow = parseFloat(rozstawPretowInput.value);
        const srednicaPreta = parseFloat(srednicaPretaSelect.value);
        const liczbaWarstw = parseFloat(liczbaWarstwInput.value);
        const dlugoscZakladu = parseFloat(dlugoscZakladuInput.value);

        if (isNaN(stropLength) || isNaN(stropWidth) || isNaN(rozstawPretow) || isNaN(srednicaPreta) || isNaN(liczbaWarstw) || isNaN(dlugoscZakladu)) {
            alert('Proszę wpisać poprawne wartości.');
            return;
        }

        // Obliczenia
        const liczbaPretow = (stropLength * 100 / rozstawPretow) + 1;
        const dlugoscPreta = stropWidth + (2 * (dlugoscZakladu / 100)); // Przeliczamy zakłady na metry
        const calkowitaDlugoscStali = liczbaPretow * dlugoscPreta;
        const masaStali = calkowitaDlugoscStali * srednicaPreta;
        const calkowitaMasaStali = masaStali * liczbaWarstw;

        totalSteelSpan.textContent = calkowitaMasaStali.toFixed(2);
    });

    // Generowanie kodu QR
    const qrCodeContainer = document.getElementById('qr-code');
    if (qrCodeContainer) {
        const currentUrl = window.location.href; // Bieżący adres URL strony
        new QRCode(qrCodeContainer, {
            text: currentUrl,
            width: 100,
            height: 100,
        });
    }

    // Sprawdź, czy strona jest otwarta na urządzeniu mobilnym
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
        // Wyświetl monit o zapisanie strony na ekranie głównym
        const promptText = "Czy chcesz zapisać tę stronę na ekranie głównym?";
        if (confirm(promptText)) {
            // Dodaj stronę do ekranu głównego (PWA)
            if ('serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window) {
                window.addEventListener('beforeinstallprompt', (event) => {
                    event.preventDefault();
                    event.prompt();
                });
            } else {
                alert("Twoja przeglądarka nie obsługuje tej funkcji.");
            }
        }
    }
});
