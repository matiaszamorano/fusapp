comunidadfusa.util.descargas = (function () {

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
            window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (fileSystem) {
                var entry = fileSystem;
                entry.getDirectory("fusa", {create: true, exclusive: false}, function (dir) {
                    dir.getDirectory("audios", {create: true, exclusive: false}, function (dir) {
                        dir.getFile(filename, {create: true, exclusive: false}, function (fileEntry) {
                            fileEntry.remove();
                            comunidadfusa.service.audios.eliminarDescargado(audioDescargado.id);
                            comunidadfusa.service.bandas.decrementarAudiosDescargados(audioDescargado.idBanda);
                            successCallback(audioDescargado);
                            comunidadfusa.service.bandas.actualizarBandasDescargadas(audioDescargado.idBanda);
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
        comunidadfusa.util.analytics.trackEvent("error", "descarga", "onGetDirectoryFail", 1);
    }

    function descargarListaCanciones(canciones, $this, $iconosDescarga) {
        if (canciones.length > 0) {
            var itemsProcessed = 0;
            var cantidadCanciones = canciones.length;
            var $botonDescarga = $this.find("span.text");
            $botonDescarga.addClass("fusa-descargando-banda");
            $botonDescarga.html("<i class='icon-clock'></i> Descargando (0/" + cantidadCanciones + ")");
            $iconosDescarga.removeClass("icon-arrow-down");
            $iconosDescarga.addClass("icon-clock");
            for (var i = 0; i < cantidadCanciones; i++) {
                var audio = canciones[i];
                if (comunidadfusa.service.audios.estaDescargado(audio.id)) {
                    itemsProcessed++;
                    $botonDescarga.html("<i class='icon-clock'></i> Descargando (" + itemsProcessed + "/" + cantidadCanciones + ")");
                    if (itemsProcessed === cantidadCanciones) {
                        $botonDescarga.html("<i class='icon-check'></i> Descargado");
                    }
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

                    }, function () {});
                }
            }
        }
    }

    return {
        descargarCancion: descargarCancion,
        eliminarCancionDescargada: eliminarCancionDescargada,
        descargarListaCanciones: descargarListaCanciones
    };
})();

