/* global comunidadfusa, MusicControls */

comunidadfusa.ui.reproductor = (function () {

    var playlist;
    var reproduciendo;
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
        $(document).on($.jPlayer.event.ended, playlist.cssSelector.jPlayer, function (data) {
            reproduciendo = 0;
            $('.musicbar').removeClass('animate');
            storage.setItem("playlistCurrent", 0);
            comunidadfusa.util.analytics.trackEvent("reproduccion", "end", data.jPlayer.status.media.id, 1);
            MusicControls.destroy();
        });
        $(document).on($.jPlayer.event.loadstart, playlist.cssSelector.jPlayer, function (data) {
            checkAudioDescargado(data);
        });
        $(document).on($.jPlayer.event.playing, playlist.cssSelector.jPlayer, function (data) {
            $('.musicbar').addClass('animate');
            $("#spin").addClass("hide");
            var d = new Date();
            tiempoInicioReproduccionTema = d.getTime();
            reproduciendo = 1;
            storage.setItem("playlistCurrent", playlist.current);
            comunidadfusa.util.analytics.trackEvent("reproduccion", "play", data.jPlayer.status.media.id, 1);
            actualizarControlesDeLaBarra(data.jPlayer.status);
        });
        $(document).on($.jPlayer.event.pause, playlist.cssSelector.jPlayer, function (data) {
            $('.musicbar').removeClass('animate');
            reproduciendo = 0;
            MusicControls.updateIsPlaying(false);
        });
        $(document).on($.jPlayer.event.ready, playlist.cssSelector.jPlayer, function () {
            $('.musicbar').removeClass('animate');
            MusicControls.updateIsPlaying(false);
        });
        $(document).on($.jPlayer.event.timeupdate, playlist.cssSelector.jPlayer, function (data) {
            var d = new Date();
            tiempoActual = d.getTime();
            if (tiempoActual >= tiempoInicioReproduccionTema + 100000) {
                comunidadfusa.service.reproducciones.incrementarReproduccionesAudio(data.jPlayer.status.media.id);
                tiempoInicioReproduccionTema = 999999999999999;
                comunidadfusa.util.analytics.trackEvent("reproduccion", "playInc", data.jPlayer.status.media.id, 1);
            }
        });
    }

    function checkAudioDescargado(data) {
        if (comunidadfusa.ui.activoSoloDescargado()) {
            var archivo = data.jPlayer.status.media.mp3;
            if (archivo.match("^http")) {
                playlist.pause();
                playlist.next();
            }
        }
    }

    function inicializarEventos() {
        $(document).on('click', '.jp-play-me-list', function (e) {
            e && e.preventDefault();
            var id = $(this).data("id");
            comunidadfusa.service.listas.getAudiosListasReproduccion({idListaReproduccion: id}, function (data) {
                if (data.length > 0) {
                    reemplazarPlaylist(data);
                    comunidadfusa.util.analytics.trackEvent("reproducir", "listaUsuario", id, 1);
                }
            });
        });
        $(document).on('click', '.jp-play-me', function (e) {
            e && e.preventDefault();
            var id = $(this).data("id");
            comunidadfusa.service.audios.getAudiosBanda({idBanda: id}, function (data) {
                if (data.length > 0) {
                    reemplazarPlaylist(data);
                    comunidadfusa.util.analytics.trackEvent("reproducir", "banda", id, 1);
                }
            });
        });
        $(document).on('click', '.jp-play-me-one', function (e) {
            e && e.preventDefault();
            var id = $(this).data("id");
            comunidadfusa.service.audios.getAudio(id, function (data) {
                agregarAudios([data]);
                comunidadfusa.util.analytics.trackEvent("reproducir", "cancion", id, 1);
            });
        });
        $(document).on('click', '.jp-play-me-disc', function (e) {
            e && e.preventDefault();
            var id = $(this).data("id");
            comunidadfusa.service.audios.getAudiosDisco(id, function (data) {
                if (data && data.canciones.length > 0) {
                    reemplazarPlaylist(data.canciones);
                    comunidadfusa.util.analytics.trackEvent("reproducir", "disco", id, 1);
                }
            });
        });
        $(document).on('click', '.jp-play-me-mix', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var id = $(this).data("id");
            comunidadfusa.service.audios.getAudiosMixBanda(id, function (audios) {
                if (audios.length > 0) {
                    reemplazarPlaylist(audios);
                    comunidadfusa.util.analytics.trackEvent("reproducir", "mix", id, 1);
                }
            });
        });
        $(document).on('click', '.fusa-js-lista-por-genero', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var idGenero = $(this).data("id-genero");
            comunidadfusa.service.audios.getPorGenero(idGenero, function (audios) {
                if (audios.length > 0) {
                    reemplazarPlaylist(audios);
                    comunidadfusa.util.analytics.trackEvent("reproducir", "genero", idGenero, 1);
                }
            });
        });

        $(document).on('click', '.jp-play-shuffle-descargado', function (e) {
            var audiosIdDescargados = [];
            var audiosAReproducir = [];
            $.each(storage, function (key, value) {
                if (key.match("^descargado")) {
                    audiosIdDescargados.push(key.substr(10));
                }
            });
            audiosIdDescargados = shuffle(audiosIdDescargados);
            var cantidad = 0;
            $.each(audiosIdDescargados, function (key, value) {
                comunidadfusa.service.audios.getAudio(value, function (data) {
                    audiosAReproducir.push(data);
                });
                if (cantidad++ >= 50) {
                    return false;
                }
            });
            reemplazarPlaylist(audiosAReproducir);
            comunidadfusa.util.analytics.trackEvent("reproducir", "descargados", "shuffle", 1);
        });
    }

    function inicializarListasRecomendadas() {
        $(document).on("click", ".fusa-js-lista-recomendada-popular", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var url = comunidadfusa.service.baseURI + "/audios/populares";
            reproducirListaPorUrl(url, "populares");
            return false;
        });
        $(document).on("click", ".fusa-js-lista-recomendada-nuevas", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var url = comunidadfusa.service.baseURI + "/audios/nuevos";
            reproducirListaPorUrl(url, "nuevos");
            return false;
        });
        $(document).on("click", ".fusa-js-lista-recomendada-azar", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var url = comunidadfusa.service.baseURI + "/audios/random";
            reproducirListaPorUrl(url, "random");
            return false;
        });
        $(document).on("click", "#lista-nunca-escuchadas", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var url = comunidadfusa.service.baseURI + "/audios/noescuchados/" + usuario.id;
            reproducirListaPorUrl(url, "noEscuchados");
            return false;
        });
        $(document).on("click", "#lista-mas-escuchadas", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var url = comunidadfusa.service.baseURI + "/audios/playlist/masescuchados/" + usuario.id;
            reproducirListaPorUrl(url, "masEscuchados");
            return false;
        });
        $(document).on("click", "#lista-me-gustan", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var url = comunidadfusa.service.baseURI + "/audios/megustan/" + usuario.id;
            reproducirListaPorUrl(url, "meGustan");
            return false;
        });
        $(document).on("click", "#lista-ultimos-me-gustan", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var url = comunidadfusa.service.baseURI + "/audios/ultimosmegustan/" + usuario.id;
            reproducirListaPorUrl(url, "ultimosMeGustan");
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
            audiosGuardados = JSON.parse(playlistStorage);
        }
        agregarAudiosGuardados(audiosGuardados);
        var playlistCurrent = storage.getItem("playlistCurrent");
        if (playlistCurrent !== null) {
            playlist.select(playlistCurrent);
        }

    }

    function reproducirListaPorUrl(url, label) {
        $("#spin").removeClass("hide");
        comunidadfusa.service.audios.getAudiosPorUrl(url, function (audios) {
            if (audios.length > 0) {
                reemplazarPlaylist(audios);
                comunidadfusa.util.analytics.trackEvent("reproducir", "listaAutomatica", label, 1);
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

    function reemplazarPlaylist(audios) {
        limpiarListaDeReproduccion();
        agregarAudios(audios);
        play();
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
        $(document).on('click', '.fusa-opciones-reproductor .dropdown-menu li a', function (e) {
            $('.fusa-opciones-reproductor').removeClass('open');
        });
        $(document).on("click", ".fusa-js-limpiar-lista-actual", function (e) {
            e.preventDefault();
            e.stopPropagation();
            limpiarListaDeReproduccion();
            comunidadfusa.util.analytics.trackEvent("accion", "reproductor", "limpiar", 1);
            $('.musicbar').removeClass('animate');
            return false;
        });
    }

    function limpiarListaDeReproduccion() {
        playlist.remove();
        $(".jp-progress .jp-seek-bar .jp-title").html("");
        $("#footer-banda-sonando").html("");
        if (comunidadfusa.estaEnEscuchando()) {
            window.location = "index.html";
        }
        storage.removeItem("playlist");
        storage.removeItem("playlistCurrent");
    }

    function play() {
        $('.musicbar').addClass('animate');
        playlist.play();
    }

    function pausa() {
        $('.musicbar').removeClass('animate');
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

    function actualizarControlesDeLaBarra(status) {
        MusicControls.create(obtenerDataTemaActual(status));
        function events(action) {
            switch (action) {
                case 'music-controls-next':
                    playlist.next();
                    break;
                case 'music-controls-previous':
                    playlist.previous();
                    break;
                case 'music-controls-pause':
                    playlist.pause();
                    MusicControls.updateIsPlaying(false);
                    break;
                case 'music-controls-play':
                    playlist.play();
                    MusicControls.updateIsPlaying(true);
                    break;
            }
        }
        MusicControls.subscribe(events);
        // The plugin will run the events function each time an event is fired
        MusicControls.listen();
    }

    function obtenerDataTemaActual(status) {
        var storagePlaylist = JSON.parse(storage.getItem("playlist"));
        var numTemaActual = parseInt(storage.getItem("playlistCurrent"));
        var temaData = {
            track: status.media.title,
            artist: status.media.artist,
            cover: status.media.poster,
            hasPrev: (numTemaActual !== 0),
            hasNext: (numTemaActual !== storagePlaylist.length)
        };
        return temaData;
    }

    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
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
