(() => {
  const CONTEXT_MENUS = {
    SEND_THIS_PAGE: "send_this_page",
    SEND_WITH_CLIPBOARD: "send_with_clipboard",
  };

  const defaultMethod = "POST";
  const toVRC = (url: string, method: string = defaultMethod) => {
    fetch("http://localhost:11400/url", {
      method: method,
      mode: "cors",
      credentials: "omit",
      cache: "no-cache",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: url }),
    })
      .then((res) => {
        if (!res.ok && method !== "PUT") {
          toVRC(url, "PUT");
        }

        if (!res.ok && method === "PUT") {
          window.alert("please start send_vrc_desktop.");
        }
      })
      .catch((e) => {
        console.log(e, method);
        // old version compatible.
        if (method !== "PUT") {
          toVRC(url, "PUT");
        }
        if (method === "PUT") {
          window.alert("please start send_vrc_desktop.");
        }
      });
  };

  const getClipboard = async (tabId: number) => {
    const result = await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => navigator.clipboard.readText(),
    });
    return result[0].result;
  };

  const canonicalizeUrl = (url: string) => {
    const u = new URL(url);
    switch (u.hostname) {
      case "youtube.com":
      case "www.youtube.com":
      case "m.youtube.com": {
        const v = u.searchParams.get("v");
        const allowURL = new URL("https://www.youtube.com/watch");
        if (v) {
          allowURL.searchParams.append("v", v);
        }
        return allowURL.toString();
      }
      default:
        return u.toString();
    }
  };

  chrome.contextMenus.create({
    id: CONTEXT_MENUS.SEND_THIS_PAGE,
    title: "SendVRC this page",
    type: "normal",
    contexts: ["page"],
  });

  chrome.contextMenus.create({
    id: CONTEXT_MENUS.SEND_WITH_CLIPBOARD,
    title: "SendVRC with clipboard",
    type: "normal",
    contexts: ["action"],
  });

  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    switch (info.menuItemId) {
      case CONTEXT_MENUS.SEND_THIS_PAGE: {
        if (!info || !info["pageUrl"]) {
          return;
        }
        const pageURL = info["pageUrl"];
        toVRC(pageURL);
        break;
      }
      case CONTEXT_MENUS.SEND_WITH_CLIPBOARD: {
        if (!tab || tab.id === undefined) {
          return;
        }
        const clipboardText = await getClipboard(tab.id);
        toVRC(clipboardText);
        break;
      }
    }
  });

  chrome.action.onClicked.addListener((e) => {
    if (!e || !e["url"]) {
      return;
    }
    const url = canonicalizeUrl(e["url"]);
    toVRC(url);
  });
})();
