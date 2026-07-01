// El algoritmo de Nexus — transforma texto libre en acciones ejecutables

export type ServicioId = "whatsapp" | "spotify" | "gmail" | "uber" | "indrive" | "pedidosya";

export interface AccionNexus {
  servicio: ServicioId;
  titulo: string;
  detalle: string;
  color: string;
  disponible: boolean;
  parametros: Record<string, string>;
}

export interface PlanNexus {
  intencion: string;
  acciones: AccionNexus[];
  mensaje: string;
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function limpiar(s: string): string {
  return s.trim().replace(/\s+/g, " ").replace(/[.!,]+$/, "").trim();
}

export function parsearIntencion(texto: string, appsConectadas: string[]): PlanNexus {
  const acciones: AccionNexus[] = [];

  // ── WhatsApp ──────────────────────────────────────────────────────
  // Patrones: "dile/avísale a NOMBRE que MENSAJE"
  //           "manda/envía/escribe (mensaje) a NOMBRE (que) MENSAJE"
  const waRegexes = [
    /(?:dile|avísale|avisa|cuéntale|notifica)\s+a\s+([\w]+(?:\s+[\w]+)?)\s+que\s+([\s\S]+?)(?=\s*[,]?\s*y\s+(?:pon(?:me)?|reproduce|escucha|pide|manda|env[ií]a|correo)|$)/i,
    /(?:manda|env[ií]a|escribe)\s+(?:un\s+)?(?:mensaje\s+)?a\s+([\w]+(?:\s+[\w]+)?)\s*(?:que\s+|diciendo\s+|:\s*)?([\s\S]+?)(?=\s*[,]?\s*y\s+(?:pon(?:me)?|reproduce|pide|correo)|$)/i,
    /mensaje\s+(?:para|a)\s+([\w]+(?:\s+[\w]+)?)\s*[:\-]?\s*([\s\S]+?)(?=\s*[,]?\s*y\s+|$)/i,
  ];

  for (const rx of waRegexes) {
    const m = texto.match(rx);
    if (m) {
      const destinatario = cap(limpiar(m[1]));
      const mensaje = limpiar(m[2]);
      if (destinatario && mensaje) {
        acciones.push({
          servicio: "whatsapp",
          titulo: `Mensaje a ${destinatario}`,
          detalle: `"${mensaje}"`,
          color: "#25D366",
          disponible: appsConectadas.includes("whatsapp"),
          parametros: { destinatario, mensaje },
        });
        break;
      }
    }
  }

  // ── Spotify ───────────────────────────────────────────────────────
  // Patrones: "pon/ponme/reproduce/escucha [música de] ARTISTA"
  //           "música/canciones de ARTISTA"
  const spRegexes = [
    /(?:pon(?:me)?|reproduce|escucha(?:me)?)\s+(?:m[uú]sica\s+de|canciones?\s+de|algo\s+de\s+)?([\w\s]+?)(?=\s*[,]?\s*y\s+(?:dile|avisa|manda|env[ií]a|correo|pide)|$)/i,
    /(?:m[uú]sica|canciones?)\s+de\s+([\w\s]+?)(?=\s*[,]?\s*y\s+|$)/i,
    /quiero\s+(?:escuchar|o[ií]r)\s+(?:m[uú]sica\s+de|canciones?\s+de\s+)?([\w\s]+?)(?=\s*[,]?\s*y\s+|$)/i,
  ];

  for (const rx of spRegexes) {
    const m = texto.match(rx);
    if (m) {
      const artista = limpiar(m[1]);
      if (artista && artista.split(" ").length <= 5) {
        acciones.push({
          servicio: "spotify",
          titulo: `Música de ${cap(artista)}`,
          detalle: `Reproducir en Spotify`,
          color: "#1DB954",
          disponible: appsConectadas.includes("spotify"),
          parametros: { artista },
        });
        break;
      }
    }
  }

  // ── Gmail ─────────────────────────────────────────────────────────
  if (/(?:env[ií]a|manda|escribe)\s+(?:un\s+)?correo|email\s+a|por\s+gmail/i.test(texto)) {
    const destM = texto.match(/(?:correo|email)\s+(?:a\s+)?([\w\s@.]+?)(?=\s+(?:con|diciendo|que|sobre|asunto)|$)/i);
    const asuntoM = texto.match(/(?:con\s+asunto|asunto\s*[:\-]?)\s*([\s\S]+?)(?=\s*[,]?\s*y\s+|$)/i);
    const destinatario = destM ? cap(limpiar(destM[1])) : "contacto";
    acciones.push({
      servicio: "gmail",
      titulo: `Correo a ${destinatario}`,
      detalle: asuntoM ? limpiar(asuntoM[1]) : "Redactar correo",
      color: "#EA4335",
      disponible: appsConectadas.includes("gmail"),
      parametros: {
        destinatario,
        asunto: asuntoM ? limpiar(asuntoM[1]) : "",
      },
    });
  }

  // ── Viajes ────────────────────────────────────────────────────────
  if (/(?:pide|solicita|necesito|quiero|llama)\s+(?:un\s+)?(?:taxi|viaje|carro|coche|transport|chofer)/i.test(texto)) {
    const destM = texto.match(/(?:\ba\b|hasta|para)\s+([\w\s]+?)(?=\s*[,]?\s*(?:y\s+)|$)/i);
    const esInDriver = /indrive/i.test(texto);
    const servicio: ServicioId = esInDriver ? "indrive" : "uber";
    acciones.push({
      servicio,
      titulo: `Viaje${destM ? ` a ${cap(limpiar(destM[1]))}` : ""}`,
      detalle: esInDriver ? "Solicitar en InDriver" : "Solicitar en Uber",
      color: esInDriver ? "#2EB85C" : "#FFFFFF",
      disponible: appsConectadas.includes(servicio),
      parametros: { destino: destM ? limpiar(destM[1]) : "" },
    });
  }

  // ── Comida ────────────────────────────────────────────────────────
  if (/(?:pide|ordena|quiero)\s+(?:comida|pizza|sushi|hamburguesa|pollo|chino|algo\s+para\s+comer|de\s+comer)/i.test(texto)) {
    const comidaM = texto.match(/(?:pide|ordena|quiero)\s+([\w\s]+?)(?=\s*[,]?\s*(?:y\s+)|$)/i);
    acciones.push({
      servicio: "pedidosya",
      titulo: `Pedir comida`,
      detalle: comidaM ? cap(limpiar(comidaM[1])) : "Tu pedido favorito",
      color: "#FF441F",
      disponible: appsConectadas.includes("pedidosya"),
      parametros: { busqueda: comidaM ? limpiar(comidaM[1]) : "" },
    });
  }

  // ── Mensaje de feedback ───────────────────────────────────────────
  let mensaje = "";
  if (acciones.length === 0) {
    mensaje = 'No reconocí ninguna acción. Prueba: "Dile a Juan que llegamos tarde y ponme música de Karol G"';
  } else {
    const listas = acciones.filter((a) => a.disponible).length;
    const pendientes = acciones.filter((a) => !a.disponible).length;
    if (listas > 0 && pendientes === 0) {
      mensaje = "Todo listo para ejecutar ↓";
    } else if (listas > 0) {
      mensaje = `${listas} acción${listas > 1 ? "es" : ""} lista · ${pendientes} requiere conectar la app`;
    } else {
      mensaje = "Conecta las apps para que Nexus ejecute esto";
    }
  }

  return { intencion: texto, acciones, mensaje };
}
