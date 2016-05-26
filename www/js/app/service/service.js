comunidadfusa.service = (function () {
    var BASE_URI = comunidadfusa.baseURI + "servicios";

    function get(uri) {
        return $.get(uri);
    }

    function post(uri, data) {
        return $.post(uri, data);

        
//        return $.ajax({
//            contentType: 'application/json; charset=UTF-8',
//            url: uri,
//            type: 'POST',
//            data: data,
//            dataType: 'json'
//        });
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
        post: post
    };
})();
