# GitHub Copilot – Projektanweisungen (CalCalCal)

Diese Datei definiert **verbindliche Anweisungen** für GitHub Copilot beim Arbeiten am Projekt **CalCalCal**.
Copilot soll sich strikt an diese Regeln halten, um konsistenten, wartbaren und architekturkonformen Code zu erzeugen.

---

## 0. Verbindliche Kontext-Dokumente

GitHub Copilot MUSS bei jeder Code-Generierung die folgenden Dokumente
als verbindliche Quelle berücksichtigen:

1. `Konzept.md`  
   → beschreibt Zweck, Funktionsumfang und Produktlogik der App

2. `ARCHITECTURE.md`  
   → definiert die technische Architektur, Schichten, State-Trennung,
   Datenmodelle und technische Entscheidungen

3. `TASKS.md`  
   → definiert Phasen, Aufgaben und Umsetzungsschritte

Diese Dokumente sind **gleichrangig** und **verbindlich**.

Copilot DARF:

- keine Features implementieren, die diesen Dokumenten widersprechen
- keine Architekturentscheidungen treffen, die dort nicht definiert sind

Copilot MUSS:

- Code immer im Kontext dieser Dokumente erzeugen
- bei Unklarheiten explizit mit `// TODO: clarify behavior` markieren

## 1. Projektüberblick

**CalCalCal** ist eine **Workout-Routine Builder & Workout-Player App**.

**Stack (fix):**

- React Native + Expo
- TypeScript (strict)
- React Navigation (Stack + Tabs)
- Zustand (State Management)
- SQLite (expo-sqlite) als lokale Datenbank
- Firebase JS SDK (Auth + Firestore) für Accounts & Sync
- Offline-first Architektur

Die App besteht aus **Templates (Routinen)** und **Workout-Runs (aktive Trainingsdurchläufe)**, die strikt getrennt sind.

---

## 2. Grundregeln für Code-Generierung

Copilot MUSS:

- ausschließlich **TypeScript** generieren
- **keinen** `any`-Typ verwenden
- keine Business-Logik direkt in UI-Komponenten implementieren
- keine globale Mutable State außerhalb von Zustand verwenden
- keine direkten Firebase- oder SQLite-Zugriffe aus UI-Komponenten machen

Copilot DARF NICHT:

- Architekturentscheidungen eigenmächtig ändern
- neue Libraries einführen, ohne explizite Anweisung
- Logik zwischen Template-State und Run-State vermischen

---

## 3. Projektstruktur (verbindlich)

Copilot darf Dateien **nur** innerhalb dieser Struktur anlegen:

```
src/
  app/
    navigation/
    screens/
  features/
    routines/
      ui/
      state/
      domain/
      data/
    workoutRun/
      ui/
      state/
      domain/
      data/
    exercises/
      ui/
      domain/
      data/
  shared/
    ui/
      components/
      theme/
    utils/
    types/
  infra/
    db/
    firebase/
```

Keine Cross-Imports zwischen Features ohne explizite Freigabe.

---

## 4. Architekturprinzipien

### 4.1 Template vs Run (kritisch)

- **Routine / Template** = Planung
- **WorkoutRun** = Ausführung

Copilot MUSS:

- diese Zustände strikt trennen
- keine Änderungen an Templates während eines Runs durchführen
- Live-Änderungen im Run-State isoliert halten

---

### 4.2 State Management (Zustand)

- Jeder Feature-Bereich besitzt **einen eigenen Store**
- Stores enthalten:
  - State
  - Actions
  - keine UI-Logik

UI-Komponenten:

- greifen nur über Selector-Funktionen auf Stores zu
- enthalten keine Datenpersistenz

---

## 5. Domain-Regeln (Workout-Logik)

### 5.1 Exercise-Typen

- Eine Exercise ist **entweder** `reps` **oder** `time`
- Rest-Zeiten sind **immer optional**

### 5.2 Sets

- Sets sind **indexbasiert** (0..n)
- Gewicht wird **pro Set** gespeichert
- Set-Completion wird explizit markiert

---

## 6. Timer-Regeln (sehr wichtig)

Copilot MUSS:

- Timer **timestamp-basiert** implementieren
- KEINE rein interval-basierten `setInterval`-Timer als Logikquelle nutzen

Timer-Regel:

```
remaining = duration - (now - startAt)
```

Timer dürfen:

- durch App-Wechsel pausiert werden
- beim Zurückkehren korrekt weiterlaufen

Local Notifications dürfen verwendet werden, um Rest-Enden zu signalisieren.

---

## 7. Datenpersistenz

### 7.1 SQLite

- SQLite ist **lokale Source of Truth**
- Alle Writes gehen zuerst in SQLite
- Repositories kapseln alle DB-Zugriffe

### 7.2 Firebase

- Firebase dient zur **Synchronisation**, nicht als Primärquelle
- Sync erfolgt:
  - bei App-Start
  - periodisch im Hintergrund

Konfliktlösung:

- `updatedAt` → **Last Write Wins**

---

## 8. UI-Richtlinien

- UI-Komponenten sind **dumm** (Props rein, Events raus)
- Zentrale UI-Komponenten:
  - `ExerciseCard`
  - `SetRow`
  - `TimerDisplay`

Keine Logik in:

- `renderItem`
- JSX-Ausdrücken

---

## 9. Naming-Konventionen

### Dateien

- `*.store.ts` → Zustand Store
- `*.repository.ts` → Repository Interface
- `*.sqlite.ts` → SQLite Implementierung
- `*.firebase.ts` → Firebase Implementierung

### Funktionen

- `startRun()`
- `markSetDone()`
- `updateSetWeight()`

---

## 10. Coding Style

- `strict: true`
- Early returns statt tiefer Verschachtelung
- Kleine, pure Funktionen bevorzugen

---

## 11. Git-Regeln

- Commits nach **Conventional Commits**:
  - `feat:` neue Funktion
  - `fix:` Bugfix
  - `refactor:` Umbau ohne Funktionsänderung
  - `chore:` Tooling / Cleanup

---

## 12. Verhalten bei Unklarheiten

Wenn Anforderungen unklar sind, MUSS Copilot:

- kommentieren `// TODO: clarify behavior`
- KEINE Annahmen treffen
- KEINE zusätzliche Features einbauen

---

## 13. Ziel

Copilot soll **architekturtreuen, wartbaren Code** erzeugen,
kein experimentelles oder spekulatives Verhalten zeigen
und sich strikt an Konzept.md, ARCHITECTURE.md und TASKS.md orientieren.

## Kontext-Check (Pflicht)

Bevor Copilot Code erzeugt, MUSS geprüft werden:

- Passt der Code zur Architektur in `ARCHITECTURE.md`?
- Entspricht das Feature dem Scope in `Konzept.md`?
- Befindet sich die Aufgabe in einer Phase aus `TASKS.md`?

Wenn mindestens eine Frage nicht eindeutig mit JA beantwortet werden kann:
→ KEIN Code generieren.
→ Stattdessen `// TODO: clarify behavior` setzen.
