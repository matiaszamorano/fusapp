comunidadfusa.ui.index = (function () {

    

    function init() {
        if (!comunidadfusa.service.usuario.get()) {
            comunidadfusa.util.html5HistoryAPI.cargarPagina("login.html");
        } else {
            initBienvenida();
        }

    }


    function initBienvenida() {
        var usuario = comunidadfusa.service.usuario.get();
        $("#reproductor").removeClass("hide");
        comunidadfusa.util.html5HistoryAPI.cargarPagina("bienvenida.html");
//        comunidadfusa.util.html5HistoryAPI.cargarPagina("bienvenida.html", function () {
//            comunidadfusa.ui.bienvenida.init();
//        });
        $(".fusa-js-apodo").text(usuario.apodo);
        $(".fusa-js-avatar-usuario").attr("src", comunidadfusa.service.usuario.get().avatar);
        $(document).off("click", "#fusa-js-empeza-a-escuchar");
        $(document).on("click", "#fusa-js-empeza-a-escuchar", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var url = comunidadfusa.service.baseURI + "/audios/populares";
            comunidadfusa.ui.reproductor.reproducirListaPorUrl(url);
        });

    }

    return {
        init: init
    };

})();
