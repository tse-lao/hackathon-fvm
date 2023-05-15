
import axios from 'axios';
import nextConnect from 'next-connect';

const users = {}; // This is your "database" for this demonstration.

const handler = nextConnect();

handler.post(async (req, res) => {
  const { accessToken } = req.body;
  const appTokenRes = await axios.get(`https://graph.facebook.com/v14.0/oauth/access_token?client_id=<Your App ID>&client_secret=<Your App Secret>&grant_type=client_credentials`);
  const appAccessToken = appTokenRes.data.access_token;
  
  const debugTokenRes = await axios.get(`https://graph.facebook.com/v14.0/debug_token?input_token=${accessToken}&access_token=${appAccessToken}`);
  
  if (debugTokenRes.data.data.is_valid && debugTokenRes.data.data.app_id === '<Your App ID>') {
    const { data } = await axios.get(`https://graph.facebook.com/v14.0/me?fields=id,name&access_token=${accessToken}`);
    const { id, name } = data;

    // User management logic.
    if (users[id]) {
      // User already exists. Just update the name.
      users[id].name = name;
    } else {
      // New user. Add to the database.
      users[id] = { id, name };
    }

    res.json(users[id]);
  } else {
    res.status(401).json({ error: 'Invalid access token' });
  }
});
