import { Accordion, Button, Heading, Stack, Text } from '@chakra-ui/react';

import { useStorage } from '@plasmohq/storage/hook';

import { Cookie } from '~popup/Cookie';
import { getNextRuleId } from '~popup/cookie.service';

import packageJson from '../../package.json';

export type CookieType = {
  id: number;

  /**
   * Label of the cookie we want to capture the value
   */
  label: string;

  /**
   * Attribute used to store the cookie value marked as used
   * to override
   */
  activeCookieDomain?: string;
};

export const Content = () => {
  const [cookies, setCookies] = useStorage<CookieType[]>('cookies', []);

  return (
    <>
      <Stack py="4" w={400} maxH={400} mb="8" overflowY="auto">
        <Stack px="4">
          <Heading size="md">Cookie names</Heading>
          <Accordion allowMultiple>
            {cookies.map((cookie, index) => (
              <Cookie
                cookie={cookie}
                key={cookie.id}
                onChange={async ({ label, activeDomain }) => {
                  cookies[index] = {
                    ...cookies[index],
                    label,
                    activeCookieDomain: activeDomain,
                  };

                  setCookies([...cookies]);
                }}
                onDelete={() =>
                  setCookies(
                    cookies.filter(
                      (currentCookie) => currentCookie.id !== cookie.id,
                    ),
                  )
                }
              />
            ))}
          </Accordion>

          <Button
            size="sm"
            variant="outline"
            onClick={async () => {
              const nextCookieId = await getNextRuleId();
              setCookies([...cookies, { id: nextCookieId, label: '' }]);
            }}>
            Add new cookie
          </Button>
        </Stack>
      </Stack>

      <Stack
        position="fixed"
        bg="gray.700"
        color="gray.200"
        px="4"
        py="2"
        w="full"
        bottom="0">
        <Text>
          MG DevTools v{packageJson.version} - {process.env.NODE_ENV}
        </Text>
      </Stack>
    </>
  );
};
