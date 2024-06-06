const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    discordId: String,
    username: String,
    discriminator: String,
    avatar: String,
    accessToken: String,
    refreshToken: String,
});

module.exports = mongoose.model('User', userSchema);
