comunidadfusa.ui.lista = (function () {

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