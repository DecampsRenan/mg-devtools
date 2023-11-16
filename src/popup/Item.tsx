import {
  Button,
  Code,
  HStack,
  Spacer,
  Stack,
  Text,
  useClipboard,
} from '@chakra-ui/react';
import { useEffect } from 'react';

export const Item = ({
  cookie,
  label,
}: {
  label: string;
  cookie: chrome.cookies.Cookie;
}) => {
  const { onCopy, hasCopied, setValue } = useClipboard(cookie.value);

  const formattedCookieValue = `${label}=${cookie.value}`;

  useEffect(() => {
    setValue(formattedCookieValue);
  }, [formattedCookieValue, setValue]);

  return (
    <Stack>
      <HStack alignItems="center">
        <Text>{cookie.domain}</Text>
        <Spacer />
        <Button size="sm" variant="outline" onClick={() => onCopy()}>
          {hasCopied ? 'Copied!' : 'Copy'}
        </Button>
      </HStack>

      <Code borderRadius="md" p="2" shadow="inner">
        {cookie.value}
      </Code>
    </Stack>
  );
};
