package intencion_test

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/tuusuario/orquestador-mini/conectores"
	"github.com/tuusuario/orquestador-mini/intencion"
)

func motorConectado(t *testing.T) *intencion.MotorDeIntencion {
	t.Helper()
	adaptador := conectores.NuevoAdaptadorSimulado()
	motor := intencion.NuevoMotorDeIntencion(adaptador)
	assert.NoError(t, motor.Iniciar("usuario_test"))
	return motor
}

func TestIniciar_TokenValido(t *testing.T) {
	adaptador := conectores.NuevoAdaptadorSimulado()
	motor := intencion.NuevoMotorDeIntencion(adaptador)
	err := motor.Iniciar("usuario_123")
	assert.NoError(t, err)
}

func TestIniciar_TokenVacio(t *testing.T) {
	adaptador := conectores.NuevoAdaptadorSimulado()
	motor := intencion.NuevoMotorDeIntencion(adaptador)
	err := motor.Iniciar("")
	assert.Error(t, err)
}

func TestProcesar_Reproducir(t *testing.T) {
	motor := motorConectado(t)
	resultado, err := motor.Procesar("reproducir jazz_lo_fi")
	assert.NoError(t, err)
	assert.Equal(t, "[SIMULADO] Reproduciendo: jazz_lo_fi", resultado)
}

func TestProcesar_ReproducirSinParametro(t *testing.T) {
	motor := motorConectado(t)
	resultado, err := motor.Procesar("reproducir")
	assert.NoError(t, err)
	assert.Equal(t, "[SIMULADO] Reproduciendo: ", resultado)
}

func TestProcesar_Detener(t *testing.T) {
	motor := motorConectado(t)
	resultado, err := motor.Procesar("detener")
	assert.NoError(t, err)
	assert.Equal(t, "[SIMULADO] Detenido", resultado)
}

func TestProcesar_Parar(t *testing.T) {
	motor := motorConectado(t)
	resultado, err := motor.Procesar("parar")
	assert.NoError(t, err)
	assert.Equal(t, "[SIMULADO] Detenido", resultado)
}

func TestProcesar_Estado(t *testing.T) {
	motor := motorConectado(t)
	resultado, err := motor.Procesar("estado")
	assert.NoError(t, err)
	assert.Equal(t, "[SIMULADO] Servicio activo, sin API real conectada", resultado)
}

func TestProcesar_Info(t *testing.T) {
	motor := motorConectado(t)
	resultado, err := motor.Procesar("info")
	assert.NoError(t, err)
	assert.Equal(t, "[SIMULADO] Servicio activo, sin API real conectada", resultado)
}

func TestProcesar_IntencionDesconocida(t *testing.T) {
	motor := motorConectado(t)
	_, err := motor.Procesar("bailar salsa")
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "bailar salsa")
}

func TestProcesar_EntradaMayusculas(t *testing.T) {
	motor := motorConectado(t)
	resultado, err := motor.Procesar("DETENER")
	assert.NoError(t, err)
	assert.Equal(t, "[SIMULADO] Detenido", resultado)
}

func TestProcesar_EntradaConEspacios(t *testing.T) {
	motor := motorConectado(t)
	resultado, err := motor.Procesar("  reproducir  bossa_nova  ")
	assert.NoError(t, err)
	assert.Equal(t, "[SIMULADO] Reproduciendo: bossa_nova", resultado)
}
