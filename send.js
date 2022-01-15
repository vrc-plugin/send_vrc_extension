(() => {
    let toVRC = (url) => {
        fetch("http://localhost:11400/url", {
            method: "PUT",
            mode: "cors",
            credentials: 'omit',
            cache: "no-cache",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({url: url})
        }).catch((e) => {
            console.log(e);
        });
    }

    chrome.contextMenus.create({
        title: 'SendVRC this page',
        type: 'normal',
        contexts: ['page'],
        onclick: (info, tab) => {
            if (!info || !info['pageUrl']) {
                return;
            }
            const pageURL = info['pageUrl'];
            toVRC(pageURL);
        }
    })

    chrome.browserAction.onClicked.addListener((e) =>{
        if (!e || !e['url']) {
            return;
        }
        toVRC(e['url'])
    });
})()