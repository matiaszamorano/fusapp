comunidadfusa.service.listas = (function () {

    function getAudiosListasReproduccion(data, callback) {
        var url = comunidadfusa.service.baseURI + "/listaReproduccion/" + data.idListaReproduccion + "/audios";
        comunidadfusa.service.getFromStorage(url, callback);
    }

    function getListasUsuario(callback) {
        var url = comunidadfusa.service.baseURI + "/listaReproduccion/" + comunidadfusa.service.usuario.get().id;
        comunidadfusa.service.getFromStorage(url, callback);
    }

    function getMixFusero(idBanda, callback) {
        var url = comunidadfusa.service.baseURI + "/audio/mix/" + idBanda;
        comunidadfusa.service.getFromStorage(url, callback);
    }

    function getListasHome(callback) {
        var listas = [];
        comunidadfusa.service.bandas.getMasEscuchadasDeLaSemana(null, function (bandasMasEscuchadasDeLaSemana) {

            $.each(bandasMasEscuchadasDeLaSemana, function (i, banda) {
                var lista = {
                    id: banda.Id,
                    nombre: 'Radio: ' + banda.Nombre,
                    imagen: banda.Imagen
                };
                listas.push(lista);
            });
        });
        callback(listas);
    }

    return {
        getListasUsuario: getListasUsuario,
        getAudiosListasReproduccion: getAudiosListasReproduccion,
        getMixFusero: getMixFusero,
        getListasHome: getListasHome
    };
})();