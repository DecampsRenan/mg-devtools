import {
  Button,
  Code,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Stack,
  Text,
  useClipboard
} from "@chakra-ui/react"
import { useEffect } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { useCaptureCookie } from "~popup"

import packageJson from "../package.json"

export const Content = () => {
  const [cookieName, setCookieName] = useStorage("cookie", "")

  const cookieValue = useCaptureCookie(cookieName)
  const formattedCookieValue = `${cookieName}=${cookieValue}`

  useEffect(() => {
    setValue(formattedCookieValue)
  }, [cookieValue])

  const handleSaveCookieName = ({ target }) => {
    setCookieName(target.value)
  }

  const { onCopy, hasCopied, setValue } = useClipboard("")

  return (
    <Stack m="4" w={300}>
      <HStack alignItems="flex-end">
        <Text>MG DevTools v${packageJson.version}</Text>
        <FormControl>
          <FormLabel>Cookie name</FormLabel>
          <Input
            type="text"
            onChange={handleSaveCookieName}
            value={cookieName}
            minW="28"
          />
        </FormControl>
        {!!cookieValue && (
          <Button onClick={onCopy} isDisabled={hasCopied}>
            {hasCopied ? "Copied!" : "Copy"}
          </Button>
        )}
      </HStack>
      <Code>{formattedCookieValue}</Code>
    </Stack>
  )
}
