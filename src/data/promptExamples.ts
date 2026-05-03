export type PromptExampleKind = "play" | "info";

export type PromptExample = {
  /** Kurzer Text auf dem Chip */
  label: string;
  /** Vollständiger Prompt ans Modell */
  prompt: string;
  kind: PromptExampleKind;
};

/** Wenige starke Vorgaben — Spiel & informational / didaktisch. */
export const PROMPT_EXAMPLES: PromptExample[] = [
  {
    kind: "play",
    label: "Flappy",
    prompt: `Baue ein einseitiges HTML-Spiel (Canvas 2D): Flappy-Art, aber eigenständiger Look.

Mechanik:
- Vogel mit Schwerkraft und Sprung (negativer Impuls). Feste Welt nach rechts scrollen ODER Rohre kommen von rechts; regelmäßige vertikale Lücken zwischen „Röhren“ oder Balken; Score +1 pro passierter Öffnung.
- Kollision mit Boden, Decke oder Hindernis = Game Over.

Steuerung:
- Leertaste oder Klick/Tap = Flap; auf Mobil zusätzlich: Tap irgendwo im Canvas.
- P = Pause/Weiter.

UX:
- States: Titel/Anleitung → playing → paused → gameOver. Auf Titel kurz: „Leertaste / Tap = Flappen, P = Pause“.
- HUD: aktueller Score. Game Over: Endscore + Button „Nochmal“ (State-Reset ohne Reload).

Technik (kurz halten, lauffähig):
- requestAnimationFrame + Delta-Zeit; Canvas an Fensterbreite, optional devicePixelRatio; touch-action: none am Wrapper.
- Schwierigkeit steigt leicht mit Score (z. B. etwas schnellere Scroll-Geschwindigkeit alle paar Punkte).`,
  },
  {
    kind: "play",
    label: "Snake",
    prompt: `Einseitiges HTML: Snake auf einem sichtbaren Raster (Canvas oder DOM-Grid, aber kompakt).

Mechanik:
- Schlange als Liste von Zellen; konstante Bewegung pro Tick in aktuelle Richtung; Futter erscheint auf freiem Feld; wachsen +1 und Score +10 bei Futter; Kollision Wand oder eigener Körper = Game Over.
- Eingaben dürfen die Richtung nur um 90 Grad ändern; keine 180°-Kehrtwende in einem Schritt (Queue erlaubt).

Steuerung:
- Pfeiltasten. Mobil: Wischen (swipe) oder Buttons/oben-unten-links-rechts als vier kleine Zonen unter dem Feld — mindestens eine Touch-Variante muss klar funktionieren.
- P = Pause.

UX:
- Startscreen mit kurzer Anleitung; HUD mit Score; Game Over mit Neustart.
- Optional: Geschwindigkeit (Intervall oder Pixel/Sekunde) steigt alle 50 Punkte leicht.

Technik:
- requestAnimationFrame oder festes Zeitintervall nur für Schritt-Takt, aber Bewegung zeichnen im rAF; Canvas-DPR optional; preventDefault auf Steuerflächen wo nötig.`,
  },
  {
    kind: "play",
    label: "Breakout",
    prompt: `Einseitiges HTML: Breakout/Arkanoid-Stil mit Canvas 2D.

Mechanik:
- Schläger unten (Breite fest), Ball startet mit leichtem zufälligem Winkel nach oben; reflektiert an Wänden und Schläger; Winkel am Schläger abhängig vom Trefferort (einfaches Modell reicht).
- Mehrere Reihen Ziegel mit Farben; Ziegel verschwinden bei Treffer und geben Punkte; Ball unten verloren = Leben -1; bei 0 Leben Game Over; alle Ziegel weg = Sieg/Level-Ende mit Option „Nochmal schwerer“ (einfach Ball etwas schneller).

Steuerung:
- Maus/Touch: Schläger folgt X-Position relativ zum Canvas; plus Pfeiltasten links/rechts als Alternative.
- P = Pause; Leertaste startet Ball vom Schläger, solange Ball „klebt“.

UX:
- HUD: Punkte, Leben. Kurze Anleitung vor Start.

Technik:
- rAF + dt; responsive Canvas + optional DPR; keine externe Physik-Library.`,
  },
  {
    kind: "play",
    label: "Frogger",
    prompt: `Einseitiges HTML: Frogger-inspiriertes Spiel (Canvas 2D), top-down, vereinfacht aber spielbar.

Spielfeld:
- Unten Startzone, oben 3–5 sichere Zielbuchten (nur eine muss erreicht werden pro Level oder alle nacheinander für Bonus — wähle eine klare, einfache Regel).
- Dazwischen mehrere „Spuren“: Straße mit horizontal fahrenden Fahrzeugen (unterschiedliche Geschwindigkeiten/Richtungen pro Spur); optional Wasser-Spuren mit sich bewegenden „Holzstämmen“ — Frosch darf nur auf Stamm oder Ufer stehen, nicht auf leeres Wasser.
- Frosch bewegt sich in festen Schritten (Raster): eine Zelle pro Tastendruck oder Tap, mit kurzer Cooldown damit es nicht zu spambar ist.

Mechanik:
- Kollision mit Auto = Leben -1 oder sofort Game Over (eine Regel wählen und konsequent); Kollision Wasser ohne Stamm = Tod.
- Erreichte Zielbucht gibt Punkte und resettet Frosch zur Startzeile; optional nächste Runde: etwas schnellere Fahrzeuge.

Steuerung:
- Pfeiltasten hoch/runte/links/rechts. Mobil: vier Pfeil-Buttons unter dem Canvas oder Swipe in vier Richtungen (mindestens eine Touch-Variante muss gut spielbar sein).
- P = Pause.

UX:
- States: Titel mit Steuer-Hinweis → playing → paused → gameOver. HUD: Score, Leben (3 ok).
- Game Over + „Nochmal“ ohne Reload.

Technik:
- requestAnimationFrame + dt; Fahrzeuge/Stämme mit x-Position und fester Geschwindigkeit pro Spur; responsive Canvas, optional DPR; touch-action: none.`,
  },
  {
    kind: "play",
    label: "Space Invaders",
    prompt: `Einseitiges HTML: Space-Invaders-inspiriertes Shoot’em-up (Canvas 2D), vereinfacht.

Mechanik:
- Spieler-Schiff unten, kann horizontal fahren und nach oben schießen (max. 1–3 Spieler-Schüsse gleichzeitig reichen).
- Oben 4–6 Reihen „Aliens“ in Formation; die Gruppe bewegt sich als Block horizontal, bei Randabriss eine Zeile nach unten und Richtungswechsel; wenn Aliens zu tief kommen oder Spieler getroffen wird = Leben weg / Game Over.
- Treffer entfernt Alien und gibt Punkte; alle Aliens weg = Welle geschafft, nächste Welle: etwas schneller oder mehr Punkte.
- Optional: 2–3 einfache Schutzbarrieren (zerstörbar durch Schüsse von beiden Seiten — nur wenn der Code kompakt bleibt).

Steuerung:
- Links/Rechts: Pfeiltasten oder A/D; Schießen: Leertaste oder oben-Pfeil; Mobil: Schiff folgt Touch-X am unteren Rand + separaten „Feuer“-Button oder Doppeltap.
- P = Pause.

UX:
- Startscreen mit Kurzanleitung; HUD: Score, Leben, ggf. aktuelle Welle.
- Game Over + Neustart-Button.

Technik:
- rAF + dt; Kollision als Rechtecke oder Kreise (einfach halten); responsive Canvas + optional DPR; keine externen Libs.`,
  },
  {
    kind: "info",
    label: "Photosynthese",
    prompt:
      "Didaktische Einzelseite auf Deutsch: Was ist Photosynthese? Kurze Texte mit Absätzen, ein vereinfachtes SVG-Schema (Sonne, Blatt, CO₂, O₂, Glucose), optional Aufklapp-Tabs für Licht- und Dunkelreaktion.",
  },
  {
    kind: "info",
    label: "HTTPS Ablauf",
    prompt:
      "Erklärseite: Wie funktioniert HTTPS grob? Schritt-für-Schritt mit nummerierten Abschnitten oder Akkordeon (Handshake, Zertifikat, symmetrische Session Keys). Ohne technische Feinheiten von Wireshark.",
  },
  {
    kind: "info",
    label: "Energien vergleichen",
    prompt:
      "Übersichtsseite: Solar, Wind und Erdgas im Strommix vergleichen (Demo-Zahlen). Nutze Chart.js per CDN für ein Balken- oder Liniendiagramm, darunter 3–4 Bullet-Points Vor- und Nachteile jeder Quelle.",
  },
  {
    kind: "info",
    label: "Mondlandungen",
    prompt:
      "Interaktive Zeitleiste (horizontal scrollbar auf Desktop): Apollo 11–17 und Artemis-I als Meilensteine mit Jahr und einem Satz Kontext. Klick auf einen Punkt zeigt Details im selben Dokument.",
  },
  {
    kind: "info",
    label: "Vokabeln",
    prompt:
      "Mini-Lern-App: 8 englische Wörter mit deutschen Übersetzungen als Karteikarten (Klick dreht Karte). Fortschrittsbalken und Button ‚nochmal mischen‘. Niederschwellig, ohne Backend.",
  },
  {
    kind: "info",
    label: "BMI + Info",
    prompt:
      "BMI-Rechner: Eingabe Körpergröße und Gewicht, Button berechnet BMI, zeigt Kategorie nach WHO (Untergewicht bis adipös) in einer farblich dezenten Legende. Kurzer Hinweistext, dass es nur Orientierung ist.",
  },
  {
    kind: "info",
    label: "Klimazonen",
    prompt:
      "Eine Seite mit vereinfachter Weltkarte oder Quadranten-Layout: tropisch, trocken, gemäßigt, polar. Jeweils Klima in zwei Sätzen + typische Vegetation. Kein echtes Geo-JSON nötig, CSS reicht.",
  },
];
