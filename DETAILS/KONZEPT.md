# CalCalCal – Workout-Routine Builder & Workout-Player

## 1. Überblick

**CalCalCal** ist eine mobile Workout-App, die sich vollständig auf das **Planen, Durchführen und Wiederverwenden von Trainingseinheiten** konzentriert. Der Fokus liegt auf individuell konfigurierbaren Workout-Routinen, die während des Trainings als **interaktive Checkliste mit Timer- und Rest-Logik** abgearbeitet werden können.

Die App verzichtet bewusst auf Social-Features, Gamification oder Ernährungstracking. Stattdessen ist sie ein **praktisches Werkzeug für reales Training**, optimiert für Nutzung im Gym oder zu Hause.

---

## 2. Ziel der App

- Eigene Workout-Routinen erstellen und speichern
- Übungen flexibel konfigurieren (Sets, Reps/Zeit, Gewicht, Rest)
- Training strukturiert und stressfrei abarbeiten
- Volle Kontrolle über Automatik vs. manuelle Bedienung
- Klare, übersichtliche Darstellung aller Trainingsdaten

---

## 3. Zentrale Konzepte

### 3.1 Routine (Session / Template)

Eine **Routine** ist eine wiederverwendbare Trainingsvorlage.

Beispiele:

- Bauchtraining
- Push Day
- Full Body

Eine Routine besteht aus:

- Name
- optionaler Beschreibung
- einer geordneten Liste von Exercises

Routinen können jederzeit bearbeitet, dupliziert und erneut gestartet werden.

---

### 3.2 Workout-Run (Trainingseinheit)

Ein **Workout-Run** entsteht, wenn eine Routine gestartet wird.

Merkmale:

- konkrete Durchführung einer Routine
- Fortschritt pro Exercise und Set
- Timer und Restzeiten laufen live
- Werte können während des Trainings angepasst werden

Die Trennung zwischen Routine (Template) und Run (Ausführung) ist zentral für die App-Logik.

---

## 4. ExerciseCards (Kernelement der App)

Jede Übung innerhalb einer Routine wird als **ExerciseCard** dargestellt. Diese Card bündelt alle relevanten Informationen und Interaktionen.

### 4.1 Exercise-Typ

Eine Exercise ist **entweder**:

- **Reps-basiert** (z. B. 5–12 Wiederholungen)
- **Time-basiert** (z. B. 30 Sekunden Plank)

Reps und Zeit sind **nicht gleichzeitig aktiv**.
Restzeiten sind immer möglich.

---

### 4.2 Set-Struktur

Pro Exercise konfigurierbar:

- Anzahl Sets
- Ziel-Reps **oder** Ziel-Zeit pro Set

Während des Trainings:

- Sets werden einzeln abgehakt
- Fortschritt ist jederzeit sichtbar (z. B. 2/3 Sets)

---

### 4.3 Gewicht & Einheiten

Gewicht wird **pro Set** erfasst und kann variieren.

Unterstützte Einheiten:

- kg (z. B. Hanteln)
- bodyweight (Eigengewicht)
- bands (Widerstandsbänder)

Dadurch sind Progressionen innerhalb einer Übung möglich (z. B. Gewicht erhöhen oder reduzieren).

---

### 4.4 Intensität (optional)

Optional kann eine Intensität hinterlegt werden, z. B.:

- Prozentangabe (z. B. 75 %)
- spätere Erweiterung: RPE oder subjektive Skala

---

## 5. Timer- & Rest-Logik

Die App bietet eine **hochflexible Rest- und Timersteuerung**, die vollständig optional ist.

### 5.1 Rest innerhalb einer Exercise

- Restzeit zwischen Sets konfigurierbar
- z. B. Bankdrücken: 5 Reps → 90 Sekunden Pause → nächstes Set

### 5.2 Rest zwischen Exercises

- zusätzliche Pause nach Abschluss einer Exercise möglich
- z. B. 90 Sekunden Pause zwischen Bankdrücken und Curls

### 5.3 Timer-Modi

Optional aktivierbar:

- **Total**: Gesamtzeit für die Exercise
- **Intervals**: Set-Zeit + Rest-Zeit als wiederkehrendes Intervall

### 5.4 Automatik vs. Manuell

Alle Timer-Funktionen sind **optional**:

- automatischer Rest nach Set
- automatischer Wechsel zur nächsten Exercise
- oder vollständig manuelle Steuerung

Der Nutzer entscheidet selbst über den Automatisierungsgrad.

---

## 6. Workout Player (Abarbeitungsmodus)

Beim Start einer Routine öffnet sich der **Workout Player**.

Funktionen:

- Anzeige der aktuellen ExerciseCard
- Set-Fortschritt und Timer
- Buttons für:
  - Set erledigt
  - Pause / Skip
  - Zur nächsten oder vorherigen Exercise wechseln

Die Routine wird wie eine **Checkliste** abgearbeitet.

---

## 7. Live-Bearbeitung während des Trainings

Während eines laufenden Workout-Runs können Werte angepasst werden:

- Gewicht pro Set ändern
- Reps oder Zeit korrigieren
- Restzeiten anpassen
- optional Sets hinzufügen oder entfernen

Dies ermöglicht realitätsnahes Training ohne starre Vorgaben.

---

## 8. Übungs-Info & Erklärung

Jede ExerciseCard besitzt einen **Info-Button**.

Dieser öffnet eine Detailansicht mit:

- Erklärung der Übungsausführung
- Zielmuskeln
- häufigen Fehlern
- Tipps zur Technik

Zum Start:

- eigene kleine Übungsbibliothek
- Text + Bild pro Übung

Später erweiterbar durch externe Übungsdatenbanken.

---

## 9. Übungsbibliothek

### Startphase

- kleine, selbst gepflegte Bibliothek (ca. 20–40 Übungen)
- jede Übung enthält:
  - Name
  - Kategorie / Muskelgruppe
  - Beschreibung
  - optional Bild

### Perspektive

- größere Bibliothek
- Suche und Filter
- mögliche externe Datenquellen

---

## 10. Routinen verwalten

Nutzer können:

- Routinen erstellen
- Routinen bearbeiten
- Routinen duplizieren
- Routinen löschen
- Reihenfolge der Exercises ändern

Routinen sind jederzeit erneut startbar.

---

## 11. Zukünftiges Feature: Workout-History

Nicht Teil des initialen Fokus, aber vorgesehen:

- Speicherung abgeschlossener Workout-Runs
- Übersicht vergangener Trainings
- Grundlage für Fortschritts- und Statistikfunktionen

---

## 12. Leitprinzipien

- Fokus auf Training, kein Feature-Overload
- schnelle Bedienung
- gym-taugliche UX
- maximale Flexibilität
- klare Trennung von Planung und Durchführung

---

## 13. Kurzbeschreibung (Pitch)

CalCalCal ist eine Workout-App, mit der Nutzer ihre eigenen Trainingsroutinen aus individuell konfigurierbaren Exercises zusammenstellen und diese anschließend als interaktive Checkliste mit Set-, Timer- und Rest-Logik abarbeiten können. Jede Übung wird übersichtlich als Card dargestellt und kann während des Trainings flexibel angepasst werden. Die App ist ein pragmatisches Tool für strukturiertes, reales Training – ohne Ablenkung, ohne unnötige Features.
