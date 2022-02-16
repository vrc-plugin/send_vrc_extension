
let urlReplace = (url) =>  {

    const u = new URL(url);
    switch (u.hostname) {
        case 'www.youtube.com':
        case 'm.youtube.com':
            const v = u.searchParams.get("v");
            const a = new URL("https://www.youtube.com/watch");
            a.searchParams.append("v", v)
            return a.toString();
    }

    return u.toString();
}


console.assert(
    urlReplace("https://www.youtube.com/watch?v=QARkl1vfJZ8") === "https://www.youtube.com/watch?v=QARkl1vfJZ8"
)


console.assert(
    urlReplace("https://www.youtube.com/watch?v=tpTwNFE_dXk&list=RDtpTwNFE_dXk&start_radio=1") === "https://www.youtube.com/watch?v=tpTwNFE_dXk",
    "invalid list url " + urlReplace("https://www.youtube.com/watch?v=tpTwNFE_dXk&list=RDtpTwNFE_dXk&start_radio=1")
)


console.assert(
    urlReplace("https://m.youtube.com/watch?v=tpTwNFE_dXk") === "https://www.youtube.com/watch?v=tpTwNFE_dXk",
    "invalid mobile url " + urlReplace("https://www.youtube.com/watch?v=tpTwNFE_dXk")
)