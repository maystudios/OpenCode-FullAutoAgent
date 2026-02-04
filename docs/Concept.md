## OpenCode Full-Auto Plugin – Konzeptdokument

### Ziel

Entwicklung eines OpenCode-Plugins, das eine **einfache CLI-basierte Workflow-Automation** bereitstellt.

Das Plugin automatisiert einen festen Arbeitsablauf über reine CLI-Sequenzen und nutzt OpenCodes bestehendes Command-System. Es orchestriert Aufgaben aus einer Checkliste, indem definierte States nacheinander ausgeführt werden:

> Pick Next → Plan → Implement → Review → Done

Der Nutzer kann Commands/Prompts/State-Definitionen anpassen. Das Plugin liefert die Automationslogik.

---

## Kernidee

Das Plugin ist ein dünner Orchestrator, der:

- CLI-Commands nacheinander ausführt
- kurze Delays zwischen Commands einfügt
- OpenCode neu startet / beendet
- OpenCode-Commands triggert
- den aktuellen State speichert

Das System steuert primär die laufende CLI wie ein Skript. Ein State entspricht einer definierten Command-Sequenz.

---

## Projektstruktur

Bei `init` wird folgender Ordner erzeugt:

```
.opencode/full-auto/
  state.json
  checklist.md

  commands/
    pick_next.md
    plan.md
    implement.md
    review.md
    done.md
    stop.md
    update_state_status.md

  cli/
    pick_next.json
    plan.json
    implement.json
    review.json
    done.json
    stop.json
    update_state_status.json
```

Zusätzlich wird im Projekt-Root eine Datei angelegt/erweitert:

```
AGENTS.md
```

---

## Bedeutung

**checklist.md**
Backlog / Aufgabenliste

**state.json**
Aktueller Workflow-State (vom Orchestrator gelesen/geschrieben)

**commands/**
OpenCode Commands (werden direkt über `/command` ausgeführt)

**cli/**
CLI-Sequenzen pro State

**AGENTS.md**
Projektweite Agenten-Anweisung (Schema/Regeln), wie der Workflow-State zu interpretieren und zu aktualisieren ist.

---

## Plugin-Commands

### `full-auto init`

Initialisiert die Struktur:

- legt Ordner an
- erzeugt Default-Commands
- erstellt Beispiel-Checkliste
- schreibt Default-State
- legt `AGENTS.md` an oder erweitert sie (Header-Block am Anfang)

---

### `full-auto start`

Startet die Automation:

- liest `state.json`
- führt CLI-Sequenz des aktuellen States aus
- führt danach `update_state_status` aus
- setzt/übernimmt den nächsten State
- wiederholt

---

### `full-auto stop`

Stoppt die Automation.

---

### `full-auto run-once`

Führt genau einen State aus (inkl. `update_state_status`).

---

## State Machine

Der State-Graph ist frei anpassbar.

Standard:

```
pick_next → plan → implement → review → done → pick_next
```

Zusatz:

```
stop → (halt)
```

Die tatsächliche State-Transition wird nicht „hart“ im Plugin kodiert, sondern über `update_state_status` anhand eines Schemas entschieden.

Der State `stop` ist verpflichtend und muss exakt so heißen. Wenn `state.json` auf `stop` steht, beendet der Orchestrator die Loop und führt keine CLI-Sequenzen mehr aus.

---

## AGENTS.md

Das Plugin verwaltet einen **Header-Block am Anfang** der `AGENTS.md`, der:

- die State-Namen definiert
- das erwartete State-Schema beschreibt
- festlegt, wie Status/Artefakte interpretiert werden
- festlegt, wie der nächste State gewählt wird

Beispiel-Inhalt (konzeptionell):

- erlaubte States: `pick_next, plan, implement, review, done, stop`
- `stop` ist ein reservierter State-Name und stoppt die Orchestrator-Schleife
- wo der aktuelle State steht (z. B. `.opencode/full-auto/state.json`)
- welche Signale/Artefakte den State-Übergang bestimmen (z. B. `review` entscheidet `implement` vs `done`)

---

## CLI-Automation pro State

Jeder State besteht aus einer reinen CLI-Sequenz.

Beispiel `cli/plan.json`:

```json
{
  "delay_ms": 800,
  "commands": ["/exit", "opencode --model gpt-5", "/plan"]
}
```

Ablauf:

1. Command ausführen
2. Delay warten
3. nächstes Command ausführen
4. wiederholen bis fertig

Die Commands nutzen direkt OpenCodes internes Command-System.

Beispiel:

```
/plan
```

→ OpenCode lädt automatisch `.opencode/full-auto/commands/plan.md` (bzw. den konfigurierten Command-Pfad)

Das Plugin orchestriert nur CLI-Kommandos.

---

## Update State Status (Zwischenschritt)

Nach jedem State (oder optional nach jedem einzelnen CLI-Command) wird ein zusätzlicher Command ausgeführt:

- **Command-Name:** `update_state_status`
- **Zweck:** überprüft, ob der Workflow-State korrekt ist, und aktualisiert `state.json` strikt nach dem Schema in `AGENTS.md`

Dieser Schritt kann bewusst ein **schnelles, günstiges Modell** verwenden (z. B. ein „Flash“-Profil), da er nur:

- State validiert
- State aktualisiert
- ggf. minimale Begründung/Log schreibt

Beispiel `cli/update_state_status.json`:

```json
{
  "delay_ms": 400,
  "commands": ["/exit", "opencode --model fast-small", "/update_state_status"]
}
```

Der Orchestrator „hört“ anschließend auf den neuen State aus `state.json` und führt den nächsten passenden State aus.

---

## Zielzustand

Ein simples OpenCode-Plugin, das:

- CLI-Sequenzen automatisiert ausführt
- OpenCode-Commands orchestriert
- `AGENTS.md` als verbindliches State-/Schema-Doc pflegt
- State über einen günstigen `update_state_status`-Zwischenschritt aktualisiert
- wiederholbare Workflows erlaubt

Der Workflow besteht aus Commands, die automatisch nacheinander laufen und sich über den State selbs
