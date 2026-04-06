// ─── STATE ───────────────────────────────────────────────────
let state = {
  teamId: null,
  teamName: null,
  riddles: [],
  currentIndex: 0,
  startTime: null,
  riddleStartTime: null,
  hintShown: false,
  attempts: 0,
  hintTimerInterval: null,
  cooldownTimeout: null,
  cooldownInterval: null,
};

const HINT_DELAY_MS   = 10 * 60 * 1000;
const MAX_ATTEMPTS    = 5;
const COOLDOWN_MS     = 30 * 1000;

// ─── UTILS ───────────────────────────────────────────────────
function $(id) { return document.getElementById(id); }

function normalizeAnswer(str) {
  return str.trim().toLowerCase().replace(/\s+/g, '');
}

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function formatTimeHuman(ms) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m} min ${String(s).padStart(2,'0')} sek`;
}

// ─── SAVE / LOAD PROGRESS ────────────────────────────────────
function saveProgress() {
  const data = {
    teamId: state.teamId,
    currentIndex: state.currentIndex,
    startTime: state.startTime,
  };
  localStorage.setItem('cq_progress', JSON.stringify(data));
}

function loadProgress() {
  try {
    const raw = localStorage.getItem('cq_progress');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function clearProgress() {
  localStorage.removeItem('cq_progress');
}

// ─── SCREENS ─────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
}

// ─── START SCREEN ────────────────────────────────────────────
function initStartScreen() {
  const saved = loadProgress();
  if (saved && TEAMS[saved.teamId]) {
    const resume = confirm(
      `Pokračovať za ${TEAMS[saved.teamId].name}? (hádanka ${saved.currentIndex + 1})`
    );
    if (resume) {
      state.teamId      = saved.teamId;
      state.teamName    = TEAMS[saved.teamId].name;
      state.riddles     = TEAMS[saved.teamId].riddles;
      state.currentIndex = saved.currentIndex;
      state.startTime   = saved.startTime;
      startRiddle();
      return;
    } else {
      clearProgress();
    }
  }

  showScreen('screen-start');
  renderTeamButtons();
  $('btn-start').disabled = true;
}

function renderTeamButtons() {
  const grid = $('team-grid');
  grid.innerHTML = '';
  Object.entries(TEAMS).forEach(([id, team]) => {
    const btn = document.createElement('button');
    btn.className = 'team-btn';
    btn.textContent = team.name;
    btn.dataset.teamId = id;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.team-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      $('btn-start').disabled = false;
      state.teamId = id;
    });
    grid.appendChild(btn);
  });
}

$('btn-start').addEventListener('click', () => {
  if (!state.teamId) return;
  state.teamName  = TEAMS[state.teamId].name;
  state.riddles   = TEAMS[state.teamId].riddles;
  state.currentIndex = 0;
  state.startTime = Date.now();
  saveProgress();
  startRiddle();
});

// ─── RIDDLE SCREEN ────────────────────────────────────────────
function startRiddle() {
  state.riddleStartTime = Date.now();
  state.hintShown  = false;
  state.attempts   = 0;

  stopHintTimer();
  renderRiddle();
  showScreen('screen-riddle');
  startHintTimer();
  startLiveTimer();
}

function renderRiddle() {
  const riddle = state.riddles[state.currentIndex];
  const total  = state.riddles.length;
  const idx    = state.currentIndex;

  $('level-badge-text').textContent = `Hádanka ${idx + 1} z ${total}`;
  $('progress-fill').style.width = `${(idx / total) * 100}%`;

  const img = $('riddle-img');
  if (riddle.image) {
    img.src = riddle.image;
    img.style.display = 'block';
    $('riddle-img-placeholder').style.display = 'none';
  } else {
    img.style.display = 'none';
    $('riddle-img-placeholder').style.display = 'flex';
  }

  $('riddle-question').textContent = riddle.question;

  $('answer-input').value = '';
  $('answer-input').classList.remove('shake');

  $('feedback-error').classList.remove('error');
  $('hint-card').classList.remove('visible');
  $('btn-hint').classList.remove('visible');
  $('attempts-warning').classList.remove('visible');

  renderDots();
}

function renderDots() {
  const container = $('dots-row');
  container.innerHTML = '';
  state.riddles.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot';
    if (i < state.currentIndex) dot.classList.add('done');
    if (i === state.currentIndex) dot.classList.add('active');
    container.appendChild(dot);
  });
}

// ─── TIMER ───────────────────────────────────────────────
let liveTimerInterval = null;
function startLiveTimer() {
  if (liveTimerInterval) clearInterval(liveTimerInterval);
  updateLiveTimer();
  liveTimerInterval = setInterval(updateLiveTimer, 1000);
}
function updateLiveTimer() {
  const elapsed = Date.now() - state.startTime;
  $('timer-badge').textContent = formatTime(elapsed);
}

// ─── HINT TIMER ───────────────────────────────────────────────
function startHintTimer() {
  stopHintTimer();
  state.hintTimerInterval = setTimeout(() => {
    if (!state.hintShown) {
      $('btn-hint').classList.add('visible');
    }
  }, HINT_DELAY_MS);
}
function stopHintTimer() {
  if (state.hintTimerInterval) clearTimeout(state.hintTimerInterval);
}

// ─── ANSWER CHECK ─────────────────────────────────────────────
function checkAnswer() {
  const input   = $('answer-input');
  const val     = input.value;
  const riddle  = state.riddles[state.currentIndex];

  if (!val.trim()) return;

  if (normalizeAnswer(val) === normalizeAnswer(riddle.answer)) {
    onCorrectAnswer();
  } else {
    onWrongAnswer(input);
  }
}

function onCorrectAnswer() {
  stopHintTimer();
  if (liveTimerInterval) clearInterval(liveTimerInterval);

  $('answer-input').value = '';
  $('feedback-error').classList.remove('error');

  showScreen('screen-success');

  const isLast = state.currentIndex === state.riddles.length - 1;

  $('success-sub').textContent = isLast
    ? 'Posledná hádanka vyriešená! Skvelá práca tímu.'
    : 'Našli ste správne miesto. Pokračujte na ďalší bod.';

  $('btn-next-riddle').textContent = isLast
    ? 'Zobraziť výsledok'
    : 'Ďalšia hádanka →';

  $('btn-next-riddle').onclick = isLast ? showFinal : goNextRiddle;
}

function onWrongAnswer(input) {
  state.attempts++;
  input.classList.remove('shake');
  void input.offsetWidth;
  input.classList.add('shake');
  $('feedback-error').classList.add('error');

  if (state.attempts >= MAX_ATTEMPTS) {
    startCooldown();
  } else {
    const left = MAX_ATTEMPTS - state.attempts;
    if (left <= 2) {
      $('attempts-warning').textContent = `Zostáva pokusov: ${left}`;
      $('attempts-warning').classList.add('visible');
    }
  }
}

// ─── COOLDOWN ─────────────────────────────────────────────────
function startCooldown() {
  const overlay = $('cooldown-overlay');
  overlay.classList.add('visible');

  $('answer-input').disabled = true;
  $('btn-check').disabled    = true;

  let remaining = Math.floor(COOLDOWN_MS / 1000);
  $('cooldown-timer-text').textContent = remaining;

  state.cooldownInterval = setInterval(() => {
    remaining--;
    $('cooldown-timer-text').textContent = remaining;

    if (remaining <= 0) {
      clearInterval(state.cooldownInterval);
      overlay.classList.remove('visible');

      $('answer-input').disabled = false;
      $('btn-check').disabled    = false;
      $('answer-input').value    = '';

      state.attempts = 0;
      $('attempts-warning').classList.remove('visible');
    }
  }, 1000);
}

// ─── HINT ────────────────────────────────────────────────────
$('btn-hint').addEventListener('click', () => {
  const riddle = state.riddles[state.currentIndex];
  $('hint-text').textContent = riddle.hint;
  $('hint-card').classList.add('visible');
  $('btn-hint').classList.remove('visible');
  state.hintShown = true;
});

// ─── NAVIGATION ───────────────────────────────────────────────
function goNextRiddle() {
  state.currentIndex++;
  saveProgress();
  startRiddle();
}

function showFinal() {
  clearProgress();
  const totalTime = Date.now() - state.startTime;

  $('final-team-name').textContent = state.teamName;
  $('final-time').textContent = formatTime(totalTime);
  $('final-time-human').textContent = formatTimeHuman(totalTime);

  showScreen('screen-final');

  if (liveTimerInterval) clearInterval(liveTimerInterval);
}

$('btn-next-riddle').addEventListener('click', () => {});

// ─── ENTER KEY ────────────────────────────────────────────────
$('answer-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') checkAnswer();
});
$('btn-check').addEventListener('click', checkAnswer);

// ─── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', initStartScreen);
