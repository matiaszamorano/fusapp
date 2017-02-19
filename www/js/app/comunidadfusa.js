var comunidadfusa = (function () {
    var BASE_URI = baseURI();
    var MP3_URI = mp3URI();
    var BASE_URI_HASH = baseURIHash();

    function baseURI() {
        return "http://www.comunidadfusa.com/";
    }

    function mp3URI() {
        return "https://storage.googleapis.com/audiosfusa/";
    }

    function baseURIHash() {
        if (baseURIHashLayout) {
            return baseURIHashLayout;
        }
        //no base found in document, use relative URIs
        return "";
    }

    function estaEnEscuchando() {
        var estoyEnEscuchando = window.location.pathname;
        return estoyEnEscuchando === "/fusapp/escuchando.html";
    }

    return {
        baseURI: BASE_URI,
        baseURIHash: BASE_URI_HASH,
        MP3_URI: MP3_URI,
        estaEnEscuchando: estaEnEscuchando
    };
})();