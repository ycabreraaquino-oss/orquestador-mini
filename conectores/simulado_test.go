package conectores_test

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/tuusuario/orquestador-mini/conectores"
)

func TestConectar_TokenValido(t *testing.T) {
	a := conectores.NuevoAdaptadorSimulado()
	err := a.Conectar("usuario_123")
	assert.NoError(t, err)
	assert.True(t, a.Estado())
}

func TestConectar_TokenVacio(t *testing.T) {
	a := conectores.NuevoAdaptadorSimulado()
	err := a.Conectar("")
	assert.Error(t, err)
	assert.False(t, a.Estado())
}

func TestEstado_AntesDeCconectar(t *testing.T) {
	a := conectores.NuevoAdaptadorSimulado()
	assert.False(t, a.Estado())
}

func TestEjecutarAccion_SinConectar(t *testing.T) {
	a := conectores.NuevoAdaptadorSimulado()
	_, err := a.EjecutarAccion("PLAY", "algo")
	assert.Error(t, err)
}

func TestEjecutarAccion_PLAY(t *testing.T) {
	a := conectores.NuevoAdaptadorSimulado()
	_ = a.Conectar("usuario_123")
	resultado, err := a.EjecutarAccion("PLAY", "jazz_lo_fi")
	assert.NoError(t, err)
	assert.Equal(t, "[SIMULADO] Reproduciendo: jazz_lo_fi", resultado)
}

func TestEjecutarAccion_STOP(t *testing.T) {
	a := conectores.NuevoAdaptadorSimulado()
	_ = a.Conectar("usuario_123")
	resultado, err := a.EjecutarAccion("STOP", "")
	assert.NoError(t, err)
	assert.Equal(t, "[SIMULADO] Detenido", resultado)
}

func TestEjecutarAccion_INFO(t *testing.T) {
	a := conectores.NuevoAdaptadorSimulado()
	_ = a.Conectar("usuario_123")
	resultado, err := a.EjecutarAccion("INFO", "")
	assert.NoError(t, err)
	assert.Equal(t, "[SIMULADO] Servicio activo, sin API real conectada", resultado)
}

func TestEjecutarAccion_AccionDesconocida(t *testing.T) {
	a := conectores.NuevoAdaptadorSimulado()
	_ = a.Conectar("usuario_123")
	_, err := a.EjecutarAccion("BAILAR", "")
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "BAILAR")
}
