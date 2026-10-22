const TRACKS = ['Kick', 'Snare', 'HiHat', 'Clap'];
let isPlaying = false, stepIdx = 0, intervalId = null;

function getStepInterval(bpm) {
  return (60 / bpm / 4) * 1000;
}

if (typeof document !== 'undefined') {
  let audioCtx = null;
  function playSound(type) {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    if (type === 'Kick') {
      osc.frequency.setValueAtTime(150, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
    } else if (type === 'HiHat') {
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    } else {
      osc.frequency.setValueAtTime(250, audioCtx.currentTime);
    }
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
    osc.start(); osc.stop(audioCtx.currentTime + 0.2);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('stepGrid');
    TRACKS.forEach(track => {
      const row = document.createElement('div');
      row.className = 'track';
      row.innerHTML = `<span class="track-name">${track}</span>` + 
        Array.from({length: 16}, (_, i) => `<div class="step" data-track="${track}" data-step="${i}"></div>`).join('');
      grid.appendChild(row);
    });

    grid.addEventListener('click', (e) => {
      if (e.target.classList.contains('step')) e.target.classList.toggle('active');
    });

    const playBtn = document.getElementById('playBtn');
    playBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      playBtn.textContent = isPlaying ? '⏹ Stop Beat' : '▶ Play Beat';
      if (isPlaying) {
        const bpm = parseInt(document.getElementById('bpm').value) || 120;
        intervalId = setInterval(() => {
          document.querySelectorAll('.step.current').forEach(s => s.classList.remove('current'));
          document.querySelectorAll(`.step[data-step="${stepIdx}"]`).forEach(s => {
            s.classList.add('current');
            if (s.classList.contains('active')) playSound(s.dataset.track);
          });
          stepIdx = (stepIdx + 1) % 16;
        }, getStepInterval(bpm));
      } else {
        clearInterval(intervalId);
      }
    });
  });
}
if (typeof module !== 'undefined') module.exports = { getStepInterval, TRACKS };
