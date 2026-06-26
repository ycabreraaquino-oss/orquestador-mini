package conectores

import "fmt"

// AdaptadorSimulado implementa ServicioMedia sin llamar a ninguna API externa.
// En v1.0 se reemplaza por adaptadores reales; el puerto (interface) no cambia.
type AdaptadorSimulado struct {
	conectado bool
}

func NuevoAdaptadorSimulado() *AdaptadorSimulado {
	return &AdaptadorSimulado{}
}

func (a *AdaptadorSimulado) Conectar(tokenUsuario string) error {
	if tokenUsuario == "" {
		return fmt.Errorf("token vacío: se requiere un token de usuario válido")
	}
	a.conectado = true
	return nil
}

func (a *AdaptadorSimulado) EjecutarAccion(accion string, parametro string) (string, error) {
	if !a.conectado {
		return "", fmt.Errorf("servicio no conectado: llama Conectar antes de EjecutarAccion")
	}
	switch accion {
	case "PLAY":
		return fmt.Sprintf("[SIMULADO] Reproduciendo: %s", parametro), nil
	case "STOP":
		return "[SIMULADO] Detenido", nil
	case "INFO":
		return "[SIMULADO] Servicio activo, sin API real conectada", nil
	default:
		return "", fmt.Errorf("ACCION_DESCONOCIDA: '%s' no es una acción válida (PLAY, STOP, INFO)", accion)
	}
}

func (a *AdaptadorSimulado) Estado() bool {
	return a.conectado
}
