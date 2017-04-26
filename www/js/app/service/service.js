comunidadfusa.service = (function () {
    var BASE_URI = comunidadfusa.baseURI + "servicios";

    var storage = window.localStorage;

    function get(uri, callback, data) {
        $.ajax({
            url: uri,
            method: "GET",
            dataType: "json",
            data: data,
            success: function (resultado) {
                storage.setItem(uri, JSON.stringify(resultado));
                callback(resultado);
            }
        });
    }

    function getFromStorage(uri, callback, data) {
        if (storage.getItem(uri) == null) {
            get(uri, callback, data);
        } else {
            callback(JSON.parse(storage.getItem(uri)));
            get(uri, function () {}, data);
        }
    }

    function getSinCache(uri) {
        return $.get(uri);
    }


    function post(uri, data) {
        return $.post(uri, data);
    }

    function put(uri, data) {
        return $.ajax({
            contentType: 'application/json; charset=UTF-8',
            url: uri,
            type: 'PUT',
            data: data,
            dataType: 'json'
        });
    }

    function eliminar(uri, data) {
        return $.ajax({
            contentType: 'application/json; charset=UTF-8',
            url: uri,
            data: data,
            type: 'DELETE'
        });
    }

    return {
        baseURI: BASE_URI,
        get: get,
        post: post,
        getFromStorage: getFromStorage,
        getSinCache: getSinCache
    };
})();
