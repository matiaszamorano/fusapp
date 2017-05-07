comunidadfusa.util.analytics = (function () {

    function track(url) {
        if (typeof ga !== 'undefined') {
            ga('set', 'page', '/' + url);
            ga('send', 'pageview');
        }
    }

    function trackEvent(category, tipo, label, value) {
        if (typeof ga !== 'undefined') {
            ga('send', 'event', category, tipo, label, value);
        }
    }

    return {
        track: track,
        trackEvent: trackEvent
    };
})();