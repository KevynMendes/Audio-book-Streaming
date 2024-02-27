const audioCapitulo = document.getElementById("audio-capitulo");
const botaoPlayPause = document.getElementById("play-pause");
const botaoProximoCapitulo = document.getElementById("proximo");
const botaoCapituloAnterior = document.getElementById("anterior");
const quantidadeCapitulos = 10;
const nomeCapitulo = document.getElementById("capitulo");
let taTocando = false;
let capitulo = 1;

botaoPlayPause.addEventListener("click", tocarOuPausarFaixa);
botaoProximoCapitulo.addEventListener("click", proximoCapitulo);
botaoCapituloAnterior.addEventListener("click", capituloAnterior);
audioCapitulo.addEventListener("ended", proximoCapitulo);

function tocarFaixa() {
    botaoPlayPause.classList.remove("bi-play-circle");
    botaoPlayPause.classList.add("bi-pause-circle");
    audioCapitulo.play();
    taTocando = true;
}

function pausarFaixa() {
    botaoPlayPause.classList.add("bi-play-circle");
    botaoPlayPause.classList.remove("bi-pause-circle");
    audioCapitulo.pause();
    taTocando = false;
}

function tocarOuPausarFaixa() {
    if (taTocando === true) {
        pausarFaixa();
    } else {
        tocarFaixa();
    }
}

function proximoCapitulo() {
    if (capitulo < quantidadeCapitulos) {
        capitulo += 1;
    } else {
        capitulo = 1;
    }

    audioCapitulo.src = "./src/books/dom-casmurro/" + capitulo + ".mp3";
    nomeCapitulo.innerText = "Capítulo " + capitulo;
    tocarFaixa();
}

function capituloAnterior() {
    if (capitulo === 1) {
        capitulo = quantidadeCapitulos;
    } else {
        capitulo -= 1;
    }

    audioCapitulo.src = "./src/books/dom-casmurro/" + capitulo + ".mp3";
    nomeCapitulo.innerText = "Capítulo " + capitulo;
    tocarFaixa();
}

const botaoVoltar15 = document.getElementById("voltar15");
const botaoAvancar15 = document.getElementById("avancar15");

botaoVoltar15.addEventListener("click", voltar15Segundos);

botaoAvancar15.addEventListener("click", avancar15Segundos);

function avancar15Segundos() {
    audioCapitulo.currentTime += 15;
}

function voltar15Segundos() {
    audioCapitulo.currentTime -= 15;
}


function adjustVolume(volume) {
    audioCapitulo.volume = volume;
}

var volumeControl = document.getElementById("volumeControl");
var volume = 0.5; // Volume inicial

// volume padrão
audioCapitulo.volume = volume;

// Função para atualizar o volume do áudio
function updateVolume(newVolume) {
    volume = newVolume;
    audioCapitulo.volume = volume;
}

function toggleMute() {
    if (audioCapitulo.muted) {
        audioCapitulo.muted = false; // Desmutar o áudio
        document.getElementById("vol").classList.remove("bi-volume-mute-fill");
        document.getElementById("vol").classList.add("bi-volume-up-fill");
    } else {
        audioCapitulo.muted = true; // Mutar o áudio
        document.getElementById("vol").classList.remove("bi-volume-up-fill");
        document.getElementById("vol").classList.add("bi-volume-mute-fill");
    }
}

// Adicionar evento de rolagem do mouse para ajustar o volume
volumeControl.addEventListener("wheel", function(event) {
    event.preventDefault(); // Evitar rolar a página ao usar o scroll do mouse

    var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

    // Ajustar o volume com base na direção do scroll do mouse
    var newVolume = Math.max(0, Math.min(1, volume + (delta * 0.05))); // Aumenta ou diminui o volume

    // Atualizar o volume do áudio
    updateVolume(newVolume);
    updateVolumeSliderPosition(); // Atualizar a posição da bolinha do controle de volume
});

// Adicionar eventos de mouse para arrastar o controle de volume
var isDragging = false;

