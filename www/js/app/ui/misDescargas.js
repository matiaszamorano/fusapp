comunidadfusa.ui.misDescargas = (function () {
    
    var storage = window.localStorage;

    function init() {
        var bandasStorage = JSON.parse(storage.getItem("bandasGuardadas"));
        $(".fusa-js-bandas-descargadas").empty();
        $(".fusa-js-bandas-descargadas").append($("#banda-descargada-tmpl").tmpl(bandasStorage));
        comunidadfusa.util.html5HistoryAPI.setupHistoryClicks();
    }

    return {
        init: init
    };

})();