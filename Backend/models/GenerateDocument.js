const { default: mongoose } = require("mongoose");

const generatedDocumentSchema = new mongoose.Schema({
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  data: { type: Map, of: String }, // map of placeholder key-value pairs
  generatedContent: { type: String, required: true },
  version: { type: Number, default: 1 },
  format: { type: String, enum: ['DOCX', 'PDF'], required: true },
}, { timestamps: true });
module.exports = mongoose.model('GeneratedDocument', generatedDocumentSchema);
