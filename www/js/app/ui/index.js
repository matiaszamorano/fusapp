comunidadfusa.ui.index = (function () {

    function init() {
        if (!comunidadfusa.service.usuario.get()) {
            comunidadfusa.util.html5HistoryAPI.cargarPagina("login.html");
        } else {
            initBienvenida();
        }
    }


    function initBienvenida() {
        $("#reproductor").removeClass("hide");
        comunidadfusa.util.html5HistoryAPI.cargarPagina("bienvenida.html");
        $(".fusa-js-apodo").text(comunidadfusa.service.usuario.get().apodo);
        $(".fusa-js-avatar-usuario").attr("src", comunidadfusa.service.usuario.get().avatar);
        $(document).on("click", "#fusa-js-empeza-a-escuchar", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var url = comunidadfusa.service.baseURI + "/audios/populares";
            comunidadfusa.ui.reproductor.reproducirListaPorUrl(url);
        });
        $(document).on("click", "#fusa-js-logout", function (e) {
            e.preventDefault();
            e.stopPropagation();
            comunidadfusa.service.usuario.logout();
            window.location.reload(true);
        });
        $(document).on("click", "a[rel='ajax']", function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("rel ajax");
            comunidadfusa.util.html5HistoryAPI.cargarPagina($(this).attr("href"));
            return false;
        });

    }

    return {
        init: init
    };

})();