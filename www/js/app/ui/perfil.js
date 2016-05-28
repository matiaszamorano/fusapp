comunidadfusa.ui.perfil = (function () {

    function init() {
        var listas = comunidadfusa.service.listas.getListasUsuario();
        var usuario = comunidadfusa.service.usuario.get();
        if (listas.length > 0) {
            $("#listas").empty();
            $("#listas").append($("#perfil-lista-usuario-tmpl").tmpl(listas));
        }
        $(".fusa-js-avatar-usuario").attr("src", usuario.avatar);
        $(".fusa-js-perfil-apodo").text(usuario.apodo);
        $(".fusa-js-perfil-ciudad").text(usuario.ciudad);
    }


    return {
        init: init
    };

})();