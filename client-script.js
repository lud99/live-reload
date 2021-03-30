(function () {
    let webSocket;

    function refreshCSS() {
        var sheets = [].slice.call(document.getElementsByTagName("link"));
        var head = document.getElementsByTagName("head")[0];
        for (var i = 0; i < sheets.length; ++i) {
            var elem = sheets[i];
            var parent = elem.parentElement || head;
            parent.removeChild(elem);
            var rel = elem.rel;
            if (elem.href && typeof rel != "string" || rel.length == 0 || rel.toLowerCase() == "stylesheet") {
                var url = elem.href.replace(/(&|\?)_cacheOverride=\d+/, '');
                elem.href = url + (url.indexOf('?') >= 0 ? '&' : '?') + '_cacheOverride=' + (new Date().valueOf());
            }
            parent.appendChild(elem);
        }
    }

    function connect() {
        webSocket = new WebSocket("ws://" + window.location.hostname + ":9731");
    }

    connect();

    webSocket.onmessage = msg => {
        if (msg.data == "refresh")
            window.location.reload();
        if (msg.data == "refreshcss")
            refreshCSS();
    }

    webSocket.onclose = function (e) {
        console.log('Refresh socket is closed. Reconnect will be attempted in 3 seconds.', e.reason);
        setTimeout(function () {
            connect();
        }, 3000);
    };

    webSocket.onerror = function (err) {
        console.error('Refresh socket encountered error: ', err.message, 'Closing refresh socket');
        webSocket.close();
    };
})();