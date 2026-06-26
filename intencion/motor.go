package intencion

import (
	"fmt"
	"strings"

	"github.com/tuusuario/orquestador-mini/conectores"
)

// MotorDeIntencion traduce texto libre a acciones del ServicioMedia.
// No sabe qué servicio concreto está usando; solo habla con la interface.
type MotorDeIntencion struct {
	servicio conectores.ServicioMedia
}

func NuevoMotorDeIntencion(servicio conectores.ServicioMedia) *MotorDeIntencion {
	return &MotorDeIntencion{servicio: servicio}
}

func (m *MotorDeIntencion) Iniciar(token string) error {
	return m.servicio.Conectar(token)
}

func (m *MotorDeIntencion) Procesar(texto string) (string, error) {
	texto = strings.TrimSpace(strings.ToLower(texto))

	if strings.HasPrefix(texto, "reproducir") {
		parametro := strings.TrimSpace(strings.TrimPrefix(texto, "reproducir"))
		return m.servicio.EjecutarAccion("PLAY", parametro)
	}

	if texto == "detener" || texto == "parar" {
		return m.servicio.EjecutarAccion("STOP", "")
	}

	if texto == "estado" || texto == "info" {
		return m.servicio.EjecutarAccion("INFO", "")
	}

	return "", fmt.Errorf("ACCION_DESCONOCIDA: la intención '%s' no existe en el protocolo", texto)
}
