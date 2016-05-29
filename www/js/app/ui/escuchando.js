comunidadfusa.ui.escuchando = (function () {

    var jPlaylist;
    var playlist;

    function init() {
        console.log("escuchando init");
        jPlaylist = comunidadfusa.ui.reproductor.getPlayList();
        console.log(jPlaylist);
        playlist = jPlaylist.playlist;
        initLista();

        $("#escuchando").on('click', '.jp-play-me-escuchando', function (e) {
            e && e.preventDefault();
            var $this = $(this);
            if ($this.hasClass("active")) { /* Pausa */
                jPlaylist.pause();
            } else if ($this.parent().hasClass("active")) { /* Play actual */
                jPlaylist.play();
            } else { /* Play otro tema */
                var index = $this.parent().data("index");
                jPlaylist.play(index);
            }
        });

        $("#escuchando").on('click', '.jp-remove-me-escuchando', function (e) {
            e && e.preventDefault();
            var $this = $(this);
            var index = $this.parent().data("index");
            if (jPlaylist.remove(index)) {
                setTimeout(function () {
                    initLista();
                    if (index === jPlaylist.current) {
                        jPlaylist.play();
                    }
                }, 500);
            }
            $this.parent().remove();
        });

        $(document).on($.jPlayer.event.play, jPlaylist.cssSelector.jPlayer, function (data) {
            if ($("#escuchando-lista li").length == 0) {
                initLista();
            }
            $("#escuchando-lista li").removeClass("active");
            $("#escuchando-lista li a.jp-play-me-escuchando").removeClass("active");
            activarItemActual();
        });

        $(document).on($.jPlayer.event.pause, jPlaylist.cssSelector.jPlayer, function (data) {
            $("#escuchando-lista li a.jp-play-me-escuchando").removeClass("active");
        });
    }

    function initLista() {
        $("#escuchando-lista").empty().append(
                $("#escuchando-cancion-tmpl").tmpl({
            playlist: playlist,
            actual: jPlaylist.current
        }));
        if (comunidadfusa.ui.reproductor.estaReproduciendo()) {
            activarItemActual();
        }
    }

    function activarItemActual() {
        var $itemActual = $("#escuchando-lista li[data-index='" + jPlaylist.current + "']");
        $itemActual.addClass("active");
        $itemActual.children("a.jp-play-me-escuchando").addClass("active");
        $("#fusa-portada-banda-actual").empty().append(
                $("#fusa-portada-tema-actual-tmpl").tmpl(jPlaylist.playlist[jPlaylist.current])
                );
    }


    return {
        init: init
    };

})();