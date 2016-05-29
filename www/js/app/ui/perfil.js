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

        var data = {
            usuario_id: usuario.id,
            pagina: 1
        };

        comunidadfusa.service.bandas.getBandasMasEscuchadas(data)
                .done(function (data) {
                    $("#escuchadas").empty();
                    $("#escuchadas").append($("#fusa-js-banda-mas-escuchada-tmpl").tmpl(data));
                })
                .fail(function (error) {
                    console.log(error);
                });
    }


    return {
        init: init
    };

})();