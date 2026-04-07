const TEAMS = {
  team1: {
    name: "Tím A",
    riddles: [
      {
        id: 1,
        image: "images/place1.jpg",
        question: "Som pamätník so symbolikou Svätej Trojice, som jeden z najznámejších barokových pamätníkov v Trenčíne. Ako sa volám? Príď ku mne, aby si začal hľadanie pokladu.",
        answer: "Mórový stĺp",
        hint: "Nachádza sa na Mierovom námestí.",
      },
      {
        id: 2,
        image: "images/place2.jpg",
        question: "To, čo je napísané nie vo vašom jazyku, sa dá aj tak prečítať. Nehľadaj význam, ale tvar. Tam, kde písali starí, sú čísla ukryté v písmenách. Spočítaj ich na troch stranách pamätníka.",
        answer: ["1712", "1712", "4665"],
        placeholders: ["1. strana", "2. strana", "3. strana"],
        hint: "Pozri sa na tri strany pamätníka a hľadaj rímske číslice ukryté v písmenách.",
        hintDelayMs: 15 * 60 * 1000,
      }
    
    ],
  },

  team2: {
    name: "Tím B",
    riddles: [
      {
        id: 1,
        stages: [
          {
            image: "images/team2_stage1.jpg",
            question: `
              <div class="stage-card">
                <div class="stage-label">1. etapa</div>
                <div class="stage-audio-wrap">
                  <audio controls preload="none" style="width:100%; margin:0 0 16px 0;">
                    <source src="audio/team2_first_task.mp3" type="audio/mpeg">
                    Tvoj prehliadač nepodporuje prehrávanie audia.
                  </audio>
                </div>
                <p>Nasleduj znamenie a prejdi 100 krokov tam, kam ukazuje šípka.<br>Tam, kde voda mlčí, nájdeš ho.</p>
              </div>
            `,
          },
          {
            image: "images/team2_stage2.jpg",
            question: `
              <div class="stage-card">
                <div class="stage-label">2. etapa</div>
                <p>Koľkými prstami sa drží okraja?<br>Čo skrýva na hlave?<br>Je jeho druhá ruka prázdna, alebo niečo drží?</p>
              </div>
            `,
            answer: "510",
            placeholders: ["Zadaj kód"],
          }
        ],
        hint: "Keď spojíš odpovede, vznikne kód. Ten odomkne ďalšiu časť cesty… ale len ak si sa pozeral naozaj pozorne.",
        hintDelayMs: 15 * 60 * 1000,
      }
    ],
  },
};
