comunidadfusa.util.analytics = (function () {

    function track(url) {
        ga('set', 'page', '/' + url);
        ga('send', 'pageview');
    }

    function trackEvent(category, tipo, label, value) {
        ga('send', 'event', category, tipo, label, value);
    }

    return {
        track: track,
        trackEvent: trackEvent
    };
})();