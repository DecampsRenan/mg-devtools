import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Input,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import { type FC } from 'react';
import { LuRefreshCw, LuTrash } from 'react-icons/lu';

import { useStorage } from '@plasmohq/storage/hook';

import type { CookieType } from '~popup/Content';
import { removeRule, saveRule, useCookie } from '~popup/cookie.service';
import { Item } from '~popup/Item';

export interface CookieValue {
  label: string;
  value?: string;
  activeDomain?: string;
}

export interface CookieProps {
  cookie: CookieType;
  activeDomain?: string;
  onDelete?(): void;
  onChange?(value: CookieValue): void;
}

export const Cookie: FC<CookieProps> = ({ cookie, onDelete, onChange }) => {
  const cookieLabel = cookie.label;
  const cookieQuery = useCookie(cookieLabel);
  const [urlCatcher, setUrlCatcher] = useStorage<string>(
    `${cookie.id}-url-catcher`,
    '',
  );

  const handleSaveCookieName = ({ target }) => {
    onChange?.({ label: target.value });
  };

  const handleUpdateCookieToOverride = async (
    activeDomain: string,
    activatedCookie: chrome.cookies.Cookie,
  ) => {
    onChange?.({ activeDomain, label: cookie.label });

    if (activeDomain) {
      await saveRule({
        id: cookie.id,
        conditionType: 'urlFilter',
        conditionValue: urlCatcher,
        value: `${activatedCookie.name}=${activatedCookie.value}`,
      });
    } else {
      await removeRule(cookie.id);
    }
  };

  return (
    <AccordionItem>
      <HStack w="full" py="2">
        <AccordionButton w="fit-content" px="2" borderRadius="sm">
          <AccordionIcon w="full" px="0" />
        </AccordionButton>

        <Input
          flex={1}
          size="sm"
          borderRadius="md"
          type="text"
          onChange={handleSaveCookieName}
          value={cookieLabel}
          minW="28"
        />

        <IconButton
          size="sm"
          variant="outline"
          aria-label="Refetch cookie value"
          onClick={() => cookieQuery.refetch()}
          isLoading={cookieQuery.isFetching}
          isDisabled={cookieQuery.isLoading}
          icon={<Icon as={LuRefreshCw} />}
        />

        <IconButton
          size="sm"
          variant="ghost"
          colorScheme="red"
          aria-label="Delete"
          onClick={onDelete}
          icon={<Icon as={LuTrash} />}
        />
      </HStack>
      <AccordionPanel
        pb={4}
        bg="gray.50"
        shadow="inner"
        borderRadius="md"
        mb="2">
        <Stack spacing="4" divider={<Divider />}>
          <HStack>
            <FormControl>
              <FormLabel>URL pattern for override</FormLabel>
              <Input
                fontFamily="monospace"
                size="sm"
                borderRadius="md"
                bg="white"
                value={urlCatcher}
                onChange={async (e) => {
                  setUrlCatcher(e.target.value.trim());

                  const activeCookie = cookieQuery.data?.find(
                    (c) => c.domain === cookie.activeCookieDomain,
                  );

                  if (activeCookie && e.target.value.trim()) {
                    await saveRule({
                      id: cookie.id,
                      conditionType: 'urlFilter',
                      conditionValue: e.target.value.trim(),
                      value: `${activeCookie.name}=${activeCookie.value}`,
                    });
                  } else {
                    await removeRule(cookie.id);
                  }
                }}
              />
              <FormHelperText>
                See{' '}
                <Link
                  isExternal
                  textDecor="underline"
                  href="https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest#filter-matching-charactgers">
                  how to build your url pattern here
                </Link>
              </FormHelperText>
            </FormControl>
          </HStack>

          {cookieQuery.data?.length ? (
            cookieQuery.data?.map((actualCookie) => (
              <Item
                key={actualCookie.domain}
                cookie={actualCookie}
                label={cookieLabel}
                isActive={cookie.activeCookieDomain === actualCookie.domain}
                onChange={(isActive) =>
                  handleUpdateCookieToOverride(
                    isActive ? actualCookie.domain : null,
                    actualCookie,
                  )
                }
              />
            ))
          ) : (
            <Text justifySelf="center">No cookie value</Text>
          )}
        </Stack>
      </AccordionPanel>
    </AccordionItem>
  );
};
