comunidadfusa.service.audios = (function () {

    function getAudiosPorUrl(uri, callback) {
        comunidadfusa.service.getFromStorage(uri, callback);
    }

    function getAudiosBanda(data, callback) {
        var url = comunidadfusa.service.baseURI + "/audio/todos/" + data.idBanda;
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

    return {
        getAudiosPorUrl: getAudiosPorUrl,
        getAudiosBanda: getAudiosBanda,
        getAudiosDisco: getAudiosDisco,
        getAudio: getAudio
    };
})();