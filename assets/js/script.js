const bpmDisplay = document.getElementById('bpm');
const startStopButton = document.getElementById('startStopButton');
const decrementButton = document.getElementById('decrementButton');
const incrementButton = document.getElementById('incrementButton');
const bpmSlider = document.getElementById('bpmSlider');
const classification = document.getElementById('classification');
const musicalNote = document.querySelector('.bx.bxs-music');
const startButtonContent = document.getElementById('startStopButton').innerHTML;

var beatCircles = document.querySelectorAll('.beat-circle');

//Audio embebido en el html
const tickSound = document.getElementById('tickSound');

let isPlaying = false;
let tempo = parseInt(bpmSlider.value);
let interval;
let beat = 0;

// Pinto el beat que esta sonando actualmente
function paintBeat(circleNumber) {
    beatCircles.forEach((beatCircle, index) => {
        if (index === circleNumber) {
            beatCircle.style.backgroundColor = '#ff3a27';
        } else {
            beatCircle.style.backgroundColor = '#8d8c8c';
        }
    });
}

// Iniciar y detener el metrónomo
function startStop() {
    if (isPlaying) {
        stopMetronome();
    } else {
        startMetronome();
    }
}

// Comienzo del trabajo del metronomo
function startMetronome() {
    const intervalMs = 60000 / tempo;
    tick();
    interval = setInterval(tick, intervalMs);
    musicalNote.classList.add('bx-tada');
    startStopButton.innerHTML = `
        <span class="bx bx-stop-circle me-2 bx-md bx-burst"></span>
    `;
    isPlaying = true;
}

function stopMetronome() {
    clearInterval(interval);
    musicalNote.classList.remove('bx-tada');
    startStopButton.innerHTML = startButtonContent;
    isPlaying = false;
}

// Reproducir el sonido del tick
function tick() {
    // Reiniciar la reproducción al principio del audio
    tickSound.currentTime = 0;
    beat++;
    tickSound.play();
    paintBeat(beat % 4);
}

function updateMetronome() {
    if (isPlaying) {
        stopMetronome();
        startMetronome();
    }
}

// Incrementar el tempo dentro del intervalo permitido
function decrementTempo() {
    if (tempo > 1) {
        tempo--;
        updateMetronome();
        updateTempoDisplay();
    }
}

// Decrementa el tempo dentro del intervalo permitido
function incrementTempo() {
    if (tempo < 240) {
        tempo++;
        updateMetronome();
        updateTempoDisplay();
    }
}

// Manejar el cambio en el tempo
function handleBpmChange() {
    tempo = parseInt(bpmSlider.value);
    updateMetronome();
    updateTempoDisplay();
}

// Actualizar la pantalla con el tempo actual y su clasificación
function updateTempoDisplay() {
    bpmDisplay.textContent = tempo;
    switch (true) {
        case tempo <= 20:
            return (classification.textContent = 'Larghissimo');
        case tempo <= 40:
            return (classification.textContent = 'Grave');
        case tempo <= 45:
            return (classification.textContent = 'Lento');
        case tempo <= 50:
            return (classification.textContent = 'Largo');
        case tempo <= 60:
            return (classification.textContent = 'Adagio');
        case tempo <= 70:
            return (classification.textContent = 'Adagietto');
        case tempo <= 85:
            return (classification.textContent = 'Andante');
        case tempo <= 97:
            return (classification.textContent = 'Moderato');
        case tempo <= 109:
            return (classification.textContent = 'Allegretto');
        case tempo <= 132:
            return (classification.textContent = 'Allegro');
        case tempo <= 140:
            return (classification.textContent = 'Vivace');
        case tempo <= 177:
            return (classification.textContent = 'Presto');
        case tempo <= 240:
            return (classification.textContent = 'Prestissimo');
    }
}

// Inicializar el metrónomo
function init() {
    startStopButton.addEventListener('click', startStop);
    decrementButton.addEventListener('click', decrementTempo);
    incrementButton.addEventListener('click', incrementTempo);
    bpmSlider.addEventListener('input', handleBpmChange);
}

init();
