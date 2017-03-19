comunidadfusa.ui = (function () {

    var storage = window.localStorage;

    function init() {
        $(document).on("click", ".fusa-js-buscar ", function (data) {
            $(".fusa-js-buscador-inactivo").hide();
            $(".fusa-js-buscador-activo").show();
            $(".fusa-js-buscador-activo").attr("style", "display: inline-table;");
            return false;
        });

        $(document).on("click", ".fusa-js-salir-busqueda ", function (data) {
            $(".fusa-js-buscador-inactivo").show();
            $(".fusa-js-buscador-activo").hide();
            return false;
        });

        $(document).on("click", ".fusa-js-ejecutar-busqueda ", function (data) {
            var busqueda = $(".fusa-js-busqueda").val();
            storage.setItem("busqueda", busqueda);
            comunidadfusa.util.html5HistoryAPI.cargarPagina("busqueda.html");
            return false;
        });

    }

    return {
        init: init
    };

})();