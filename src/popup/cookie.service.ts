import { useQuery } from '@tanstack/react-query';

import { sendToBackground } from '@plasmohq/messaging';

export const useCookie = (name: string) =>
  useQuery({
    queryKey: ['cookie', name],
    queryFn: () =>
      sendToBackground({
        name: 'getCookieValue',
        body: {
          name,
        },
      }),
  });
