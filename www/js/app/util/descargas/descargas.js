comunidadfusa.util.descargas = (function () {

    function descargarCancion(nombreArchivo, idAudio, successCallback, errorCallback) {
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
                                        successCallback(idAudioDescargado);
                                    },
                                    function () {
                                        errorCallback(idAudioDescargado);
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
        descargarCancion: descargarCancion
    };
})();

