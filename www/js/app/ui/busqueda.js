comunidadfusa.ui.busqueda = (function () {

    var storage = window.localStorage;

    function init() {
        comunidadfusa.ui.mostrarCargando();
        var busqueda = storage.getItem("busqueda");
        var encontroBandas = false;
        comunidadfusa.service.busqueda.buscar(busqueda)
                .done(function (data) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].nombre == "Bandas") {
                            mostrarBandas(data[i].valores);
                            encontroBandas = true;
                        }
                        if (data[i].nombre == "Listas de reproducción") {
                            mostrarListas(data[i].valores);
                        }
                        if (data[i].nombre == "Canciones") {
                            mostrarCanciones(data[i].valores);
                        }
                    }
                    if (encontroBandas == false) {
                        $(".fusa-js-busqueda-bandas").empty();
                        $(".fusa-js-busqueda-bandas").append("<li class='list-group-item'><span class='clear'>No se encontraron resultados.</span></li>");
                    }
                    comunidadfusa.ui.ocultarCargando();
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

    function mostrarCanciones(canciones) {
        $(".fusa-js-busqueda-canciones").empty();
        $(".fusa-js-busqueda-canciones").append($("#cancion-disco-tmpl").tmpl(canciones));
    }


    return {
        init: init
    };

})();

