const bpmDisplay = document.getElementById("bpm");
const startStopButton = document.getElementById("startStopButton");
const decrementButton = document.getElementById("decrementButton");
const incrementButton = document.getElementById("incrementButton");
const incrementBeatCount = document.getElementById("incrementBeatCount");
const decrementBeatCount = document.getElementById("decrementBeatCount");
const beatsDisplay = document.getElementById("beatsDisplay");
const bpmSlider = document.getElementById("bpmSlider");
const classification = document.getElementById("classification");
const musicalNote = document.querySelector(".bx.bxs-music");
const startButtonContent = document.getElementById("startStopButton").innerHTML;
const beatsCircle = document.getElementById("beatsCircle");
const audioOptions = document.getElementById("audioOptions");
const darkModeSwitch = document.getElementById("modo-oscuro-switch");
const firstBeatToogle = document.getElementById("firstBeatToogle");
const volumeSwitch = document.getElementById("volume-switch");
const fullVolume = document.querySelector(".full-volume-icon");
const lowVolume = document.querySelector(".low-volume-icon");

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
let tickNumber = 0;
// Aloja la figura de subdivisión seleccionada por el usuario
let beatFigure;
// Variable para el contexto de audio
let audioContext;
// Variable para el sonido del tick
let tickSound;
// Almacena los buffers de audio de los sonidos del ticks
let tickSources = [];

// Cambiar la subdivisión correspondiente
function changeSubdivision() {
    beatFigure = parseInt(this.value);
    updateMetronome();
}

// Variable para el nodo de ganancia
let gainNode;

// Función para crear el nodo de ganancia (vinculado al manejo del volumen)
function createGainNode() {
    // Crear un nodo de ganancia
    gainNode = audioContext.createGain();
    // Conectar el nodo de ganancia al destino de audio
    gainNode.connect(audioContext.destination);
}

// Función para cargar los sonidos del tick como buffers de audio
function preloadSounds() {
    // Contexto de audio
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    // Rutas de los archivos de audio
    const tickSoundUrls = ["/assets/audios/classic.mp3", "/assets/audios/loud.mp3", "/assets/audios/naturalHigh.mp3", "/assets/audios/can.mp3"];

    // Cargar cada sonido como un buffer de audio
    tickSoundUrls.forEach((soundUrl, index) => {
        loadSound(soundUrl, index);
    });
}

// Carga del sonido
function loadSound(soundUrl, index) {
    // Añade el parámetro 'index'
    let xhr = new XMLHttpRequest();
    xhr.open("GET", soundUrl, true);
    xhr.responseType = "arraybuffer";

    xhr.onload = function () {
        audioContext.decodeAudioData(
            xhr.response,
            function (buffer) {
                // Almacena el buffer en tickSources en la posición correspondiente
                tickSources[index] = buffer;

                // Una vez cargado el sonido, puedes conectarlo al nodo de ganancia
                let source = audioContext.createBufferSource();
                source.buffer = tickSources[index];

                // Conecta el nodo de buffer source al nodo de ganancia
                source.connect(gainNode);
            },
            function (error) {
                console.error("Error al decodificar el archivo de audio:", error);
            }
        );
    };

    xhr.send();
}

// Activación/Desactivación del sonido
function changeVolume(volume) {
    gainNode.gain.value = volume;
}

// Reproducción del Tick
function playTickSound(index) {
    let source = audioContext.createBufferSource();
    source.buffer = tickSources[index];
    source.connect(audioContext.destination);
    source.start(0);
}

// Variable para rastrear si se ha modificado el buffer para el primer tick
let firstTickModified = false;

// Reproducir del sonido en general
function tick() {
    // Seleccionar el buffer del sonido del tick basado en tickNumber
    let tickBuffer = tickSources[tickNumber];

    if (tickBuffer) {
        // Crear un buffer source
        let source = audioContext.createBufferSource();
        source.buffer = tickBuffer;
        // Conectar el buffer source al nodo de ganancia
        source.connect(gainNode);
        // Reproducir el sonido del tick
        source.start(0);
        paintBeat(beat % beatSize);
        beat++;
    } else {
        console.error("Buffer de audio no encontrado para tickNumber:", tickNumber);
    }
}

document.getElementById("figureOptions").addEventListener("change", changeSubdivision);

// Toogle del modo oscuro/claro
document.getElementById("modo-oscuro-switch").addEventListener("change", (event) => {
    if (event.target.checked) {
        // Cambiar al modo oscuro
        document.querySelector(".modo-claro-icon").style.display = "none";
        document.querySelector(".modo-oscuro-icon").style.display = "inline-block";
        document.body.classList.add("dark-mode");
    } else {
        // Cambiar al modo claro
        document.querySelector(".modo-oscuro-icon").style.display = "none";
        document.querySelector(".modo-claro-icon").style.display = "inline-block";
        document.body.classList.remove("dark-mode");
    }
});

document.getElementById("volume-switch").addEventListener("change", (event) => {
    if (event.target.checked) {
        changeVolume(1);
        lowVolume.style.display = "none";
        fullVolume.style.display = "inline-block";
    } else {
        console.log("APAGAR");
        changeVolume(0);
        fullVolume.style.display = "none";
        lowVolume.style.display = "inline-block";
    }
});

