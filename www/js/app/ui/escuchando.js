comunidadfusa.ui.escuchando = (function () {

    var jPlaylist;
    var playlist;

    function init() {
        jPlaylist = comunidadfusa.ui.reproductor.getPlayList();
        playlist = jPlaylist.playlist;
        initLista();

        $("#escuchando").on('click', '.jp-play-me-escuchando', function (e) {
            e && e.preventDefault();
            var $this = $(this);
            if ($this.hasClass("active")) { /* Pausa */
                jPlaylist.pause();
                $('.fusa-js-music-bar').removeClass('animate');
            } else if ($this.parent().hasClass("active")) { /* Play actual */
                jPlaylist.play();
                $('.fusa-js-music-bar').addClass('animate');
            } else { /* Play otro tema */
                var index = $this.parent().data("index");
                jPlaylist.play(index);
            }
        });

        $("#escuchando").on('click', '.js-cancion-me-gusta', function (e) {
            e && e.preventDefault();
            var $this = $(this);
            var index = $this.parent().data("index");
            var idAudio = $this.parent().data("id");
            if (playlist[index].opinion == 1) {
                $this.find("i").removeClass("text-success");
                $this.find("i").removeClass("fa-thumbs-up");
                $this.find("i").addClass("text-muted");
                $this.find("i").addClass("fa-thumbs-o-up");
            } else {
                $this.find("i").removeClass("text-muted");
                $this.find("i").removeClass("fa-thumbs-o-up");
                $this.find("i").addClass("text-success");
                $this.find("i").addClass("fa-thumbs-up");
            }
            comunidadfusa.service.audios.guardarOpinionAudioUsuario({
                audio_id: idAudio,
                megusta: 1
            }).done(function (data) {
                if (data == 1) {
                    playlist[index].opinion = data;
                    comunidadfusa.util.analytics.trackEvent("meGusta", "1", idAudio, 1);
                } else {
                    playlist[index].opinion = null;
                    comunidadfusa.util.analytics.trackEvent("meGusta", "0", idAudio, 1);
                }
            });
        });

        $(document).off($.jPlayer.event.play, jPlaylist.cssSelector.jPlayer);
        $(document).on($.jPlayer.event.play, jPlaylist.cssSelector.jPlayer, function (data) {
            if ($("#escuchando-lista li").length == 0) {
                initLista();
            }
            $("#escuchando-lista li").removeClass("active");
            $("#escuchando-lista li a.jp-play-me-escuchando").removeClass("active");
            activarItemActual();
        });

        $(document).off($.jPlayer.event.pause, jPlaylist.cssSelector.jPlayer);
        $(document).on($.jPlayer.event.pause, jPlaylist.cssSelector.jPlayer, function (data) {
            $("#escuchando-lista li a.jp-play-me-escuchando").removeClass("active");
            $('.fusa-js-music-bar').removeClass('animate');
        });
    }

    function initLista() {
        $("#escuchando-lista").empty().append(
                $("#escuchando-cancion-tmpl").tmpl({
            playlist: playlist,
            actual: jPlaylist.current
        }));
        activarSwipeEliminar();
        activarSwipeNextPrev();
        comunidadfusa.util.html5HistoryAPI.setupHistoryClicks();
        if (comunidadfusa.ui.reproductor.estaReproduciendo()) {
            activarItemActual();
        }
    }

    function activarSwipeEliminar() {
        $(".list-group-item").swipe({
            swipeRight: function (event, direction, distance, duration, fingerCount, fingerData) {
                var $this = $(this);
                var index = $this.data("index");
                $this.css({'right': '0px', 'left': ''}).animate({
                    'left': '350px'
                });
                if (jPlaylist.remove(index)) {
                    setTimeout(function () {
                        initLista();
                        comunidadfusa.ui.reproductor.actualizarPlaylist();
                        if (index === jPlaylist.current) {
                            jPlaylist.play();
                        }
                        if (playlist.length == 0) {
                            window.location = "index.html";
                        }
                    }, 500);
                }
            }
        });
    }

    function activarSwipeNextPrev() {
        $(".fusa-foto-perfil").swipe({
            swipeRight: function (event, direction, distance, duration, fingerCount, fingerData) {
                comunidadfusa.ui.reproductor.prev();
            },
            swipeLeft: function (event, direction, distance, duration, fingerCount, fingerData) {
                comunidadfusa.ui.reproductor.next();
            },
        });
    }

    function activarItemActual() {
        var $itemActual = $("#escuchando-lista li[data-index='" + jPlaylist.current + "']");
        $itemActual.addClass("active");
        $itemActual.children("a.jp-play-me-escuchando").addClass("active");
        $("#fusa-portada-banda-actual-escuchando").empty().append($("#fusa-portada-tema-actual-tmpl").tmpl(jPlaylist.playlist[jPlaylist.current]));
        comunidadfusa.util.html5HistoryAPI.setupHistoryClicks();
    }


    return {
        init: init
    };

})();