require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const User = require('./models/User');
const Command = require('./models/Command');
const app = express();
const port = 3000;


// DATABASE
mongoose.connect(`mongodb+srv://cxzichan:${process.env.db_password}@discordbot.fw9cnxq.mongodb.net/?retryWrites=true&w=majority&appName=discordbot`);
const db = mongoose.connection;
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// APP or Website

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: process.env.secretkey,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // true wenn HTTPS verwendet wird
        maxAge: 60000 // Lebensdauer des Cookies in Millisekunden (z.B. 60 Sekunden)
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Serialize user object to store in the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user by finding user by id
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// Passport middleware using Discord OAuth2 strategy for authentication.
passport.use(new DiscordStrategy({
    clientID: 'YOUR_CLIENT_ID',
    clientSecret: 'YOUR_CLIENT_SECRET',
    callbackURL: 'http://localhost:3000/auth/discord/callback',
    scope: ['identify', 'guilds']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ discordId: profile.id });
        if (user) {
            user.username = profile.username;
            user.discriminator = profile.discriminator;
            user.avatar = profile.avatar;
            user.accessToken = accessToken;
            user.refreshToken = refreshToken;
            await user.save();
        } else {
            user = new User({
                discordId: profile.id,
                username: profile.username,
                discriminator: profile.discriminator,
                avatar: profile.avatar,
                accessToken: accessToken,
                refreshToken: refreshToken,
            });
            await user.save();
        }
        return done(null, user);
    } catch (err) {
        console.error(err);
        return done(err, null);
    }
}));

// APP GET ANFRAGEN
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

app.get('/', (req, res) => {
    res.redirect('/dashboard');
});

app.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard', { user: req.user });
});

app.get('/guilds', isAuthenticated, (req, res) => {
    res.render('guilds', { user: req.user });
});

app.get('/commands', isAuthenticated, (req, res) => {
    Command.find({ userId: req.user.id }, (err, commands) => {
        if (err) return console.error(err);
        res.render('commands', { user: req.user, commands: commands });
    });
});

app.get('/settings', isAuthenticated, (req, res) => {
    res.render('settings', { user: req.user });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/auth/discord', passport.authenticate('discord'));

app.get('/auth/discord/callback', passport.authenticate('discord', {
    failureRedirect: '/login'
}), (req, res) => {
    res.redirect('/dashboard');
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

// APP POST ANFRAGEN
app.post('/commands', isAuthenticated, (req, res) => {
    const newCommand = new Command({
        guildId: req.body.guildId,
        userId: req.user.id,
        name: req.body.name,
        response: req.body.response,
    });
    newCommand.save(err => {
        if (err) {
            console.error(err);
            res.status(500).send('Error saving command');
        } else {
            res.redirect('/commands');
        }
    });
});

app.post('/commands/delete', isAuthenticated, (req, res) => {
    Command.findByIdAndRemove(req.body.commandId, err => {
        if (err) {
            console.error(err);
            res.status(500).send('Error deleting command');
        } else {
            res.redirect('/commands');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports = app; // Exportieren des Express-App-Objekts
