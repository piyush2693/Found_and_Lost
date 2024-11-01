const User = require('./../models/user');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use('user-local', new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {

            const user = await User.findOne({ email });
            if (!user) {
                
                return done(null, false, { message: 'User Not Found' });
            }

            const isPasswordMatch = await user.comparePassword(password);

            if (isPasswordMatch) {
                
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect Password' });
            }

        } catch (error) {
            console.log(error);
            return done(error);
        }
    }
));
module.exports = passport;