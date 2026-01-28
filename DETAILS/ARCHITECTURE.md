# ARCHITECTURE.md – CalCalCal (Workout-Only)

> **Stack (festgelegt):** React Native + **Expo**, **TypeScript**, **React Navigation** (Stack + Tabs), **Zustand** für State, **Firebase** (Auth + Firestore) für Accounts/Sync, **SQLite** für lokale Persistenz, Prettier + ESLint + Conventional Commits.

---

## 1. Ziel der Architektur

Die Architektur soll:

- **Workout-Routinen (Templates)** stabil speichern, bearbeiten und abspielen können.
- Einen **Workout-Run (Player-State)** sauber von Templates trennen.
- **Offline-first** funktionieren (Gym, schlechter Empfang) und später/parallel **Cloud-Sync** über Firebase ermöglichen.
- **Timer/Rest** zuverlässig abbilden – auch wenn der Nutzer kurz in andere Apps wechselt.
- Einfach erweiterbar bleiben (History/Stats später), ohne den MVP zu überfrachten.

---

## 2. Nicht-Ziele (bewusst)

- Social Features, Feed, Sharing, Leaderboards
- Ernährung/Makros (Workout-only)
- Komplexe Statistik-Engine im MVP

---

## 3. High-Level Design

### 3.1 Schichten

**UI Layer**

- Screens, Components, Navigation
- Ruft Use-Cases/Stores auf

**State Layer (Zustand)**

- Getrennte Stores für Templates, Run/Player, Auth
- UI bindet sich an Stores (Selectors)

**Domain Layer**

- Typen/Modelle (Routine, Exercise, Run, Timer)
- Pure Helper/Use-Case-Funktionen (z. B. NextStep, Timer-Rechnung)

**Data Layer**

- Repositories (Interfaces) + Implementierungen
- SQLite (lokal) + Firebase (remote)

---

## 4. Kernkonzepte & Datenmodell

### 4.1 Begriffe

- **Routine (Template / Session):** wiederverwendbare Workout-Vorlage
- **RoutineExercise:** konfiguriertes Element innerhalb einer Routine (mit Sets, Rest, Einheit, Typ etc.)
- **WorkoutRun:** eine konkrete Ausführung einer Routine (Player-Progress)
- **ExerciseDefinition:** Eintrag aus der Übungsbibliothek (Name, How-to, Muskelgruppe)

### 4.2 Domain-Model (TypeScript)

**ExerciseType**

- `"reps" | "time"`

**UnitType**

- `"kg" | "bodyweight" | "bands"`

**Routine**

- `id: string`
- `title: string`
- `description?: string`
- `exerciseIds: string[]` (Reihenfolge)
- `createdAt: number` / `updatedAt: number`

**RoutineExercise**

- `id: string` (unique within routine)
- `routineId: string`
- `exerciseDefinitionId: string`
- `type: ExerciseType` (reps ODER time)
- `sets: SetPlan[]` (pro Set trackbar)
- `restBetweenSetsSec?: number`
- `restAfterExerciseSec?: number` (zwischen Exercises)
- `timerMode: "none" | "total" | "intervals"`
- `totalDurationSec?: number`
- `intervalSetSec?: number`
- `intervalRestSec?: number`
- `unit: UnitType`
- `intensityPercent?: number`

**SetPlan** (Plan + Live editable)

- `index: number`
- `targetReps?: number` (wenn type=reps)
- `targetTimeSec?: number` (wenn type=time)
- `weightValue?: number` (optional)
- `weightUnit: UnitType` (kg/bodyweight/bands)

**WorkoutRun**

- `id: string`
- `routineId: string`
- `startedAt: number`
- `finishedAt?: number`
- `currentExerciseIndex: number`
- `exerciseProgress: RunExerciseProgress[]`
- `status: "active" | "paused" | "finished" | "abandoned"`

**RunExerciseProgress**

- `routineExerciseId: string`
- `setsDone: boolean[]` (Länge = sets.length)
- `actualSets?: ActualSet[]` (optional, wenn du tatsächliche Werte erfassen willst)
- `skipped?: boolean`

**ActualSet (optional)**

- `index: number`
- `actualReps?: number`
- `actualTimeSec?: number`
- `actualWeight?: number`
- `completedAt: number`

---

## 5. Persistence & Sync-Strategie

### 5.1 Lokal: SQLite (Source of Truth offline)

- SQLite speichert:
  - Routines
  - RoutineExercises
  - ExerciseDefinitions (initial hardcoded → später importierbar)
  - optional WorkoutRuns (History später)

**Warum SQLite?**

- strukturiert, robust, performant
- saubere Relationen (Routine → Exercises → Sets)

### 5.2 Remote: Firebase (Accounts + Sync)

- **Firebase Auth**: Email/Passwort oder Provider (später)
- **Firestore**: Cloud-Speicherung der Templates (und später Runs)

**Sync-Ansatz (pragmatisch, offline-first):**

- Lokal wird immer zuerst geschrieben.
- Bei Login/Online wird im Hintergrund synchronisiert.
- Konflikte: **Last-Write-Wins** über `updatedAt`.

**Daten-Scope in Firestore (vorschlag):**

- `users/{uid}/routines/{routineId}`
- `users/{uid}/routineExercises/{routineExerciseId}`
- später: `users/{uid}/runs/{runId}`

### 5.3 IDs

- Durchgehend UUIDs (lokal + cloud kompatibel)

---

## 6. Timer-Architektur (Foreground + “kurz Hintergrund”)

