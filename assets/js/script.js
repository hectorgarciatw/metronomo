const bpmDisplay = document.getElementById('bpm');
const startStopButton = document.getElementById('startStopButton');
const decrementButton = document.getElementById('decrementButton');
const incrementButton = document.getElementById('incrementButton');
const incrementBeatCount = document.getElementById('incrementBeatCount');
const decrementBeatCount = document.getElementById('decrementBeatCount');
const beatsDisplay = document.getElementById('beatsDisplay');
const bpmSlider = document.getElementById('bpmSlider');
const classification = document.getElementById('classification');
const musicalNote = document.querySelector('.bx.bxs-music');
const startButtonContent = document.getElementById('startStopButton').innerHTML;
const beatsCircle = document.getElementById('beatsCircle');
const audioOptions = document.getElementById('audioOptions');

//Audio embebido en el html
let tickSound = document.getElementById('tickSound1');
let tickSound2 = document.getElementById('tickSound2');
let tickSound3 = document.getElementById('tickSound3');
let tickSound4 = document.getElementById('tickSound4');

let isPlaying = false;
let tempo = parseInt(bpmSlider.value);
let interval;
// Representa el beat que está sonando
let beat = 0;
// Representa la cantidad de beats en pantalla
let beatSize = 4;
//Representa la cantidad de elementos representantes de los beats
let beatCircles;

// Pinto el beat que esta sonando actualmente
function paintBeat(circleNumber) {
    beatCircles = document.querySelectorAll('.beat-circle');
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
    <i class="bx bx-stop-circle bx-md"></i>
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
    tickSound.play();
    paintBeat(beat % beatSize);
    beat++;
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

// Agrega un nuevo indicador de pulso en pantalla
function incrementBeatDisplay() {
    let beats = parseInt(beatsDisplay.textContent);
    if (beats < 8) {
        beats++;
        beatSize++;
        let newBeatCircle = document.createElement('div');
        newBeatCircle.className = 'beat-circle';
        beatsCircles.insertBefore(newBeatCircle, beatsCircles.firstChild);
        beatsDisplay.textContent = beats;
    }
}

// Elimino un indicar de pulso de pantalla
function decrementBeatDisplay() {
    let beats = parseInt(beatsDisplay.textContent);
    if (beats > 1) {
        beats--;
        beatSize--;
        // Obtener todos los elementos 'beat-circle' dentro de beatsCircles
        let beatCircles = document.querySelectorAll('#beatsCircles .beat-circle');
        // Verificar que haya al menos un beat-circle que no sea beatPill
        if (beatCircles.length > 1) {
            // Eliminar el último beat-circle que no sea beatPill
            for (let i = beatCircles.length - 1; i >= 0; i--) {
                if (!beatCircles[i].classList.contains('beatPill')) {
                    beatsCircles.removeChild(beatCircles[i]);
                    break;
                }
            }
        }
        beatsDisplay.textContent = beats;
    }
}

function changeAudioOptions() {
    let selectedValue = this.value;
    switch (selectedValue) {
        case '1':
            console.log('Se seleccionó Clásico');
            break;
        case '2':
            tickSound = tickSound2;
            break;
        case '3':
            tickSound = tickSound3;
            break;
        case '4':
            tickSound = tickSound4;
            break;
        default:
            console.log('Opción no reconocida');
    }
}

// Inicializar el metrónomo
function init() {
    startStopButton.addEventListener('click', startStop);
    decrementButton.addEventListener('click', decrementTempo);
    incrementButton.addEventListener('click', incrementTempo);
    incrementBeatCount.addEventListener('click', incrementBeatDisplay);
    decrementBeatCount.addEventListener('click', decrementBeatDisplay);
    audioOptions.addEventListener('change', changeAudioOptions);
    bpmSlider.addEventListener('input', handleBpmChange);
}

// TAP TEMPO ---- Variable para almacenar los tiempos de los clics
let tapTimes = [];
const tapTempoButton = document.getElementById('tapTempoButton');

// Función para manejar los clics en el botón de tap tempo
function handleTapTempo() {
    const now = Date.now();

    // Añadir el tiempo del clic a la lista
    tapTimes.push(now);

    // Limitar la lista de tiempos a los últimos 4 clics para mantenerla fresca
    if (tapTimes.length > 4) {
        tapTimes.shift();
    }

    // Calcular el tempo basado en los tiempos de los últimos clics
    let sum = 0;
    for (let i = 1; i < tapTimes.length; i++) {
        sum += tapTimes[i] - tapTimes[i - 1];
    }
    const averageInterval = sum / (tapTimes.length - 1);
    const tempo = Math.round(60000 / averageInterval);

    console.log(`New tempo: ${tempo}`);
    //updateTempo(tempo)
    updateMetronome();
    updateTempoDisplay();
}

// Inicializar el botón de tap tempo
tapTempoButton.addEventListener('click', handleTapTempo);

// FIN TAP TEMPO

init();
