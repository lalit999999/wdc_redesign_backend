import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

const missingEnvVars = [
    ["GOOGLE_CLIENT_ID", GOOGLE_CLIENT_ID],
    ["GOOGLE_CLIENT_SECRET", GOOGLE_CLIENT_SECRET],
    ["GOOGLE_CALLBACK_URL", GOOGLE_CALLBACK_URL],
]
    .filter(([, value]) => !value)
    .map(([name]) => name);

if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
}

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: GOOGLE_CALLBACK_URL,
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
