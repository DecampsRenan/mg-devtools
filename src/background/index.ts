import { Storage } from '@plasmohq/storage';

async function updateRewriteRules(regex: string) {
  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [
      {
        id: 1,
        action: {
          type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
          requestHeaders: [
            {
              header: 'COOKIE_MYGREFFE_AUTH',
              operation: chrome.declarativeNetRequest.HeaderOperation.SET,
              value: 'coucou',
            },
          ],
        },
        condition: {
          regexFilter: regex,
        },
      },
    ],
  });
}

(async () => {
  const storage = new Storage();
  storage.watch({
    urlRegex: (value) => {
      updateRewriteRules(value.newValue);
    },
  });
})();

export {};
