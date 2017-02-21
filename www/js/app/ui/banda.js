comunidadfusa.ui.banda = (function () {

    function init() {
        var idBanda = comunidadfusa.getUrlParameter("id");
        comunidadfusa.service.bandas.getBanda(idBanda)
                .done(function (data) {
                    $(".fusa-js-nombre-banda").text(data.nombre);
                    $(".fusa-js-ciudad-banda").text(data.ciudad);
                    $imagen = $(".fusa-js-imagen-banda");
                    $imagen.attr("src", "http://www.comunidadfusa.com/" + data.avatar_grande);
                    console.log(data);
                })
                .fail(function (error) {
                    console.log(error);
                });
    }


    return {
        init: init
    };

})();