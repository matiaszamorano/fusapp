comunidadfusa.ui = (function () {

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
//            $(".fusa-js-buscador-activo").attr("style", "display: inline-table;");
            return false;
        });
        
       
    }

    return {
        init: init
    };

})();