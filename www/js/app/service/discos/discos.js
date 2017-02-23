comunidadfusa.service.discos = (function () {

    function getDisco(id) {
        var url = comunidadfusa.service.baseURI + "/disco/info/" + id;
        return comunidadfusa.service.get(url);
    }

    return {
        getDisco: getDisco
    };
})();