volumeControl.addEventListener("mousedown", function(event) {
    isDragging = true;
    updateVolumeOnClick(event);
});

document.addEventListener("mousemove", function(event) {
    if (isDragging) {
        updateVolumeOnClick(event);
    }
});

document.addEventListener("mouseup", function() {
    isDragging = false;
});

// Atualizar o volume do áudio com base na posição do controle deslizante ao ser clicado
function updateVolumeOnClick(event) {
    var boundingRect = volumeControl.getBoundingClientRect();
    var offsetX = event.clientX - boundingRect.left;
    var width = boundingRect.width;
    var newVolume = Math.max(0, Math.min(1, offsetX / width));

    // Atualizar o volume do áudio
    updateVolume(newVolume);
    updateVolumeSliderPosition();
}

// Função para atualizar a posição da bolinha do controle de volume
function updateVolumeSliderPosition() {
    var thumbWidth = volumeControl.offsetWidth * volume;
    volumeControl.style.setProperty("--thumb-position", thumbWidth + "px");
}

// Atualizar a posição da bolinha do controle de volume quando a página é carregada
window.addEventListener("load", updateVolumeSliderPosition)

// Atualiza o controle deslizante de progresso da música
function updateProgressSlider() {
    var progressSlider = document.getElementById("progressSlider");
    var progress = (audioCapitulo.currentTime / audioCapitulo.duration) * 100;
    progressSlider.value = progress;
}

// Avança/retrocede a música para a posição desejada quando o controle deslizante é arrastado
function seekTo(progress) {
    var seekToTime = (progress / 100) * audioCapitulo.duration;
    audioCapitulo.currentTime = seekToTime;
}

// Atualiza o controle deslizante de progresso e o tempo atual periodicamente
audioCapitulo.addEventListener("timeupdate", function() {
    updateProgressSlider();
    updateCurrentTime();
});

// Atualiza o tempo atual da música
function updateCurrentTime() {
    var currentTimeElement = document.getElementById("currentTime");
    currentTimeElement.textContent = formatTime(audioCapitulo.currentTime);
}

// Atualiza o tempo atual da música conforme o controle deslizante de progresso é arrastado
progressSlider.addEventListener("input", function() {
    updateCurrentTime();
});

// Função para formatar o tempo em minutos e segundos
function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);
    return minutes + ":" + (remainingSeconds < 10 ? "0" : "") + remainingSeconds;
}

// Atualiza o tempo da música conforme o controle deslizante de progresso é arrastado
progressSlider.addEventListener("input", function() {
    updateCurrentTime();
});

// Função para calcular quanto tempo falta para o término da música
function updateRemainingTime() {
    var remainingTimeElement = document.getElementById("remainingTime");
    var remainingTime = audioCapitulo.duration - audioCapitulo.currentTime;
    remainingTimeElement.textContent = "-" + formatTime(remainingTime);
}

// Atualize o tempo restante da música periodicamente
audioCapitulo.addEventListener("timeupdate", function() {
    updateRemainingTime();
});

// Atualize o tempo restante da música quando o controle deslizante de progresso é arrastado
progressSlider.addEventListener("input", function() {
    updateRemainingTime();
});

progressSlider.addEventListener("input", function(event) {
    // Obtém o valor atual do controle deslizante de progresso
    var progress = event.target.value;
    // Chama a função seekTo com o valor de progresso
    seekTo(progress);
});

const selectCapitulo = document.getElementById("selectCapitulo");

// Preenche o seletor de capítulos com as opções
for (let i = 1; i <= quantidadeCapitulos; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = "Capítulo " + i;
    selectCapitulo.appendChild(option);
}

// Adiciona um evento para mudar de capítulo quando uma opção for selecionada
selectCapitulo.addEventListener("change", function() {
    capitulo = parseInt(selectCapitulo.value);
    audioCapitulo.src = `./src/books/dom-casmurro/${capitulo}.mp3`;
    nomeCapitulo.innerText = "Capítulo " + capitulo;
    tocarFaixa();
});



