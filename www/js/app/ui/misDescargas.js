comunidadfusa.ui.misDescargas = (function () {

    var storage = window.localStorage;

    function init() {
        var bandasStorage = JSON.parse(storage.getItem("bandasGuardadas"));
        $(".fusa-js-bandas-descargadas").empty();
        if (bandasStorage) {
            $(".fusa-js-bandas-descargadas").append($("#banda-descargada-tmpl").tmpl(bandasStorage));
            comunidadfusa.util.html5HistoryAPI.setupHistoryClicks();
        } else {
            $(".fusa-js-bandas-descargadas").html("<div class='m-sm'>Sin canciones descargadas</div>");
        }
    }

    return {
        init: init
    };

})();