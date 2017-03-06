comunidadfusa.service.bandas = (function () {

    var storage = window.localStorage;

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

    function incrementarAudiosDescargados(idBanda) {
        var cantidadAudios = storage.getItem("audiosBandaDescargados" + idBanda);
        if (cantidadAudios === null) {
            storage.setItem("audiosBandaDescargados" + idBanda, 1);
        } else {
            storage.setItem("audiosBandaDescargados" + idBanda, parseInt(cantidadAudios) + 1);
        }
    }

    function decrementarAudiosDescargados(idBanda) {
        var cantidadAudios = storage.getItem("audiosBandaDescargados" + idBanda);
        if (cantidadAudios !== null) {
            storage.setItem("audiosBandaDescargados" + idBanda, parseInt(cantidadAudios) - 1);
        }
    }

    function setAudiosDescargados(idBanda, cantidad) {
        storage.setItem("audiosBandaDescargados" + idBanda, cantidad);
    }

    function getCantidadAudiosDescargados(idBanda) {
        var cantidadAudios = storage.getItem("audiosBandaDescargados" + idBanda);
        if (cantidadAudios === null) {
            return 0;
        }
        return parseInt(cantidadAudios);
    }

    return {
        getBandasMasEscuchadas: getBandasMasEscuchadas,
        getSiguiendo: getSiguiendo,
        getBanda: getBanda,
        getDiscosBanda: getDiscosBanda,
        getBandasRecomendadas: getBandasRecomendadas,
        incrementarAudiosDescargados: incrementarAudiosDescargados,
        getCantidadAudiosDescargados: getCantidadAudiosDescargados,
        setAudiosDescargados: setAudiosDescargados,
        decrementarAudiosDescargados: decrementarAudiosDescargados
    };
})();