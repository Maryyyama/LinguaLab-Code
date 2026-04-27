const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  type: { type: String, enum: ['news', 'blog', 'faq'], required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: String,
  image: String,
  category: String,
  tags: [String],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  views: { type: Number, default: 0 },
  status: { type: String, enum: ['published', 'draft', 'archived'], default: 'draft' },
  publishedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Content', ContentSchema);