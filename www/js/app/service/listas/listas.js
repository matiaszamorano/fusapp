comunidadfusa.service.listas = (function () {

    function getAudiosListasReproduccion(data, callback) {
        var url = comunidadfusa.service.baseURI + "/listaReproduccion/" + data.idListaReproduccion + "/audios";
        comunidadfusa.service.getFromStorage(url, callback);
    }

    function getListasUsuario(callback) {
        var url = comunidadfusa.service.baseURI + "/listaReproduccion/" + comunidadfusa.service.usuario.get().id;
        comunidadfusa.service.getFromStorage(url, callback);
    }

    return {
        getListasUsuario: getListasUsuario,
        getAudiosListasReproduccion: getAudiosListasReproduccion
    };
})();