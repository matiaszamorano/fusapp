var comunidadfusa = (function () {
    var BASE_URI = baseURI();
    var MP3_URI = mp3URI();
    var BASE_URI_HASH = baseURIHash();
    var externalSdCardApplicationStorageDirectory;

    function baseURI() {
        return "http://www.comunidadfusa.com/";
    }

    function mp3URI() {
        return "https://storage.googleapis.com/audiosfusa/";
    }

    function baseURIHash() {
        if (baseURIHashLayout) {
            return baseURIHashLayout;
        }
        //no base found in document, use relative URIs
        return "";
    }

    function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    }

    function estaEnEscuchando() {
        var estoyEnEscuchando = window.location.pathname;
        return estoyEnEscuchando === "/fusapp/escuchando.html";
    }

    function getExternalSdCardApplicationStorageDirectory() {
        return externalSdCardApplicationStorageDirectory;
    }

    function init() {
        cordova.plugins.diagnostic.getExternalSdCardDetails(function (details) {
            details.forEach(function (detail) {
                externalSdCardApplicationStorageDirectory = detail.filePath;
            });
            if (externalSdCardApplicationStorageDirectory === undefined) {
                externalSdCardApplicationStorageDirectory = cordova.file.externalDataDirectory;
            }
        }, function (error) {
            externalSdCardApplicationStorageDirectory = cordova.file.externalDataDirectory;
            console.error(error);
        });
    }

    return {
        baseURI: BASE_URI,
        baseURIHash: BASE_URI_HASH,
        MP3_URI: MP3_URI,
        estaEnEscuchando: estaEnEscuchando,
        getUrlParameter: getUrlParameter,
        init: init,
        getExternalSdCardApplicationStorageDirectory: getExternalSdCardApplicationStorageDirectory
    };
})();