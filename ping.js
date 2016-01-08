(function()
{
    "use strict"

    if ("ping" in HTMLAnchorElement.prototype)
        if (!navigator.userAgent.includes("Firefox"))
            return module.exports = Function.prototype

    var ELEMENTS =
    [
        , "HTMLAnchorElement"
        , "HTMLAreaElement"
    ]

    function polyfill(global)
    {
        var document = global.document
          , location = global.location
          , fetch = global.fetch

        function resolve(url)
        {
            try { return new URL(url, location) }
            catch (error) { return "" }
        }

        document.addEventListener("click", function(event)
        {
            if (event.defaultPrevented) return

            var $link = event.target.closest("a, area")
            if ($link == null || $link.href == "") return

            var href = $link.getAttribute("href")
            if (!resolve(href)) return

            var ping = $link.ping
                .trim()
                .split(/\s+/)
                .map(resolve)
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
    }

    module.exports =
        polyfill(window),
        polyfill
})()