comunidadfusa.service.audios = (function () {

    function getAudiosPorUrl(uri) {
        return comunidadfusa.service.get(uri);
    }

    return {
        getAudiosPorUrl: getAudiosPorUrl
    };
})();