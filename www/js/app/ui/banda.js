/* global comunidadfusa */

comunidadfusa.ui.banda = (function () {

    var idBanda;
    var seguidor = false;
    var contenidoBotonSiguiendo = "<i class='icon fa fa-star'></i> Siguiendo";
    var contenidoBotonSeguir = "<i class='icon fa fa-star'></i> Seguir";

    function init() {
        comunidadfusa.ui.mostrarCargando();
        idBanda = comunidadfusa.getUrlParameter("id");
        comunidadfusa.service.bandas.getBanda(idBanda, function (data) {
            $(".fusa-js-nombre-banda").text(data.nombre);
            $(".fusa-js-ciudad-banda").text(data.ciudad);
            $("a.jp-play-me").data("id", idBanda);
            $("a.fusa-js-descargar-banda").data("id", idBanda);
            var $imagen = $(".fusa-js-imagen-banda");
            $imagen.attr("src", comunidadfusa.baseURI + data.avatar_grande);
            if (data.seguidor) {
                $(".fusa-js-seguir-banda span.text").html(contenidoBotonSiguiendo);
                seguidor = true;
            }
            $(".fusa-js-acciones-banda").removeClass("hide");
            inicializarSeguirNoSeguir();
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

    function inicializarSeguirNoSeguir() {
        $(".fusa-js-seguir-banda").click(function (e) {
            if (!seguidor) {
                comunidadfusa.service.seguidores.seguirBanda(idBanda)
                        .done(function () {
                            comunidadfusa.service.bandas.getSiguiendo(function () {});
                            comunidadfusa.service.bandas.getBanda(idBanda, function () {});
                            $(".fusa-js-seguir-banda span.text").html(contenidoBotonSiguiendo);
                            seguidor = true;
                        })
                        .fail(function (error) {
                            console.log(error);
                            console.log("error");
                        });
            } else {
                comunidadfusa.service.seguidores.dejarDeSeguirBanda(idBanda)
                        .done(function () {
                            comunidadfusa.service.bandas.getSiguiendo(function () {});
                            comunidadfusa.service.bandas.getBanda(idBanda, function () {});
                            $(".fusa-js-seguir-banda span.text").html(contenidoBotonSeguir);
                            seguidor = false;
                        })
                        .fail(function (error) {
                            console.log(error);
                            console.log("error");
                        });
            }
            return false;
        });
    }

    return {
        init: init
    };

})();