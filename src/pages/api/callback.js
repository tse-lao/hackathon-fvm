import { TwitterClient } from 'twitter-lite';



const client = new TwitterClient({
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_API_SECRET_KEY,
});

export default async function handler(req, res) {
  const { oauth_token, oauth_verifier } = req.query;

  if (!oauth_token || !oauth_verifier) {
    res.status(400).json({ error: 'Missing required parameters' });
    return;
  }

  try {
    const { oauth_token: access_token, oauth_token_secret: access_token_secret, user_id, screen_name } = await client.getAccessToken({
      oauth_verifier,
      oauth_token,
    });

    // At this point, you should store the access tokens and Twitter user ID securely in your application's
    // storage. These tokens can be used to make authenticated requests to the Twitter API on behalf of the user.

    // For simplicity, we'll just return them in the response. Do not do this in a real application.
    res.status(200).json({ access_token, access_token_secret, user_id, screen_name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
