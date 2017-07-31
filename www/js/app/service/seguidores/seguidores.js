comunidadfusa.service.seguidores = (function () {

    function seguirBanda(idBanda) {
        var url = comunidadfusa.service.baseURI + "/bandas/seguir/" + idBanda + "?usuario_id=" + comunidadfusa.service.usuario.get().id;
        return comunidadfusa.service.put(url);
    }


    function dejarDeSeguirBanda(idBanda) {
        var url = comunidadfusa.service.baseURI + "/bandas/noSeguir/" + idBanda + "?usuario_id=" + comunidadfusa.service.usuario.get().id;
        return comunidadfusa.service.put(url);
    }

    return {
        seguirBanda: seguirBanda,
        dejarDeSeguirBanda: dejarDeSeguirBanda
    };
})();