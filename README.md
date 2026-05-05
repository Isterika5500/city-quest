# Trenčín Quest — Mestská šifrovacia hra

Webová aplikácia pre mestskú kvest hru v Trenčíne s dvoma tímami.

## Štruktúra projektu

```
trencan-quest/
├── index.html        # Hlavná stránka
├── css/
│   └── style.css     # Štýly (dark medieval téma)
├── js/
│   ├── data.js       # Dáta: zastávky, záhady, trasy
│   └── app.js        # Herná logika
└── README.md
```

## Spustenie

Stačí otvoriť `index.html` v prehliadači — nevyžaduje server ani inštaláciu.

## Maršruty

| Tím | Poradie |
|-----|---------|
| Tím 1 | Hotel Elizabeth → Morový stĺp → Vodník → Synagóga → Hrad |
| Tím 2 | Synagóga → Vodník → Morový stĺp → Hotel Elizabeth → Hrad |

## Záhady

| Zastávka | Typ šifry | Odpoveď |
|----------|-----------|---------|
| Hotel Elizabeth | Číselný rébus (poradové čísla písmen) | ELIZABETH |
| Morový stĺp | Akrostich (slovenský text) | MOROVÝ STĹP |
| Vodník | Morseova abeceda | VODNIK |
| Synagóga | Cézarov šifr (posun 4) | SINAGOGA |
| Hrad (finále) | Binárny šifr | HRAD |

## Mechanika

Každá zastávka = 2 fázy:
1. **Záhada** → hráč zadá odpoveď → ak správne, zobrazí sa názov miesta
2. **Úloha na mieste** → doplnkové otázky → tlačidlo na ďalšiu zastávku

Odpovede sú **case-insensitive** a ignorujú diakritiku.
