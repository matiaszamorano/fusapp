comunidadfusa.ui.banda = (function () {

    function init() {
        var idBanda = comunidadfusa.getUrlParameter("id");
        comunidadfusa.service.bandas.getBanda(idBanda, function (data) {
            $(".fusa-js-nombre-banda").text(data.nombre);
            $(".fusa-js-ciudad-banda").text(data.ciudad);
            $(".jp-play-me").data("id", data.id);
            $imagen = $(".fusa-js-imagen-banda");
            $imagen.attr("src", "http://www.comunidadfusa.com/" + data.avatar_grande);
        });

        comunidadfusa.service.bandas.getDiscosBanda(idBanda, function (data) {
            $(".fusa-js-lista-discos").empty();
            $(".fusa-js-lista-discos").append($("#disco-banda-tmpl").tmpl(data));
            comunidadfusa.util.html5HistoryAPI.setupHistoryClicks();
        });

        comunidadfusa.service.bandas.getBandasRecomendadas(idBanda, function (data) {
            $(".fusa-js-bandas-recomendadas").empty();
            $(".fusa-js-bandas-recomendadas").append($("#banda-recomendada-tmpl").tmpl(data));
            comunidadfusa.util.html5HistoryAPI.setupHistoryClicks();
        });
    }


    return {
        init: init
    };

})();