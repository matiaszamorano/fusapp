comunidadfusa.service.busqueda = (function () {

    function buscar(query) {
        var url = comunidadfusa.service.baseURI + "/buscador?q=" + query;
        return comunidadfusa.service.getSinCache(url);
    }

    return {
        buscar: buscar
    };
})();