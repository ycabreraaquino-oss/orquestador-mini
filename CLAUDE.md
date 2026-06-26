# CLAUDE.md — Orquestador de Intenciones (Mini v0.1)

## Contexto del proyecto completo

Este repositorio es la **versión de pruebas (10%)** de un sistema mayor llamado **Ecosistema de Orquestación Autónoma**. El sistema completo tiene como visión unificar servicios externos (audio, mensajes, video) bajo un único motor de intenciones del usuario, usando una arquitectura hexagonal en Go + Python, un grafo de contexto en Neo4j, y una capa de interfaz líquida en TypeScript/React.

No construimos el sistema completo todavía. Esta versión mini valida el patrón de diseño central antes de escalar.

---

## Objetivo de la versión mini (v0.1)

Demostrar que el **patrón Hexagonal (Puertos y Adaptadores)** funciona correctamente con:
- Un puerto único de intención
- Un solo adaptador real (simulado, sin llamar APIs externas reales)
- Un test suite TDD que lo cubre al 100%
- Un endpoint HTTP mínimo que acepta una intención y devuelve una respuesta

**No incluye:** Neo4j, criptografía, frontend, múltiples adaptadores reales, GitHub Actions, autocuración con IA.

---

## Stack técnico (mini)

| Capa | Tecnología | Notas |
|------|-----------|-------|
| Lenguaje | Go 1.22 | Solo el núcleo de conectores |
| HTTP | `net/http` estándar | Sin frameworks externos |
| Tests | `testing` + `testify` | TDD estricto, cobertura ≥ 90% |
| Base de datos | Ninguna (in-memory) | El grafo Neo4j va en v1.0 |
| Frontend | Next.js 14 + Tailwind + Framer Motion | `frontend/` — 3 pantallas líquidas |

---

## Estructura de archivos

```
orquestador-mini/
├── CLAUDE.md
├── go.mod
├── main.go                ← servidor HTTP (puerto 8080)
├── conectores/
│   ├── puerto.go          ← interface ServicioMedia
│   ├── simulado.go        ← AdaptadorSimulado
│   └── simulado_test.go   ← pruebas TDD
├── intencion/
│   ├── motor.go           ← MotorDeIntencion
│   └── motor_test.go      ← pruebas del motor
└── frontend/              ← Next.js (puerto 3000)
    ├── package.json
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx       ← Pantalla 1: Lienzo en Blanco
    │   └── api/intencion/route.ts
    └── components/
        ├── IntentBar.tsx
        ├── TimerModule.tsx
        ├── AudioModule.tsx
        ├── MessagesModule.tsx
        └── GraphPanel.tsx
```

---

## Contrato del Puerto Universal

```go
// conectores/puerto.go
package conectores

type ServicioMedia interface {
    Conectar(tokenUsuario string) error
    EjecutarAccion(accion string, parametro string) (string, error)
    Estado() bool
}
```

Acciones válidas en v0.1: `"PLAY"`, `"STOP"`, `"INFO"`.

---

## Adaptador simulado

El `AdaptadorSimulado`:
- Acepta cualquier token no vacío como válido
- Responde a `"PLAY"` con `"[SIMULADO] Reproduciendo: <parametro>"`
- Responde a `"STOP"` con `"[SIMULADO] Detenido"`
- Responde a `"INFO"` con `"[SIMULADO] Servicio activo, sin API real conectada"`
- Retorna `error` en cualquier otra acción
- Retorna `error` si se llama `EjecutarAccion` antes de `Conectar`

---

## Motor de intención

Mapeo de intenciones:
- `"reproducir <algo>"` → `PLAY`, parametro = `<algo>`
- `"detener"` o `"parar"` → `STOP`
- `"estado"` o `"info"` → `INFO`
- Cualquier otra entrada → error descriptivo

---

## Endpoint HTTP

`POST /intencion` (Go, puerto 8080)

