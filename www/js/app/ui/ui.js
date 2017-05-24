comunidadfusa.ui = (function () {

    var storage = window.localStorage;
    var soloDescargado = false;

    function activoSoloDescargado() {
        return soloDescargado;
    }

    function init() {
        $(document).on("click", ".fusa-js-buscar ", function (data) {
            $(".fusa-js-buscador-inactivo").hide();
            $(".fusa-js-buscador-activo").show();
            $(".fusa-js-buscador-activo").attr("style", "display: inline-table;");
            $(".fusa-js-busqueda").focus();
            return false;
        });
        
        $(document).on("click", ".fusa-js-salir-busqueda ", function (data) {
            $(".fusa-js-buscador-inactivo").show();
            $(".fusa-js-buscador-activo").hide();
            return false;
        });

        $(document).on("click", ".fusa-js-ejecutar-busqueda ", function (data) {
            ejecutarBusqueda();
        });

        $('.fusa-js-busqueda').keyup(function (e) {
            if (e.keyCode == 13) {
                ejecutarBusqueda();
                $(".fusa-js-ejecutar-busqueda").trigger("click");
            }
        });

        $(document).on("click", "#fusa-solo-descargado", function (data) {
            if ($(this).is(":checked")) {
                soloDescargado = true;
            } else {
                soloDescargado = false;
            }
            storage.setItem("solo-descargado", soloDescargado);
        });
        if (storage.getItem("solo-descargado") == "true") {
            $("#fusa-solo-descargado").prop('checked', true);
            soloDescargado = true;
        }

    }

    function ejecutarBusqueda() {
        var busqueda = $(".fusa-js-busqueda").val();
        storage.setItem("busqueda", busqueda);
        $(".fusa-js-buscador-inactivo").show();
        $(".fusa-js-buscador-activo").hide();
        return false;
    }

    return {
        init: init,
        activoSoloDescargado: activoSoloDescargado
    };

})();