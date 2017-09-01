comunidadfusa.util.parches = (function () {

    var storage = window.localStorage;

    function init() {
        var parcheActual = storage.getItem("parches");
        if (parcheActual === null) {
            var usuario = comunidadfusa.service.usuario.get();
            comunidadfusa.service.usuario.esMobile(usuario.id)
                    .done(function () {
                        storage.setItem("parches", 1);
                        parcheActual = storage.getItem("parches");
                    })
                    .fail(function () {
                        comunidadfusa.util.analytics.trackEvent("error", "parche", usuario.id, 1);
                    });
        }
        if (parcheActual == 1) {
            var usuario = comunidadfusa.service.usuario.get();
            comunidadfusa.service.usuario.esMobile(usuario.id)
                    .done(function (data) {
                        comunidadfusa.service.usuario.set(data["usuario"]);
                        storage.setItem("parches", 2);
                    })
                    .fail(function () {
                        comunidadfusa.util.analytics.trackEvent("error", "parche2", usuario.id, 1);
                    });
        }
    }

    return {
        init: init
    };
})();

