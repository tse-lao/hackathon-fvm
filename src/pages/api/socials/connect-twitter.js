import Twitter from 'twitter-lite';

export default async (req, res) => {
  const { oauth_verifier } = req.body;

  try {
    // Create a Twitter client
    const client = new Twitter({
      consumer_key: process.env.TWITTER_API_KEY,
      consumer_secret: process.env.TWITTER_API_SECRET_KEY,
      access_token_key: process.env.TWITTER_ACCESS_TOKEN,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });

    // Exchange the oauth_verifier for an access token
    const { access_token, access_token_secret } = await client.getAccessToken({
      oauth_verifier,
    });

    res.json({ access_token, access_token_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error getting access token' });
  }
};
