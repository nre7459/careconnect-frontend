# k6 Performance Tests

## Übersicht

Dieser Ordner enthält k6 Performance-Tests für CareConnect. Die Tests sind in zwei Kategorien unterteilt:

- **Smoke-Test (`smoke.test.js`)**: Prüft die wichtigsten Seiten auf schnelle Reaktionszeiten.
- **Stress-Test (`stress.test.js`)**: Simuliert steigende Last auf die Startseite, um das Verhalten bei hoher Auslastung zu beobachten.
- **Hardcore-Test (`hardcore.test.js`)**: Nutzt einen `ramping-arrival-rate`-Executor mit hohem Durchsatz und aggressiver Laststeigerung.

## Voraussetzungen

- [k6](https://grafana.com/oss/k6/) muss global installiert oder als lokales Binary verfügbar sein (z.B. via `choco install k6`, `brew install k6`, Docker, etc.).

## Ausführen

Standardmäßig wird `http://localhost:3000` als Basis-URL verwendet. Dies kann über die Umgebungsvariable `K6_BASE_URL` überschrieben werden.

```bash
npm run perf:k6
npm run perf:k6:stress
npm run perf:k6:hardcore
```

## Wichtige Umgebungsvariablen

- `K6_BASE_URL`: Basis-URL der Anwendung (Standard: `http://localhost:3000`).
- `K6_VUS`: Anzahl der virtuellen Benutzer für den Smoke-Test (Standard: `5`).
- `K6_DURATION`: Dauer des Smoke-Tests (Standard: `30s`).
- `K6_STRESS_TARGET`: Zielanzahl VUs für die Belastungsphase im Stress-Test (Standard: `50`).
- `K6_SLEEP`: Pause zwischen den Requests im Stress-Test in Sekunden (Standard: `1`).
- `K6_HARDCORE_START_RATE`: Start-Request-Rate pro Sekunde für den Hardcore-Test (Standard: `20`).
- `K6_HARDCORE_TARGET_RATE`: Ziel-Request-Rate pro Sekunde während der Plateau-Phase (Standard: `200`).
- `K6_HARDCORE_PREALLOCATED`: Vorallokierte VUs für den Hardcore-Test (Standard: `50`).
- `K6_HARDCORE_MAX_VUS`: Maximale VUs für den Hardcore-Test (Standard: `200`).
