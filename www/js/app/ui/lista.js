comunidadfusa.ui.lista = (function () {

    var canciones;

    function init() {
        var tipo = comunidadfusa.getUrlParameter("tipo");
        if (tipo === "usuario") {
            var idLista = comunidadfusa.getUrlParameter("id");
            listaUsuario(idLista);
        } else if (tipo === "top25") {
            var url = comunidadfusa.service.baseURI + "/audios/populares";
            listaAutomatica(url, "Top 25", "images/listas/01.jpg");
        } else if (tipo === "genero") {
            var idGenero = comunidadfusa.getUrlParameter("id");
            var imagen = comunidadfusa.getUrlParameter("imagen");
            var titulo = comunidadfusa.getUrlParameter("titulo");
            listaGeneros(idGenero, titulo, imagen);
        } else if (tipo === "mixBanda") {
            var idBanda = comunidadfusa.getUrlParameter("id");
            var imagen = comunidadfusa.getUrlParameter("imagen");
            var titulo = comunidadfusa.getUrlParameter("titulo");
            listaMixBanda(idBanda, titulo, imagen);
        }

    }

    function listaMixBanda(idBanda, titulo, imagen) {
        $(".jp-play-configure").addClass("jp-play-me-mix");
        $(".jp-play-configure").data("id", idBanda);
        $(".fusa-js-imagen-lista").attr("src", imagen);
        $(".fusa-js-titulo-lista-usuario").text(titulo);
        comunidadfusa.service.audios.getAudiosMixBanda(idBanda, function (audios) {
            if (audios.length > 0) {
                audios.forEach(function (cancion) {
                    if (comunidadfusa.service.audios.estaDescargado(cancion.id)) {
                        cancion.descargado = true;
                    } else {
                        cancion.descargado = false;
                    }
                });
                canciones = audios;
                $(".fusa-js-lista-canciones-lista").empty();
                $(".fusa-js-lista-canciones-lista").append($("#lista-usuario-tmpl").tmpl(audios));
                $(".fusa-js-descargar-lista").addClass("descarga-activa");
                comunidadfusa.util.descargas.activarDescargaCanciones();
                activarDescargaTodos();
            }
        });
    }

    function listaGeneros(idGenero, titulo, imagen) {
        $(".jp-play-configure").addClass("fusa-js-lista-por-genero");
        $(".jp-play-configure").data("id-genero", idGenero);
        $(".fusa-js-imagen-lista").attr("src", imagen);
        $(".fusa-js-titulo-lista-usuario").text(titulo);
        comunidadfusa.service.audios.getPorGenero(idGenero, function (audios) {
            if (audios.length > 0) {
                audios.forEach(function (cancion) {
                    if (comunidadfusa.service.audios.estaDescargado(cancion.id)) {
                        cancion.descargado = true;
                    } else {
                        cancion.descargado = false;
                    }
                });
                canciones = audios;
                $(".fusa-js-lista-canciones-lista").empty();
                $(".fusa-js-lista-canciones-lista").append($("#lista-usuario-tmpl").tmpl(audios));
                $(".fusa-js-descargar-lista").addClass("descarga-activa");
                comunidadfusa.util.descargas.activarDescargaCanciones();
                activarDescargaTodos();
            }
        });
    }

    function listaAutomatica(url, titulo, imagen) {
        $(".jp-play-configure").addClass("fusa-js-lista-recomendada-popular");
        $(".fusa-js-imagen-lista").attr("src", imagen);
        $(".fusa-js-titulo-lista-usuario").text(titulo);
        comunidadfusa.service.audios.getAudiosPorUrl(url, function (audios) {
            if (audios.length > 0) {
                audios.forEach(function (cancion) {
                    if (comunidadfusa.service.audios.estaDescargado(cancion.id)) {
                        cancion.descargado = true;
                    } else {
                        cancion.descargado = false;
                    }
                });
                canciones = audios;
                $(".fusa-js-lista-canciones-lista").empty();
                $(".fusa-js-lista-canciones-lista").append($("#lista-usuario-tmpl").tmpl(audios));
                $(".fusa-js-descargar-lista").addClass("descarga-activa");
                comunidadfusa.util.descargas.activarDescargaCanciones();
                activarDescargaTodos();
            }
        });
    }

    function listaUsuario(idLista) {
        $(".jp-play-configure").addClass("jp-play-me-list");
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
                canciones = data;
                $(".fusa-js-lista-canciones-lista").empty();
                $(".fusa-js-lista-canciones-lista").append($("#lista-usuario-tmpl").tmpl(data));
                $(".fusa-js-descargar-lista").addClass("descarga-activa");
                comunidadfusa.util.descargas.activarDescargaCanciones();
                activarDescargaTodos();
            }
        });
    }

    function activarDescargaTodos() {
        $(document).off('click', '.descarga-activa');
        $(document).on('click', '.descarga-activa', function (e) {
            e && e.preventDefault();
            var $this = $(this);
            var $iconosDescarga = $(".fusa-js-lista-canciones-lista i.icon-arrow-down");
            comunidadfusa.util.descargas.descargarListaCanciones(canciones, $this, $iconosDescarga);
        });
    }


    return {
        init: init
    };

})();