comunidadfusa.service.audios = (function () {

    function getAudiosPorUrl(uri) {
        return comunidadfusa.service.get(uri);
    }

    function getAudiosBanda(data) {
        var url = comunidadfusa.service.baseURI + "/audio/todos/" + data.idBanda;
        return comunidadfusa.service.get(url);
    }

    function getAudiosDisco(discoId) {
        var url = comunidadfusa.service.baseURI + "/disco/info/" + discoId;
        return comunidadfusa.service.get(url);
    }

    return {
        getAudiosPorUrl: getAudiosPorUrl,
        getAudiosBanda: getAudiosBanda,
        getAudiosDisco: getAudiosDisco
    };
})();