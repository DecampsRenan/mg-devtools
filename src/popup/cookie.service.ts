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
