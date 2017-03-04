comunidadfusa.ui.disco = (function () {

    var entry, documentname, documentid, referenceID, callLogID, filePath, blob, cdr, fileObject;
    var filename = "";
    var fileURL = "";
    var imagePath = "";
    var fileTransfer;

    function init() {
        var idDisco = comunidadfusa.getUrlParameter("id");

        comunidadfusa.service.discos.getDisco(idDisco, function (data) {
            $(".fusa-js-titulo-disco").text(data.nombre);
            $(".jp-play-me-disc").data("id", idDisco);
            $imagen = $(".fusa-js-imagen-disco");
            $imagen.attr("src", "http://www.comunidadfusa.com/" + data.avatar);

            $(".fusa-js-lista-canciones-disco").empty();
            $(".fusa-js-lista-canciones-disco").append($("#cancion-disco-tmpl").tmpl(data.canciones));

        });

        $(document).on('click', '.fusa-js-descargar-cancion', function (e) {
            e && e.preventDefault();
            var $this = $(e.target);
            if (!$this.is('a')) {
                $this = $this.closest('a');
            }
            var id = $this.data("id");
            comunidadfusa.service.audios.getAudio(id, function (data) {
                console.log(data);
                descargarCancion(data.archivo);
            });
        });
    }

    function descargarCancion(nombreArchivo) {
        filename = nombreArchivo;
        fileURL = comunidadfusa.MP3_URI + nombreArchivo;
        alert(fileURL);
        fileTransfer = new FileTransfer();
        try {
            window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, onFileSystemSuccess, onError);
        } catch (err) {
            alert("ER - " + err.message);
        }
    }

    function onFileSystemSuccess(fileSystem) {
        alert("onFileSystemSuccess");
        entry = fileSystem;
        entry.getDirectory("fusa", {create: true, exclusive: false}, onGetDirectorySuccess, onGetDirectoryFail);
    }

    function onGetDirectorySuccess(dir) {
        alert("onGetDirectorySuccess");
        dir.getDirectory("audios", {create: true, exclusive: false}, onGetDirectorySuccess1, onGetDirectoryFail);
    }

    function onGetDirectorySuccess1(dir) {
        alert("onGetDirectorySuccess1");
        cdr = dir;
        dir.getFile(filename, {create: true, exclusive: false}, gotFileEntry, errorHandler);
    }

    function gotFileEntry(fileEntry) {
        alert("gotFileEntry");
        var uri = encodeURI(fileURL);
        alert("dest - " + cdr.nativeURL + filename);
        fileTransfer.download(uri, cdr.nativeURL + filename,
                function (entry) {
                    alert("descargar finalizada");
                },
                function (error) {
                    alert("download error source " + error.source);
                    alert("download error target " + error.target);
                    alert("upload error code" + error.code);
                    alert("error");
                },
                true);
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