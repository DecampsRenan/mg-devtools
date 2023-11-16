import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Code,
  Divider,
  HStack,
  Icon,
  IconButton,
  Input,
  Spacer,
  Stack,
  Text,
  useClipboard,
} from '@chakra-ui/react';
import { useEffect, type FC } from 'react';
import { LuRefreshCw, LuTrash } from 'react-icons/lu';

import type { CookieType } from '~popup/Content';
import { useCookie } from '~popup/cookie.service';
import { Item } from '~popup/Item';

export interface CookieValue {
  label: string;
  value?: string;
}

export interface CookieProps {
  cookie: CookieType;
  onDelete?(): void;
  onChange?(value: CookieValue): void;
}

export const Cookie: FC<CookieProps> = ({ cookie, onDelete, onChange }) => {
  const cookieLabel = cookie.label;
  const cookieQuery = useCookie(cookieLabel);

  const handleSaveCookieName = ({ target }) => {
    onChange?.({ label: target.value });
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
        <Stack spacing="6" divider={<Divider />}>
          {cookieQuery.data?.length ? (
            cookieQuery.data?.map((cookie) => (
              <Item key={cookie.domain} cookie={cookie} label={cookieLabel} />
            ))
          ) : (
            <Code>No value</Code>
          )}
        </Stack>
      </AccordionPanel>
    </AccordionItem>
  );
};