timeInput.addEventListener("input", function () {
    let value = this.value;
    // Elimina cualquier carácter que no sea un número o ":"
    value = value.replace(/[^0-9:]/g, "");
    // Divide el valor en minutos y segundos
    let parts = value.split(":");
    let minutes = parseInt(parts[0]) || 0;
    let seconds = parseInt(parts[1]) || 0;
    // Asegúrate de que los minutos estén en el rango de 0 a 59
    minutes = Math.min(Math.max(0, minutes), 59);
    // Asegúrate de que los segundos estén en el rango de 0 a 59
    seconds = Math.min(Math.max(0, seconds), 59);
    // Formatea los minutos y segundos para que tengan siempre dos dígitos
    let formattedMinutes = String(minutes).padStart(2, "0");
    let formattedSeconds = String(seconds).padStart(2, "0");
    // Actualiza el valor del input con el nuevo formato "mm:ss"
    this.value = formattedMinutes + ":" + formattedSeconds;
});

// Agrega eventos de clic para permitir la edición directa de minutos y segundos
timeInput.addEventListener("click", function (event) {
    const selection = window.getSelection().toString();
    if (selection === "") {
        // Determina si el clic se realizó en la parte de minutos o segundos
        const cursorPos = this.selectionStart;
        // Primeros dos caracteres son minutos
        const isMinutes = cursorPos <= 1;
        // Después del segundo carácter son segundos
        const isSeconds = cursorPos > 2;

        // Si es minutos o segundos, selecciona el valor para permitir la edición directa
        if (isMinutes) {
            // Selecciona los minutos
            this.setSelectionRange(0, 2);
        } else if (isSeconds) {
            // Selecciona los segundos
            this.setSelectionRange(3, 5);
        }
    }
});

// Pinto el beat que esta sonando actualmente en la sección de Latidos
function paintBeat(circleNumber) {
    beatCircles = document.querySelectorAll(".beat-circle");
    beatCircles.forEach((beatCircle, index) => {
        if (index === circleNumber && beatCircle.style.backgroundColor !== "#ff3a27") {
            beatCircle.style.backgroundColor = "#ff3a27";
        } else if (beatCircle.style.backgroundColor !== "#8d8c8c") {
            beatCircle.style.backgroundColor = "#8d8c8c";
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
    musicalNote.classList.add("bx-tada");
    startStopButton.innerHTML = `
    <i class="bx bx-stop-circle bx-md"></i>
    `;
    isPlaying = true;

    if (stopwatchCheck.checked) {
        // Si el checkbox está marcado, comenzar el cronómetro
        const startTime = timeInput.value.split(":");
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
            timeInput.value = minutos.toString().padStart(2, "0") + ":" + segundos.toString().padStart(2, "0");
        }, 1000);
    }
}

function stopMetronome() {
    clearInterval(interval);
    clearInterval(intervalID);
    musicalNote.classList.remove("bx-tada");
    startStopButton.innerHTML = startButtonContent;
    isPlaying = false;
    clearInterval(intervalID);
    stopwatchCheck.checked = false;
    stopwatchCheck.disabled = false;
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
            return (classification.textContent = "Larghissimo");
        case tempo <= 40:
            return (classification.textContent = "Grave");
        case tempo <= 45:
            return (classification.textContent = "Lento");
        case tempo <= 50:
            return (classification.textContent = "Largo");
        case tempo <= 60:
            return (classification.textContent = "Adagio");
        case tempo <= 70:
            return (classification.textContent = "Adagietto");
        case tempo <= 85:
            return (classification.textContent = "Andante");
        case tempo <= 97:
            return (classification.textContent = "Moderato");
        case tempo <= 109:
            return (classification.textContent = "Allegretto");
        case tempo <= 132:
            return (classification.textContent = "Allegro");
        case tempo <= 140:
            return (classification.textContent = "Vivace");
        case tempo <= 177:
            return (classification.textContent = "Presto");
        case tempo <= 240:
            return (classification.textContent = "Prestissimo");
    }
}

// Agrega un nuevo indicador de pulso en pantalla
function incrementBeatDisplay() {
    let beats = parseInt(beatsDisplay.textContent);
    if (beats < 8) {
        beats++;
        beatSize++;
        let newBeatCircle = document.createElement("div");
        newBeatCircle.className = "beat-circle";
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
        let beatCircles = document.querySelectorAll("#beatsCircles .beat-circle");
        // Verificar que haya al menos un beat-circle que no sea beatPill
        if (beatCircles.length > 1) {
            // Eliminar el último beat-circle que no sea beatPill
            for (let i = beatCircles.length - 1; i >= 0; i--) {
                if (!beatCircles[i].classList.contains("beatPill")) {
                    beatsCircles.removeChild(beatCircles[i]);
                    break;
                }
            }
        }
        beatsDisplay.textContent = beats;
    }
}

// Selección de tipos de ticks
function changeAudioOptions() {
    let selectedValue = this.value;
    switch (selectedValue) {
        case "1":
            tickNumber = 0;
            break;
        case "2":
            tickNumber = 1;
            break;
        case "3":
            tickNumber = 2;
            break;
        case "4":
            tickNumber = 3;
            break;
        default:
            console.log("Opción no reconocida");
            return;
    }
}

// Inicializar el metrónomo
function init() {
    startStopButton.addEventListener("click", startStop);
    decrementButton.addEventListener("click", decrementTempo);
    incrementButton.addEventListener("click", incrementTempo);
    incrementBeatCount.addEventListener("click", incrementBeatDisplay);
    decrementBeatCount.addEventListener("click", decrementBeatDisplay);
    audioOptions.addEventListener("change", changeAudioOptions);
    bpmSlider.addEventListener("input", handleBpmChange);
    preloadSounds();
}

// TAP TEMPO ---- Variable para almacenar los tiempos de los clics
let tapTimes = [];
const tapTempoButton = document.getElementById("tapTempoButton");

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
        console.log("Not enough clicks to calculate tempo.");
    }
}

// Inicializar el botón de tap tempo
tapTempoButton.addEventListener("click", handleTapTempo);

// FIN TAP TEMPO

init();
createGainNode();
