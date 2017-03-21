comunidadfusa.ui.reproductor = (function () {

    var playlist;
    var reproduciendo;
    var $botonComienzo;
    var usuario;
    var storage = window.localStorage;
    var tiempoInicioReproduccionTema;

    function actualizarPosicion() {
        var altura = $(window).height();
        $("#contenedorInfoFusa").css("height", altura - 110);
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
            storage.setItem("playlistCurrent", 0);
        });

        $(document).on($.jPlayer.event.playing, playlist.cssSelector.jPlayer, function () {
            $('.musicbar').addClass('animate');
            $("#spin").addClass("hide");
            var d = new Date();
            tiempoInicioReproduccionTema = d.getTime();
            reproduciendo = 1;
            storage.setItem("playlistCurrent", playlist.current);
        });

        $(document).on($.jPlayer.event.pause, playlist.cssSelector.jPlayer, function (data) {
            $('.musicbar').removeClass('animate');
            reproduciendo = 0;
        });

        $(document).on($.jPlayer.event.ready, playlist.cssSelector.jPlayer, function () {
            $('.musicbar').removeClass('animate');
        });

        $(document).on($.jPlayer.event.timeupdate, playlist.cssSelector.jPlayer, function (data) {
            var d = new Date();
            tiempoActual = d.getTime();
            if (tiempoActual >= tiempoInicioReproduccionTema + 100000) {
                comunidadfusa.service.reproducciones.incrementarReproduccionesAudio(data.jPlayer.status.media.id);
                tiempoInicioReproduccionTema = 999999999999999;
            }
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
            comunidadfusa.service.listas.getAudiosListasReproduccion({idListaReproduccion: id}, function (data) {
                if (data.length > 0) {
                    agregarAudios(data);
                }
            });
        });

        $(document).on('click', '.jp-play-me', function (e) {
            e && e.preventDefault();
            var $this = $(e.target);

            if (!$this.is('a')) {
                $this = $this.closest('a');
            }

            var id = $this.data("id");
            comunidadfusa.service.audios.getAudiosBanda({idBanda: id}, function (data) {
                if (data.length > 0) {
                    agregarAudios(data);
                }
            });
        });

        $(document).on('click', '.jp-play-me-one', function (e) {
            e && e.preventDefault();
            var $this = $(e.target);
            if (!$this.is('a')) {
                $this = $this.closest('a');
            }

            var id = $this.data("id");
            comunidadfusa.service.audios.getAudio(id, function (data) {
                agregarAudios([data]);
            });
        });
        $(document).on('click', '.jp-play-me-disc', function (e) {
            e && e.preventDefault();
            var $this = $(e.target);
            if (!$this.is('a')) {
                $this = $this.closest('a');
            }
            var id = $this.data("id");
            comunidadfusa.service.audios.getAudiosDisco(id, function (data) {
                if (data && data.canciones.length > 0) {
                    agregarAudios(data.canciones);
                }
            });
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

        var playlistStorage = storage.getItem("playlist");
        var audiosGuardados = new Array();
        if (playlistStorage !== null) {
            audiosGuardados = JSON.parse(storage.getItem("playlist"));
        }
        agregarAudiosGuardados(audiosGuardados);
        var playlistCurrent = storage.getItem("playlistCurrent");
        if (playlistCurrent !== null) {
            playlist.select(playlistCurrent);
        }
    }

    function reproducirListaPorUrl(url) {
        $("#spin").removeClass("hide");
        comunidadfusa.service.audios.getAudiosPorUrl(url, function (data) {
            if (data.length > 0) {
                agregarAudios(data);
            }
        });
    }

    function agregarAudiosGuardados(audios) {
        for (var i = 0; i < audios.length; i++) {
            var audio = audios[i];
            playlist.add(audio, 0);
        }
    }

    function agregarAudios(audios) {
        for (var i = 0; i < audios.length; i++) {
            var audio = audios[i];
            var reproducirAhora = 0;
            var mp3;
            if ((i === 0) && !reproduciendo) {
                reproducirAhora = 1;
            }
            var rutaAudioDescargado = comunidadfusa.service.audios.getDescargado(audio.id);
            if (rutaAudioDescargado === null) {
                mp3 = comunidadfusa.MP3_URI + audio.archivo;
            } else {
                mp3 = rutaAudioDescargado;
            }
            var audioAAgregar = {
                id: audio.id,
                title: audio.nombreTema,
                artist: audio.nombreBanda,
                mp3: mp3,
                poster: comunidadfusa.baseURI + audio.avatar,
                opinion: audio.opinion,
                ciudad: audio.ciudad,
                idBanda: audio.idBanda
            };
            playlist.add(audioAAgregar, reproducirAhora);
            agregarAudioAStorage(audioAAgregar);
        }
    }

    function actualizarPlaylist() {
        storage.setItem("playlist", JSON.stringify(playlist.playlist));
    }

    function agregarAudioAStorage(audio) {
        var playlistStorage = storage.getItem("playlist");
        var audiosGuardados = new Array();
        if (playlistStorage !== null) {
            audiosGuardados = JSON.parse(storage.getItem("playlist"));
        }
        audiosGuardados.push(audio);
        storage.setItem("playlist", JSON.stringify(audiosGuardados));
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
            storage.removeItem("playlist");
            storage.removeItem("playlistCurrent");
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
        prev: prev,
        actualizarPlaylist: actualizarPlaylist
    };

})();