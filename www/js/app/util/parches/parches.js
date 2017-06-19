comunidadfusa.util.parches = (function () {

    var storage = window.localStorage;

    function init() {
        if (storage.getItem("parches") === null) {
            var usuario = comunidadfusa.service.usuario.get();
            comunidadfusa.service.usuario.esMobile(usuario.id)
                    .done(function () {
                        storage.setItem("parches", 1);
                    })
                    .fail(function () {
                        comunidadfusa.util.analytics.trackEvent("error", "parche", usuario.id, 1);
                    });

        }
    }

    return {
        init: init
    };
})();

