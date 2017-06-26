comunidadfusa.ui.explorar = (function () {


    function init() {
        comunidadfusa.ui.mostrarCargando();
        comunidadfusa.service.generos.buscarTodos(function (data) {
            $(".fusa-js-lista-generos").empty();
            $(".fusa-js-lista-generos").append($("#item-genero-lista-tmpl").tmpl(data));
            comunidadfusa.util.html5HistoryAPI.setupHistoryClicks();
            comunidadfusa.ui.ocultarCargando();
        });
    }


    return {
        init: init
    };

})();