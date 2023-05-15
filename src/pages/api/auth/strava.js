export default (req, res) => {
    const clientId = process.env.STRAVA_CLIENT_ID;
    const clientSecret = process.env.STRAVA_CLIENT_SECRET
    const redirectUri = `${process.env.BASE_URL}/api/auth/strava/callback`;
  
    // Redirect the user to the Strava authentication page
    res.redirect(
      `http://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=read_all,activity:read_all`
    );
  };
  