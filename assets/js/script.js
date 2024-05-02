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
const darkModeSwitch = document.getElementById('modo-oscuro-switch');
const volumeRange = document.getElementById('volumeRange');
const firstBeatToogle = document.getElementById('firstBeatToogle');

let isPlaying = false;
let tempo = parseInt(bpmSlider.value);
let interval;
// Representa el beat que está sonando
let beat = 0;
// Representa la cantidad de beats en pantalla
let beatSize = 4;
//Representa la cantidad de elementos representantes de los beats
let beatCircles;
//Para alojar el id del intervalo asociado al cronómetro/temporizador
let intervalID;
// El nro asociado al tick seleccionado
let tickNumber = 1;

// Precarga de los tipos de sonidos de los ticks
function preloadSounds() {
    tickSound = document.getElementById('tickSound1');
    tickSound2 = document.getElementById('tickSound2');
    tickSound3 = document.getElementById('tickSound3');
    tickSound4 = document.getElementById('tickSound4');
}

// Toogle del modo oscuro/claro
document.getElementById('modo-oscuro-switch').addEventListener('change', (event) => {
    if (event.target.checked) {
        // Cambiar al modo oscuro
        document.querySelector('.modo-claro-icon').style.display = 'none';
        document.querySelector('.modo-oscuro-icon').style.display = 'inline-block';
        document.body.classList.add('dark-mode');
    } else {
        // Cambiar al modo claro
        document.querySelector('.modo-oscuro-icon').style.display = 'none';
        document.querySelector('.modo-claro-icon').style.display = 'inline-block';
        document.body.classList.remove('dark-mode');
    }
});

timeInput.addEventListener('input', function () {
    let value = this.value;
    // Elimina cualquier carácter que no sea un número o ":"
    value = value.replace(/[^0-9:]/g, '');
    // Divide el valor en minutos y segundos
    let parts = value.split(':');
    let minutes = parseInt(parts[0]) || 0;
    let seconds = parseInt(parts[1]) || 0;
    // Asegúrate de que los minutos estén en el rango de 0 a 59
    minutes = Math.min(Math.max(0, minutes), 59);
    // Asegúrate de que los segundos estén en el rango de 0 a 59
    seconds = Math.min(Math.max(0, seconds), 59);
    // Formatea los minutos y segundos para que tengan siempre dos dígitos
    let formattedMinutes = String(minutes).padStart(2, '0');
    let formattedSeconds = String(seconds).padStart(2, '0');
    // Actualiza el valor del input con el nuevo formato "mm:ss"
    this.value = formattedMinutes + ':' + formattedSeconds;
});

// Agrega eventos de clic para permitir la edición directa de minutos y segundos
timeInput.addEventListener('click', function (event) {
    const selection = window.getSelection().toString();
    if (selection === '') {
        // Determina si el clic se realizó en la parte de minutos o segundos
        const cursorPos = this.selectionStart;
        const isMinutes = cursorPos <= 1; // Primeros dos caracteres son minutos
        const isSeconds = cursorPos > 2; // Después del segundo carácter son segundos

        // Si es minutos o segundos, selecciona el valor para permitir la edición directa
        if (isMinutes) {
            this.setSelectionRange(0, 2); // Selecciona los minutos
        } else if (isSeconds) {
            this.setSelectionRange(3, 5); // Selecciona los segundos
        }
    }
});

// Ocultar slider del volumen al clickear en botones
document.addEventListener('click', function (event) {
    // Verificar si el clic se realizó en un botón
    if (event.target.tagName === 'BUTTON') {
        // Remover la clase 'active' del slider
        volumeSlider.classList.remove('active');
    }
});

// Escucha el evento clic en el input range
volumeRange.addEventListener('click', function (event) {
    // Evitar que el evento de clic se propague y cierre el slider
    event.stopPropagation();
});

// Escucha el evento clic en el slider
volumeSlider.addEventListener('click', function (event) {
    // Evitar que el evento de clic se propague y cierre el slider
    event.stopPropagation();
});

