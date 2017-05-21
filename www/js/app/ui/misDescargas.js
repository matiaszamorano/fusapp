comunidadfusa.ui.misDescargas = (function () {

    var storage = window.localStorage;
    var descargasActivas;

    function init() {
        var bandasStorage = JSON.parse(storage.getItem("bandasGuardadas"));
        $(".fusa-js-bandas-descargadas").empty();
        if (bandasStorage) {
            $(".fusa-js-bandas-descargadas").append($("#banda-descargada-tmpl").tmpl(bandasStorage));
            comunidadfusa.util.html5HistoryAPI.setupHistoryClicks();
        } else {
            $(".fusa-js-bandas-descargadas").html("<div class='m-sm'>Sin canciones descargadas</div>");
        }

        inicializarDescargasEnProgreso();
    }

    function  inicializarDescargasEnProgreso() {
        descargasActivas = comunidadfusa.util.descargas.getDescargasActivas();
        if (descargasActivas > 0) {
            $(".fusa-js-descargas-activas").removeClass("hide");
            var $progress = $(".fusa-js-progress-bar");
            var myVar = setInterval(function () {
                var progreso = descargasActivas - comunidadfusa.util.descargas.getDescargasActivas();
                var porcentaje = Math.floor(progreso * 100 / descargasActivas);
                if (porcentaje === 0) {
                    porcentaje = 5;
                }
                $progress.attr("style", "width: " + porcentaje + "%");
                if (porcentaje === 100) {
                    $progress.attr("style", "width: 100%");
                    $(".fusa-js-descargas-activas h4").text("Descargas finalizadas")
                    clearInterval(myVar);
                }
            }, 5000);
        }



    }

    return {
        init: init
    };

})();