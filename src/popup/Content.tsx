import {
  Accordion,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Stack,
  Text
} from "@chakra-ui/react"
import { v4 as uuid } from "uuid"

import { useStorage } from "@plasmohq/storage/hook"

import { Cookie } from "~popup/Cookie"

import packageJson from "../../package.json"

export const Content = () => {
  const [cookies, setCookies] = useStorage<
    {
      id: string
      label: string
    }[]
  >("cookies", [{ id: uuid(), label: "" }])

  return (
    <Stack pt="2" w={400}>
      <Stack px="4">
        <HStack alignItems="flex-end">
          <FormControl>
            <FormLabel>Cookie names</FormLabel>
            <Accordion allowMultiple>
              {cookies.map((cookie, index) => (
                <Cookie
                  key={cookie.id}
                  label={cookie.label}
                  onChange={async ({ label }) => {
                    cookies[index] = {
                      ...cookies[index],
                      label
                    }
                    setCookies([...cookies])
                  }}
                  onDelete={() =>
                    setCookies(
                      cookies.filter(
                        (currentCookie) => currentCookie.id !== cookie.id
                      )
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
          onClick={() => setCookies([...cookies, { id: uuid(), label: "" }])}>
          Add new cookie
        </Button>
      </Stack>

      <Stack bg="gray.700" color="gray.200" px="4" py="2">
        <Text>
          MG DevTools v{packageJson.version} - {process.env.NODE_ENV}
        </Text>
      </Stack>
    </Stack>
  )
}
