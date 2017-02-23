comunidadfusa.ui.disco = (function () {

    function init() {
        var idDisco = comunidadfusa.getUrlParameter("id");

        comunidadfusa.service.discos.getDisco(idDisco)
                .done(function (data) {
                    $(".fusa-js-titulo-disco").text(data.nombre);
                    $(".jp-play-me-disc").data("id", idDisco);
                    $imagen = $(".fusa-js-imagen-disco");
                    $imagen.attr("src", "http://www.comunidadfusa.com/" + data.avatar);

                    $(".fusa-js-lista-canciones-disco").empty();
                    $(".fusa-js-lista-canciones-disco").append($("#cancion-disco-tmpl").tmpl(data.canciones));

                })
                .fail(function (error) {
                    console.log(error);
                });
    }

    return {
        init: init
    };

})();