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
            var idAudio = $this.data("id");
            comunidadfusa.service.audios.getAudio(idAudio, function (data) {
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
            var dir = comunidadfusa.util.archivos.getPathAudios();
            dir.getFile(filename, {create: true, exclusive: false}, gotFileEntry, errorHandler);
        } catch (err) {
            alert("ER - " + err.message);
        }
    }

    function gotFileEntry(fileEntry) {
        alert("gotFileEntry");
        var uri = encodeURI(fileURL);
        alert("dest - " + dir.nativeURL + filename);
        fileTransfer.download(uri, dir.nativeURL + filename,
                function (entry) {
                    alert("descargar finalizada");
                    comunidadfusa.service.audios.audioDescargado(idAudio);
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

    return {
        init: init
    };

})();