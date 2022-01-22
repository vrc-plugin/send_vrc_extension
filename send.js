(() => {
    const defaultMethod = 'POST';
    let toVRC = (url, method = defaultMethod) => {
        fetch('http://localhost:11400/url', {
            method: method,
            mode: 'cors',
            credentials: 'omit',
            cache: 'no-cache',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({url: url})
        }).catch((e) => {
            console.warn(e);
            // old version compatible.
            if (method !== 'PUT') {
                toVRC(url, 'PUT');
            }
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