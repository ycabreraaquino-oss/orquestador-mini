const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/estado", (_req, res) => {
  res.json({ estado: "no_disponible", codigo: null });
});

app.post("/registrar", (_req, res) => {
  res.status(503).json({ ok: false, error: "Servicio WhatsApp no disponible en la nube. Usa el servidor local." });
});

app.post("/enviar", (_req, res) => {
  res.status(503).json({ ok: false, error: "Servicio WhatsApp no disponible en la nube. Usa el servidor local." });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`WhatsApp service stub en puerto ${PORT}`));
