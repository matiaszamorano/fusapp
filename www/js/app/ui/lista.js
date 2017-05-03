comunidadfusa.ui.lista = (function () {

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

    function resolverDescargas() {
        $(document).off('click', '.fusa-js-descargar-cancion');
        $(document).on('click', '.fusa-js-descargar-cancion', function (e) {
            e && e.preventDefault();
            var $this = $(e.target);
            if (!$this.is('a')) {
                $this = $this.closest('a');
            }
            var idAudio = $this.data("id");
            $this.find("i").removeClass("icon-arrow-down");
            $this.find("i").addClass("icon-clock");
            comunidadfusa.service.audios.getAudio(idAudio, function (audio) {
                comunidadfusa.util.descargas.descargarCancion(audio, descargaAudioSuccess, descargaAudioError);
            });
        });

        $(document).off('click', '.fusa-js-quitar-descarga-cancion');
        $(document).on('click', '.fusa-js-quitar-descarga-cancion', function (e) {
            e && e.preventDefault();
            var $this = $(e.target);
            if (!$this.is('a')) {
                $this = $this.closest('a');
            }
            var idAudio = $this.data("id");
            $this.find("i").removeClass("icon-check");
            $this.find("i").removeClass("text-success");
            $this.find("i").addClass("icon-clock");
            comunidadfusa.service.audios.getAudio(idAudio, function (audio) {
                comunidadfusa.util.descargas.eliminarCancionDescargada(audio, eliminarAudioSuccess);
            });
        });
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
                $(".fusa-js-lista-canciones-lista").empty();
                $(".fusa-js-lista-canciones-lista").append($("#lista-usuario-tmpl").tmpl(audios));
                resolverDescargas();
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
                $(".fusa-js-lista-canciones-lista").empty();
                $(".fusa-js-lista-canciones-lista").append($("#lista-usuario-tmpl").tmpl(audios));
                resolverDescargas();
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
                $(".fusa-js-lista-canciones-lista").empty();
                $(".fusa-js-lista-canciones-lista").append($("#lista-usuario-tmpl").tmpl(audios));
                resolverDescargas();
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
                $(".fusa-js-lista-canciones-lista").empty();
                $(".fusa-js-lista-canciones-lista").append($("#lista-usuario-tmpl").tmpl(data));
                resolverDescargas();
            }
        });
    }

    function eliminarAudioSuccess(audioDescargado) {
        var $cancion = $("a[data-id='" + audioDescargado.id + "']");
        var $icono = $cancion.find("i.icon-clock");
        $icono.removeClass("icon-clock");
        $icono.addClass("icon-arrow-down");
        $cancion.removeClass("fusa-js-quitar-descarga-cancion");
    }

    function descargaAudioSuccess(audioDescargado) {
        var $cancion = $("a[data-id='" + audioDescargado.id + "']");
        comunidadfusa.service.bandas.incrementarAudiosDescargados(audioDescargado.idBanda);
        var $icono = $cancion.find("i.icon-clock");
        $icono.removeClass("icon-clock");
        $icono.addClass("icon-check");
        $icono.addClass("text-success");
        $cancion.removeClass("fusa-js-descargar-cancion");
        $cancion.addClass("fusa-js-quitar-descarga-cancion");
    }

    function descargaAudioError(audioDescargado) {
        var $cancion = $("a[data-id='" + audioDescargado.id + "']");
        var $icono = $cancion.find("i.icon-clock");
        $icono.removeClass("icon-clock");
        $icono.addClass("icon-arrow-down");
        comunidadfusa.util.analytics.trackEvent("error", "descarga", audioDescargado.id, 1);
    }

    return {
        init: init
    };

})();