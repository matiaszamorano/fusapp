comunidadfusa.service.bandas = (function () {

    function getBandasMasEscuchadas(data) {
        var url = comunidadfusa.service.baseURI + "/mi-musica/masEscuchadas";
        return comunidadfusa.service.get(url, data);
    }
    function getSiguiendo(data) {
        var url = comunidadfusa.service.baseURI + "/mi-musica/siguiendo";
        return comunidadfusa.service.get(url, data);
    }

    return {
        getBandasMasEscuchadas: getBandasMasEscuchadas,
        getSiguiendo: getSiguiendo
    };
})();