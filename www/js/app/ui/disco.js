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
            comunidadfusa.util.descargas.activarDescargaCanciones();
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

    return {
        init: init
    };

})();