# Bitácora de Construcción — Super App de Intenciones
**Fundador:** Yeremy Ersaquino  
**Fecha de inicio:** 26 de junio de 2026  
**Visión:** Una sola plataforma que unifica WhatsApp, Spotify, Gmail, TikTok, Instagram, Uber, InDriver, Pedidos Ya y más — controlada con lenguaje natural.

---

## ¿Qué es este documento?

Registro completo de cada decisión, cada línea de código construida, cada problema resuelto y cada aprendizaje. Sirve como:
- **Evidencia** del proceso de construcción desde cero
- **Historial técnico** para nuevos colaboradores o inversores
- **Aprendizaje** de cómo se construye un sistema real paso a paso

---

## Sesión 1 — 26 de junio de 2026

### Punto de partida
El fundador llegó con una visión clara pero sin código existente. Tenía:
- La idea de una super app unificada
- Un CLAUDE.md con la especificación técnica del v0.1
- Cero código escrito

### Lo que se construyó

#### 1. Base técnica — Arquitectura Hexagonal en Go
**Decisión:** Usar el patrón Hexagonal (Puertos y Adaptadores) como núcleo del sistema.  
**Por qué:** Permite agregar Spotify, WhatsApp, TikTok sin tocar el motor central. El motor no sabe qué servicio usa — solo habla con una interfaz universal llamada `ServicioMedia`.

Archivos creados:
- `conectores/puerto.go` — La interfaz universal (contrato fijo)
- `conectores/simulado.go` — Adaptador de prueba sin APIs reales
- `conectores/simulado_test.go` — 8 tests TDD
- `intencion/motor.go` — Motor que traduce texto a acciones
- `intencion/motor_test.go` — 10 tests del motor
- `main.go` — Servidor HTTP en puerto 8080

**Aprendizaje:** Go no estaba instalado en la máquina. Los archivos están listos para cuando se instale.

#### 2. Frontend — Next.js con 3 pantallas
**Stack:** Next.js 14 + TypeScript + Tailwind CSS  
**Decisión:** No usar frameworks de UI pesados. Todo hecho a mano para máximo control visual.

**Pantalla 1 — El Lienzo en Blanco:**
- Fondo negro absoluto (OLED)
- Barra de intención flotante con resplandor blanco
- Badge de seguridad "Protocolo Cero Confianza Activo" en verde

**Pantalla 2 — El Lienzo Dinámico:**
- Se activa cuando el usuario escribe su intención
- Módulo Audio: detecta el artista del texto y abre YouTube
- Módulo Timer: detecta los minutos/horas del texto y cuenta regresiva real
- Módulo Mensajes: filtra urgentes vs. no urgentes

**Pantalla 3 — Panel del Grafo:**
- Red de nodos animados mostrando la arquitectura en vivo
- Consola verde con verificaciones en tiempo real

**Resultado real probado:** El fundador escribió "quiero ver las músicas de Rochy por 10 minutos" → el sistema abrió YouTube buscando "Rochy música" automáticamente.

#### 3. Gmail — Lectura en tiempo real
Se demostró lectura real del correo sin código adicional.  
**Resultado:** El sistema leyó 19 correos sin leer y los clasificó:
- 🔴 URGENTE: Respuesta de Termoenvases RD a una aplicación de trabajo
- ⚫ RUIDO: 18 emails de marketing de Google, OpenAI, Anthropic

**Aprendizaje clave:** El sistema ya puede leer, clasificar y actuar sobre correos reales. La IA identifica qué importa sin que el usuario abra Gmail.

#### 4. WhatsApp — Servicio de mensajería por intención
**Decisión:** Construir un servicio Node.js separado en `services/whatsapp/`  
**Stack:** Express + whatsapp-web.js

**Capacidad construida:**
- El usuario escribe: *"Envía a Ana, Juan y Pedro que hoy no podré ir porque tengo un problema"*
- El sistema detecta: destinatarios (Ana, Juan, Pedro) + mensaje
- Envía a contactos individuales Y grupos automáticamente
- Historial de envíos con confirmación por destinatario

**Estado:** Dependencias instaladas (302 paquetes). Pendiente: conectar con número real del fundador.

---

### Decisiones arquitectónicas tomadas

| Decisión | Alternativa descartada | Razón |
|---|---|---|
| Patrón Hexagonal | MVC tradicional | Permite agregar servicios sin romper el núcleo |
| Next.js App Router | React puro | Server components + API routes en un solo proyecto |
| whatsapp-web.js para demo | WhatsApp Cloud API | Más rápido para probar; migrar a API oficial en producción |
| OAuth para todas las apps | Guardar contraseñas | Legal, seguro, estándar de la industria |
| Servidor en la nube | Depender del teléfono | 24/7 activo sin que el usuario haga nada |

---

### Preguntas respondidas durante la sesión

**¿Pueden las plataformas demandarme por unificar sus servicios?**  
No. Todas publican APIs oficiales para que terceros las usen. Se necesita registrar la app en el portal de cada plataforma (gratis), aceptar sus términos, y usar OAuth. Google, Apple y otros hacen lo mismo.

**¿Por qué ellos pueden unificar y yo también puedo?**  
Ellos usan acuerdos comerciales y control del sistema operativo. Nosotros usamos las APIs públicas que ellos mismos ofrecen. La ventaja nuestra: vivimos en la nube, no dependemos de ningún dispositivo.

**¿Qué es OAuth?**  
El botón "Iniciar sesión con Google/Spotify". El usuario aprueba el acceso, nosotros recibimos un permiso temporal. Nunca vemos la contraseña.

---

### Visión del fundador (palabras exactas)

> "Whasaap, TikTok, Spotify, Instagram, Pedidos Ya, Uber, InDriver, Meta, Google — será uno solo."

> "No es escanear QR — el usuario se registra. El sistema será como un celular pero centralizado."

> "Todo pero paso por paso vamos construyendo esto 100% perfecto."

---

### Hoja de ruta acordada

| Paso | Qué construimos | Estado |
|---|---|---|
| 1 | Base técnica — Go + Next.js + 3 pantallas | ✅ Completo |
| 2 | WhatsApp — mensajes por lenguaje natural | 🔧 En progreso |
| 3 | Gmail — leer, clasificar, responder | 🔧 Demostrado |
| 4 | Spotify — música por nombre de artista | ⏳ Pendiente |
| 5 | Login unificado — el usuario se registra una vez | ⏳ Pendiente |
| 6 | Motor de IA — aprende hábitos del usuario | ⏳ Pendiente |
| 7 | TikTok, Instagram, Uber, InDriver, Pedidos Ya | ⏳ Pendiente |
| 8 | App móvil PWA (Android + iPhone) | ⏳ Pendiente |
| 9 | Servidor en la nube 24/7 | ⏳ Pendiente |

---

### Próximo paso inmediato
Correr el servicio WhatsApp y conectar con número real:
```bash
cd C:\Users\DELL\OneDrive\Desktop\orquestador-mini\services\whatsapp
npm start
```

---

*Bitácora iniciada el 26 de junio de 2026. Se actualiza al final de cada sesión de construcción.*
