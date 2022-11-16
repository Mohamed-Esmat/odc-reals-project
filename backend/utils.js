import jwt from 'jsonwebtoken';
import passport from 'passport';
import GooglePlusTokenStrategy from 'passport-google-plus-token';
import User from './models/userModel.js';




export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '2d',
    }
  );
};

export const toAuthJSON = (user)=> {
  return {
    _id: user.id,
    username: user.username,
    token: generateToken(user),
  };
}

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};




// Google Plus Strategy
const googleConfig = {
  clientID: '972876750900-puqhb5qllei92camjhq2h55v1d2e3405.apps.googleusercontent.com',
  clientSecret: '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', 
};
const googleStrategy = new GooglePlusTokenStrategy(
  googleConfig,
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await User.findOne({ 'google.id': profile.id });
      if (!user) {
        const newUser = await User.create({
          email: profile.emails[0].value,
          name: profile.displayName,
        });
        return done(null, newUser);
      }
      return done(null, user);
    } catch (e) {
      return done(e, false);
    }
  }
);
passport.use(googleStrategy);
export const authGoogle = passport.authenticate('google-plus-token', {
  session: false,
});
