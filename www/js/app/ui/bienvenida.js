comunidadfusa.ui.bienvenida = (function () {

    function init() {
        comunidadfusa.service.listas.getListasBandasMasEscuchadas(function (listas) {
            $("#fusa-js-listas-home").append($("#listaBandaMasEscuchadaTmpl").tmpl(listas));

        });
    }

    return {
        init: init
    };

})();