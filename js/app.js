// ─── STATE ───────────────────────────────────────────────────
let state = {
  teamId: null,
  teamName: null,
  riddles: [],
  currentIndex: 0,
  stageIndex: 0,
  startTime: null,
  riddleStartTime: null,
  hintShown: false,
  attempts: 0,
  hintTimerInterval: null,
  cooldownTimeout: null,
  cooldownInterval: null,
};

const DEFAULT_HINT_DELAY_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS  = 5;
const COOLDOWN_MS   = 30 * 1000;

// ─── UTILS ───────────────────────────────────────────────────
function $(id) { return document.getElementById(id); }

function normalizeAnswer(str) {
  return String(str).trim().toLowerCase()
    .replace(/\s+/g, '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '');
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

function getCurrentRiddle() {
  return state.riddles[state.currentIndex];
}

function getCurrentStage() {
  const riddle = getCurrentRiddle();
  return Array.isArray(riddle.stages) ? riddle.stages[state.stageIndex] : null;
}

function getAnswerInputs() {
  return Array.from(document.querySelectorAll('.answer-input'));
}

function getActiveAnswerData(riddle = getCurrentRiddle()) {
  const stage = getCurrentStage();
  if (stage && Object.prototype.hasOwnProperty.call(stage, 'answer')) {
    return {
      answer: stage.answer,
      placeholders: Array.isArray(stage.placeholders) ? stage.placeholders : [],
    };
  }

  return {
    answer: riddle.answer,
    placeholders: Array.isArray(riddle.placeholders) ? riddle.placeholders : [],
  };
}

function isMultiAnswerRiddle(riddle = getCurrentRiddle()) {
  const active = getActiveAnswerData(riddle).answer;
  return Array.isArray(active);
}

function hasAnswerStage(riddle = getCurrentRiddle()) {
  const active = getActiveAnswerData(riddle).answer;
  return active !== undefined && active !== null;
}

function getHintDelayMs(riddle) {
  return riddle.hintDelayMs || DEFAULT_HINT_DELAY_MS;
}

// ─── VIBRATION ───────────────────────────────────────────────
function vibrate(pattern) {
  if (navigator.vibrate) navigator.vibrate(pattern);
}

// ─── SAVE / LOAD PROGRESS ────────────────────────────────────
function saveProgress() {
  const data = {
    teamId: state.teamId,
    currentIndex: state.currentIndex,
    stageIndex: state.stageIndex,
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
  window.scrollTo(0, 0);
}

// ─── START SCREEN ────────────────────────────────────────────
function initStartScreen() {
  const saved = loadProgress();
  if (saved && TEAMS[saved.teamId]) {
    const resume = confirm(
      `Pokračovať za ${TEAMS[saved.teamId].name}? (hádanka ${saved.currentIndex + 1})`
    );
    if (resume) {
      state.teamId       = saved.teamId;
      state.teamName     = TEAMS[saved.teamId].name;
      state.riddles      = TEAMS[saved.teamId].riddles;
      state.currentIndex = saved.currentIndex;
      state.stageIndex   = saved.stageIndex || 0;
      state.startTime    = saved.startTime;
      startRiddle(true);
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
      vibrate(30);
    });
    grid.appendChild(btn);
  });
}

$('btn-start').addEventListener('click', () => {
  if (!state.teamId) return;
  state.teamName     = TEAMS[state.teamId].name;
  state.riddles      = TEAMS[state.teamId].riddles;
  state.currentIndex = 0;
  state.stageIndex   = 0;
  state.startTime    = Date.now();
  saveProgress();
  vibrate(50);
  startRiddle();
});

// ─── RIDDLE SCREEN ────────────────────────────────────────────
function startRiddle(isResume = false) {
  if (!isResume) state.stageIndex = 0;
  state.riddleStartTime = Date.now();
  state.hintShown  = false;
  state.attempts   = 0;

  stopHintTimer();
  renderRiddle();
  showScreen('screen-riddle');
  startHintTimer();
  startLiveTimer();
}

function renderAnswerFields(riddle) {
  const wrap = $('answer-fields');
  wrap.innerHTML = '';
  wrap.className = 'answer-fields';

  const active = getActiveAnswerData(riddle);
  const answers = Array.isArray(active.answer) ? active.answer : [active.answer];
  const placeholders = active.placeholders;

  if (!hasAnswerStage(riddle)) return;

  if (answers.length > 1) {
    wrap.classList.add('multi');
  }

  answers.forEach((_, index) => {
    const input = document.createElement('input');
    input.className = 'answer-input';
    input.type = 'text';
    input.placeholder = placeholders[index] || `Odpoveď ${index + 1}`;
    input.autocomplete = 'off';
    input.autocorrect = 'off';
    input.autocapitalize = 'off';
    input.spellcheck = false;
    input.dataset.index = String(index);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') checkAnswer();
    });
    wrap.appendChild(input);
  });

  const firstInput = getAnswerInputs()[0];
  if (firstInput) firstInput.focus();
}

