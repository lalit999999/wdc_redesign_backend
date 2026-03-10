import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (_accessToken, _refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value?.toLowerCase();

                if (!email) {
                    return done(null, false, { message: "Email not available from Google" });
                }

                if (!email.endsWith("@nitp.ac.in")) {
                    return done(null, false, {
                        message: "Only @nitp.ac.in email addresses are allowed",
                    });
                }

                let user = await User.findOne({ email });

                if (!user) {
                    user = await User.create({
                        fullName: profile.displayName || "NITP Student",
                        email,
                    });
                }

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

export default passport;
