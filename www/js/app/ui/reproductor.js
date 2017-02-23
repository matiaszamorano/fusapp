comunidadfusa.ui.reproductor = (function () {

    var playlist;
    var reproduciendo;
    var $botonComienzo;
    var usuario;

    function actualizarPosicion() {
        var altura = $(window).height();
        $("#contenedorInfoFusa").css("height", altura - 110)
    }

    function init() {
        inicializarPlaylist();
        inicializarEventos();
        inicializarListasRecomendadas();
        inicializarOpcionesReproductor();
        usuario = comunidadfusa.service.usuario.get();

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
            comunidadfusa.service.listas.getAudiosListasReproduccion({idListaReproduccion: id})
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

        $(document).on('click', '.jp-play-me', function (e) {
            console.log("playhmeee");
            e && e.preventDefault();
            var $this = $(e.target);

            if (!$this.is('a')) {
                $this = $this.closest('a');
            }

            var id = $this.data("id");
            comunidadfusa.service.audios.getAudiosBanda({idBanda: id})
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

        $(document).on('click', '.jp-play-me-disc', function (e) {
            e && e.preventDefault();
            var $this = $(e.target);
            if (!$this.is('a')) {
                $this = $this.closest('a');
            }
            var id = $this.data("id");
            comunidadfusa.service.audios.getAudiosDisco(id)
                    .done(function (data) {
                        console.log(data);
                        if (data && data.canciones.length > 0) {
                            agregarAudios(data.canciones);
                        }
                    })
                    .fail(function (error) {
                        console.log(error);
                    });
            ;
        });
    }

    function inicializarListasRecomendadas() {
        $(document).on("click", ".fusa-js-lista-recomendada-popular", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var url = comunidadfusa.service.baseURI + "/audios/populares";
            reproducirListaPorUrl(url);
            return false;
        });

        $(document).on("click", ".fusa-js-lista-recomendada-nuevas", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var url = comunidadfusa.service.baseURI + "/audios/nuevos";
            reproducirListaPorUrl(url);
            return false;
        });

        $(document).on("click", ".fusa-js-lista-recomendada-azar", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var url = comunidadfusa.service.baseURI + "/audios/random";
            reproducirListaPorUrl(url);
            return false;
        });

        $(document).on("click", "#lista-nunca-escuchadas", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var url = comunidadfusa.service.baseURI + "/audios/noescuchados/" + usuario.id;
            reproducirListaPorUrl(url);
            return false;
        });

        $(document).on("click", "#lista-mas-escuchadas", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var url = comunidadfusa.service.baseURI + "/audios/playlist/masescuchados/" + usuario.id;
            reproducirListaPorUrl(url);
            return false;
        });

        $(document).on("click", "#lista-me-gustan", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var url = comunidadfusa.service.baseURI + "/audios/megustan/" + usuario.id;
            ;
            reproducirListaPorUrl(url);
            return false;
        });

        $(document).on("click", "#lista-ultimos-me-gustan", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var url = comunidadfusa.service.baseURI + "/audios/ultimosmegustan/" + usuario.id;
            ;
            reproducirListaPorUrl(url);
            return false;
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
                idBanda: audio.idBanda
            }, reproducirAhora);
        }
    }

    function inicializarOpcionesReproductor() {
        $(document).on("click", ".fusa-js-limpiar-lista-actual", function (e) {
            e.preventDefault();
            e.stopPropagation();
            playlist.remove();
            $(".jp-progress .jp-seek-bar .jp-title").html("");
            $("#footer-banda-sonando").html("");
            if (comunidadfusa.estaEnEscuchando()) {
                window.location = "index.html";
            }
            return false;
        });

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