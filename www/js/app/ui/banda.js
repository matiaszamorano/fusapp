comunidadfusa.ui.banda = (function () {

    function init() {
        comunidadfusa.ui.mostrarCargando();
        var idBanda = comunidadfusa.getUrlParameter("id");
        comunidadfusa.service.bandas.getBanda(idBanda, function (data) {
            $(".fusa-js-nombre-banda").text(data.nombre);
            $(".fusa-js-ciudad-banda").text(data.ciudad);
            $("a.jp-play-me").data("id", idBanda);
            $("a.fusa-js-descargar-banda").data("id", idBanda);
            $imagen = $(".fusa-js-imagen-banda");
            $imagen.attr("src", "http://www.comunidadfusa.com/" + data.avatar_grande);
            if (data.seguidor) {
                $(".fusa-js-seguir-banda span.text").html("<i class='icon icon-basket-loaded'></i> Siguiendo</span>");
            }
            $(".fusa-js-acciones-banda").removeClass("hide");
        });

        comunidadfusa.service.bandas.getDiscosBanda(idBanda, function (data) {
            $(".fusa-js-lista-discos").empty();
            $(".fusa-js-lista-discos").append($("#disco-banda-tmpl").tmpl(data));
            comunidadfusa.util.html5HistoryAPI.setupHistoryClicks();
        });

        comunidadfusa.service.bandas.getBandasRecomendadas(idBanda, function (data) {
            $(".fusa-js-bandas-recomendadas").empty();
            $(".fusa-js-bandas-recomendadas").append($("#banda-recomendada-tmpl").tmpl(data));
            comunidadfusa.ui.ocultarCargando();
            comunidadfusa.util.html5HistoryAPI.setupHistoryClicks();
        });

    }

    return {
        init: init
    };

})();