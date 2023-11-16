import {
  Accordion,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react';
import { v4 as uuid } from 'uuid';

import { useStorage } from '@plasmohq/storage/hook';

import { Cookie } from '~popup/Cookie';

import packageJson from '../../package.json';

export type CookieType = {
  id: string;
  label: string;
};

export const Content = () => {
  const [cookies, setCookies] = useStorage<CookieType[]>('cookies', [
    { id: uuid(), label: '' },
  ]);

  return (
    <>
      <Stack py="4" w={400} maxH={400} mb="8" overflowY="auto">
        <Stack px="4">
          <HStack alignItems="flex-end">
            <FormControl>
              <FormLabel>Cookie names</FormLabel>
              <Accordion allowMultiple>
                {cookies.map((cookie, index) => (
                  <Cookie
                    cookie={cookie}
                    key={cookie.id}
                    onChange={async ({ label }) => {
                      cookies[index] = {
                        ...cookies[index],
                        label,
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
            </FormControl>
          </HStack>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCookies([...cookies, { id: uuid(), label: '' }])}>
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
