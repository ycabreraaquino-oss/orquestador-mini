package conectores

// ServicioMedia es el puerto universal del orquestador.
// Ningún código fuera de este paquete conoce servicios externos por nombre.
type ServicioMedia interface {
	Conectar(tokenUsuario string) error
	EjecutarAccion(accion string, parametro string) (string, error)
	Estado() bool
}
