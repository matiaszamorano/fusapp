comunidadfusa.ui.perfil = (function () {

    function init() {
        var listas = comunidadfusa.service.listas.getListasUsuario();
        if (listas.length > 0) {
            $("#listas").empty();
            $("#listas").append($("#perfil-lista-usuario-tmpl").tmpl(listas));
        }
    }


    return {
        init: init
    };

})();