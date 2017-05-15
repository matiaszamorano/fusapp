comunidadfusa.ui.disco = (function () {

    var canciones;

    function init() {
        var idDisco = comunidadfusa.getUrlParameter("id");
        var cantidadAudiosDescargados = 0;

        comunidadfusa.service.discos.getDisco(idDisco, function (data) {
            var algunoDescargando = false;
            $(".fusa-js-titulo-disco").text(data.nombre);
            $(".jp-play-me-disc").data("id", idDisco);
            $imagen = $(".fusa-js-imagen-disco");
            $imagen.attr("src", "http://www.comunidadfusa.com/" + data.avatar);

            data.canciones.forEach(function (cancion) {
                if (comunidadfusa.service.audios.estaDescargado(cancion.id)) {
                    cancion.descargado = true;
                    cancion.enDescarga = false;
                    cantidadAudiosDescargados++;
                } else {
                    cancion.descargado = false;
                    if (comunidadfusa.service.audios.estaEnDescargaEnProceso(cancion.id)) {
                        cancion.descargando = true;
                        algunoDescargando = true;
                    } else {
                        cancion.descargando = false;
                    }
                }
            });

            canciones = data.canciones;
            $(".fusa-js-lista-canciones-disco").empty();
            $(".fusa-js-lista-canciones-disco").append($("#cancion-disco-tmpl").tmpl(data.canciones));
            if (algunoDescargando) {
                var $botonDescarga = $(".fusa-js-descargar-disco span.text");
                $botonDescarga.addClass("fusa-descargando-banda");
                $botonDescarga.html("<i class='icon-clock'></i> Descargando...");
            } else {
                $(".fusa-js-descargar-disco").addClass("descarga-activa");
            }
            if (data.canciones.length <= cantidadAudiosDescargados) {
                $(".fusa-js-descargar-disco span.text").html("<i class='icon-check'></i> Descargado");
            }
            comunidadfusa.util.descargas.activarDescargaCanciones();
            activarDescargaDisco();
        });
    }

    function activarDescargaDisco() {
        $(document).off('click', '.descarga-activa');
        $(document).on('click', '.descarga-activa', function (e) {
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