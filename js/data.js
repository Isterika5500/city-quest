// ============================================================
//  TRENČÍN QUEST — Game Data
// ============================================================

const STOPS = {

  hotel: {
    id: 'hotel',
    name: '? ? ?',           // hidden until solved
    revealName: 'Hotel Elizabeth',
    shortName: '1',
    icon: '🏨',
    puzzle: {
      title: 'Rozlúšti šifru',
      text: 'Každé číslo je poradové číslo písmena v anglickej abecede. Spoj ich dohromady.',
      cipher: '5 · 12 · 9 · 26 · 1 · 2 · 5 · 20 · 8',
      hint: 'A=1, B=2, C=3 ... Z=26',
      answer: 'ELIZABETH',
      answerDisplay: 'HOTEL ELIZABETH'
    },
    onsite: {
      title: 'Úloha na mieste',
      text: 'Si pred budovou. Pozri sa na hlavný fasád.',
      fields: [
        { label: 'Koľko okien má druhé poschodie?', placeholder: 'Počet okien...' }
      ]
    }
  },

  stolp: {
    id: 'stolp',
    name: '? ? ?',
    revealName: 'Morový stĺp',
    shortName: '2',
    icon: '⛪',
    puzzle: {
      title: 'Akrostich',
      text: 'Čítaj <strong>prvé písmená</strong> každého riadku zhora nadol.',
      cipher: `M esto ma pozná už dlho<br/>
O zdobený som barokovým štýlom<br/>
R oky chránim ľudí pred nešťastím<br/>
O mne hovoria ako o symbole viery<br/>
V ysoko sa týčim nad námestím<br/>
Ý znam mám historický<br/>
S om spojený so Svätou Trojicou<br/>
T y ma musíš nájsť<br/>
Ľ udia ku mne často chodia<br/>
P amätáš si moje meno?`,
      hint: 'Prvé písmeno každého riadku...',
      hint2: 'Rímske číslice na pamätníku: MDCCXII = 1712 &nbsp;·&nbsp; MCDLXV = 1465',
      answer: 'MOROVÝ STĹP',
      answerDisplay: 'MOROVÝ STĹP'
    },
    onsite: {
      title: 'Úloha na mieste',
      text: 'Nájdi latinské nápisy na troch stranách pamätníka.',
      fields: [
        { label: '🧭 Severná strana — aké číslo?', placeholder: 'Číslo...' },
        { label: '🧭 Južná strana — aké číslo?',   placeholder: 'Číslo...' },
        { label: '🧭 Východná strana — aké číslo?', placeholder: 'Číslo...' }
      ]
    }
  },

  vodnik: {
    id: 'vodnik',
    name: '? ? ?',
    revealName: 'Vodník',
    shortName: '3',
    icon: '🧙',
    puzzle: {
      title: 'Morseova abeceda',
      text: 'Rozlúšti Morseov kód. Každá skupina symbolov je jedno písmeno.',
      cipher: '·— · — · · · · · — — — — · · — · · · — · —',
      hint: null,
      morseTable: true,
      answer: 'VODNIK',
      answerDisplay: 'VODNÍK'
    },
    onsite: {
      title: 'Úloha na mieste',
      text: 'Pozoruj sochu a odpovedz na otázky. Na konci zadaj 3-ciferný kód.',
      fields: [
        { label: '🖐 Koľkými prstami sa drží okraja studne?', placeholder: 'Číslo...' },
        { label: '🎩 Čo má na hlave? (cylinder = 1)',         placeholder: 'Číslo...' },
        { label: '✋ Čo drží v druhej ruke? (nič = 0)',       placeholder: 'Číslo...' },
        { label: '🔑 Výsledný 3-ciferný kód',                placeholder: 'Kód...' }
      ]
    }
  },

  synagoga: {
    id: 'synagoga',
    name: '? ? ?',
    revealName: 'Synagóga',
    shortName: '4',
    icon: '🕍',
    puzzle: {
      title: 'Cézarov šifr',
      text: 'Každé písmeno v zašifrovanom slove posuň <strong>späť v abecede</strong>.<br/>Posun = počet písmen v slove ROMA.',
      cipher: 'V L Q D J R J D',
      hint: 'ROMA má 4 písmená → posuň každé písmeno o 4 späť',
      answer: 'SINAGOGA',
      answerDisplay: 'SYNAGÓGA'
    },
    onsite: {
      title: 'Úloha na mieste',
      text: 'Pozri sa na budovu a odpovedz.',
      fields: [
        { label: 'Aký geometrický tvar dominuje v hornej časti budovy?', placeholder: 'Tvar...' }
      ]
    }
  },

  hrad: {
    id: 'hrad',
    name: '? ? ?',
    revealName: 'Trenčínsky hrad',
    shortName: '5',
    icon: '🏰',
    puzzle: {
      title: 'Binárny šifr — FINÁLE',
      text: 'Každá skupina núl a jednotiek = jedno písmeno. Použi tabuľku a rozlúšti slovo.',
      cipher: '01000 &nbsp; 10010 &nbsp; 00001 &nbsp; 00100',
      hint: null,
      binaryTable: true,
      answer: 'HRAD',
      answerDisplay: 'HRAD'
    },
    onsite: null,
    isFinal: true
  }

};

const ROUTES = {
  1: ['hotel', 'stolp', 'vodnik', 'synagoga', 'hrad'],
  2: ['synagoga', 'vodnik', 'stolp', 'hotel', 'hrad']
};

// Trenčín hrad coords for prize map
const PRIZE_COORDS = { lat: 48.8944, lng: 18.0440, label: 'Trenčínsky hrad — tu čaká vaša cena!' };

const MORSE_TABLE = [
  ['A','·—'],  ['B','—···'],['C','—·—·'],['D','—··'],
  ['E','·'],   ['F','··—·'],['G','——·'], ['H','····'],
  ['I','··'],  ['J','·———'],['K','—·—'], ['L','·—··'],
  ['M','——'],  ['N','—·'],  ['O','———'], ['P','·——·'],
  ['Q','——·—'],['R','·—·'], ['S','···'], ['T','—'],
  ['U','··—'], ['V','···—'],['W','·——'], ['X','—··—'],
  ['Y','—·——'],['Z','——··']
];

const BINARY_TABLE = [
  ['A','00001'],['B','00010'],['C','00011'],['D','00100'],['E','00101'],
  ['F','00110'],['G','00111'],['H','01000'],['I','01001'],['J','01010'],
  ['K','01011'],['L','01100'],['M','01101'],['N','01110'],['O','01111'],
  ['P','10000'],['Q','10001'],['R','10010'],['S','10011'],['T','10100'],
  ['U','10101'],['V','10110'],['W','10111'],['X','11000'],['Y','11001'],['Z','11010']
];
