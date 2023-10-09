import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { Content } from "~popup/Content"
import { Providers } from "~popup/Providers"

export const useCaptureCookie = (cookieName: string) => {
  const [cookieValue, setCookieValue] = useState()

  useEffect(() => {
    sendToBackground({
      name: "getCookieValue",
      body: {
        name: cookieName
      }
    }).then((cookieValue) => {
      setCookieValue(cookieValue)
    })
  }, [cookieName])

  return cookieValue
}

export default function Popup() {
  return (
    <Providers>
      <Content />
    </Providers>
  )
}
