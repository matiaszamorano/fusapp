comunidadfusa.ui.misDescargas = (function () {

    var storage = window.localStorage;
    var descargasActivas;

    function init() {
        mostrarBandasDescargadas();
        inicializarDescargasEnProgreso();
    }

    function mostrarBandasDescargadas() {
        comunidadfusa.ui.mostrarCargando();
        var bandasStorage = JSON.parse(storage.getItem("bandasGuardadas"));
        if (bandasStorage !== null) {
            bandasStorage.sort(comunidadfusa.ordenar('nombre', false, function (a) {
                return a.toUpperCase()
            }));
        }
        $(".fusa-js-bandas-descargadas").empty();
        if (bandasStorage) {
            $(".fusa-js-bandas-descargadas").append($("#banda-descargada-tmpl").tmpl(bandasStorage));
            comunidadfusa.util.html5HistoryAPI.setupHistoryClicks();
        } else {
            $(".fusa-js-bandas-descargadas").html("<div class='m-sm'>Sin canciones descargadas</div>");
        }
        comunidadfusa.ui.ocultarCargando();
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
                    $(".fusa-js-descargas-activas h4").text("Descargas finalizadas");
                    $(".fusa-js-descargas-activas .progress").removeClass("active");
                    $progress.removeClass("bg-info");
                    $progress.addClass("bg-warning");
                    mostrarBandasDescargadas();
                    clearInterval(myVar);
                }
            }, 2000);
        }



    }

    return {
        init: init
    };

})();