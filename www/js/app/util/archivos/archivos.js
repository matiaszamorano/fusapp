comunidadfusa.util.archivos = (function () {

    function getPathAudios() {
        var buscandoPath = true;
        var path;
        window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, onFileSystemSuccess, onError);
        while (buscandoPath) {

        }
        return path;
    }

    function onFileSystemSuccess(fileSystem) {
        alert("onFileSystemSuccess");
        fileSystem.getDirectory("fusa", {create: true, exclusive: false}, onGetDirectorySuccess, onGetDirectoryFail);
    }

    function onGetDirectorySuccess(dir) {
        alert("onGetDirectorySuccess");
        dir.getDirectory("audios", {create: true, exclusive: false}, onGetDirectorySuccess1, onGetDirectoryFail);
    }

    function onGetDirectorySuccess1(dir) {
        alert("onGetDirectorySuccess1");
        path = dir;
        buscandoPath = false;
    }

    function onError(e) {
        alert("onError");
    }

    function onGetDirectoryFail(error) {
        alert("onGetDirectoryFail");
    }

    return {
        getPathAudios: getPathAudios
    };
})();