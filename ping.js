(function()
{
    "use strict"

    if (/webkit/i.test(navigator.userAgent))
        return module.exports = Object

    var ELEMENTS =
    [
        , "HTMLAnchorElement"
        , "HTMLAreaElement"
    ]

    function polyfill(global)
    {
        var document = global.document
          , location = global.location
          , secure = location.protocol == "https:"
          , fetch = global.fetch

        function resolve(url)
        {
            if (typeof url == "string")
            {
                try { return new URL(url, location) }
                finally { }
            }

            return ""
        }

        document.addEventListener("click", function(event)
        {
            if (event.defaultPrevented) return

            var $link = event.target.closest("a, area")
            if ($link == null) return

            var href = resolve($link.getAttribute("href"))
            if (href == "") return

            var ping = $link.ping
                .trim()
                .split(/\s+/)
                .map(resolve)
                .filter(String)

            ping.forEach(function(url)
            {
                var options =
                {
                    method: "POST",
                    headers:
                    {
                        "Ping-From": location,
                        "Ping-To": href
                    },
                    referrer: "no-referrer",
                    body: "PING"
                }

                if (url.origin != location.origin)
                    if (secure) options.referrer = location
                    else delete options.headers["Ping-From"]

                fetch(url, options)
            })
        })

        ELEMENTS.forEach(function(element)
        {
            var prototype = global[element].prototype

            Object.defineProperty(prototype, "ping",
            {
                get: function()
                {
                    return this.getAttribute("ping") || ""
                },
                set: function(value)
                {
                    this.setAttribute("ping", value)
                },
                enumerable: true,
                configurable: true
            })
        })

        return global
    }

    module.exports =
        polyfill(window) &&
        polyfill
})()