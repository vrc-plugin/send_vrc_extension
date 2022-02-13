(() => {
    const defaultMethod = 'POST';
    let toVRC = (url, method = defaultMethod) => {
        const url = urlReplace(reciveUrl)
        fetch('http://localhost:11400/url', {
            method: method,
            mode: 'cors',
            credentials: 'omit',
            cache: 'no-cache',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({url: url})
        }).then((res) => {
            if (!res.ok && method !== 'PUT') {
                toVRC(url, 'PUT');
            }

            if (!res.ok && method === 'PUT') {
                window.alert('please start send_vrc_desktop.');
            }
        }).catch((e) => {
            console.log(e, method);
            // old version compatible.
            if (method !== 'PUT') {
                toVRC(url, 'PUT');
            }
            if (method === 'PUT') {
                window.alert('please start send_vrc_desktop.');
            }
        });
    }
    let getClipboard = () =>  {
        const pasteTarget = document.createElement('div');
        pasteTarget.contentEditable = 'true';
        const actElem = document.activeElement.appendChild(pasteTarget).parentNode;
        pasteTarget.focus();
        document.execCommand('Paste', null, null);
        const paste = pasteTarget.innerText;
        actElem.removeChild(pasteTarget);
        return paste;
    }
    //String replacement process for URLs
    let urlReplace = (url) =>  {
        return url.replace(/&list.*/, '');
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

    chrome.contextMenus.create({
        title: 'SendVRC with clipboard',
        type: 'normal',
        contexts: ['browser_action'],
        onclick: () => {
            toVRC(getClipboard());
        }
    })

    chrome.browserAction.onClicked.addListener((e) =>{
        if (!e || !e['url']) {
            return;
        }
        toVRC(e['url'])
    });
})()