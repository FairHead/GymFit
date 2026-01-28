# TASKS.md – Umsetzung (Phasen & Tasks)

> Ziel: **Workout-Routine Builder + Workout Player** in **React Native (Expo) + TypeScript**
>
> Stack: React Navigation (Stack + Tabs) · Zustand · expo-sqlite · Firebase **JS SDK** (Auth + Firestore) · Offline-first + Auto-Sync (bei App-Start + periodisch)

---

## Phase 0 – Projektgrundlagen (Setup & Standards)

### 0.1 Repo / Tooling

- [x] React-Native-Expo-Projekt erstellen (TypeScript Template)
- [x] `src/`-Struktur anlegen (feature-first)
- [x] Prettier konfigurieren
- [x] ESLint konfigurieren (TS + React Hooks)
- [x] Conventional Commits festlegen (Commitlint optional)
- [x] Env-Handling festlegen (z. B. `.env` + Expo config)

### 0.2 Grundpakete installieren

- [x] React Navigation (Stack + Bottom Tabs)
- [x] Zustand
- [x] expo-sqlite
- [x] Firebase JS SDK
- [x] Optional: `uuid` (IDs) + `zod` (Validation)

### 0.3 App Shell

- [x] RootNavigator erstellen
- [x] TabsNavigator erstellen (Routines / Library / Settings)
- [x] Global Error Boundary + simple Toast/Alert Strategie definieren

---

## Phase 1 – Domain & Data Contracts (Typen, Modelle, Interfaces)

### 1.1 Domain-Types

- [ ] `ExerciseType` definieren (`reps | time`)
- [ ] `UnitType` definieren (`kg | bodyweight | bands`)
- [ ] Modelle definieren:
  - [ ] `ExerciseDefinition`
  - [ ] `Routine`
  - [ ] `RoutineExercise`
  - [ ] `SetPlan`
  - [ ] `WorkoutRun` (+ `RunExerciseProgress`)

- [ ] Default-Konfigurationen als Helper (z. B. „neue Exercise“ → 3 Sets, Reps = 8)

### 1.2 Repository Interfaces (Data Layer)

- [ ] `RoutineRepository` Interface (CRUD + reorder)
- [ ] `ExerciseRepository` Interface (read-only + seed)
- [ ] `SyncService` Interface (pull/push, lastSyncAt)

---

## Phase 2 – SQLite (Offline Source of Truth)

### 2.1 DB Setup

- [ ] SQLite init (einmalig beim App-Start)
- [ ] Migrations-System (Versionstabelle + `migrate()`)

### 2.2 Schema (MVP)

- [ ] Tabellen definieren:
  - [ ] `routines`
  - [ ] `routine_exercises`
  - [ ] `routine_sets` (SetPlan je RoutineExercise)
  - [ ] `exercise_definitions`
  - [ ] `meta` (z. B. lastSyncAt)

### 2.3 Repositories implementieren (SQLite)

- [ ] `sqliteRoutineRepository` (CRUD + reorder)
- [ ] `sqliteExerciseRepository` (seed + read)
- [ ] Seed-Mechanismus für `exercise_definitions` (nur wenn Tabelle leer)

### 2.4 Data Validation

- [ ] Minimal-Validation bei Inserts/Updates (keine kaputten Routinen)

---

## Phase 3 – Firebase (Auth + Firestore Sync)

### 3.1 Firebase Konfiguration

- [ ] Firebase Projekt anlegen (Auth + Firestore)
- [ ] Firebase JS SDK in Expo integrieren
- [ ] Konfig in Env (Expo config) ablegen

### 3.2 Auth

- [ ] Email/Passwort Register
- [ ] Email/Passwort Login
- [ ] Logout
- [ ] Auth Listener (persistenter Login-Status)

### 3.3 Firestore Datenmodell

- [ ] Collections definieren:
  - [ ] `users/{uid}/routines/{routineId}`
  - [ ] `users/{uid}/routineExercises/{routineExerciseId}`
  - [ ] optional: `users/{uid}/routineSets/{setId}` oder Sets eingebettet (Entscheidung treffen)

- [ ] `updatedAt` / `createdAt` Strategie festlegen (ServerTimestamp vs local timestamp)

### 3.4 Sync Service (Auto-Sync Option B)

- [ ] Sync-Regeln definieren (Last-Write-Wins via `updatedAt`)
- [ ] **Pull**: Cloud → Local (wenn cloud newer)
- [ ] **Push**: Local → Cloud (wenn local newer)
- [ ] Sync Trigger:
  - [ ] bei App-Start
  - [ ] periodisch (z. B. alle 5–10 Minuten, nur wenn user eingeloggt)
  - [ ] zusätzlich manuell in Settings („Jetzt synchronisieren“)

---

## Phase 4 – State Management (Zustand Stores)

### 4.1 auth.store

- [ ] `user`, `status` (loading/authenticated/anonymous)
- [ ] `login`, `register`, `logout`
- [ ] `initAuthListener`

### 4.2 routines.store (Templates)

- [ ] `routines[]`, `selectedRoutineId`
- [ ] CRUD Actions (create/update/delete/duplicate)
- [ ] Exercise Actions:
  - [ ] addExercise
  - [ ] removeExercise
  - [ ] reorderExercises
  - [ ] updateRoutineExerciseConfig
  - [ ] updateSetPlan (pro Set)

- [ ] `loadFromDb()`
- [ ] `sync()` Hook (calls SyncService)

### 4.3 workoutRun.store (Player)