function renderRiddle() {
  const riddle = getCurrentRiddle();
  const stage = getCurrentStage();
  const total  = state.riddles.length;
  const idx    = state.currentIndex;
  const view = stage || riddle;

  $('level-badge-text').textContent = `Hádanka ${idx + 1} z ${total}`;
  $('progress-fill').style.width = `${(idx / total) * 100}%`;

  const img = $('riddle-img');
  if (view.image) {
    img.src = view.image;
    img.style.display = 'block';
    $('riddle-img-placeholder').style.display = 'none';
  } else {
    img.style.display = 'none';
    $('riddle-img-placeholder').style.display = 'flex';
  }

  $('riddle-question').innerHTML = (view.question || '').replace(/\n/g, '<br>');

  renderAnswerFields(riddle);

  const answerRow = $('answer-row');
  const stageNextBtn = $('btn-stage-next');
  const needsAnswer = hasAnswerStage(riddle);
  const hasMoreStages = Array.isArray(riddle.stages) && state.stageIndex < riddle.stages.length - 1;

  answerRow.style.display = needsAnswer ? 'flex' : 'none';
  stageNextBtn.style.display = (!needsAnswer && hasMoreStages) ? 'block' : 'none';

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

// ─── TIMER ───────────────────────────────────────────────────
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

// ─── HINT TIMER ──────────────────────────────────────────────
function startHintTimer() {
  stopHintTimer();
  const riddle = getCurrentRiddle();
  state.hintTimerInterval = setTimeout(() => {
    if (!state.hintShown) {
      $('btn-hint').classList.add('visible');
    }
  }, getHintDelayMs(riddle));
}
function stopHintTimer() {
  if (state.hintTimerInterval) clearTimeout(state.hintTimerInterval);
}

// ─── STAGES ──────────────────────────────────────────────────
function goNextStage() {
  const riddle = getCurrentRiddle();
  if (!Array.isArray(riddle.stages)) return;
  if (state.stageIndex >= riddle.stages.length - 1) return;

  state.stageIndex++;
  saveProgress();
  vibrate(35);
  renderRiddle();
}

// ─── ANSWER CHECK ─────────────────────────────────────────────
function checkAnswer() {
  const riddle = getCurrentRiddle();
  const active = getActiveAnswerData(riddle);
  const inputs = getAnswerInputs();
  const values = inputs.map(input => input.value);

  if (values.every(val => !val.trim())) return;

  const isCorrect = Array.isArray(active.answer)
    ? values.length === active.answer.length && values.every((val, index) => normalizeAnswer(val) === normalizeAnswer(active.answer[index]))
    : normalizeAnswer(values[0] || '') === normalizeAnswer(active.answer);

  if (isCorrect) {
    onCorrectAnswer();
  } else {
    onWrongAnswer(inputs);
  }
}

function onCorrectAnswer() {
  stopHintTimer();
  if (liveTimerInterval) clearInterval(liveTimerInterval);

  vibrate([50, 30, 100]);

  getAnswerInputs().forEach(input => {
    input.value = '';
    input.classList.remove('shake');
  });
  $('feedback-error').classList.remove('error');

  showScreen('screen-success');

  const isLast = state.currentIndex === state.riddles.length - 1;

  $('success-sub').textContent = isLast
    ? 'Posledná hádanka vyriešená! Skvelá práca tímu.'
    : 'Správne miesto! Pokračujte na ďalší bod.';

  $('btn-next-riddle').textContent = isLast
    ? 'Zobraziť výsledok'
    : 'Ďalšia hádanka →';

  $('btn-next-riddle').onclick = isLast ? showFinal : goNextRiddle;
}

function onWrongAnswer(inputs) {
  state.attempts++;
  vibrate([80, 20, 80]);

  inputs.forEach(input => {
    input.classList.remove('shake');
    void input.offsetWidth;
    input.classList.add('shake');
  });
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

  getAnswerInputs().forEach(input => {
    input.disabled = true;
    input.value = '';
  });
  $('btn-check').disabled = true;

  let remaining = Math.floor(COOLDOWN_MS / 1000);
  $('cooldown-timer-text').textContent = remaining;

  state.cooldownInterval = setInterval(() => {
    remaining--;
    $('cooldown-timer-text').textContent = remaining;

    if (remaining <= 0) {
      clearInterval(state.cooldownInterval);
      overlay.classList.remove('visible');

      getAnswerInputs().forEach(input => {
        input.disabled = false;
        input.value = '';
      });
      $('btn-check').disabled = false;

      state.attempts = 0;
      $('attempts-warning').classList.remove('visible');
    }
  }, 1000);
}

// ─── HINT ────────────────────────────────────────────────────
$('btn-hint').addEventListener('click', () => {
  const riddle = getCurrentRiddle();
  $('hint-text').textContent = riddle.hint;
  $('hint-card').classList.add('visible');
  $('btn-hint').classList.remove('visible');
  state.hintShown = true;
  vibrate(20);
});

// ─── NAVIGATION ───────────────────────────────────────────────
function goNextRiddle() {
  state.currentIndex++;
  state.stageIndex = 0;
  saveProgress();
  startRiddle();
}

function showFinal() {
  clearProgress();
  const totalTime = Date.now() - state.startTime;

  $('final-team-name').textContent = state.teamName;
  $('final-time').textContent      = formatTime(totalTime);
  $('final-time-human').textContent = formatTimeHuman(totalTime);

  showScreen('screen-final');
  vibrate([100, 50, 100, 50, 200]);

  if (liveTimerInterval) clearInterval(liveTimerInterval);
}

$('btn-next-riddle').addEventListener('click', () => {});
$('btn-check').addEventListener('click', checkAnswer);
$('btn-stage-next').addEventListener('click', goNextStage);

// ─── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', initStartScreen);
