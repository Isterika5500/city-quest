// ============================================================
//  TRENČÍN QUEST — App Logic
// ============================================================

let state = {
  team: null,
  route: [],
  currentStop: 0,
  phase: 'puzzle' // 'puzzle' | 'onsite' | 'map'
};

// ── Screens ───────────────────────────────────────────────────

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ── Start ─────────────────────────────────────────────────────

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

// ── Progress ──────────────────────────────────────────────────

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
      <span class="progress-dot-label">${stop.shortName}</span>`;
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

  const showBack = state.currentStop > 0 || state.phase === 'onsite' || state.phase === 'map';
  document.getElementById('btn-back').style.visibility = showBack ? 'visible' : 'hidden';
}

// ── Render ────────────────────────────────────────────────────

function renderStop() {
  const stopId = state.route[state.currentStop];
  const stop = STOPS[stopId];
  const main = document.getElementById('game-main');
  updateProgress();

  let html = '';
  if (state.phase === 'puzzle')      html = renderPuzzlePhase(stop);
  else if (state.phase === 'onsite') html = renderOnsitePhase(stop);
  else if (state.phase === 'map')    html = renderMapPhase();

  main.innerHTML = html;
  main.classList.remove('fade-in');
  void main.offsetWidth;
  main.classList.add('fade-in');
}

// ── Phase: PUZZLE ─────────────────────────────────────────────

function renderPuzzlePhase(stop) {
  const p = stop.puzzle;

  let extras = '';

  // Morse table
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

  // Binary table
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

  const hint  = p.hint  ? `<div class="hint-box">💡 ${p.hint}</div>` : '';
  const hint2 = p.hint2 ? `<div class="hint-box hint-box--roman">🏛 ${p.hint2}</div>` : '';

  // Synagóga: cipher rendered inside blue info-box instead of dark cipher-box
  const isSynagoga = stop.id === 'synagoga';
  const cipherHtml = isSynagoga
    ? `<div class="info-box">
         <div class="info-box-label">Zašifrované slovo</div>
         <div class="cipher-text cipher-text--dark">${p.cipher}</div>
       </div>`
    : `<div class="cipher-box"><span class="cipher-text">${p.cipher}</span></div>`;

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
        ${cipherHtml}
        ${hint}
        ${hint2}
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

// ── Phase: ONSITE ─────────────────────────────────────────────

function renderOnsitePhase(stop) {
  const o = stop.onsite;
  const isLastStop = state.currentStop === state.route.length - 1;
  // Last stop (hrad) has no onsite, so this only fires for non-final stops
  const btnLabel = 'Ďalšia zastávka →';

  const fields = (o.fields || []).map((f, i) => `
    <div class="field-group">
      <label class="field-label">${f.label}</label>
      <input
        type="text"
        class="field-input"
        id="field-${i}"
        placeholder="${f.placeholder}"
        autocomplete="off"
        autocorrect="off"
        spellcheck="false"
      />
    </div>`).join('');

  return `
    <div class="stop-card">
      <div class="stop-header">
        <div class="stop-icon-wrap">${stop.icon}</div>
        <div>
          <div class="stop-number">Zastávka ${state.currentStop + 1} — na mieste</div>
          <div class="stop-name">${stop.revealName}</div>
        </div>
      </div>

      <div class="solved-badge">✅ Záhada rozlúštená!</div>

      <div class="onsite-section">
        <div class="section-label">${o.title}</div>
        <p class="onsite-text">${o.text}</p>
        <div class="fields-wrap">${fields}</div>
      </div>

      <button class="btn-next" onclick="nextStop()">${btnLabel}</button>
    </div>`;
}

// ── Phase: MAP (prize location) ───────────────────────────────

function renderMapPhase() {
  const c = PRIZE_COORDS;
  const mapsUrl = `https://www.google.com/maps?q=${c.lat},${c.lng}`;
  const wazeUrl = `https://waze.com/ul?ll=${c.lat},${c.lng}&navigate=yes`;

  return `
    <div class="stop-card">
      <div class="stop-header" style="background: var(--blue-800);">
        <div class="stop-icon-wrap">🏆</div>
        <div>
          <div class="stop-number">Cieľ</div>
          <div class="stop-name">Idete pre cenu!</div>
        </div>
      </div>

      <div class="solved-badge">🎉 Všetky záhady rozlúštené!</div>

      <div class="onsite-section">
        <div class="section-label">Kde čaká vaša cena</div>
        <p class="onsite-text">${c.label}</p>

        <div class="map-embed-wrap">
          <iframe
            class="map-iframe"
            src="https://maps.google.com/maps?q=${c.lat},${c.lng}&z=16&output=embed"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>

        <div class="map-coords">
          <span>📍 ${c.lat}, ${c.lng}</span>
        </div>
      </div>

      <div class="map-buttons">
        <a class="btn-map" href="${mapsUrl}" target="_blank">
          🗺 Otvoriť v Google Maps
        </a>
        <a class="btn-map btn-map--waze" href="${wazeUrl}" target="_blank">
          🚗 Navigovať vo Waze
        </a>
      </div>

      <button class="btn-next" onclick="showFinish()">🏅 Dokončiť hru</button>
    </div>`;
}

// ── Answer Check ──────────────────────────────────────────────

function checkAnswer() {
  const input    = document.getElementById('answer-input');
  const feedback = document.getElementById('answer-feedback');
  const stop     = STOPS[state.route[state.currentStop]];

  const normalize = s => s.trim().toUpperCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9]/g, '');

  if (normalize(input.value) === normalize(stop.puzzle.answer)) {
    feedback.className = 'answer-feedback correct';
    feedback.textContent = `✓ Správne! Nájdi: ${stop.puzzle.answerDisplay}`;
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
      // Final stop — go to map screen
      setTimeout(() => {
        state.phase = 'map';
        renderStop();
      }, 900);
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
    state.phase = 'map';
    renderStop();
  }
}

function goBack() {
  if (state.phase === 'map') {
    state.phase = 'puzzle';
  } else if (state.phase === 'onsite') {
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
