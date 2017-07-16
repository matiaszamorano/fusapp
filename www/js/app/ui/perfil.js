comunidadfusa.ui.perfil = (function () {

    function init() {
        comunidadfusa.ui.mostrarCargando();
        comunidadfusa.service.listas.getListasUsuario(function (data) {
            if (data.length > 0) {
                $("#listas ul").append($("#perfil-lista-usuario-tmpl").tmpl(data));
            }
            comunidadfusa.ui.ocultarCargando();
        });
        var usuario = comunidadfusa.service.usuario.get();
        $(".fusa-js-avatar-usuario").attr("src", usuario.avatar);
        $(".fusa-js-perfil-apodo").text(usuario.apodo);
        if (usuario.ciudad) {
            $(".fusa-js-perfil-ciudad").text(usuario.ciudad);
        }

        var dataMasEscuchadas = {
            usuario_id: usuario.id,
            pagina: 1,
            cantidad: 25
        };

        comunidadfusa.service.bandas.getBandasMasEscuchadas(dataMasEscuchadas, function (data) {
            if (data.length > 0) {
                $(".fusa-js-perfil-mas-escuchadas").empty();
                $(".fusa-js-perfil-mas-escuchadas").append($("#fusa-js-banda-mas-escuchada-tmpl").tmpl(data));
                comunidadfusa.util.html5HistoryAPI.setupHistoryClicks();
            }
        });

        var dataSigiuendo = {
            usuario_id: usuario.id
        };

        comunidadfusa.service.bandas.getSiguiendo(dataSigiuendo, function (data) {
            if (data.length > 0) {
                $(".fusa-js-perfil-siguiendo").empty();
                $(".fusa-js-perfil-siguiendo").append($("#fusa-js-banda-siguiendo-tmpl").tmpl(data));
                comunidadfusa.util.html5HistoryAPI.setupHistoryClicks();
            }
        });
    }


    return {
        init: init
    };

})();