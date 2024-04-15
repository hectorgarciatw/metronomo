const bpmDisplay = document.getElementById("bpm");
const startStopButton = document.getElementById("startStopButton");
const bpmSlider = document.getElementById("bpmSlider");
const classification = document.getElementById("classification");

let isPlaying = false;
let tempo = parseInt(bpmSlider.value);
let interval;

const startButtonContent = document.getElementById("startStopButton").innerHTML;
const tickSound = document.getElementById("tickSound");

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

startStopButton.addEventListener("click", startStop);

bpmSlider.addEventListener("input", function () {
    tempo = parseInt(this.value);
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

    if (isPlaying) {
        stopMetronome();
        startMetronome();
    }
});
