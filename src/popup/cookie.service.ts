import { useQuery } from '@tanstack/react-query';

import { sendToBackground } from '@plasmohq/messaging';

export const useCookie = (label: string) =>
  useQuery<chrome.cookies.Cookie[]>({
    queryKey: ['cookie', label],
    queryFn: () =>
      sendToBackground({
        name: 'getCookieValue',
        body: {
          name: label,
        },
      }),
  });

export async function removeRule(id) {
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [id],
  });
}

export async function getNextRuleId() {
  const rules = await chrome.declarativeNetRequest.getDynamicRules();
  return Math.max(1, ...rules.map((rule) => rule.id)) + 1;
}

/**
 * Fonction used to update a new rule
 * if conditionType === 'regexFilter', any regex can work
 * if conditionType === 'urlFilter', the following syntax can be used:
 *   - `*` Wildcard: Matches any number of characters.
 *   - `|` Left/right anchor: If used at either end of the pattern, specifies the beginning/end of the url respectively.
 *   - `||` Domain name anchor: If used at the beginning of the pattern, specifies the start of a (sub-)domain of the URL.
 *   - `^` Separator character: This matches anything except a letter, a digit or one of the following: `_` `-` `.` `%`. This can also match the end of the URL.
 *
 * Therefore `urlFilter` is composed of the following parts: `(optional Left/Domain name anchor) + pattern + (optional Right anchor)`.
 * If omitted, all urls are matched. An empty string is not allowed.
 * A pattern beginning with `||*` is not allowed. Use `*` instead.
 *
 * | urlFilter         | Matches                                                 | Does not match                                            |
 * |-------------------|---------------------------------------------------------|-----------------------------------------------------------|
 * | "abc"             | `https://abcd.com`, `https://example.com/abcd`          | `https://ab.com`                                          |
 * | "ab*c"            | `https://abcd.com`, `https://example.com/abcxyzd`       | `https://abc.com`                                         |
 * | "\|\|a.example.com" | `https://a.example.com/`, `https://b.a.example.com/xyz` | `https://example.com/`                                    |
 * | "\|https*"         | `https://example.com`                                   | `http://example.com/`, `http://https.com`                 |
 * | "example*^123\|"   | `https://example.com/123`, `http://abc.com/example?123` | `https://example.com/1234`, `https://abc.com/example0123` |
 *
 */
export async function saveRule({
  id,
  conditionType,
  conditionValue,
  caseSensitive = false,
  value,
}: {
  id: number;
  conditionType: 'urlFilter' | 'regexFilter';
  conditionValue: string;
  caseSensitive?: boolean;
  value: string;
}) {
  try {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [id],
      addRules: [
        {
          id,
          action: {
            type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
            requestHeaders: [
              {
                header: 'cookie',
                operation: chrome.declarativeNetRequest.HeaderOperation.SET,
                value,
              },
            ],
          },
          condition: {
            [conditionType]: conditionValue,
            isUrlFilterCaseSensitive: caseSensitive,
          },
        },
      ],
    });
  } catch (error) {
    console.log('ERROR cannot update header', error);
  }
}
