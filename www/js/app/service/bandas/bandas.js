comunidadfusa.service.bandas = (function () {

    var storage = window.localStorage;

    function getMasEscuchadasDeLaSemana(data, callback) {
        var url = comunidadfusa.service.baseURI + "/bandas/masEscuchadas?limite=5&dias=7";
        comunidadfusa.service.getFromStorage(url, callback, data);
    }

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

    function actualizarBandasDescargadas(idBanda) {
        var bandasStorage = storage.getItem("bandasGuardadas");
        var bandasGuardadas = new Array();
        if (bandasStorage !== null) {
            bandasGuardadas = JSON.parse(storage.getItem("bandasGuardadas"));
        }
        var cantidadAudios = getCantidadAudiosDescargados(idBanda);
        if (cantidadAudios == 0) {
            var indiceABorrar;
            for (var i = 0; i < bandasGuardadas.length; i++) {
                if (bandasGuardadas[i].id == idBanda)
                    indiceABorrar = i;
            }
            bandasGuardadas.splice(indiceABorrar, 1);
            storage.setItem("bandasGuardadas", JSON.stringify(bandasGuardadas));
        } else {
            getBanda(idBanda, function (banda) {
                if (!existeBandaInArray(banda, bandasGuardadas)) {
                    bandasGuardadas.push(banda);
                    storage.setItem("bandasGuardadas", JSON.stringify(bandasGuardadas));
                }
            });
        }

    }

    function existeBandaInArray(bandaBuscada, bandas) {
        for (var i = 0; i < bandas.length; i++) {
            if (bandas[i].id == bandaBuscada.id)
                return true;
        }
        return false;
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
        getMasEscuchadasDeLaSemana: getMasEscuchadasDeLaSemana,
        getBandasMasEscuchadas: getBandasMasEscuchadas,
        getSiguiendo: getSiguiendo,
        getBanda: getBanda,
        getDiscosBanda: getDiscosBanda,
        getBandasRecomendadas: getBandasRecomendadas,
        incrementarAudiosDescargados: incrementarAudiosDescargados,
        getCantidadAudiosDescargados: getCantidadAudiosDescargados,
        setAudiosDescargados: setAudiosDescargados,
        decrementarAudiosDescargados: decrementarAudiosDescargados,
        actualizarBandasDescargadas: actualizarBandasDescargadas
    };
})();
