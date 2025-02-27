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
});
