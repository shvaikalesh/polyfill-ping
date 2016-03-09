(function()
{
    "use strict"

    if (/webkit/i.test(navigator.userAgent)) return

    var tls = "https:" == location.protocol
    var reflect = require("reflect-attribute")
        reflect("ping", [ "a", "area" ])

    function resolve(href)
    {
        if (typeof href == "string")
            try { return new URL(href, location) }
            finally { }

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
                if (tls) options.referrer = location
                else delete options.headers["Ping-From"]

            fetch(url, options)
        })
    })
})()