- [ ] `activeRun` State
- [ ] `startRun(routineId)`
- [ ] `markSetDone(exerciseId, setIndex)`
- [ ] `nextExercise() / prevExercise()`
- [ ] `pauseRun() / resumeRun() / finishRun()`
- [ ] Live-Edit:
  - [ ] Gewicht/Reps/Time im Run ändern
  - [ ] optional: „Als Vorlage übernehmen“ später

---

## Phase 5 – UI: Routinen (Builder)

### 5.1 Routines Tab

- [ ] RoutineListScreen
  - [ ] Liste aller Routinen
  - [ ] CTA: „Neue Routine“
  - [ ] Aktionen: Start / Edit / Duplicate / Delete

### 5.2 Routine Builder

- [ ] RoutineBuilderScreen
  - [ ] Titel + Beschreibung editierbar
  - [ ] Liste der RoutineExercises als Cards
  - [ ] reorder (drag & drop oder buttons up/down)
  - [ ] „Exercise hinzufügen“

### 5.3 Exercise Picker

- [ ] ExercisePickerModal
  - [ ] Suche (MVP: optional)
  - [ ] Auswahl → fügt Exercise in Routine ein

### 5.4 Exercise Config Screen

- [ ] ExerciseConfigScreen
  - [ ] Typ wählen: reps oder time
  - [ ] Sets Anzahl
  - [ ] SetPlan pro Set editierbar (Reps/Time + Gewicht + Unit)
  - [ ] Rest zwischen Sets
  - [ ] Rest nach Exercise
  - [ ] TimerMode: none/total/intervals
  - [ ] Total/Interval Felder
  - [ ] Option: Automatik an/aus (Rest auto, next auto)

---

## Phase 6 – UI: Workout Player (Abarbeiten)

### 6.1 Player Screen

- [ ] WorkoutPlayerScreen
  - [ ] Anzeige aktuelle ExerciseCard
  - [ ] Set-Fortschritt (z. B. 2/3)
  - [ ] Buttons: Set done, Skip rest, Next/Prev
  - [ ] Progress in Routine (Exercise 2/6)

### 6.2 Checklisten-Logik

- [ ] Markiere Sets als done
- [ ] Markiere Exercise als done sobald alle Sets done
- [ ] Next/Prev Exercise Navigation

### 6.3 Live Edit im Player

- [ ] Gewicht pro Set anpassbar
- [ ] Reps/Time korrigierbar
- [ ] Restzeiten während Run anpassbar

---

## Phase 7 – Timer & Rest Engine (robust bei App-Wechsel)

### 7.1 Timer State (timestamp-basiert)

- [ ] Timer-Model im Run:
  - [ ] `timerStartAt`
  - [ ] `timerDurationSec`
  - [ ] `timerKind` (set/rest/total)

- [ ] Remaining berechnen über `Date.now()` (kein “countdown drift”)

### 7.2 Local Notifications (Rest-Ende)

- [ ] Permission Handling
- [ ] Bei Rest-Start Notification planen
- [ ] Beim Skip/Next Notification canceln

### 7.3 Automatik-Optionen

- [ ] Auto-Rest nach Set (toggle)
- [ ] Auto-Next nach Exercise (toggle)
- [ ] Manuell bleibt immer möglich

---

## Phase 8 – Exercise Library & Info (How-to)

### 8.1 Library Tab

- [ ] ExerciseLibraryScreen
  - [ ] Liste der ExerciseDefinitions
  - [ ] Filter/Sort (später)

### 8.2 Exercise Detail

- [ ] ExerciseDetailScreen
  - [ ] Beschreibung, Zielmuskeln
  - [ ] Technik-Tipps + häufige Fehler

### 8.3 Info Button

- [ ] Info-Button auf ExerciseCards (Builder + Player)
- [ ] Navigation zum Detail

---

## Phase 9 – Settings (Account, Sync, Optionen)

### 9.1 Settings Tab

- [ ] Auth Status anzeigen
- [ ] Login/Register/Logout
- [ ] Sync Status:
  - [ ] LastSyncAt anzeigen
  - [ ] Button „Jetzt synchronisieren“

### 9.2 Player/Timer Optionen

- [ ] Default Toggles speichern:
  - [ ] Auto-Rest
  - [ ] Auto-Next
  - [ ] Notifications an/aus

---

## Phase 10 – Polishing (MVP Abschluss)

### 10.1 UX

- [ ] Empty States (keine Routinen, keine Exercises)
- [ ] Loading States
- [ ] Bestätigungsdialoge (Delete)
- [ ] Haptics (optional)

### 10.2 Data Integrity

- [ ] Defensive Checks (z. B. Routine ohne Exercises nicht startbar)
- [ ] Migration testen (fresh install vs update)

### 10.3 Release Readiness

- [ ] App Icon + Splash
- [ ] Basic README (Install + Run)
- [ ] Minimal Privacy Hinweis (Firebase)

---

## Phase 11 – Optional / Später

### 11.1 Workout History

- [ ] Runs in SQLite speichern
- [ ] History Screen
- [ ] Runs in Firestore syncen

### 11.2 Exercise Library Import (Internet)

- [ ] Remote fetch + caching
- [ ] Versioning der Bibliothek

### 11.3 Tests (wenn du einsteigst)

- [ ] Unit Tests Domain (Timer, Next-Step)
- [ ] Component Tests ExerciseCard

---

## Definition of Done (MVP)

- [ ] Routinen erstellen/bearbeiten/speichern
- [ ] Exercises konfigurieren (reps/time, sets, pro-set weight, rest, timer modes)
- [ ] Player: Routine als Checkliste abarbeiten
- [ ] Timer/Rest robust bei App-Wechsel (timestamp + notifications)
- [ ] Firebase Auth + Auto-Sync (Start + periodisch) für Templates
- [ ] Exercise Info erreichbar
