comunidadfusa.ui.banda = (function () {

    function init() {
        comunidadfusa.ui.mostrarCargando();
        var idBanda = comunidadfusa.getUrlParameter("id");
        comunidadfusa.service.bandas.getBanda(idBanda, function (data) {
            $(".fusa-js-nombre-banda").text(data.nombre);
            $(".fusa-js-ciudad-banda").text(data.ciudad);
            $("a.jp-play-me").data("id", idBanda);
            $("a.fusa-js-descargar-banda").data("id", idBanda);
            $imagen = $(".fusa-js-imagen-banda");
            $imagen.attr("src", "http://www.comunidadfusa.com/" + data.avatar_grande);
            comunidadfusa.service.audios.getAudiosBanda({idBanda: idBanda}, function (data) {
                var cantidadAudiosDescargados = comunidadfusa.service.bandas.getCantidadAudiosDescargados(idBanda);
                var cantidadAudiosBanda = data.length;
                if (cantidadAudiosBanda == cantidadAudiosDescargados) {
                    $(".fusa-js-descargar-banda span.text").html("<i class='icon-check'></i> Descargado");
                } else {
                    var algunoDescargando = false;
                    data.forEach(function (cancion) {
                        if (comunidadfusa.service.audios.estaEnDescargaEnProceso(cancion.id)) {
                            algunoDescargando = true;
                        }
                    });
                    if (algunoDescargando) {
                        $botonDescargar = $(".fusa-js-descargar-banda span.text");
                        $botonDescargar.html("<i class='icon-clock'></i> Descargando...");
                        $botonDescargar.removeClass("fusa-js-descargar-banda");
                    } else {
                        activarDescarga();
                    }
                }
            });
        });

        comunidadfusa.service.bandas.getDiscosBanda(idBanda, function (data) {
            $(".fusa-js-lista-discos").empty();
            $(".fusa-js-lista-discos").append($("#disco-banda-tmpl").tmpl(data));
            comunidadfusa.util.html5HistoryAPI.setupHistoryClicks();
        });

        comunidadfusa.service.bandas.getBandasRecomendadas(idBanda, function (data) {
            $(".fusa-js-bandas-recomendadas").empty();
            $(".fusa-js-bandas-recomendadas").append($("#banda-recomendada-tmpl").tmpl(data));
            comunidadfusa.ui.ocultarCargando();
            comunidadfusa.util.html5HistoryAPI.setupHistoryClicks();
        });

    }

    function activarDescarga() {
        $(document).off('click', '.fusa-js-descargar-banda');
        $(document).on('click', '.fusa-js-descargar-banda', function (e) {
            e && e.preventDefault();
            var $this = $(e.target);
            if (!$this.is('a')) {
                $this = $this.closest('a');
            }
            var idBanda = $this.data("id");

            comunidadfusa.service.audios.getAudiosBanda({idBanda: idBanda}, function (data) {
                if (data.length > 0) {
                    var itemsProcessed = 0;
                    var cantidadCanciones = data.length;
                    var $botonDescarga = $this.find("span.text");
                    $botonDescarga.addClass("fusa-descargando-banda");
                    $botonDescarga.html("<i class='icon-clock'></i> Descargando (0/" + cantidadCanciones + ")");
                    for (var i = 0; i < cantidadCanciones; i++) {
                        var audio = data[i];
                        if (comunidadfusa.service.audios.estaDescargado(audio.id)) {
                            itemsProcessed++;
                            $botonDescarga.html("<i class='icon-clock'></i> Descargando (" + itemsProcessed + "/" + cantidadCanciones + ")");
                            if (itemsProcessed === cantidadCanciones) {
                                $botonDescarga.html("<i class='icon-check'></i> Descargado");
                            }
                        } else {
                            comunidadfusa.util.descargas.incrementarDescargasActivas();
                            comunidadfusa.service.audios.audioEnDescargaEnProceso(audio.id);
                            comunidadfusa.util.descargas.descargarCancion(audio, function (audioDescargado) {
                                itemsProcessed++;
                                $botonDescarga.html("<i class='icon-clock'></i> Descargando (" + itemsProcessed + "/" + cantidadCanciones + ")");
                                comunidadfusa.service.bandas.setAudiosDescargados(audioDescargado.idBanda, itemsProcessed);
                                if (itemsProcessed === cantidadCanciones) {
                                    $botonDescarga.html("<i class='icon-check'></i> Descargado");
                                    $botonDescarga.removeClass("fusa-descargando-banda");
                                }

                            }, function () {});
                        }
                    }
                }
            });
        });
    }

    return {
        init: init
    };

})();