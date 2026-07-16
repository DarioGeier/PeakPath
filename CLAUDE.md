# PeakPath – Projektkontext für Claude Code

## Was ist PeakPath

Eine Kettlebell-/Trainings-Tracking-PWA (Vorbild: die App "Kugelhantel").
Zentrales Element: ein Kreis, der Gewicht + Wiederholungszahl zeigt; ein Tap
schließt den Satz ab und startet die Pause als Countdown im selben Kreis,
ein weiterer Tap überspringt die Pause und startet die nächste Übung.

Eigenständiges Projekt, kein Zusammenhang mit anderen Repos/Apps von Dario.

## Tech-Stack

- Reines Vanilla HTML/CSS/JS – **eine einzige Datei `index.html`** (Stand
  jetzt ca. 2,9 MB, weil alle Übungsbilder als Base64 eingebettet sind)
- Kein Build-Schritt, kein Bundler, keine externen JS-Abhängigkeiten
- `localStorage` für Trainingspläne, Verlauf, Einstellungen (Keys mit Präfix
  `circlefit_...` – bewusst nicht umbenannt, um keine Testdaten zu verlieren,
  auch wenn die App inzwischen PeakPath heißt)
- PWA: `manifest.webmanifest` + `sw.js` (Service Worker, cacht `index.html`
  aggressiv – nach Deploys immer an Hard-Reload/privaten Tab denken)
- **Zielgerät: Darios iPhone** (Safari bzw. PWA vom Homebildschirm). Neue
  Browser-Funktionen immer gegen Safari/iOS prüfen, nicht gegen Chrome –
  Safari hinkt oft hinterher und liefert manche APIs gar nicht.
- Langfristig ist geplant, aus der Web-App eine echte native App zu machen.
  Das ist aber weit weg (erst wenn alles rundläuft und Funktionen stehen) –
  **kein Grund, heute schon etwas darauf hin zu verbiegen.**
- Deployment: GitHub Pages, dieses Repo – **Repo ist öffentlich**, alles
  Committete ist im Netz lesbar. Nichts Privates/Geheimes einchecken.
- Design: Cream/Sage-Farbpalette (`--bg:#F2F5EE`, `--primary:#2F5D46`),
  Fraunces (Headlines) + Inter (Fließtext), mobile-first, `--radius-*`
  Variablen für abgerundete Ecken

## Projektstruktur

```
index.html              – die komplette App (HTML+CSS+JS inline)
manifest.webmanifest     – PWA-Manifest
sw.js                     – Service Worker
icons/icon-192.png        – App-Icon (maskable)
icons/icon-512.png        – App-Icon (maskable)
```

## Datenmodell (grober Überblick)

- `plans` (localStorage): eigene Trainingspläne des Nutzers, jeder Plan hat
  `id, name, setsRest, exRest, exercises[]`
- `EXAMPLE_PLANS` (fest im Code, Konstante): "PP-Pläne"-Vorlagen, per
  Klick als Kopie in `plans` übernehmbar oder direkt startbar, ohne vorher
  kopiert zu werden (siehe `startWorkoutFromPlan()`)
- `EXERCISES` (fest im Code): komplette Übungsdatenbank (54 Übungen,
  `name, cat, type` – `type` ist `strength`, `hold` oder `cardio` und
  bestimmt die Einheit: Wiederholungen/Sekunden/Minuten)
- `EXERCISE_IMAGES` (fest im Code): Übungsname → `{start, end}`
  Base64-Bildpaar. Übungen mit Halteposition/Cardio ohne echten
  Start/End-Wechsel (Plank, L-Sit, Laufband, Rudergerät, Seilspringen) haben
  dasselbe Bild für start & end
- `history` (localStorage): abgeschlossene Trainingseinheiten

## Konventionen & Vorgehen

- **Kein Build-Schritt** – jede Änderung landet direkt und vollständig in
  `index.html`. Bitte keine Frameworks, Bundler oder externe Skripte
  einführen, ohne das vorher abzusprechen.
- **Testen vor Auslieferung:** JS-Syntax mit `node --check` prüfen; für
  Funktionslogik (z. B. neue Datenstrukturen, Bildzuordnung, Kopiervorgänge)
  ein kleines Node-Testskript mit einem einfachen DOM-Mock bauen und
  ausführen, bevor etwas als fertig gilt. So wurde bisher jede Änderung
  verifiziert.
- **Deutsch** in der UI und in Commit-Nachrichten ist okay, Dario ist
  deutschsprachig.
- Änderungen sollten so klein wie möglich und gezielt sein – `index.html`
  ist eine einzige große Datei, also beim Editieren auf eindeutige,
  unmissverständliche Suchtexte achten (nicht versehentlich eine falsche von
  mehreren ähnlichen Stellen treffen).

## Git-Workflow

Festgelegt am 16.07.2026 mit Dario:

- **Direkt auf `main` committen und pushen** – keine Feature-Branches, keine
  Pull Requests. Ein-Personen-Projekt; der Hauptnutzen eines PR (Review durch
  jemand anderen) entfällt hier ohnehin.
- Das Sicherheitsnetz ist stattdessen der Testschritt vor jedem Push (siehe
  „Konventionen & Vorgehen"). Nichts ungetestet pushen – `main` geht sofort
  live auf GitHub Pages.
- Commit-Message-Stil: kurz und deutsch, kein festes Format.
- Nach jedem Push: Dario testet über einen privaten/Inkognito-Tab (Service
  Worker cacht sonst die alte Version)

## Kontextdokumente

- `peakpath-briefing.md` (liegt lokal in `C:\Projekte\PeakPath`, per
  `.gitignore` bewusst vom Repo ausgeschlossen) enthält den laufenden Status,
  die Roadmap und offene To-dos – bei Bedarf dort nachfragen, was als
  Nächstes ansteht.
