/* global cordova */

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
        return (estoyEnEscuchando.indexOf("escuchando.html") >= 0)
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
        inicializarAlmacenamiento();
        inicializarOneSignal();
        eliminarDescargasEnProgreso();
        cordova.plugins.backgroundMode.setDefaults({
            title: 'Fusa está sonando',
            text: '',
            color: '545a5f'
        });
    }

    function inicializarAlmacenamiento() {
        cordova.plugins.permissions.checkPermission(cordova.plugins.permissions.READ_EXTERNAL_STORAGE, function (status) {
            if (status.hasPermission) {
                setearExternalSDCardLocation();
            } else {
                cordova.plugins.diagnostic.requestRuntimePermission(function (status) {
                    switch (status) {
                        case cordova.plugins.diagnostic.permissionStatus.GRANTED:
                            setearExternalSDCardLocation();
                            break;
                        case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
                            setearInternalLocation();
                            break;
                        case cordova.plugins.diagnostic.permissionStatus.DENIED:
                            setearInternalLocation();
                            break;
                        case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
                            setearInternalLocation();
                            break;
                    }
                }, function (error) {
                    setearInternalLocation();
                    comunidadfusa.util.analytics.trackEvent("error", "init", "requestRuntimePermission " + error, 1);
                }, cordova.plugins.diagnostic.permission.READ_EXTERNAL_STORAGE);
            }
        }, function (error) {
            setearInternalLocation();
            comunidadfusa.util.analytics.trackEvent("error", "init", "checkPermission " + error, 1);
        });
    }

    function setearExternalSDCardLocation() {
        cordova.plugins.diagnostic.getExternalSdCardDetails(function (details) {
            details.forEach(function (detail) {
                externalSdCardApplicationStorageDirectory = detail.filePath;
            });
            if (externalSdCardApplicationStorageDirectory === undefined) {
                setearInternalLocation();
            }
        }, function (error) {
            setearInternalLocation();
            comunidadfusa.util.analytics.trackEvent("error", "init", "setearExternalSDCardLocation " + error, 1);
        });
    }

    function setearInternalLocation() {
        externalSdCardApplicationStorageDirectory = cordova.file.externalDataDirectory;
    }

    function inicializarOneSignal() {
        var notificationOpenedCallback = function (jsonData) {
            console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
        };

        window.plugins.OneSignal
                .startInit("70f86651-9976-455a-a14e-941dd7da6939")
                .handleNotificationOpened(notificationOpenedCallback)
                .endInit();
        window.plugins.OneSignal.sendTags(comunidadfusa.service.usuario.get());
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