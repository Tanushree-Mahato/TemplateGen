const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    token: { type: String, required: true },
    deviceInfo: { type: String },
    ipAddress: { type: String },
    expiresAt: { type: Date },
});

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    sessions: [SessionSchema],
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
