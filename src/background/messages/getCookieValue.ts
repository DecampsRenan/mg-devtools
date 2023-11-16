import type { PlasmoMessaging } from '@plasmohq/messaging';

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  if (!req.body.name) {
    return res.send(null);
  }

  let cookies;
  try {
    cookies = await chrome.cookies.getAll({
      name: req.body.name,
    });
  } catch (error) {
    console.error(`No cookie value matching ${req.body.name}`, error);
  }

  if (!cookies) {
    res.send(null);
    return;
  }
  res.send(cookies);
};

export default handler;
