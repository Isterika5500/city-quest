// ============================================================
//  TRENČÍN QUEST — Game Data
// ============================================================

const STOPS = {

  hotel: {
    id: 'hotel',
    name: '? ? ?',
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
      text: 'Z ktorých susedných krajín môžu pricestovať hostia do Hotel Elizabeth?',
      fields: [
        {
          label: 'Napíšte všetky krajiny, s ktorými susedí Slovensko.',
          placeholder: 'Napíšte krajiny...',
          answer: 'POĽSKO, MAĎARSKO, ČESKO, RAKÚSKO, UKRAJINA',           // test value — change to real count
          required: true
        }
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
Ozdobený som barokovým štýlom<br/>
Roky chránim ľudí pred nešťastím<br/>
Omne hovoria ako o symbole viery<br/>
Vysoko sa týčim nad námestím<br/>
Ýznam mám historický<br/>
Som spojený so Svätou Trojicou<br/>
Ty ma musíš nájsť<br/>
Ľudia ku mne často chodia<br/>
Pamätáš si moje meno?`,
      hint: 'Prvé písmeno každého riadku...',
      answer: 'MOROVÝ STĹP',
      answerDisplay: 'MOROVÝ STĹP'
    },
    onsite: {
      title: 'Úloha na mieste',
      text: 'Nájdi rímske čísla na troch stranách pamätníka a zadaj čísla.',
      fields: [
        { label: '🧭 Severná strana — aké číslo?',  placeholder: 'Číslo...', answer: '4665', required: true },
        { label: '🧭 Južná strana — aké číslo?',    placeholder: 'Číslo...', answer: '1712', required: false },
        { label: '🧭 Východná strana — aké číslo?', placeholder: 'Číslo...', answer: '1712', required: false }
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
      text: 'Pozoruj sochu a odpovedz na otázky. Zadaj výsledný 3-ciferný kód.',
      fields: [
        { label: '🖐 Koľkými prstami sa drží okraja studne?', placeholder: 'Číslo...', answer: '5',   required: false },
        { label: '🎩 Čo má na hlave?',                        placeholder: 'Číslo...', answer: '1',   required: false },
        { label: '✋ Čo drží v druhej ruke?',                 placeholder: 'Číslo...', answer: '0',   required: false },
        { label: '🔑 Výsledný 3-ciferný kód',                placeholder: 'Kód...',   answer: '510', required: true  }
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
      text: 'Pozri sa na hornú časť budovy.',
      fields: [
        {
          label: 'Aký geometrický tvar dominuje v hornej časti budovy?',
          placeholder: 'Tvar...',
          answer: 'KUPOLA',      // test value — Davids star
          required: true
        }
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

const PRIZE_COORDS = { lat: 48.8938464, lng: 18.0405694, label: '!' };

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
