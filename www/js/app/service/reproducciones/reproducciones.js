comunidadfusa.service.reproducciones = (function () {

    function incrementarReproduccionesAudio(idAudio) {
        var url = comunidadfusa.service.baseURI + "/audio/inc/reproduccion/" + idAudio + "/" + comunidadfusa.service.usuario.get().id;
        comunidadfusa.service.post(url);
    }

    return {
        incrementarReproduccionesAudio: incrementarReproduccionesAudio
    };
})();
