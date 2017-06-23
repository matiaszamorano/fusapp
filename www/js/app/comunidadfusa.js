var comunidadfusa = (function () {
    var BASE_URI = baseURI();
    var MP3_URI = mp3URI();
    var BASE_URI_HASH = baseURIHash();
    var externalSdCardApplicationStorageDirectory;
    var storage = window.localStorage;

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
        return estoyEnEscuchando.endsWith("escuchando.html");
    }

    function getExternalSdCardApplicationStorageDirectory() {
        return externalSdCardApplicationStorageDirectory;
    }

    function eliminarDescargasEnProgreso() {
        $.each(storage, function (key, value) {
            if (key.match("^descargandoAudio")) {
                storage.removeItem(key);
            }
        });
    }

    function ordenar(field, reverse, primer) {

        var key = primer ?
                function (x) {
                    return primer(x[field])
                } :
                function (x) {
                    return x[field]
                };
        reverse = !reverse ? 1 : -1;
        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    }

    function init() {
        $('#splash').delay(4000).fadeOut(500, function () {
            $("header .hide").removeClass("hide");
        });
        cordova.plugins.diagnostic.getExternalSdCardDetails(function (details) {
            details.forEach(function (detail) {
                externalSdCardApplicationStorageDirectory = detail.filePath;
            });
            if (externalSdCardApplicationStorageDirectory === undefined) {
                externalSdCardApplicationStorageDirectory = cordova.file.externalDataDirectory;
            }
        }, function (error) {
            externalSdCardApplicationStorageDirectory = cordova.file.externalDataDirectory;
            comunidadfusa.util.analytics.trackEvent("error", "init", error, 1);
        });
        eliminarDescargasEnProgreso();
    }

    return {
        baseURI: BASE_URI,
        baseURIHash: BASE_URI_HASH,
        MP3_URI: MP3_URI,
        estaEnEscuchando: estaEnEscuchando,
        getUrlParameter: getUrlParameter,
        init: init,
        getExternalSdCardApplicationStorageDirectory: getExternalSdCardApplicationStorageDirectory,
        ordenar: ordenar
    };
})();