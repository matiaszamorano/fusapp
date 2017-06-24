comunidadfusa.ui.lista = (function () {

    var canciones;
    var cantidadAudiosDescargados = 0;

    function init() {
        var tipo = comunidadfusa.getUrlParameter("tipo");
        cantidadAudiosDescargados = 0;
        if (tipo === "usuario") {
            var idLista = comunidadfusa.getUrlParameter("id");
            listaUsuario(idLista);
        } else if (tipo === "top50") {
            var url = comunidadfusa.service.baseURI + "/audios/populares";
            listaAutomatica(url, "Top 50", "images/listas/01.jpg");
        } else if (tipo === "recomendada") {
            var idLista = comunidadfusa.getUrlParameter("id");
            var imagen = comunidadfusa.getUrlParameter("imagen");
            var titulo = comunidadfusa.getUrlParameter("titulo");
            listaGeneros(idLista, titulo, imagen);
        }
    }

    function listaGeneros(idLista, titulo, imagen) {
        comunidadfusa.ui.mostrarCargando();
        $(".jp-play-configure").addClass("jp-play-me-list");
        $(".jp-play-configure").data("id", idLista);
        $(".fusa-js-imagen-lista").attr("src", imagen);
        $(".fusa-js-titulo-lista-usuario").text(titulo);
        comunidadfusa.service.listas.getAudiosListasReproduccion({idListaReproduccion: idLista}, function (audios) {
            if (audios.length > 0) {
                var algunoDescargando = false;
                audios.forEach(function (cancion) {
                    if (comunidadfusa.service.audios.estaDescargado(cancion.id)) {
                        cancion.descargado = true;
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
                canciones = audios;
                $(".fusa-js-lista-canciones-lista").empty();
                $(".fusa-js-lista-canciones-lista").append($("#lista-usuario-tmpl").tmpl(audios));
                if (algunoDescargando) {
                    var $botonDescarga = $(".fusa-js-descargar-lista span.text");
                    $botonDescarga.addClass("fusa-descargando-banda");
                    $botonDescarga.html("<i class='icon-clock'></i> Descargando...");
                } else {
                    $(".fusa-js-descargar-lista").addClass("descarga-activa");
                }
                comunidadfusa.util.descargas.activarDescargaCanciones();
                activarDescargaTodos();
                comunidadfusa.ui.ocultarCargando();
            }
        });
    }

    function listaAutomatica(url, titulo, imagen) {
        comunidadfusa.ui.mostrarCargando();
        $(".jp-play-configure").addClass("fusa-js-lista-recomendada-popular");
        $(".fusa-js-imagen-lista").attr("src", imagen);
        $(".fusa-js-titulo-lista-usuario").text(titulo);
        comunidadfusa.service.audios.getAudiosPorUrl(url, function (audios) {
            if (audios.length > 0) {
                var algunoDescargando = false;
                audios.forEach(function (cancion) {
                    if (comunidadfusa.service.audios.estaDescargado(cancion.id)) {
                        cancion.descargado = true;
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
                canciones = audios;
                $(".fusa-js-lista-canciones-lista").empty();
                $(".fusa-js-lista-canciones-lista").append($("#lista-usuario-tmpl").tmpl(audios));
                if (algunoDescargando) {
                    var $botonDescarga = $(".fusa-js-descargar-lista span.text");
                    $botonDescarga.addClass("fusa-descargando-banda");
                    $botonDescarga.html("<i class='icon-clock'></i> Descargando...");
                } else {
                    $(".fusa-js-descargar-lista").addClass("descarga-activa");
                }
                comunidadfusa.util.descargas.activarDescargaCanciones();
                activarDescargaTodos();
                comunidadfusa.ui.ocultarCargando();
            }
        });
    }

    function listaUsuario(idLista) {
        comunidadfusa.ui.mostrarCargando();
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
                var algunoDescargando = false;
                $(".jp-play-me-list").data("id", idLista);
                data.forEach(function (cancion) {
                    if (comunidadfusa.service.audios.estaDescargado(cancion.id)) {
                        cancion.descargado = true;
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
                canciones = data;
                $(".fusa-js-lista-canciones-lista").empty();
                $(".fusa-js-lista-canciones-lista").append($("#lista-usuario-tmpl").tmpl(data));
                if (algunoDescargando) {
                    var $botonDescarga = $(".fusa-js-descargar-lista span.text");
                    $botonDescarga.addClass("fusa-descargando-banda");
                    $botonDescarga.html("<i class='icon-clock'></i> Descargando...");
                } else {
                    $(".fusa-js-descargar-lista").addClass("descarga-activa");
                }
                comunidadfusa.util.descargas.activarDescargaCanciones();
                activarDescargaTodos();
                comunidadfusa.ui.ocultarCargando();
            }
        });
    }

    function activarDescargaTodos() {
        if (canciones.length <= cantidadAudiosDescargados) {
            $(".fusa-js-descargar-lista span.text").html("<i class='icon-check'></i> Descargado");
        }
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