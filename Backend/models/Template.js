const { default: mongoose } = require("mongoose");

const templateSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    placeholders: [{ type: String }], // e.g., ['name', 'date']
    content: { type: String, required: true },
    path: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Template', templateSchema);
