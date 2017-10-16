comunidadfusa.ui.index = (function () {



    function init() {
        if (!comunidadfusa.service.usuario.get()) {
            $("#fusa-js-carrusel").swipe({
                swipeRight: function () {
                    $(this).carousel('prev');
                },
                swipeLeft: function () {
                    $(this).carousel('next');
                },
            });
            $(document).on("click", "#fusa-js-empezar-a-utilizar", function () {
                comunidadfusa.util.analytics.trackEvent("empezar", "login", "empezar", 1);
                comunidadfusa.util.html5HistoryAPI.cargarPagina("login.html");
                $("#intro-bienvenida").hide();
                return false;
            });

        } else {
            $("#intro-bienvenida").hide();
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
