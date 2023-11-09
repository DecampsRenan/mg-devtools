import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Code,
  HStack,
  Icon,
  IconButton,
  Input,
  Tooltip,
  useClipboard
} from "@chakra-ui/react"
import { useEffect, type FC } from "react"
import { LuTrash } from "react-icons/lu"

import { useCookie } from "~popup/cookie.service"

export interface CookieValue {
  label: string
  value?: string
}

export interface CookieProps {
  label: string
  value?: string
  onDelete?(): void
  onChange?(value: CookieValue): void
}

export const Cookie: FC<CookieProps> = ({
  label,
  value,
  onDelete,
  onChange
}) => {
  const cookieQuery = useCookie(label)
  const { onCopy, hasCopied, setValue } = useClipboard(cookieQuery.data)

  const formattedCookieValue = `${label}=${cookieQuery.data}`

  useEffect(() => {
    setValue(formattedCookieValue)
  }, [formattedCookieValue, setValue])

  const handleSaveCookieName = ({ target }) => {
    onChange?.({ label: target.value })
  }

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

        <Tooltip label="No value" isDisabled={!!value}>
          <Button
            size="sm"
            variant="outline"
            isLoading={cookieQuery.isLoading}
            onClick={onCopy}
            isDisabled={!cookieQuery.data || hasCopied}>
            {hasCopied ? "Copied!" : "Copy"}
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
      <AccordionPanel pb={4} bg="gray.100">
        {cookieQuery.data ? (
          <Code>{formattedCookieValue}</Code>
        ) : (
          <Code>No value</Code>
        )}
      </AccordionPanel>
    </AccordionItem>
  )
}
