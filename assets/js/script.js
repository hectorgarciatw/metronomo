const bpmDisplay = document.getElementById('bpm');
const startStopButton = document.getElementById('startStopButton');
const bpmSlider = document.getElementById('bpmSlider');
let isPlaying = false;
let tempo = parseInt(bpmSlider.value);
let interval;

const startButtonContent = document.getElementById('startStopButton').innerHTML;
const tickSound = document.getElementById('tickSound');

function startStop() {
    if (isPlaying) {
        stopMetronome();
    } else {
        startMetronome();
    }
}

function startMetronome() {
    interval = setInterval(() => {
        tickSound.play();
    }, 60000 / tempo);
    startStopButton.innerHTML = `
        <span class="bx bx-stop-circle me-2"></span>
        Frenar
    `;
    isPlaying = true;
}

function stopMetronome() {
    clearInterval(interval);
    startStopButton.innerHTML = startButtonContent;
    isPlaying = false;
}

startStopButton.addEventListener('click', startStop);

bpmSlider.addEventListener('input', function () {
    tempo = parseInt(this.value);
    bpmDisplay.textContent = tempo;

    if (isPlaying) {
        stopMetronome();
        startMetronome();
    }
});
