comunidadfusa.ui.bienvenida = (function () {

    function init() {
        inicializarBandasHome();
        $(document).off('click', '.fusa-js-actualizar-bandas');
        $(document).on('click', '.fusa-js-actualizar-bandas', function (e) {
            setTimeout(function () {
                inicializarBandasHome();
            }, 1000);

        });
    }

    function inicializarBandasHome() {
        comunidadfusa.ui.mostrarCargando();
        comunidadfusa.service.bandas.getBandasDelTop(8, function (bandas) {
            $(".fusa-js-bandas-recomendadas").empty();
            $(".fusa-js-bandas-recomendadas").append($("#banda-home-tmpl").tmpl(bandas));
            comunidadfusa.util.html5HistoryAPI.setupHistoryClicks();
            comunidadfusa.ui.ocultarCargando();
            $(".fusa-js-actualizar-bandas").removeClass("active");
            $(".fusa-js-actualizar-bandas").removeClass("fa-spin");
        });

    }

    return {
        init: init
    };

})();