const express = require("express");
const cors = require("cors");
const { Client, LocalAuth } = require("whatsapp-web.js");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// Estado del servicio
let estado = "desconectado"; // desconectado | esperando_codigo | conectado
let codigoPairing = null;
let cliente = null;

// ── Inicializar cliente con método de número telefónico ───────────────────────
function iniciarCliente(numeroTelefono) {
  if (cliente) {
    cliente.destroy().catch(() => {});
  }

  cliente = new Client({
    authStrategy: new LocalAuth({ dataPath: "./sesion" }),
    puppeteer: { headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] },
    webVersionCache: { type: "remote", remotePath: "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html" },
  });

  // Cuando el cliente está listo para parear — solicitar código por número
  cliente.on("qr", async () => {
    if (!numeroTelefono) return;
    try {
      // Solicitar código de 8 dígitos en vez de QR
      const codigo = await cliente.requestPairingCode(numeroTelefono);
      codigoPairing = codigo;
      estado = "esperando_codigo";
      console.log(`Código de vinculación: ${codigo}`);
    } catch (e) {
      console.error("Error solicitando código:", e.message);
      estado = "error";
    }
  });

  cliente.on("ready", () => {
    estado = "conectado";
    codigoPairing = null;
    console.log("WhatsApp conectado.");
  });

  cliente.on("disconnected", () => {
    estado = "desconectado";
    codigoPairing = null;
    console.log("WhatsApp desconectado.");
  });

  estado = "iniciando";
  cliente.initialize();
}

// ── Parser de intención en español ───────────────────────────────────────────
function parsearIntencion(texto) {
  const matchDest = texto.match(/(?:a|al grupo)\s+(.+?)\s+que\s+/i);
  const destinatariosRaw = matchDest ? matchDest[1] : "";
  const destinatarios = destinatariosRaw
    .split(/,|\sy\s|\se\s/i)
    .map((d) => d.trim())
    .filter((d) => d.length > 0);

  const matchMsg = texto.match(/\bque\s+(.+)/i);
  const mensaje = matchMsg
    ? matchMsg[1].charAt(0).toUpperCase() + matchMsg[1].slice(1)
    : texto;

  return { destinatarios, mensaje };
}

async function buscarContacto(nombre) {
  const contactos = await cliente.getContacts();
  const nombreLower = nombre.toLowerCase();
  return contactos.find(
    (c) => c.name?.toLowerCase().includes(nombreLower) || c.pushname?.toLowerCase().includes(nombreLower)
  ) || null;
}

async function buscarGrupo(nombre) {
  const chats = await cliente.getChats();
  const nombreLower = nombre.toLowerCase();
  return chats.find((c) => c.isGroup && c.name?.toLowerCase().includes(nombreLower)) || null;
}

// ── ENDPOINTS ─────────────────────────────────────────────────────────────────

// Estado actual
app.get("/estado", (req, res) => {
  res.json({ estado, codigo: codigoPairing });
});

// Registrar número y generar código de 8 dígitos
// Body: { "numero": "18091234567" }  (solo dígitos, con código de país)
app.post("/registrar", (req, res) => {
  const { numero } = req.body;
  if (!numero) return res.status(400).json({ ok: false, error: "Falta el número de teléfono" });

  const numeroLimpio = numero.replace(/\D/g, "");
  if (numeroLimpio.length < 10) return res.status(400).json({ ok: false, error: "Número inválido" });

  iniciarCliente(numeroLimpio);
  res.json({ ok: true, mensaje: "Iniciando vinculación... recibirás un código en segundos." });
});

// Enviar mensaje desde intención en texto libre
app.post("/enviar", async (req, res) => {
  if (estado !== "conectado") {
    return res.status(400).json({ ok: false, error: "WhatsApp no está conectado." });
  }

  const { texto } = req.body;
  if (!texto) return res.status(400).json({ ok: false, error: "Falta el campo 'texto'" });

  const { destinatarios, mensaje } = parsearIntencion(texto);
  if (destinatarios.length === 0) {
    return res.status(400).json({ ok: false, error: "No encontré destinatarios. Usa: 'envía a [nombre] que [mensaje]'" });
  }

  const resultados = [];
  for (const nombre of destinatarios) {
    const grupo = await buscarGrupo(nombre);
    if (grupo) {
      await cliente.sendMessage(grupo.id._serialized, mensaje);
      resultados.push({ nombre, tipo: "grupo", ok: true });
      continue;
    }
    const contacto = await buscarContacto(nombre);
    if (contacto) {
      await cliente.sendMessage(contacto.id._serialized, mensaje);
      resultados.push({ nombre, tipo: "contacto", ok: true });
    } else {
      resultados.push({ nombre, tipo: "desconocido", ok: false, error: `No encontré a "${nombre}"` });
    }
  }

  res.json({ ok: resultados.every((r) => r.ok), mensaje, resultados });
});

app.listen(3001, "0.0.0.0", () => console.log("Servicio WhatsApp corriendo en http://localhost:3001"));
