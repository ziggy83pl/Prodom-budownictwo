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

    // // Save version to file
    // const version = '1.0';
    // const blob = new Blob([`Wersja kodu: ${version}`], { type: 'text/plain' });
    // const link = document.createElement('a');
    // link.href = URL.createObjectURL(blob);
    // link.download = 'prodom.txt';
    // link.click();

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
});