comunidadfusa.service.usuario = (function () {
    var usuario;
    var storage = window.localStorage;

    function get() {
        usuario = JSON.parse(storage.getItem("fusa-usuario"));
        return usuario;
    }

    function set(fusaUsuario) {
        storage.setItem("fusa-usuario", JSON.stringify(fusaUsuario));
        usuario = fusaUsuario;
    }

    function esMobile(idUsuario) {
        var url = comunidadfusa.service.baseURI + "/app/usuario/" + idUsuario + "/mobile";
        return comunidadfusa.service.post(url);
    }

    return {
        get: get,
        set: set,
        esMobile: esMobile
    };
})();
