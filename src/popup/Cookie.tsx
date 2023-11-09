import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Checkbox,
  Code,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Input,
  Stack,
  Text,
  Tooltip,
  useClipboard,
} from '@chakra-ui/react';
import { useEffect, type FC } from 'react';
import { LuTrash } from 'react-icons/lu';

import { useStorage } from '@plasmohq/storage/hook';

import { useCookie } from '~popup/cookie.service';

export interface CookieValue {
  label: string;
  value?: string;
}

export interface CookieProps {
  label: string;
  onDelete?(): void;
  onChange?(value: CookieValue): void;
}

export const Cookie: FC<CookieProps> = ({ label, onDelete, onChange }) => {
  const cookieQuery = useCookie(label);
  const { onCopy, hasCopied, setValue } = useClipboard(cookieQuery.data);
  const [regex, setRegex] = useStorage(`${label}:regex`);
  const [allowInjection, setAllowInjection] = useStorage(
    `${label}:allowInjection`,
  );

  const formattedCookieValue = `${label}=${cookieQuery.data}`;

  useEffect(() => {
    setValue(formattedCookieValue);
  }, [formattedCookieValue, setValue]);

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
          type="text"
          onChange={handleSaveCookieName}
          value={label}
          minW="28"
        />

        <Tooltip label="No value" isDisabled={!!cookieQuery.data}>
          <Button
            size="sm"
            variant="outline"
            isLoading={cookieQuery.isLoading}
            onClick={onCopy}
            isDisabled={!cookieQuery.data || hasCopied}>
            {hasCopied ? 'Copied!' : 'Copy'}
          </Button>
        </Tooltip>
        <IconButton
          size="sm"
          variant="ghost"
          colorScheme="red"
          aria-label="Delete"
          onClick={onDelete}
          icon={<Icon as={LuTrash} />}
        />
      </HStack>
      <AccordionPanel pb={4}>
        <Stack>
          <FormControl>
            <FormLabel>Regex used to inject cookie</FormLabel>
            <Input
              flex={1}
              size="sm"
              type="text"
              onChange={(e) => setRegex(e.target.value)}
              value={regex}
              minW="28"
            />
          </FormControl>
          <FormControl>
            <Checkbox
              isChecked={!!allowInjection}
              onChange={(e) => setAllowInjection(e.target.checked)}>
              Enable injection
            </Checkbox>
          </FormControl>

          <Stack>
            <Text>Current cookie value</Text>
            <Box bg="gray.100">
              {cookieQuery.data ? (
                <Code>{formattedCookieValue}</Code>
              ) : (
                <Code>No value</Code>
              )}
            </Box>
          </Stack>
        </Stack>
      </AccordionPanel>
    </AccordionItem>
  );
};
