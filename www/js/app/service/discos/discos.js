comunidadfusa.service.discos = (function () {

    function getDisco(id, callback) {
        var url = comunidadfusa.service.baseURI + "/disco/info/" + id;
        comunidadfusa.service.getFromStorage(url, callback);
    }

    return {
        getDisco: getDisco
    };
})();