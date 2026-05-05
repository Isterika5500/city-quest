// ============================================================
//  TRENČÍN QUEST — App Logic
// ============================================================

let state = {
  team: null,
  route: [],
  currentStop: 0,
  phase: 'puzzle'
};

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function startGame(team) {
  state.team = team;
  state.route = ROUTES[team];
  state.currentStop = 0;
  state.phase = 'puzzle';

  document.getElementById('header-team-label').textContent = `TÍM ${team}`;
  document.getElementById('finish-team-label').textContent = `TÍM ${team}`;

  buildProgressDots();
  renderStop();
  showScreen('screen-game');
}

function restartGame() {
  showScreen('screen-intro');
}

// ── Progress ─────────────────────────────────────────────────

function buildProgressDots() {
  const container = document.getElementById('progress-stops');
  container.innerHTML = '';
  state.route.forEach((stopId, i) => {
    const stop = STOPS[stopId];
    const dot = document.createElement('div');
    dot.className = 'progress-dot';
    dot.id = `dot-${i}`;
    dot.innerHTML = `
      <div class="progress-dot-circle">${stop.icon}</div>
      <span class="progress-dot-label">${stop.shortName || stop.name}</span>`;
    container.appendChild(dot);
  });
  updateProgress();
}

function updateProgress() {
  const total = state.route.length;
  const pct = (state.currentStop / (total - 1)) * 100;
  document.getElementById('progress-bar').style.width = pct + '%';
  document.getElementById('stop-counter').textContent = `${state.currentStop + 1} / ${total}`;

  document.querySelectorAll('.progress-dot').forEach((dot, i) => {
    dot.classList.toggle('done', i < state.currentStop);
    dot.classList.toggle('active', i === state.currentStop);
  });

  document.getElementById('btn-back').style.visibility =
    state.currentStop > 0 || state.phase === 'onsite' ? 'visible' : 'hidden';
}

// ── Render ───────────────────────────────────────────────────

function renderStop() {
  const stopId = state.route[state.currentStop];
  const stop = STOPS[stopId];
  const main = document.getElementById('game-main');
  updateProgress();

  main.innerHTML = state.phase === 'puzzle'
    ? renderPuzzlePhase(stop)
    : renderOnsitePhase(stop);

  main.classList.remove('fade-in');
  void main.offsetWidth;
  main.classList.add('fade-in');
}

function renderPuzzlePhase(stop) {
  const p = stop.puzzle;

  let extras = '';
  if (p.morseTable) {
    extras += `
      <button class="btn-toggle" onclick="toggleTable('morse-table')">📋 Morseova tabuľka</button>
      <div id="morse-table" class="ref-table">
        <div class="ref-grid">
          ${MORSE_TABLE.map(([l,m]) => `
            <div class="ref-cell">
              <span class="ref-letter">${l}</span>
              <span class="ref-code">${m}</span>
            </div>`).join('')}
        </div>
      </div>`;
  }
  if (p.binaryTable) {
    extras += `
      <button class="btn-toggle" onclick="toggleTable('binary-table')">📋 Binárna tabuľka</button>
      <div id="binary-table" class="ref-table">
        <div class="ref-grid">
          ${BINARY_TABLE.map(([l,b]) => `
            <div class="ref-cell">
              <span class="ref-letter">${l}</span>
              <span class="ref-code bin">${b}</span>
            </div>`).join('')}
        </div>
      </div>`;
  }

  const hint = p.hint ? `<div class="hint-box">💡 ${p.hint}</div>` : '';

  return `
    <div class="stop-card">
      <div class="stop-header">
        <div class="stop-icon-wrap">${stop.icon}</div>
        <div>
          <div class="stop-number">Zastávka ${state.currentStop + 1}</div>
          <div class="stop-name">${stop.name}</div>
        </div>
      </div>

      <div class="puzzle-section">
        <div class="section-label">${p.title}</div>
        <p class="puzzle-text">${p.text}</p>
        <div class="cipher-box">
          <span class="cipher-text">${p.cipher}</span>
        </div>
        ${hint}
        ${extras}
      </div>

      <div class="answer-section">
        <div class="answer-row">
          <input
            type="text"
            id="answer-input"
            class="answer-input"
            placeholder="Odpoveď..."
            autocomplete="off"
            autocorrect="off"
            spellcheck="false"
            onkeydown="if(event.key==='Enter') checkAnswer()"
          />
          <button class="btn-check" onclick="checkAnswer()">✓</button>
        </div>
        <div id="answer-feedback" class="answer-feedback hidden"></div>
      </div>
    </div>`;
}

function renderOnsitePhase(stop) {
  const o = stop.onsite;
  const btnLabel = stop.isFinal ? '🏆 Zobraziť výsledok' : 'Ďalšia zastávka →';

  return `
    <div class="stop-card">
      <div class="stop-header">
        <div class="stop-icon-wrap">${stop.icon}</div>
        <div>
          <div class="stop-number">Zastávka ${state.currentStop + 1} — na mieste</div>
          <div class="stop-name">${stop.name}</div>
        </div>
      </div>

      <div class="solved-badge">✅ Záhada rozlúštená!</div>

      <div class="onsite-section">
        <div class="section-label">${o.title}</div>
        <p class="onsite-text">${o.text}</p>
        <div class="onsite-note">${o.note}</div>
      </div>

      <button class="btn-next" onclick="nextStop()">${btnLabel}</button>
    </div>`;
}

// ── Logic ────────────────────────────────────────────────────

function checkAnswer() {
  const input = document.getElementById('answer-input');
  const feedback = document.getElementById('answer-feedback');
  const stop = STOPS[state.route[state.currentStop]];

  const normalize = s => s.trim().toUpperCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9]/g, '');

  if (normalize(input.value) === normalize(stop.puzzle.answer)) {
    feedback.className = 'answer-feedback correct';
    feedback.textContent = `✓ Správne! Choď na: ${stop.puzzle.answerDisplay}`;
    feedback.classList.remove('hidden');
    input.disabled = true;
    document.querySelector('.btn-check').disabled = true;

    if (stop.onsite) {
      setTimeout(() => {
        document.querySelector('.answer-section').insertAdjacentHTML('afterend', `
          <button class="btn-next arrive-btn" onclick="arriveAtStop()">
            📍 Som na mieste →
          </button>`);
      }, 500);
    } else {
      setTimeout(showFinish, 1000);
    }
  } else {
    feedback.className = 'answer-feedback wrong';
    feedback.textContent = '✗ Skús znova...';
    feedback.classList.remove('hidden');
    input.classList.add('shake');
    setTimeout(() => input.classList.remove('shake'), 400);
  }
}

function arriveAtStop() {
  state.phase = 'onsite';
  renderStop();
}

function nextStop() {
  if (state.currentStop < state.route.length - 1) {
    state.currentStop++;
    state.phase = 'puzzle';
    renderStop();
  } else {
    showFinish();
  }
}

function goBack() {
  if (state.phase === 'onsite') {
    state.phase = 'puzzle';
  } else if (state.currentStop > 0) {
    state.currentStop--;
    state.phase = 'onsite';
  }
  renderStop();
}

function showFinish() {
  showScreen('screen-finish');
}

function toggleTable(id) {
  document.getElementById(id).classList.toggle('open');
}
