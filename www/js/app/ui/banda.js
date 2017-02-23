comunidadfusa.ui.banda = (function () {

    function init() {
        var idBanda = comunidadfusa.getUrlParameter("id");
        comunidadfusa.service.bandas.getBanda(idBanda)
                .done(function (data) {
                    $(".fusa-js-nombre-banda").text(data.nombre);
                    $(".fusa-js-ciudad-banda").text(data.ciudad);
                    $(".jp-play-me").data("id", data.id);
                    $imagen = $(".fusa-js-imagen-banda");
                    $imagen.attr("src", "http://www.comunidadfusa.com/" + data.avatar_grande);
                })
                .fail(function (error) {
                    console.log(error);
                });
        comunidadfusa.service.bandas.getDiscosBanda(idBanda)
                .done(function (data) {
                    console.log(data);
                    $(".fusa-js-lista-discos").empty();
                    $(".fusa-js-lista-discos").append($("#disco-banda-tmpl").tmpl(data));
                    comunidadfusa.util.html5HistoryAPI.setupHistoryClicks();
                })
                .fail(function (error) {
                    console.log(error);
                });
    }


    return {
        init: init
    };

})();