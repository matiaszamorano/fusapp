comunidadfusa.service.audios = (function () {

    var storage = window.localStorage;

    function getAudiosPorUrl(uri, callback) {
        comunidadfusa.service.getFromStorage(uri, callback);
    }

    function getAudiosBanda(data, callback) {
        var url = comunidadfusa.service.baseURI + "/audio/todos/" + data.idBanda;
        comunidadfusa.service.getFromStorage(url, callback);
    }

    function getAudiosMixBanda(idBanda, callback) {
        var url = comunidadfusa.service.baseURI + "/audio/mix/" + idBanda;
        comunidadfusa.service.getFromStorage(url, callback);
    }

    function getAudiosDisco(discoId, callback) {
        var url = comunidadfusa.service.baseURI + "/disco/info/" + discoId;
        comunidadfusa.service.getFromStorage(url, callback);
    }

    function getAudio(id, callback) {
        var url = comunidadfusa.service.baseURI + "/audio/info/" + id;
        comunidadfusa.service.getFromStorage(url, callback);
    }

    function getPorGenero(idGenero, callback) {
        var url = comunidadfusa.service.baseURI + "/audios/genero/" + idGenero;
        comunidadfusa.service.getFromStorage(url, callback);
    }

    function guardarOpinionAudioUsuario(options) {
        var url = comunidadfusa.service.baseURI + "/audio/opinion?usuario_id=" + comunidadfusa.service.usuario.get().id;
        return comunidadfusa.service.post(url, options);
    }

    function audioDescargado(idAudio, ruta) {
        storage.setItem("descargado" + idAudio, ruta);
    }

    function audioEnDescargaEnProceso(idAudio) {
        storage.setItem("descargandoAudio" + idAudio, 1);
    }

    function eliminarAudioEnDescargaEnProceso(idAudio) {
        storage.removeItem("descargandoAudio" + idAudio);
    }

    function estaEnDescargaEnProceso(idAudio) {
        if (storage.getItem("descargandoAudio" + idAudio) === null) {
            return false;
        }
        return true;
    }

    function eliminarDescargado(idAudio) {
        storage.removeItem("descargado" + idAudio);
    }

    function estaDescargado(idAudio) {
        if (storage.getItem("descargado" + idAudio) === null) {
            return false;
        }
        return true;
    }

    function getDescargado(idAudio) {
        return storage.getItem("descargado" + idAudio);
    }

    return {
        getAudiosPorUrl: getAudiosPorUrl,
        getAudiosBanda: getAudiosBanda,
        getAudiosMixBanda: getAudiosMixBanda,
        getAudiosDisco: getAudiosDisco,
        getAudio: getAudio,
        audioDescargado: audioDescargado,
        getDescargado: getDescargado,
        estaDescargado: estaDescargado,
        eliminarDescargado: eliminarDescargado,
        getPorGenero: getPorGenero,
        audioEnDescargaEnProceso: audioEnDescargaEnProceso,
        eliminarAudioEnDescargaEnProceso: eliminarAudioEnDescargaEnProceso,
        estaEnDescargaEnProceso: estaEnDescargaEnProceso,
        guardarOpinionAudioUsuario: guardarOpinionAudioUsuario
    };
})();