import {
  Badge,
  Button,
  chakra,
  Code,
  HStack,
  Spacer,
  Stack,
  Tooltip,
  useClipboard,
  Wrap,
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
        <chakra.span>{cookie.domain}</chakra.span>
        <Spacer />
        <Button size="xs" colorScheme="blue" onClick={() => onCopy()}>
          {hasCopied ? 'Copied!' : 'Copy'}
        </Button>
      </HStack>

      <Code borderRadius="md" p="2" shadow="inner">
        {cookie.value}
      </Code>

      <Wrap shouldWrapChildren>
        <Tooltip
          hasArrow
          label="True if the cookie is marked as Secure (i.e. its scope is limited to secure channels, typically HTTPS)">
          {cookie.secure ? (
            <Badge colorScheme="green">secure</Badge>
          ) : (
            <Badge colorScheme="red">unsecure</Badge>
          )}
        </Tooltip>
        {cookie.session && (
          <Tooltip
            hasArrow
            label="True if the cookie is a session cookie, as opposed to a persistent cookie with an expiration date">
            <Badge variant="outline" colorScheme="yellow">
              session
            </Badge>
          </Tooltip>
        )}
        {cookie.httpOnly && (
          <Tooltip
            hasArrow
            label="True if the cookie is marked as HttpOnly (i.e. the cookie is inaccessible to client-side scripts)">
            <Badge variant="outline" colorScheme="blue">
              http Only
            </Badge>
          </Tooltip>
        )}
        {cookie.hostOnly && (
          <Tooltip
            hasArrow
            label="True if the cookie is a host-only cookie (i.e. a request's host must exactly match the domain of the cookie)">
            <Badge variant="outline" colorScheme="blue">
              host Only
            </Badge>
          </Tooltip>
        )}
      </Wrap>
    </Stack>
  );
};
