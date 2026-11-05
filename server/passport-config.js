import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { connectDB } from "./db.js";

export default function initializePassport(passport) {
  passport.use(new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const db = await connectDB();
      const user = await db.collection("users").findOne({ email });
      if (!user) return done(null, false, { message: "No user with that email" });

      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match) return done(null, false, { message: "Incorrect password" });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((user, done) => done(null, user._id.toString()));

  passport.deserializeUser(async (id, done) => {
    try {
      const db = await connectDB();
      const user = await db.collection("users").findOne({ _id: new ObjectId(id) });
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}