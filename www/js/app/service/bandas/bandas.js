comunidadfusa.service.bandas = (function () {

    function getBandasMasEscuchadas(data) {
        var url = comunidadfusa.service.baseURI + "/mi-musica/masEscuchadas";
        return comunidadfusa.service.get(url, data);
    }
    function getSiguiendo(data) {
        var url = comunidadfusa.service.baseURI + "/mi-musica/siguiendo";
        return comunidadfusa.service.get(url, data);
    }

    function getBanda(id) {
        var url = comunidadfusa.service.baseURI + "/bandas/" + id;
        return comunidadfusa.service.get(url);
    }

    function getDiscosBanda(idBanda) {
        var url = comunidadfusa.service.baseURI + "/bandas/" + idBanda + "/discos";
        return comunidadfusa.service.get(url);
    }
    
    function getBandasRecomendadas(idBanda) {
        var url = comunidadfusa.service.baseURI + "/relaciones/banda/" + idBanda;
        return comunidadfusa.service.get(url);
    }

    return {
        getBandasMasEscuchadas: getBandasMasEscuchadas,
        getSiguiendo: getSiguiendo,
        getBanda: getBanda,
        getDiscosBanda: getDiscosBanda,
        getBandasRecomendadas: getBandasRecomendadas
    };
})();