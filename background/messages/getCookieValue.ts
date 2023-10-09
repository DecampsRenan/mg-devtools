import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  try {
    const cookieStores = await chrome.cookies.getAllCookieStores()
    console.log({ cookieStores })
  } catch (error) {
    console.error("Cannot get cookie stores", error)
  }

  let cookieValue
  try {
    const [cookie] = await chrome.cookies.getAll({
      name: req.body.name
    })
    cookieValue = cookie.value
  } catch (error) {
    console.error(`No cookie value matching ${req.body.name}`, error)
  }

  res.send(cookieValue)
}

export default handler