// Detecto el cambio de volumen
volumeRange.addEventListener('input', () => {
    // Obtener el valor del rango de volumen
    const volumeValue = volumeRange.value;

    // Cambiar el volumen del sonido del tick
    changeVolume(volumeValue / 10); // Dividir por 10 ya que el rango es de 0 a 10
});

// Altera el volumen de reproducción
function changeVolume(volume) {
    // Comprueba de que el volumen esté en el rango de 0 a 1
    volume = Math.max(0, Math.min(1, volume));

    // Establecer el volumen del sonido del tick
    tickSound.volume = volume;
}

// Pinto el beat que esta sonando actualmente
function paintBeat(circleNumber) {
    beatCircles = document.querySelectorAll('.beat-circle');
    beatCircles.forEach((beatCircle, index) => {
        if (index === circleNumber && beatCircle.style.backgroundColor !== '#ff3a27') {
            beatCircle.style.backgroundColor = '#ff3a27';
        } else if (beatCircle.style.backgroundColor !== '#8d8c8c') {
            beatCircle.style.backgroundColor = '#8d8c8c';
        }
    });
}

// Iniciar y detener el metrónomo
function startStop() {
    if (isPlaying) {
        stopwatchCheck.disabled = false;
        stopMetronome();
    } else {
        stopwatchCheck.disabled = true;
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

    if (stopwatchCheck.checked) {
        // Si el checkbox está marcado, comenzar el cronómetro
        const startTime = timeInput.value.split(':');
        let minutos = parseInt(startTime[0]);
        let segundos = parseInt(startTime[1]);

        intervalID = setInterval(() => {
            if (segundos === 0) {
                if (minutos === 0) {
                    stopMetronome();
                    return;
                } else {
                    minutos--;
                    segundos = 59;
                }
            } else {
                segundos--;
            }

            // Actualizar el valor del input con el nuevo tiempo
            timeInput.value = minutos.toString().padStart(2, '0') + ':' + segundos.toString().padStart(2, '0');
        }, 1000);
    }
}

function stopMetronome() {
    clearInterval(interval);
    clearInterval(intervalID);
    musicalNote.classList.remove('bx-tada');
    startStopButton.innerHTML = startButtonContent;
    isPlaying = false;
    clearInterval(intervalID);
    stopwatchCheck.checked = false;
    stopwatchCheck.disabled = false;
}

// Reproducir el sonido del tick
function tick() {
    // Reiniciar la reproducción al principio del audio
    tickSound.currentTime = 0;
    auxTick = tickSound;
    // Se diferencia el primer beat a pedido del usuario
    if (beat % beatSize == 0 && firstBeatToogle.checked && tickNumber != 4) {
        tickSound = tickSound4;
    } else if (beat % beatSize == 0 && firstBeatToogle.checked && tickNumber == 4) {
        tickSound = tickSound2;
    }
    tickSound.play();
    tickSound = auxTick;
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
            tickNumber = 1;
            tickSound = tickSound1;
            break;
        case '2':
            tickNumber = 2;
            tickSound = tickSound2;
            break;
        case '3':
            tickNumber = 3;
            tickSound = tickSound3;
            break;
        case '4':
            tickNumber = 4;
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
    preloadSounds();
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
    tempo = Math.round(60000 / averageInterval);
    if (!isNaN(tempo) && isFinite(tempo)) {
        // Limitar el tempo entre 1 y 240
        tempo = Math.max(1, Math.min(tempo, 240));

        console.log(`New tempo: ${tempo}`);
        //updateTempo(tempo)
        updateMetronome();
        updateTempoDisplay();
    } else {
        // Si el resultado no es un número válido, no actualizamos el tempo
        console.log('Not enough clicks to calculate tempo.');
    }
}

// Inicializar el botón de tap tempo
tapTempoButton.addEventListener('click', handleTapTempo);

// FIN TAP TEMPO

init();
