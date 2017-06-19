comunidadfusa.ui.index = (function () {



    function init() {
        if (!comunidadfusa.service.usuario.get()) {
            comunidadfusa.util.html5HistoryAPI.cargarPagina("login.html");
        } else {
            initBienvenida();
            comunidadfusa.util.parches.init();
        }

    }


    function initBienvenida() {
        var usuario = comunidadfusa.service.usuario.get();
        $("#reproductor").removeClass("hide");
        comunidadfusa.util.html5HistoryAPI.cargarPagina("bienvenida.html");
        $(".fusa-js-apodo").text(usuario.apodo);
        $(".fusa-js-avatar-usuario").attr("src", comunidadfusa.service.usuario.get().avatar);

    }

    return {
        init: init
    };

})();
