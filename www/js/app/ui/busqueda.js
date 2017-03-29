comunidadfusa.ui.busqueda = (function () {

    var storage = window.localStorage;

    function init() {
        var busqueda = storage.getItem("busqueda");
        comunidadfusa.service.busqueda.buscar(busqueda)
                .done(function (data) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].nombre == "Bandas") {
                            mostrarBandas(data[i].valores);
                        }
                        if (data[i].nombre == "Listas de reproducción") {
                            mostrarListas(data[i].valores);
                        }
                    }
                    comunidadfusa.util.html5HistoryAPI.setupHistoryClicks();
                });
    }

    function mostrarBandas(bandas) {
        $(".fusa-js-busqueda-bandas").empty();
        $(".fusa-js-busqueda-bandas").append($("#fusa-js-banda-buscador").tmpl(bandas));

    }

    function mostrarListas(listas) {
        $(".fusa-js-busqueda-listas").empty();
        $(".fusa-js-busqueda-listas").append($("#fusa-js-lista-buscador").tmpl(listas));
    }

    return {
        init: init
    };

})();

