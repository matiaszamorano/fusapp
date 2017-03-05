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

            console.log(data.canciones);

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
            comunidadfusa.service.audios.getAudio(idAudio, function (data) {
                descargarCancion(data.archivo, idAudio);
            });
        });
    }

    function descargarCancion(nombreArchivo, idAudio) {
        var filename = nombreArchivo;
        var fileURL = comunidadfusa.MP3_URI + nombreArchivo;
        var fileTransfer = new FileTransfer();
        var idAudioDescargado = idAudio;
        try {
            window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (fileSystem) {
                var entry = fileSystem;
                entry.getDirectory("fusa", {create: true, exclusive: false}, function (dir) {
                    dir.getDirectory("audios", {create: true, exclusive: false}, function (dir) {
                        var cdr = dir;
                        dir.getFile(filename, {create: true, exclusive: false}, function () {
                            var uri = encodeURI(fileURL);
                            fileTransfer.download(uri, cdr.nativeURL + filename,
                                    function () {
                                        comunidadfusa.service.audios.audioDescargado(idAudioDescargado, cdr.nativeURL + filename);
                                        var $cancion = $("a[data-id='" + idAudioDescargado + "']");
                                        var $icono = $cancion.find("i.icon-clock");
                                        $icono.removeClass("icon-clock");
                                        $icono.addClass("icon-check");
                                        $icono.addClass("text-success");
                                    },
                                    function () {
                                        $this.find("i").removeClass("icon-clock");
                                        $this.find("i").addClass("icon-arrow-down");
                                        alert("Error al descargar el tema");
                                    },
                                    true);
                        }, errorHandler);
                    }, onGetDirectoryFail);
                }, onGetDirectoryFail);
            }, onError);
        } catch (err) {
            alert("ER - " + err.message);
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
        alert("Msg - " + msg);
    }

    function onError(e) {
        alert("onError");
    }

    function onGetDirectoryFail(error) {
        alert("onGetDirectoryFail");
    }

    return {
        init: init
    };

})();