```json
// Request
{ "token": "usuario_123", "texto": "reproducir cancion_abc" }

// Response OK
{ "ok": true, "resultado": "[SIMULADO] Reproduciendo: cancion_abc" }

// Response error
{ "ok": false, "error": "ACCION_DESCONOCIDA: la intención 'bailar' no existe" }
```

---

## Especificación de Pantallas — Fase Frontend (v0.1-ui)

### Pantalla 1 — El Lienzo en Blanco (estado inicial)

- Fondo negro absoluto (OLED-native dark mode)
- Sin menús laterales ni iconos flotantes
- Centro: barra de texto flotante con bordes redondeados y resplandor blanco difuminado
- Placeholder en gris tenue: *"¿Qué quieres resolver hoy? Describe tu intención..."*
- Esquina inferior derecha: candado cerrado con pulso verde + texto *"Protocolo Cero Confianza Activo • Llaves Locales Protegidas"*

### Pantalla 2 — El Lienzo Dinámico (interfaz generada por IA)

Cuando el usuario envía su intención, el lienzo sube suavemente y aparecen tres tarjetas líquidas:

**Módulo Central — Temporizador Zen**
- Círculo cronómetro minimalista, sin líneas duras
- Borde que brilla suavemente al ritmo de la música (animación Framer Motion)
- Cuenta regresiva configurable (por defecto: duración detectada de la intención)

**Módulo Izquierdo — Conector de Audio**
- Tarjeta translúcida flotante
- Portada del álbum actual (simulada en v0.1, real en v0.2 con Spotify API)
- Tres controles: Play, Pause, selector de playlist
- Sin anuncios ni secciones de descubrimiento

**Módulo Derecho — Conector de Mensajería**
- Pestaña vertical: "Mensajes de Emergencia"
- Mensajes no urgentes: ocultos
- Mensajes críticos: parpadeo suave, solo texto en una línea
- Simulado en v0.1, real en v0.5 con WhatsApp Business API

### Pantalla 3 — Panel de Control (swipe izquierda)

- **Mapa del Grafo Vivo**: red de nodos orgánicos (React Flow) — Intención → API_Spotify → Cifrado_Local
- **Consola de verificación** (parte inferior):
  ```
  [OK] Conector Spotify Autoverificado (0 fallos)
  [OK] Firma Criptográfica Ed25519 Generada Localmente
  [OK] Datos en memoria interna (Servidor externo: 0 KB)
  ```

---

## Hoja de ruta del sistema completo

| Versión | Alcance |
|---------|---------|
| v0.1 (este repo) | Patrón hexagonal + adaptador simulado + TDD + UI líquida |
| v0.2 | Adaptador Spotify real (OAuth) |
| v0.3 | Neo4j: grafo de intenciones por usuario |
| v0.4 | Generative UI: IA dibuja componentes en tiempo real |
| v0.5 | Segundo adaptador (WhatsApp Business API) |
| v1.0 | MVP: 3 adaptadores + grafo + UI + CI/CD |
| v2.0 | Ed25519 local + privacidad total |

---

## Cómo ejecutar

```bash
# Backend Go (requiere Go 1.22+)
go mod tidy
go test -v -race -coverprofile=coverage.txt ./...
go run main.go
# → http://localhost:8080

# Frontend Next.js
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

---

## Reglas de desarrollo

1. **Tests primero**: escribe `_test.go` antes de la implementación.
2. **Cobertura ≥ 90%** en paquetes `conectores` e `intencion`.
3. **Fail fast, nunca panic**: errores se retornan, nunca `log.Fatal` en paquetes internos.
4. **Sin dependencias externas** salvo `testify` (Go) y las listadas en `package.json`.
5. **Contratos fijos**: `ServicioMedia`, `PLAY/STOP/INFO`, endpoint `/intencion` no se renombran.
6. **Cada archivo bajo 150 líneas**. Si crece más, dividir.
7. **Comentarios en español**.
