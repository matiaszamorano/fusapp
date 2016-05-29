comunidadfusa.ui.reproductor = (function () {

    var playlist;
    var reproduciendo;
    var $botonComienzo;

    function actualizarPosicion() {
        var altura = $(window).height();
        $("#contenedorInfoFusa").css("height", altura - 110)
    }

    function init() {
        inicializarPlaylist();
        inicializarEventos();

        actualizarPosicion();

        $(window).resize(function () {
            actualizarPosicion();
        });

        $botonComienzo = $("#fusa-js-empeza-a-escuchar");

        $(document).on($.jPlayer.event.ended, playlist.cssSelector.jPlayer, function (data) {
            reproduciendo = 0;
            $('.musicbar').removeClass('animate');
        });

        $(document).on($.jPlayer.event.playing, playlist.cssSelector.jPlayer, function () {
            $('.musicbar').addClass('animate');
            $("#spin").addClass("hide");
            reproduciendo = 1;
        });

        $(document).on($.jPlayer.event.pause, playlist.cssSelector.jPlayer, function (data) {
            $('.musicbar').removeClass('animate');
            reproduciendo = 0;
        });

        $(document).on($.jPlayer.event.ready, playlist.cssSelector.jPlayer, function () {
            $('.musicbar').removeClass('animate');
        });

    }

    function inicializarEventos() {
        $(document).on('click', '.jp-play-me-list', function (e) {
            e && e.preventDefault();
            var $this = $(e.target);
            if (!$this.is('a')) {
                $this = $this.closest('a');
            }

            var id = $this.data("id");
            var dataAudiosLista = {
                idListaReproduccion: id,
                success: function (data) {
                    if (data.length > 0) {
                        agregarAudios(data);
                        comunidadfusa.trackEventAnalytics("playLista", "click", "usuario", id);
                    }
                }
            };
            comunidadfusa.service.listas.getAudiosListasReproduccion(dataAudiosLista)
                    .done(function (data) {
                        if (data.length > 0) {
                            agregarAudios(data);
                        }
                    })
                    .fail(function (error) {
                        console.log(error);
                    });
            ;
        });
    }

    function inicializarPlaylist() {
        var playlistOptions = {
            playlistOptions: {
                enableRemoveControls: true,
                autoPlay: false
            },
            swfPath: "/js/libs/jplayer",
            supplied: "mp3",
            smoothPlayBar: true,
            keyEnabled: true,
            audioFullScreen: false,
            solution: ("html, flash")
        };

        playlist = new jPlayerPlaylist({
            jPlayer: "#jplayer_N",
            cssSelectorAncestor: "#jp_container_N"
        }, [], playlistOptions);
    }

    function reproducirListaPorUrl(url) {
        $("#spin").removeClass("hide");
        comunidadfusa.service.audios.getAudiosPorUrl(url)
                .done(function (data) {
                    if (data.length > 0) {
                        agregarAudios(data);
                    }
                })
                .fail(function () {
                    console.log("Error al obtener las canciones");
                });
    }

    function agregarAudios(audios) {
        for (var i = 0; i < audios.length; i++) {
            var audio = audios[i];
            var reproducirAhora = 0;
            if ((i === 0) && !reproduciendo) {
                reproducirAhora = 1;
            }
            playlist.add({
                id: audio.id,
                title: audio.nombreTema,
                artist: audio.nombreBanda,
                mp3: comunidadfusa.MP3_URI + audio.archivo,
                poster: comunidadfusa.baseURI + audio.avatar,
                opinion: audio.opinion,
                ciudad: audio.ciudad,
                url: comunidadfusa.baseURI + "bandas/" + audio.url_fusa
            }, reproducirAhora);
        }
    }

    function play() {
        playlist.play();
    }

    function pausa() {
        playlist.pause();
    }

    function next() {
        $("#spin").removeClass("hide");
        playlist.next();
    }

    function prev() {
        $("#spin").removeClass("hide");
        playlist.previous();
    }

    function getPlayList() {
        return playlist;
    }

    function estaReproduciendo() {
        return reproduciendo;
    }

    return {
        init: init,
        getPlayList: getPlayList,
        reproducirListaPorUrl: reproducirListaPorUrl,
        estaReproduciendo: estaReproduciendo,
        play: play,
        pausa: pausa,
        next: next,
        prev: prev
    };

})();