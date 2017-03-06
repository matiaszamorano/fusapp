comunidadfusa.ui.disco = (function () {

    function init() {
        var idDisco = comunidadfusa.getUrlParameter("id");

        comunidadfusa.service.discos.getDisco(idDisco, function (data) {
            $(".fusa-js-titulo-disco").text(data.nombre);
            $(".jp-play-me-disc").data("id", idDisco);
            $imagen = $(".fusa-js-imagen-disco");
            $imagen.attr("src", "http://www.comunidadfusa.com/" + data.avatar);

            data.canciones.forEach(function (cancion) {
                if (comunidadfusa.service.audios.estaDescargado(cancion.id)) {
                    cancion.descargado = true;
                } else {
                    cancion.descargado = false;
                }
            });
            $(".fusa-js-lista-canciones-disco").empty();
            $(".fusa-js-lista-canciones-disco").append($("#cancion-disco-tmpl").tmpl(data.canciones));

        });

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
        alert("Error al descargar el tema");
    }

    return {
        init: init
    };

})();