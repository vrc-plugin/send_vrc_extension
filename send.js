(() => {
    let toVRC = (url) => {
        let textArea = document.createElement('textarea');
        document.body.appendChild(textArea);
        textArea.value = url;
        textArea.select();
        document.execCommand('copy');

        fetch("http://localhost:11400/paste", {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
        }).catch((e) => {
            console.error(e)
        });
    }

    chrome.contextMenus.create({
        title: 'SendVRC this page',
        type: 'normal',
        contexts: ['all'],
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