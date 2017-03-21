comunidadfusa.ui.bienvenida = (function () {

    function init() {
        comunidadfusa.service.listas.getListasHome(function (listas) {

            $(".js-lista-semanal").append($("#listasSemanalesTmpl").tmpl(listas));

            inicializarSliders();

            setImagenesEnListas();
        });

    }

    function inicializarSliders() {
        $('.js-lista-semanal').slick({
            mobileFirst: true,
            arrows: false,
            slidesToShow: 2.3,
            infinite: false,
            swipeToSlide: true,
            centerMode: false,
            responsive: [
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 3.5
                    }
                }
            ]
        });
        $('.js-lista-generos').slick({
            mobileFirst: true,
            arrows: false,
            slidesToShow: 2.3,
            infinite: false,
            swipeToSlide: true,
            responsive: [
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 3.5
                    }
                }
            ]
        });
    }

    function setImagenesEnListas() {
        var listasSemanales = $('.js-lista-semanal .item-overlay');

        $.each(listasSemanales, function (i, lista) {
            var $lista = $(lista);
            var urlImagen = $lista.data('imagen');
            $lista.css('background-image', "url('" + urlImagen + "')");
        });
    }

    return {
        init: init
    };

})();