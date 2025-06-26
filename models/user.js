const mongoose = require('mongoose');
const passportlocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    isHost: {
        type: Boolean,
        default: false
    },

    profileImage: {
        url: String,
        filename: String
    },
    aboutMe: String,
    interests: [String],
    dreamDestination: String,
    work: String,
    favSong: String,
    pets: String,
    decadeBorn: String,
    school: String,
    uselessSkill: String,
    tooMuchTime: String,
    funFact: String,
    bioTitle: String

});

userSchema.plugin(passportlocalMongoose);

module.exports = mongoose.model("User", userSchema);
