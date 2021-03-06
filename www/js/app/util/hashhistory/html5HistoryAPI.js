comunidadfusa.util.html5HistoryAPI = (function () {

    var timer;

    function supports_history_api() {
        return !!(window.history && history.pushState);
    }

    function cargarPagina(href, onComplete) {
        if (href === "escuchando.html") {
            if (comunidadfusa.estaEnEscuchando()) {
                return false;
            }
        }
        jQuery.ajax({
            type: 'GET',
            dataType: 'html',
            success: function (data, textStatus) {
                $('#contenedorInfoFusa').empty();
                $('#contenedorInfoFusa').html(data);
                $('#nav').removeClass("nav-off-screen");
                $('#contenedorInfoFusa').scrollTop(0);
                comunidadfusa.util.analytics.track(href);
            },
            beforeSend: function (XMLHttpRequest) {
            },
            complete: function (XMLHttpRequest, textStatus) {
                setupHistoryClicks();
            },
            url: href
        });
        return true;
    }

    function addClicker($link) {
        $link.on("click", function (e) {
            if (cargarPagina($link.attr("href"))) {
                history.pushState(null, null, $link.attr("href"));
                e.preventDefault();
            }
        });
    }

    function setupHistoryClicks() {
        $('a[rel=ajax][ready!=1]').unbind("click"); //revisar, sino se encadenaban
        $('a[rel=ajax][ready!=1]').each(function () {
            addClicker($(this));
            $(this).attr("ready", 1);
        });
    }

    function init() {
        if (!supports_history_api()) {
            return;
        }
        setupHistoryClicks();
        window.clearTimeout(timer);
        timer = window.setTimeout(function () {
            window.addEventListener("popstate", function (e) {
                if (location.pathname.endsWith("index.html")) {
                    comunidadfusa.ui.index.init();
                } else {
                    cargarPagina(location.pathname);
                }
            }, false);
        }, 1);
    }

    return {
        init: init,
        setupHistoryClicks: setupHistoryClicks,
        cargarPagina: cargarPagina
    };
})();