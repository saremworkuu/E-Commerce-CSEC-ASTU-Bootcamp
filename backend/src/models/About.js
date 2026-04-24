// models/About.js
import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "About Our Website",
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  embedding: {
    type: [Number],           // Vector for semantic search (3072 dimensions for gemini-embedding-001)
    required: true
  }
}, { 
  timestamps: true 
});

// Ensure only ONE About document exists (singleton pattern)
aboutSchema.statics.getAbout = async function() {
  let about = await this.findOne();
  if (!about) {
    about = await this.create({
      title: "About Our Website",
      content: "Default about content. Please update via admin panel.",
      embedding: []   // Will be updated when admin saves
    });
  }
  return about;
};

const About = mongoose.models.About || mongoose.model("About", aboutSchema);

export default About;