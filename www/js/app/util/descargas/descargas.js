comunidadfusa.util.descargas = (function () {

    var descargasActivas = 0;


    function getDescargasActivas() {
        return descargasActivas;
    }

    function descargarCancion(audio, successCallback, errorCallback) {
        var filename = audio.archivo;
        var fileURL = comunidadfusa.MP3_URI + audio.archivo;
        var fileTransfer = new FileTransfer();
        var audioDescargado = audio;
        try {
            window.resolveLocalFileSystemURL(comunidadfusa.getExternalSdCardApplicationStorageDirectory(), function (fileSystem) {
                var entry = fileSystem;
                entry.getDirectory("fusa", {create: true, exclusive: false}, function (dir) {
                    dir.getDirectory("audios", {create: true, exclusive: false}, function (dir) {
                        var cdr = dir;
                        dir.getFile(filename, {create: true, exclusive: false}, function () {
                            var uri = encodeURI(fileURL);
                            fileTransfer.download(uri, cdr.nativeURL + filename,
                                    function () {
                                        comunidadfusa.service.audios.audioDescargado(audioDescargado.id, cdr.nativeURL + filename);
                                        successCallback(audioDescargado);
                                        comunidadfusa.service.bandas.actualizarBandasDescargadas(audioDescargado.idBanda);
                                        comunidadfusa.util.analytics.trackEvent("descarga", "cancion", audioDescargado.id, 1);
                                        comunidadfusa.util.analytics.trackEvent("descarga", "banda", audioDescargado.idBanda, 1);
                                        descargasActivas--;
                                    },
                                    function () {
                                        errorCallback(audioDescargado);
                                    },
                                    true);
                        }, errorHandler);
                    }, onGetDirectoryFail);
                }, onGetDirectoryFail);
            }, onError);
        } catch (err) {
            comunidadfusa.util.analytics.trackEvent("error", "descarga", "ER - " + err.message, 1);
        }
    }

    function eliminarCancionDescargada(audio, successCallback) {
        var filename = audio.archivo;
        var audioDescargado = audio;
        try {
            window.resolveLocalFileSystemURL(comunidadfusa.getExternalSdCardApplicationStorageDirectory(), function (fileSystem) {
                var entry = fileSystem;
                entry.getDirectory("fusa", {create: true, exclusive: false}, function (dir) {
                    dir.getDirectory("audios", {create: true, exclusive: false}, function (dir) {
                        dir.getFile(filename, {create: true, exclusive: false}, function (fileEntry) {
                            fileEntry.remove(function () {
                                comunidadfusa.service.audios.eliminarDescargado(audioDescargado.id);
                                comunidadfusa.service.bandas.decrementarAudiosDescargados(audioDescargado.idBanda);
                                successCallback(audioDescargado);
                                comunidadfusa.service.bandas.actualizarBandasDescargadas(audioDescargado.idBanda);
                            }, function (error) {
                                comunidadfusa.util.analytics.trackEvent("error", "eliminarDescarga", "Remove - " + error, 1);
                            });
                        }, errorHandler);
                    }, onGetDirectoryFail);
                }, onGetDirectoryFail);
            }, onError);
        } catch (err) {
            comunidadfusa.util.analytics.trackEvent("error", "eliminarDescarga", "ER - " + err.message, 1);
        }
    }

    function  errorHandler(e) {
        var msg = '';
        switch (e.code) {
            case FileError.QUOTA_EXCEEDED_ERR:
                msg = 'QUOTA_EXCEEDED_ERR';
                break;
            case FileError.NOT_FOUND_ERR:
                msg = 'NOT_FOUND_ERR';
                break;
            case FileError.SECURITY_ERR:
                msg = 'SECURITY_ERR';
                break;
            case FileError.INVALID_MODIFICATION_ERR:
                msg = 'INVALID_MODIFICATION_ERR';
                break;
            case FileError.INVALID_STATE_ERR:
                msg = 'INVALID_STATE_ERR';
                break;
            default:
                msg = e.code;
                break;
        }
        ;
        comunidadfusa.util.analytics.trackEvent("error", "descarga", "Msg - " + msg, 1);
    }

    function onError(e) {
        comunidadfusa.util.analytics.trackEvent("error", "descarga", "onError", 1);
    }

    function onGetDirectoryFail(error) {
        comunidadfusa.util.analytics.trackEvent("error", "descarga", "onGetDirectoryFail + " + error, 1);
    }

    function descargarListaCanciones(canciones, $this, $iconosDescarga) {
        var cancionesADescargar = canciones;
        if (cancionesADescargar.length > 0) {
            var itemsProcessed = 0;
            var cantidadCanciones = cancionesADescargar.length;
            var $botonDescarga = $this.find("span.text");
            $botonDescarga.addClass("fusa-descargando-banda");
            $botonDescarga.html("<i class='icon-clock'></i> Descargando (0/" + cantidadCanciones + ")");
            $iconosDescarga.removeClass("icon-arrow-down");
            $iconosDescarga.addClass("icon-clock");
            cancionesADescargar.forEach(function (cancion) {
                descargasActivas++;
                comunidadfusa.service.audios.audioEnDescargaEnProceso(cancion.id);
            });
            enviarADescargarAudio(cancionesADescargar.shift(), cancionesADescargar, itemsProcessed, cantidadCanciones, $botonDescarga, $iconosDescarga);
        }
    }

    function enviarADescargarAudio(audio, cancionesADescargar, itemsProcessed, cantidadCanciones, $botonDescarga, $iconosDescarga) {
        if (audio !== undefined) {
            if (comunidadfusa.service.audios.estaDescargado(audio.id)) {
                itemsProcessed++;
                descargasActivas--;
                $botonDescarga.html("<i class='icon-clock'></i> Descargando (" + itemsProcessed + "/" + cantidadCanciones + ")");
                if (itemsProcessed === cantidadCanciones) {
                    $botonDescarga.html("<i class='icon-check'></i> Descargado");
                }
                enviarADescargarAudio(cancionesADescargar.shift(), cancionesADescargar, itemsProcessed, cantidadCanciones, $botonDescarga, $iconosDescarga);
            } else {
                descargarCancion(audio, function (audioDescargado) {
                    itemsProcessed++;
                    $botonDescarga.html("<i class='icon-clock'></i> Descargando (" + itemsProcessed + "/" + cantidadCanciones + ")");
                    comunidadfusa.service.bandas.setAudiosDescargados(audioDescargado.idBanda, itemsProcessed);
                    if (itemsProcessed === cantidadCanciones) {
                        $botonDescarga.html("<i class='icon-check'></i> Descargado");
                        $botonDescarga.removeClass("fusa-descargando-banda");
                        $iconosDescarga.removeClass("icon-clock");
                        $iconosDescarga.addClass("icon-check");
                        $iconosDescarga.addClass("text-success");
                    }
                    enviarADescargarAudio(cancionesADescargar.shift(), cancionesADescargar, itemsProcessed, cantidadCanciones, $botonDescarga, $iconosDescarga);
                }, function () {});
            }
        }

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
            descargasActivas++;
            comunidadfusa.service.audios.getAudio(idAudio, function (audio) {
                comunidadfusa.service.audios.audioEnDescargaEnProceso(idAudio);
                descargarCancion(audio, descargaAudioSuccess, descargaAudioError);
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
                eliminarCancionDescargada(audio, eliminarAudioSuccess);
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
        comunidadfusa.service.audios.eliminarAudioEnDescargaEnProceso(audioDescargado.id);
    }

    function descargaAudioError(audioDescargado) {
        var $cancion = $("a[data-id='" + audioDescargado.id + "']");
        var $icono = $cancion.find("i.icon-clock");
        $icono.removeClass("icon-clock");
        $icono.addClass("icon-arrow-down");
        comunidadfusa.service.audios.eliminarAudioEnDescargaEnProceso(audioDescargado.id);
        comunidadfusa.util.analytics.trackEvent("error", "descarga", audioDescargado.id, 1);
    }

    return {
        descargarCancion: descargarCancion,
        eliminarCancionDescargada: eliminarCancionDescargada,
        descargarListaCanciones: descargarListaCanciones,
        activarDescargaCanciones: activarDescargaCanciones,
        getDescargasActivas: getDescargasActivas
    };
})();

