require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const initializePassport = require("./passport-config");
const authRoutes = require("./routes/auth");

const app = express();
initializePassport(passport);

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
