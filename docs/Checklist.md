# Full-Auto Plugin - Projekt-Checklist

> **Single Source of Truth:** Das verbindliche Konzept ist in [`docs/Concept.md`](./Concept.md) definiert.
> Diese Checklist leitet sich daraus ab und dient als Arbeitsindex.

---

## Projektüberblick

**Full-Auto** ist ein OpenCode-Plugin für CLI-basierte Workflow-Automation. Es orchestriert einen festen Arbeitsablauf über CLI-Sequenzen:

```
Pick Next → Plan → Implement → Review → Done → (Loop)
```

Das Plugin führt CLI-Commands nacheinander aus, fügt Delays ein, steuert OpenCode-Sessions und pflegt den Workflow-State.

---

## Scope

**In-Scope:**

- Plugin-Befehle: `full-auto init`, `full-auto start`, `full-auto stop`, `full-auto run-once`
- CLI-Sequenz-Executor (JSON-basiert, mit Delays)
- State-Management via `state.json`
- Default-Templates für Commands und CLI-Sequenzen
- AGENTS.md Header-Block Management
- Ordnerstruktur unter `.opencode/full-auto/`

**Out-of-Scope:**

- Eigene LLM-Logik (nutzt OpenCode's Commands)
- UI/Web-Interface
- Remote/Cloud-Features
- Multi-Projekt-Support (nur aktuelles Projekt)
- Komplexe State-Validierung (wird durch `update_state_status` Command gelöst)

---

## Tasks

### T-01: Plugin-Grundstruktur & Command-Registration

| Feld                   | Wert                                                                                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ID**                 | T-01                                                                                                                                                    |
| **Titel**              | Plugin-Grundstruktur & Command-Registration                                                                                                             |
| **Status**             | `done`                                                                                                                                                  |
| **Beschreibung**       | Refactoring der bestehenden Plugin-Struktur. Registrierung der vier Hauptbefehle (`full-auto init`, `start`, `stop`, `run-once`) als OpenCode-Commands. |
| **Akzeptanzkriterien** | - Alle vier Commands sind registriert und aufrufbar<br>- Commands geben sinnvolle Fehlermeldungen wenn Voraussetzungen fehlen<br>- Plugin lädt korrekt  |
| **Betroffene Dateien** | `src/index.ts`, `src/commands/*.ts` (neu)                                                                                                               |

---

### T-02: Init-Command Implementation

| Feld                   | Wert                                                                                                                                                                                                                                                                                                 |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ID**                 | T-02                                                                                                                                                                                                                                                                                                 |
| **Titel**              | `full-auto init` Command                                                                                                                                                                                                                                                                             |
| **Status**             | `done`                                                                                                                                                                                                                                                                                               |
| **Beschreibung**       | Implementiert den Init-Befehl, der die komplette Ordnerstruktur unter `.opencode/full-auto/` anlegt, Default-Commands, CLI-Sequenzen, Beispiel-Checklist und state.json erzeugt.                                                                                                                     |
| **Akzeptanzkriterien** | - Ordnerstruktur wird korrekt angelegt<br>- Alle Default-Command-Templates werden erstellt<br>- Alle Default-CLI-Sequenzen werden erstellt<br>- `state.json` mit initialem State wird geschrieben<br>- `checklist.md` Beispiel wird erstellt<br>- Idempotent: Wiederholter Aufruf überschreibt nicht |
| **Betroffene Dateien** | `src/commands/init.ts`, `src/templates/*.ts`                                                                                                                                                                                                                                                         |

---

### T-03: AGENTS.md Management

| Feld                   | Wert                                                                                                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **ID**                 | T-03                                                                                                                                                                                 |
| **Titel**              | AGENTS.md Header-Block Management                                                                                                                                                    |
| **Status**             | `done`                                                                                                                                                                               |
| **Beschreibung**       | Logik zum Anlegen/Aktualisieren des Header-Blocks in `AGENTS.md`. Der Block definiert State-Namen, Schema und Workflow-Regeln. Bestehender Inhalt bleibt erhalten.                   |
| **Akzeptanzkriterien** | - Header-Block wird am Anfang eingefügt<br>- Bestehender AGENTS.md-Inhalt bleibt erhalten<br>- Bei Update wird nur der Header-Block ersetzt<br>- Klare Marker für Block-Anfang/-Ende |
| **Betroffene Dateien** | `src/agents-md.ts`, `src/templates/agents-header.ts`                                                                                                                                 |

---

### T-04: State-Management

| Feld                   | Wert                                                                                                                                                                    |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ID**                 | T-04                                                                                                                                                                    |
| **Titel**              | State-Management (state.json)                                                                                                                                           |
| **Status**             | `done`                                                                                                                                                                  |
| **Beschreibung**       | Funktionen zum Lesen/Schreiben der `state.json`. State enthält aktuellen Workflow-Status (z.B. `pick_next`, `plan`, etc.) und optionale Metadaten.                      |
| **Akzeptanzkriterien** | - State lesen/schreiben funktioniert<br>- State-Schema ist definiert und validiert<br>- Fehlende state.json wird sauber gehandelt<br>- State-Transitions werden geloggt |
| **Betroffene Dateien** | `src/state.ts`, `src/types.ts`                                                                                                                                          |

---

### T-05: CLI-Sequenz-Executor

| Feld                   | Wert                                                                                                                                                                                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **ID**                 | T-05                                                                                                                                                                                                                                                         |
| **Titel**              | CLI-Sequenz-Executor Engine                                                                                                                                                                                                                                  |
| **Status**             | `done`                                                                                                                                                                                                                                                       |
| **Beschreibung**       | Kernlogik zum Ausführen von CLI-Sequenzen. Liest JSON-Dateien aus `cli/`, führt Commands mit konfigurierbarem Delay aus, unterscheidet OpenCode-Commands (`/xyz`) von Shell-Commands.                                                                        |
| **Akzeptanzkriterien** | - JSON-Sequenzen werden korrekt geparst<br>- Commands werden sequentiell mit Delay ausgeführt<br>- OpenCode-Commands werden korrekt getriggert<br>- Shell-Commands (z.B. `opencode --model x`) werden ausgeführt<br>- Fehlerhandling bei fehlenden Sequenzen |
| **Betroffene Dateien** | `src/cli-executor.ts`, `src/types.ts`                                                                                                                                                                                                                        |

---

### T-06: Start-Command Implementation

| Feld                   | Wert                                                                                                                                                                                                  |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ID**                 | T-06                                                                                                                                                                                                  |
| **Titel**              | `full-auto start` Command                                                                                                                                                                             |
| **Status**             | `done`                                                                                                                                                                                                |
| **Beschreibung**       | Implementiert die Hauptautomationsschleife: State lesen, CLI-Sequenz ausführen, `update_state_status` ausführen, nächsten State bestimmen, wiederholen.                                               |
| **Akzeptanzkriterien** | - Loop läuft stabil<br>- State wird nach jedem Durchlauf aktualisiert<br>- `update_state_status` wird immer ausgeführt<br>- Loop kann sauber beendet werden (via stop)<br>- Logging für jeden Schritt |
| **Betroffene Dateien** | `src/commands/start.ts`, `src/orchestrator.ts`                                                                                                                                                        |

---

### T-07: Stop-Command Implementation

| Feld                   | Wert                                                                                                                                |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **ID**                 | T-07                                                                                                                                |
| **Titel**              | `full-auto stop` Command                                                                                                            |
| **Status**             | `done`                                                                                                                              |
| **Beschreibung**       | Stoppt die laufende Automation sauber. Setzt ein Stop-Signal, das die Schleife beim nächsten Check beendet.                         |
| **Akzeptanzkriterien** | - Stop-Signal wird gesetzt<br>- Laufende Automation beendet sich nach aktuellem State<br>- Keine harten Abbrüche mitten in Commands |
| **Betroffene Dateien** | `src/commands/stop.ts`, `src/orchestrator.ts`                                                                                       |

---

### T-08: Run-Once-Command Implementation

| Feld                   | Wert                                                                                                                             |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **ID**                 | T-08                                                                                                                             |
| **Titel**              | `full-auto run-once` Command                                                                                                     |
| **Status**             | `done`                                                                                                                           |
| **Beschreibung**       | Führt genau einen State-Zyklus aus (inkl. `update_state_status`), dann Stop. Nützlich für Debugging und schrittweise Ausführung. |
| **Akzeptanzkriterien** | - Genau ein State wird ausgeführt<br>- `update_state_status` wird danach ausgeführt<br>- Kein Loop, beendet sich selbst          |
| **Betroffene Dateien** | `src/commands/run-once.ts`                                                                                                       |

---

### T-09: Default-Templates erstellen

| Feld                   | Wert                                                                                                                                                                                |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ID**                 | T-09                                                                                                                                                                                |
| **Titel**              | Default-Templates für Commands & CLI-Sequenzen                                                                                                                                      |
| **Status**             | `done`                                                                                                                                                                              |
| **Beschreibung**       | Erstellt die Default-Inhalte für alle Command-Markdown-Dateien (`pick_next.md`, `plan.md`, `implement.md`, `review.md`, `done.md`, `update_state_status.md`) und CLI-Sequenz-JSONs. |
| **Akzeptanzkriterien** | - Alle 6 Command-Templates sind definiert<br>- Alle 6 CLI-Sequenz-JSONs sind definiert<br>- Templates sind sinnvoll und anpassbar<br>- Beispiel-Checklist ist vorhanden             |
| **Betroffene Dateien** | `src/templates/commands/*.ts`, `src/templates/cli/*.ts`                                                                                                                             |

---

### T-10: Integration & End-to-End Testing

| Feld                   | Wert                                                                                                                                    |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **ID**                 | T-10                                                                                                                                    |
| **Titel**              | Integration & End-to-End Testing                                                                                                        |
| **Status**             | `done`                                                                                                                                  |
| **Beschreibung**       | Tests für den gesamten Workflow: Init, Start, State-Transitions, Stop. Manueller E2E-Test mit echtem OpenCode.                          |
| **Akzeptanzkriterien** | - Unit-Tests für alle Module<br>- Integration-Test für kompletten Workflow<br>- Dokumentierter manueller E2E-Test<br>- CI/CD läuft grün |
| **Betroffene Dateien** | `src/*.test.ts`, `docs/testing.md`                                                                                                      |

---

## Task-Reihenfolge (Empfohlen)

1. **T-01** Plugin-Grundstruktur (Basis für alles)
2. **T-04** State-Management (wird von allen Commands benötigt)
3. **T-05** CLI-Sequenz-Executor (Kern-Engine)
4. **T-09** Default-Templates (werden von Init benötigt)
5. **T-03** AGENTS.md Management (wird von Init benötigt)
6. **T-02** Init-Command (nutzt T-03, T-04, T-09)
7. **T-06** Start-Command (nutzt T-04, T-05)
8. **T-07** Stop-Command (nutzt T-06)
9. **T-08** Run-Once-Command (nutzt T-04, T-05)
10. **T-10** Testing (abschließend)

---

## Status-Legende

| Status    | Bedeutung                         |
| --------- | --------------------------------- |
| `todo`    | Noch nicht begonnen               |
| `doing`   | In Arbeit                         |
| `done`    | Abgeschlossen                     |
| `blocked` | Blockiert durch externe Faktoren  |
| `failed`  | Fehlgeschlagen (erneut versuchen) |

---

_Letzte Aktualisierung: 2026-02-03_
