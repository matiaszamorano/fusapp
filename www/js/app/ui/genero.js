comunidadfusa.ui.genero = (function () {

    function init() {
        comunidadfusa.ui.mostrarCargando();
        var id = comunidadfusa.getUrlParameter("id");
        var nombre = comunidadfusa.getUrlParameter("nombre");
        $(".fusa-js-nombre-genero").text(nombre);
        $(".fusa-js-lista-por-genero").data("id-genero", id);
        comunidadfusa.service.generos.getBandasPorIdGenero(id, function (data) {
            $(".fusa-js-bandas-por-genero").empty();
            $(".fusa-js-bandas-por-genero").append($("#banda-genero-tmpl").tmpl(data));
            comunidadfusa.ui.ocultarCargando();
            comunidadfusa.util.html5HistoryAPI.setupHistoryClicks();
        });
    }

    return {
        init: init
    };

})();