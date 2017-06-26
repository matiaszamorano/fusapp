comunidadfusa.service.generos = (function () {

    function buscarTodos(callback) {
        var url = comunidadfusa.service.baseURI + "/generos/usados";
        comunidadfusa.service.getFromStorage(url, callback);
    }

    function getBandasPorIdGenero(idGenero, callback) {
        var url = comunidadfusa.service.baseURI + "/bandas/genero/" + idGenero;
        comunidadfusa.service.getFromStorage(url, callback);
    }

    function getAudiosGenero(idGenero, callback) {
        var url = comunidadfusa.service.baseURI + "/audios/genero/" + idGenero;
        comunidadfusa.service.getFromStorage(url, callback);
    }

    return {
        buscarTodos: buscarTodos,
        getBandasPorIdGenero: getBandasPorIdGenero,
        getAudiosGenero: getAudiosGenero
    };
})();