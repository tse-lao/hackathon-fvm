import axios from 'axios';

export default async (req, res) => {
  const { code } = req.query;

  try {
    const response = await axios.post('https://www.strava.com/oauth/token', {
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
    });

    const accessToken = response.data.access_token;
    console.log(response.data.access_token)
    //localStorage.setItem('stravaAccessToken', accessToken);

    //localStorage.setItem('stravaAccessToken', accessToken);
    // Save the access token in your session or database

    // Redirect the user to a page in your app
    res.redirect(`/connections/strava?token=${accessToken}`);
} catch (error) {
    console.error('Error getting access token', error);
    res.status(500).json({ error: 'Error getting access token' });
  }
};
