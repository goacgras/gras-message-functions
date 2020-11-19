const passport = require("passport");
const { admin, db } = require("./admin");
var GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "573419519034-6vhatrnhaitgh9dsv23d1na6vsrrnltq.apps.googleusercontent.com",
      clientSecret: "u4vH5rXFojkxUQAsTbsDOlTN",
      callbackURL:
        "http://localhost:5000/gras-message/asia-southeast2/api/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      const idToken = accessToken;
      return done(null, idToken);
      //use profile info to check if user is register in db
      // db.doc(`/users/${profile.id}`)
      //   .get()
      //   .then((doc) => {
      //     if (doc.exists) {
      //       return done(null, profile);
      //     } else {
      //       const userCredential = {
      //         uid: profile.id,
      //         userName: profile.displayName,
      //       };
      //       return db.doc(`/users/${profile.id}`).set(userCredential);
      //     }
      //   })
      //   .then((newUser) => {
      //     return done(null, newUser);
      //   })
      //   .catch((err) => {
      //     console.error("error while signin");
      //   });
    }
  )
);
