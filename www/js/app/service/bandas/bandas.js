comunidadfusa.service.bandas = (function () {

    function getBandasMasEscuchadas(data, callback) {
        var url = comunidadfusa.service.baseURI + "/mi-musica/masEscuchadas";
        comunidadfusa.service.getFromStorage(url, callback, data);
    }
    function getSiguiendo(data, callback) {
        var url = comunidadfusa.service.baseURI + "/mi-musica/siguiendo";
        comunidadfusa.service.getFromStorage(url, callback, data);
    }

    function getBanda(id, callback) {
        var url = comunidadfusa.service.baseURI + "/bandas/" + id;
        comunidadfusa.service.getFromStorage(url, callback);
    }

    function getDiscosBanda(idBanda, callback) {
        var url = comunidadfusa.service.baseURI + "/bandas/" + idBanda + "/discos";
        comunidadfusa.service.getFromStorage(url, callback);
    }

    function getBandasRecomendadas(idBanda, callback) {
        var url = comunidadfusa.service.baseURI + "/relaciones/banda/" + idBanda;
        comunidadfusa.service.getFromStorage(url, callback);
    }

    return {
        getBandasMasEscuchadas: getBandasMasEscuchadas,
        getSiguiendo: getSiguiendo,
        getBanda: getBanda,
        getDiscosBanda: getDiscosBanda,
        getBandasRecomendadas: getBandasRecomendadas
    };
})();