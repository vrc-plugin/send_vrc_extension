import { getUseJinnaiSystem } from "./config";

const CONTEXT_MENUS = {
  SEND_THIS_PAGE: "send_this_page",
  SEND_WITH_CLIPBOARD: "send_with_clipboard",
  OPEN_OPTIONS: "open_options",
};

const ERROR_NOTIFICATION_OPTIONS: chrome.notifications.NotificationOptions<true> =
  {
    type: "basic",
    iconUrl: "./icon.png",
    title: "send_vrc",
    message: "please start send_vrc_desktop.",
  } as const;

const sendUrlToVRC = async (url: string) => {
  let body: { url: string };
  if (await getUseJinnaiSystem()) {
    const jinnaiSystemUrl = new URL("https://nextnex.com/");
    jinnaiSystemUrl.searchParams.set("url", url);
    body = { url: jinnaiSystemUrl.toString() };
  } else {
    body = { url };
  }

  try {
    const res = await fetch("http://localhost:11400/url", {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      cache: "no-cache",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.log(res.statusText);
      chrome.notifications.create(ERROR_NOTIFICATION_OPTIONS);
    }
  } catch (e) {
    console.log(e);
    chrome.notifications.create(ERROR_NOTIFICATION_OPTIONS);
  }
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

chrome.contextMenus.create({
  id: CONTEXT_MENUS.OPEN_OPTIONS,
  title: "Options",
  type: "normal",
  contexts: ["action"],
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  switch (info.menuItemId) {
    case CONTEXT_MENUS.SEND_THIS_PAGE: {
      if (!info.pageUrl) {
        return;
      }

      const url = canonicalizeUrl(info.pageUrl);
      sendUrlToVRC(url);
      break;
    }
    case CONTEXT_MENUS.SEND_WITH_CLIPBOARD: {
      if (tab?.id === undefined) {
        return;
      }

      const clipboardText = await getClipboard(tab.id);
      sendUrlToVRC(clipboardText);
      break;
    }
    case CONTEXT_MENUS.OPEN_OPTIONS: {
      chrome.tabs.create({ url: "options.html" });
      break;
    }
  }
});

chrome.action.onClicked.addListener((e) => {
  if (!e.url) {
    return;
  }

  const url = canonicalizeUrl(e.url);
  sendUrlToVRC(url);
});
