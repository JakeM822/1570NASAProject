// config/passport.js
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:4000/api/auth/github/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email =
            profile.emails?.[0]?.value ||
            `${profile.username}@github-users.com`;

          let user = await User.findOne({ email });

          if (!user) {
            user = await User.create({
              email,
              name: profile.displayName || profile.username,
              passwordHash: "GITHUB_OAUTH",
            });
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
