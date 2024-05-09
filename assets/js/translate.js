const en = document.getElementById('toEnglish');
const sp = document.getElementById('toSpanish');

// Textos en inglés
const englishTexts = {
    about: 'About',
    languages: 'Languages',
    spanish: 'Spanish',
    english: 'English',
    implementedBy: 'Implemented by ☕️ Héctor García',
    subdivisions: 'Subdivisions',
    audioClick: 'Click Sound',
    timer: 'Timer',
    firstBeat: 'First Beat',
    aboutHeader: 'About',
    beats: 'Beats',
    playStopTooltip: 'Play/Stop',
};

// Textos en español
const spanishTexts = {
    about: 'Acerca',
    languages: 'Idiomas',
    spanish: 'Español',
    english: 'Inglés',
    implementedBy: 'Implementado por ☕️ Héctor García',
    subdivisions: 'Subdivisiones',
    audioClick: 'Audio del click',
    timer: 'Temporizador',
    firstBeat: 'Marca el primer beat',
    aboutHeader: 'Acerca',
    beats: 'Latidos',
    playStopTooltip: 'Reproducir/Frenar',
};

// Función para cambiar el idioma a inglés
function switchToEnglish() {
    // Cambiar el texto del botón del dropdown de idiomas
    document.getElementById('navbarDropdown').innerHTML = `<i class="bx bx-world"></i> ${englishTexts.languages}`;

    // Cambiar el texto de las opciones del dropdown de idiomas
    document.getElementById('toSpanish').innerHTML = `
        <img src="/assets/images/flags/esp.png" alt="Español" /> 
        ${englishTexts.spanish} 
        ${document.getElementById('toSpanish').classList.contains('active') ? '<i class="bx bx-check"></i>' : ''}
    `;

    document.getElementById('toEnglish').innerHTML = `
        <img src="/assets/images/flags/en.png" alt="Inglés" /> 
        ${englishTexts.english} 
        ${document.getElementById('toEnglish').classList.contains('active') ? '<i class="bx bx-check"></i>' : ''}
    `;

    // Cambiar el texto del footer
    document.querySelector('.footer p').textContent = englishTexts.implementedBy;

    // Cambiar el texto de otros elementos
    document.getElementById('figureOptions').querySelector('option').textContent = englishTexts.subdivisions;
    document.getElementById('audioOptions').querySelector('option').textContent = englishTexts.audioClick;
    document.querySelector('.countdown .form-check-label').textContent = englishTexts.timer;
    document.querySelector('.firstBeat .form-check-label').textContent = englishTexts.firstBeat;
    document.querySelector('.beatCounter').textContent = englishTexts.beats;
    document.querySelector('.acerca').textContent = englishTexts.about;

    // Actualizar el título del tooltip
    document.getElementById('startStopButton').setAttribute('title', englishTexts.playStopTooltip);

    // Eliminar los tooltips existentes y crear nuevos
    var startStopTooltip = new bootstrap.Tooltip(document.getElementById('startStopButton'), {
        title: englishTexts.playStopTooltip,
        placement: 'top',
        trigger: 'hover',
    });
}

// Función para cambiar el idioma a español
function switchToSpanish() {
    // Cambiar el texto del botón del dropdown de idiomas
    document.getElementById('navbarDropdown').innerHTML = `<i class="bx bx-world"></i> ${spanishTexts.languages}`;

    // Cambiar el texto de las opciones del dropdown de idiomas
    document.getElementById('toSpanish').innerHTML = `
        <img src="/assets/images/flags/esp.png" alt="Español" /> 
        ${spanishTexts.spanish} 
        ${document.getElementById('toSpanish').classList.contains('active') ? '<i class="bx bx-check"></i>' : ''}
    `;

    document.getElementById('toEnglish').innerHTML = `
        <img src="/assets/images/flags/en.png" alt="Inglés" /> 
        ${spanishTexts.english} 
        ${document.getElementById('toEnglish').classList.contains('active') ? '<i class="bx bx-check"></i>' : ''}
    `;

    // Cambiar el texto del footer
    document.querySelector('.footer p').textContent = spanishTexts.implementedBy;

    // Cambiar el texto de otros elementos
    document.getElementById('figureOptions').querySelector('option').textContent = spanishTexts.subdivisions;
    document.getElementById('audioOptions').querySelector('option').textContent = spanishTexts.audioClick;
    document.querySelector('.countdown .form-check-label').textContent = spanishTexts.timer;
    document.querySelector('.firstBeat .form-check-label').textContent = spanishTexts.firstBeat;
    document.querySelector('.beatCounter').textContent = spanishTexts.beats;
    document.querySelector('.acerca').textContent = spanishTexts.about;

    // Actualizar el título del tooltip
    document.getElementById('startStopButton').setAttribute('title', spanishTexts.playStopTooltip);

    // Eliminar los tooltips existentes y crear nuevos
    var startStopTooltip = new bootstrap.Tooltip(document.getElementById('startStopButton'), {
        title: spanishTexts.playStopTooltip,
        placement: 'top',
        trigger: 'hover',
    });
}

// Manejo del sptado activo de la opción de traducción al inglés
en.addEventListener('click', () => {
    switchToEnglish();
    if (sp.querySelector('.bx.bx-check')) {
        sp.querySelector('.bx.bx-check').remove();
        sp.classList.remove('active');
    }

    if (!en.classList.contains('active')) {
        en.classList.add('active');
        var icon = document.createElement('i');
        icon.className = 'bx bx-check';
        en.appendChild(icon);
    }
});

// Manejo del sptado activo de la opción de traducción al sppañol
sp.addEventListener('click', () => {
    switchToSpanish();
    if (en.querySelector('.bx.bx-check')) {
        en.querySelector('.bx.bx-check').remove();
        en.classList.remove('active');
    }

    if (!sp.classList.contains('active')) {
        sp.classList.add('active');
        var icon = document.createElement('i');
        icon.className = 'bx bx-check';
        sp.appendChild(icon);
    }
});
