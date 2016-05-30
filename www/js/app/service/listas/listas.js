comunidadfusa.service.listas = (function () {

    var storage = window.localStorage;

    function cargar(idUsuario) {
        var url = comunidadfusa.service.baseURI + "/listaReproduccion/" + idUsuario;
        comunidadfusa.service.get(url)
                .done(function (data) {
                    storage.setItem("listas-usuario", JSON.stringify(data));
                })
                .fail(function (error) {
                    console.log(error);
                });
    }

    function getAudiosListasReproduccion(data) {
        var url = comunidadfusa.service.baseURI + "/listaReproduccion/" + data.idListaReproduccion + "/audios";
        return comunidadfusa.service.get(url);
    }

    function getListasUsuario() {
        return JSON.parse(storage.getItem("listas-usuario"));
    }

    return {
        getListasUsuario: getListasUsuario,
        cargar: cargar,
        getAudiosListasReproduccion: getAudiosListasReproduccion
    };
})();