**Anforderung:** Nutzer soll während Rest/Timer in andere Apps wechseln können (z. B. Musik), ohne dass die Logik kaputt geht.

### 6.1 Prinzip: Zeit basiert auf Timestamps, nicht auf “Tick”-Zählern

- Beim Start eines Timers speichern:
  - `timerStartAt` (Unix ms)
  - `timerDurationSec`

- Beim Rendern berechnen:
  - `remaining = duration - (now - startAt)`

So ist der Timer **korrekt**, selbst wenn JS kurz pausiert.

### 6.2 Optional: Local Notifications für Rest-Ende

Da Expo/React Native Timer im Hintergrund nicht garantiert „tickgenau“ laufen:

- Beim Start eines Rest-Timers (wenn Option aktiv):
  - plane eine **Local Notification** für das Rest-Ende

- Beim Zurückkehren:
  - re-compute remaining aus Timestamps
  - notif ggf. canceln, wenn schon weiter

**Ziel:** UX zuverlässig (Signal am Rest-Ende), Logik robust (Timestamps).

> Hinweis: „Echter“ Background Timer Loop ist in Expo Managed eingeschränkt. Die Architektur setzt deshalb auf **Timestamps + Notifications** als robuste Lösung.

---

## 7. State Management (Zustand)

### 7.1 Store-Schnitt (empfohlen)

**auth.store**

- `user`, `status`, `login()`, `logout()`, `initAuthListener()`

**routines.store** (Templates)

- `routines[]`, `selectedRoutineId`
- CRUD: `createRoutine`, `updateRoutine`, `deleteRoutine`, `duplicateRoutine`
- `addExerciseToRoutine`, `updateRoutineExercise`, `reorderExercises`
- `loadFromDb()`
- `syncToCloud()` (wenn user logged in)

**workoutRun.store** (Player)

- `activeRun?: WorkoutRun`
- `startRun(routineId)`
- `markSetDone(exerciseId, setIndex)`
- `nextExercise()`, `prevExercise()`
- `startRestTimer()`, `skipRest()`
- `pauseRun()`, `resumeRun()`, `finishRun()`

### 7.2 Regel: Template-State vs Run-State strikt trennen

- **Routine bearbeiten** ändert Templates.
- **WorkoutRun** ist momentaner Fortschritt.
- Live-Bearbeitung während Run ist erlaubt, aber wird als:
  - Update an Template (wenn Nutzer „speichern“/„apply to routine“ wählt) oder
  - Update nur in Run (wenn Nutzer nur für dieses Workout ändern will)

> Entscheidungspunkt für UX: Im MVP kann es reichen, Live-Änderungen direkt im Run zu speichern und optional „als Vorlage übernehmen“ später.

---

## 8. Navigation

### 8.1 Tab-Navigation

- **Routines** (Liste + Start)
- **Library** (ExerciseDefinitions + Details)
- **Settings** (Account, Sync, App-Optionen)

### 8.2 Stack/Modal Screens

- RoutineBuilderScreen (Edit/Create)
- ExercisePickerModal
- ExerciseConfigScreen (Card-Konfiguration)
- WorkoutPlayerScreen
- ExerciseDetailScreen (How-to)
- AuthScreens (Login/Register)

---

## 9. Projektstruktur (recommended)

```
src/
  app/
    navigation/
      RootNavigator.tsx
      TabsNavigator.tsx
    screens/
      routines/
      library/
      settings/
      auth/
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
    db/         # sqlite setup, migrations
    firebase/   # auth, firestore clients
```

**Prinzip:** Feature-first. Shared nur für wirklich wiederverwendbare Bausteine.

---

## 10. Data Layer (Repositories)

### 10.1 Interfaces

- `RoutineRepository`
- `ExerciseRepository`
- `WorkoutRunRepository` (später)

### 10.2 Implementierungen

- `sqliteRoutineRepository`
- `firestoreRoutineRepository`

### 10.3 Sync Service

Ein `syncService` koordiniert:

- Pull: Cloud → Local (wenn neuer)
- Push: Local → Cloud (wenn local updatedAt neuer)

---

## 11. Error Handling & Logging

- Repositories werfen definierte Fehler (z. B. `NotFound`, `ValidationError`, `DbError`)
- UI zeigt nutzerfreundliche States (Empty/Error/Loading)
- Debug logging nur in dev builds

---

## 12. Performance-Grundsätze

- FlatList für Routine-Listen
- Memoization nur bei Bedarf
- Store-Selectors nutzen (Zustand), um Re-Renders zu minimieren

---

## 13. Coding Standards

### 13.1 TypeScript

- `strict: true`
- keine `any`
- Domain Types zentral

### 13.2 Format/Lint

- Prettier (format on save)
- ESLint (TypeScript + React Hooks Regeln)

### 13.3 Git

- Conventional Commits:
  - `feat: ...`
  - `fix: ...`
  - `chore: ...`
  - `refactor: ...`

---

## 14. Testing (später aktivieren)

Da du im MVP erstmal keine Tests willst:

- Architektur hält Domain/Use-Cases **testbar** (pure functions)
- Wenn du später einsteigst:
  - Unit Tests für Domain (Timer-Rechnung, Next-Step Logic)
  - Component Tests für ExerciseCard

---

## 15. Roadmap-Architekturentscheidungen (später)

- Workout-History aktivieren: `WorkoutRunRepository` + UI History Screen
- Progress/Stats: Aggregation layer (read models)
- Exercise Library Import: Remote fetch + caching + versioning
- Background reliability: optional EAS Build + native background libs (wenn wirklich nötig)
