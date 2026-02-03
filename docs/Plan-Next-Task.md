# Plan: Batch B-04 - Finalization & Testing

## Batch-ID

B-04

## Titel

Finalization & Quality Assurance (Integration & E2E Testing)

## Enthaltene Checklist-Tasks

- T-10: Integration & End-to-End Testing

## Outcome / Zielbild

Ein vollständig verifiziertes Plugin, das stabil in der OpenCode-Umgebung läuft. Alle kritischen Pfade (Init, Start-Loop, State-Transitions, Stop) sind durch Tests abgedeckt. Die Dokumentation für manuelle Tests und die CI-Konformität sind sichergestellt.

## Anforderungen

### Must

- Unit-Tests für Kernkomponenten (`state.ts`, `cli-executor.ts`, `agents-md.ts`, `orchestrator.ts`).
- Mocking der OpenCode/Node-APIs (fs, child_process) für isolierte Integrationstests.
- Erfolgreicher manueller E2E-Durchlauf (simuliert via Scripts).
- Kompilierbarkeit und Lint-Freiheit sicherstellen.

### Should

- Dokumentation der Test-Szenarien in `docs/testing.md`.
- Optimierung der Logging-Ausgaben für bessere User Experience.

### Could

- Edge-Case Tests (z.B. korrupte `state.json`, fehlende Permissions).
- Performance-Check der Delays.

## Akzeptanzkriterien (Integration/End-to-End)

- `npm test` läuft ohne Fehler durch (sobald Toolchain verfügbar).
- Der Orchestrator verarbeitet Mocks von CLI-Sequenzen ohne Hänger.
- `init` hinterlässt ein konsistentes Dateisystem-Abbild.
- Die `AGENTS.md` Marker-Logik erkennt alle Grenzfälle (leere Datei, Datei ohne Marker).

## Scope-Grenzen (Explizite Non-Goals)

- Kein Testing auf verschiedenen Betriebssystemen außer Linux/WSL.
- Keine Lasttests für die CLI-Ausführung.

## Risiken & Annahmen

- **Risiko:** Fehlende Bun/Mise Umgebung erschwert echte Test-Ausführung im Agent-Kontext.
- **Annahme:** Statische Analyse und Mock-Tests reichen für die finale Abnahme im Plugin-System aus.

## Architektur- / Design-Entscheidungen

- **Test-Framework**: Nutzung von `vitest` wie in `AGENTS.md` vorgegeben.
- **Mocking**: Einsatz von `vi.mock` für `fs/promises` und `child_process`, um externe Seiteneffekte zu vermeiden.
- **E2E-Simulation**: Aufgrund der fehlenden Plugin-Runtime im Test-Runner simulieren wir den End-to-End-Flow durch direkte Aufrufe des `orchestrator` gegen ein temporäres Test-Dateisystem.

## Meilensteine (Sub-Milestones)

- **M1: Unit Tests (Core)**: Tests für `state.ts` (Read/Write/Validation) und `agents-md.ts` (Marker Injection).
- **M2: Integration Tests (Executor)**: Tests für `cli-executor.ts` (Mocking von Exec/Spawn) und `orchestrator.ts` (Loop-Logik).
- **M3: Documentation**: Erstellung von `docs/testing.md` mit Anleitungen zum manuellen Testen und zur Fehlersuche.

## Abhängigkeiten

- **Intern**: Alle Module müssen stable sein (keine offenen Refactorings).
- **Extern**: `vitest` muss im Dev-Stack verfügbar sein (implizit durch `package.json`).

## Risiken + Mitigation

- **Risiko: Mock-Drift**: Mocks verhalten sich anders als das echte Dateisystem.
  - _Mitigation_: Integration von "echten" FS-Tests in einem temporären Verzeichnis (sofern Permissions erlauben).
- **Risiko: Toolchain-Fehler**: Tests laufen lokal nicht wegen fehlendem `bun`.
  - _Mitigation_: Schreiben von robustem, standardkonformem Testcode, der theoretisch auch mit `node` runner kompatibel wäre (Backup-Plan).

## Teststrategie

- **Unit**: Jede öffentliche Funktion in `src/` bekommt mindestens einen Positiv- und einen Negativ-Test.
- **Integration**: Der `orchestrator` wird mit einem Mock-State initialisiert und muss mindestens einen Zyklus durchlaufen.

## Rollback / Failure-Plan

- Sollten Tests Design-Schwächen aufdecken, wird der Code refactored ("Fix forward").
- Bei unlösbaren Test-Blockern wird der Test-Scope auf "Critical Paths" reduziert.

## Implementation Steps

1. **State Tests (`src/state.test.ts`)**: Validierung von `readState`/`writeState` und Schema-Checks.
2. **Agents Header Tests (`src/agents-md.test.ts`)**: Prüfung der Idempotenz von `injectAgentsHeader`.
3. **Executor Tests (`src/cli-executor.test.ts`)**: Mock-Test für `executeSequence` inkl. Delay-Simulation.
4. **Orchestrator Tests (`src/orchestrator.test.ts`)**: Simulation von `startLoop`, `stopLoop` und State-Updates.
5. **Test Docs (`docs/testing.md`)**: Anleitung schreiben.

## Cut Line

- **MVP**: Coverage der Happy-Paths für alle 4 Hauptkomponenten.
- **Nice-to-have**: 100% Branch Coverage, Fuzzing von State-Inputs.

## Fortschritt

- **M1: Unit Tests (Core)**: done
- **M2: Integration Tests (Executor)**: done
- **M3: Documentation**: done

## Progress

- M1 abgeschlossen: Unit-Tests fuer `state.ts` und `agents-md.ts` implementiert.
- M2 abgeschlossen: Tests fuer `cli-executor.ts` und `orchestrator.ts` implementiert.
- M3 abgeschlossen: `docs/testing.md` erstellt.
- Checks erneut versucht (Build/Test/Lint), Toolchain weiterhin nicht verfuegbar.
- Bun installiert; initialer Build scheiterte wegen fehlender Abhaengigkeiten.
- Bun install mit `--no-save` erfolgreich; Build erfolgreich; Tests haengen (Timeout).
- Tests stabilisiert (isolierte Temp-Dirs/Mocks); `bun test` laeuft jetzt durch.

## Deviations / Notes

- Tests konnten in dieser Umgebung nicht ausgefuehrt werden (fehlendes `mise`/`bun`).
- Build/Test/Lint erneut fehlgeschlagen, da `mise`/`bun` fehlen.
- `mise` Install-Script meldet unsupported OS (MINGW64).
- `bun install` scheitert mit Lockfile-Fehler (old lockfile replace).
- `npm install` scheitert wegen UNC-Pfad (esbuild install.js).
- `bun test` haengt (wiederholtes "State: pick_next"), Timeout nach 120s.
- `bun test` jetzt erfolgreich nach Test-Isolierung und Mock-Anpassung.
- `bunx eslint .` scheitert auf Windows (UNC-Path/Modulpfad).
