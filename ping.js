(function()
{
    "use strict"

    if ("ping" in HTMLAnchorElement.prototype)
        if (!navigator.userAgent.includes("Firefox"))
            return module.exports = Function.prototype

    var INTERFACES =
    [
        , "HTMLAnchorElement"
        , "HTMLAreaElement"
    ]

    function polyfill(global)
    {
        var $document = global.document
          , location = global.location
          , fetch = global.fetch

        function _resolve(url)
        {
            try { return new URL(url, location) }
            catch (error) { return "" }
        }

        $document.addEventListener("click", function(event)
        {
            if (event.defaultPrevented) return

            var $link = event.target.closest("a, area")
            if ($link == null || $link.href == "") return

            var href = $link.getAttribute("href")
            if (!_resolve(href)) return

            var ping = $link.ping
                .trim()
                .split(/\s+/)
                .map(_resolve)
                .filter(String)

            ping.forEach(function(url)
            {
                fetch(url,
                {
                    method: "POST",
                    body: "PING"
                })
            })
        })

        INTERFACES.forEach(function(interface)
        {
            var prototype = global[interface].prototype

            Object.defineProperty(prototype, "ping",
            {
                get: function()
                {
                    return this.getAttribute("ping")
                },
                set: function(value)
                {
                    this.setAttribute("ping", value)
                },
                enumerable: true,
                configurable: true
            })
        })
    }

    module.exports =
        polyfill(window),
        polyfill
})()