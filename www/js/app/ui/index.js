comunidadfusa.ui.index = (function () {



    function init() {
        if (!comunidadfusa.service.usuario.get()) {
//            comunidadfusa.util.html5HistoryAPI.cargarPagina("bienvenida.html");
        } else {
            initHome();
            comunidadfusa.util.parches.init();
        }

    }


    function initHome() {
        var usuario = comunidadfusa.service.usuario.get();
        $("#reproductor").removeClass("hide");
        comunidadfusa.util.html5HistoryAPI.cargarPagina("home.html");
        $(".fusa-js-apodo").text(usuario.apodo);
        $(".fusa-js-avatar-usuario").attr("src", comunidadfusa.service.usuario.get().avatar);

    }

    return {
        init: init
    };

})();
