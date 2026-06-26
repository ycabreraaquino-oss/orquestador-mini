package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/tuusuario/orquestador-mini/conectores"
	"github.com/tuusuario/orquestador-mini/intencion"
)

type requestIntencion struct {
	Token string `json:"token"`
	Texto string `json:"texto"`
}

type responseIntencion struct {
	Ok        bool   `json:"ok"`
	Resultado string `json:"resultado,omitempty"`
	Error     string `json:"error,omitempty"`
}

func responderJSON(w http.ResponseWriter, status int, body responseIntencion) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(body)
}

func manejarIntencion(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		responderJSON(w, http.StatusMethodNotAllowed, responseIntencion{Ok: false, Error: "método no permitido"})
		return
	}

	var req requestIntencion
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		responderJSON(w, http.StatusBadRequest, responseIntencion{Ok: false, Error: "cuerpo JSON inválido"})
		return
	}

	adaptador := conectores.NuevoAdaptadorSimulado()
	motor := intencion.NuevoMotorDeIntencion(adaptador)

	if err := motor.Iniciar(req.Token); err != nil {
		responderJSON(w, http.StatusBadRequest, responseIntencion{Ok: false, Error: err.Error()})
		return
	}

	resultado, err := motor.Procesar(req.Texto)
	if err != nil {
		responderJSON(w, http.StatusBadRequest, responseIntencion{Ok: false, Error: err.Error()})
		return
	}

	responderJSON(w, http.StatusOK, responseIntencion{Ok: true, Resultado: resultado})
}

func main() {
	http.HandleFunc("/intencion", manejarIntencion)
	fmt.Println("Servidor corriendo en http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
