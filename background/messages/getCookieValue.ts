import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  if (!req.body.name) {
    return res.send(null)
  }

  let cookie
  try {
    const [searchedCookie] = await chrome.cookies.getAll({
      name: req.body.name
    })
    cookie = searchedCookie
  } catch (error) {
    console.error(`No cookie value matching ${req.body.name}`, error)
  }

  if (!cookie) {
    res.send(null)
    return
  }

  res.send(cookie?.value)
}

export default handler
