comunidadfusa.ui.disco = (function () {

    var canciones;

    function init() {
        var idDisco = comunidadfusa.getUrlParameter("id");
        var cantidadAudiosDescargados = 0;

        comunidadfusa.service.discos.getDisco(idDisco, function (data) {
            $(".fusa-js-titulo-disco").text(data.nombre);
            $(".jp-play-me-disc").data("id", idDisco);
            $imagen = $(".fusa-js-imagen-disco");
            $imagen.attr("src", "http://www.comunidadfusa.com/" + data.avatar);

            data.canciones.forEach(function (cancion) {
                if (comunidadfusa.service.audios.estaDescargado(cancion.id)) {
                    cancion.descargado = true;
                    cantidadAudiosDescargados++;
                } else {
                    cancion.descargado = false;
                }
            });
            canciones = data.canciones;
            $(".fusa-js-lista-canciones-disco").empty();
            $(".fusa-js-lista-canciones-disco").append($("#cancion-disco-tmpl").tmpl(data.canciones));
            $(".fusa-js-descargar-disco").addClass("descarga-activa")
            if (data.canciones.length <= cantidadAudiosDescargados) {
                $(".fusa-js-descargar-disco span.text").html("<i class='icon-check'></i> Descargado");
            }
            activarDescargaCanciones();
            activarDescargaDisco();
        });
    }

    function activarDescargaDisco() {
        $(document).off('click', '.fusa-js-descargar-disco');
        $(document).on('click', '.fusa-js-descargar-disco', function (e) {
            e && e.preventDefault();
            var $this = $(this);
            var $iconosDescarga = $(".fusa-js-lista-canciones-disco i.icon-arrow-down");
            comunidadfusa.util.descargas.descargarListaCanciones(canciones, $this, $iconosDescarga);
        });
    }

    function activarDescargaCanciones() {
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