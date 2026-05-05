// ============================================================
//  TRENČÍN QUEST — Game Data
// ============================================================

const STOPS = {

  hotel: {
    id: 'hotel',
    name: 'Hotel Elizabeth',
    shortName: 'Hotel',
    icon: '🏨',
    puzzle: {
      title: 'Rozlúšti názov miesta',
      text: `Každé číslo je poradové číslo písmena v anglickej abecede.<br/>
             Spoj ich dohromady a dostaneš meno, kde ťa čaká ďalšia zastávka.`,
      cipher: '5 · 12 · 9 · 26 · 1 · 2 · 5 · 20 · 8',
      hint: 'A=1, B=2, C=3 ... Z=26',
      answer: 'ELIZABETH',
      answerDisplay: 'HOTEL ELIZABETH'
    },
    onsite: {
      title: 'Úloha na mieste',
      text: 'Si pred hotelom. Pozri sa na hlavný fasád.<br/><strong>Koľko okien má druhé poschodie?</strong>',
      note: 'Zapíš si číslo — možno sa ti zíde neskôr.'
    }
  },

  stolp: {
    id: 'stolp',
    name: 'Morový stĺp',
    shortName: 'Stĺp',
    icon: '⛪',
    puzzle: {
      title: 'Akrostich',
      text: 'Čítaj <strong>prvé písmená</strong> každého riadku zhora nadol. Dostaneš názov miesta.',
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
      answer: 'MOROVÝ STĹP',
      answerDisplay: 'MOROVÝ STĹP'
    },
    onsite: {
      title: 'Úloha na mieste',
      text: 'Nájdi latinské nápisy na troch stranách pamätníka a zapíš čísla:',
      note: `<span class="onsite-list">
               <span>🧭 Severná strana: <strong>4665</strong></span>
               <span>🧭 Južná strana: <strong>1712</strong></span>
               <span>🧭 Východná strana: <strong>1712</strong></span>
             </span>`
    }
  },

  vodnik: {
    id: 'vodnik',
    name: 'Vodník',
    shortName: 'Vodník',
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
      text: 'Pozoruj sochu Vodníka a odpovedz na otázky:',
      note: `<span class="onsite-list">
               <span>🖐 Koľkými prstami sa drží okraja studne? → <strong>5</strong></span>
               <span>🎩 Čo má na hlave? (cylinder = 1) → <strong>1</strong></span>
               <span>✋ Čo drží v druhej ruke? (nič = 0) → <strong>0</strong></span>
               <span>🔑 <strong>Kód: 510</strong></span>
             </span>`
    }
  },

  synagoga: {
    id: 'synagoga',
    name: 'Synagóga',
    shortName: 'Synagóga',
    icon: '🕍',
    puzzle: {
      title: 'Cézarov šifr',
      text: `Každé písmeno v zašifrovanom slove posuň späť v abecede.<br/>
             <strong>Posun = počet písmen v slove ROMA</strong>`,
      cipher: 'V L Q D J R J D',
      hint: 'ROMA má 4 písmená → posuň každé písmeno o 4 späť',
      answer: 'SINAGOGA',
      answerDisplay: 'SYNAGÓGA'
    },
    onsite: {
      title: 'Úloha na mieste',
      text: 'Pozri sa na hornú časť budovy.<br/><strong>Aký geometrický tvar tam dominuje?</strong>',
      note: 'Zapíš si tvar — jedným slovom.'
    }
  },

  hrad: {
    id: 'hrad',
    name: 'Trenčínsky hrad',
    shortName: 'Hrad',
    icon: '🏰',
    puzzle: {
      title: 'Binárny šifr — FINÁLE',
      text: `Každá skupina núl a jednotiek predstavuje jedno písmeno.<br/>
             Použi tabuľku nižšie a rozlúšti slovo.`,
      cipher: '01000 &nbsp; 10010 &nbsp; 00001 &nbsp; 00100',
      hint: null,
      binaryTable: true,
      answer: 'HRAD',
      answerDisplay: 'TRENČÍNSKY HRAD'
    },
    onsite: null,
    isFinal: true
  }

};

// Route order per team
const ROUTES = {
  1: ['hotel', 'stolp', 'vodnik', 'synagoga', 'hrad'],
  2: ['synagoga', 'vodnik', 'stolp', 'hotel', 'hrad']
};

// Morse reference table
const MORSE_TABLE = [
  ['A', '·—'],  ['B', '—···'], ['C', '—·—·'], ['D', '—··'],
  ['E', '·'],   ['F', '··—·'], ['G', '——·'],  ['H', '····'],
  ['I', '··'],  ['J', '·———'], ['K', '—·—'],  ['L', '·—··'],
  ['M', '——'],  ['N', '—·'],   ['O', '———'],  ['P', '·——·'],
  ['Q', '——·—'],['R', '·—·'],  ['S', '···'],  ['T', '—'],
  ['U', '··—'], ['V', '···—'], ['W', '·——'],  ['X', '—··—'],
  ['Y', '—·——'],['Z', '——··']
];

// Binary reference table
const BINARY_TABLE = [
  ['A','00001'],['B','00010'],['C','00011'],['D','00100'],['E','00101'],
  ['F','00110'],['G','00111'],['H','01000'],['I','01001'],['J','01010'],
  ['K','01011'],['L','01100'],['M','01101'],['N','01110'],['O','01111'],
  ['P','10000'],['Q','10001'],['R','10010'],['S','10011'],['T','10100'],
  ['U','10101'],['V','10110'],['W','10111'],['X','11000'],['Y','11001'],['Z','11010']
];
