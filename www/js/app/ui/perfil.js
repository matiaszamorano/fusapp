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

        var dataMasEscuchadas = {
            usuario_id: usuario.id,
            pagina: 1
        };

        comunidadfusa.service.bandas.getBandasMasEscuchadas(dataMasEscuchadas)
                .done(function (data) {
                    if (data.length > 0) {
                        $(".fusa-js-perfil-mas-escuchadas").empty();
                        $(".fusa-js-perfil-mas-escuchadas").append($("#fusa-js-banda-mas-escuchada-tmpl").tmpl(data));
                    }
                })
                .fail(function (error) {
                    console.log(error);
                });

        var dataSigiuendo = {
            usuario_id: usuario.id
        };

        comunidadfusa.service.bandas.getSiguiendo(dataSigiuendo)
                .done(function (data) {
                    if (data.length > 0) {
                        $(".fusa-js-perfil-siguiendo").empty();
                        $(".fusa-js-perfil-siguiendo").append($("#fusa-js-banda-siguiendo-tmpl").tmpl(data));
                    }
                })
                .fail(function (error) {
                    console.log(error);
                });
    }


    return {
        init: init
    };

})();