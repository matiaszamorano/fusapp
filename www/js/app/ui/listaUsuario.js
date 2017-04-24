comunidadfusa.ui.listaUsuario = (function () {

    function init() {
        var idLista = comunidadfusa.getUrlParameter("id");

        comunidadfusa.service.listas.getListasUsuario(function (data) {
            data.forEach(function (lista) {
                if (lista.id == idLista) {
                    $(".fusa-js-titulo-lista-usuario").text(lista.nombre);
                }
            });
        });

        comunidadfusa.service.listas.getAudiosListasReproduccion({idListaReproduccion: idLista}, function (data) {
            if (data.length > 0) {
                $(".jp-play-me-list").data("id", idLista);
                data.forEach(function (cancion) {
                    if (comunidadfusa.service.audios.estaDescargado(cancion.id)) {
                        cancion.descargado = true;
                    } else {
                        cancion.descargado = false;
                    }
                });
                $(".fusa-js-lista-canciones-lista").empty();
                $(".fusa-js-lista-canciones-lista").append($("#lista-usuario-tmpl").tmpl(data));
            }
        });
    }

    return {
        init: init
    };

})();