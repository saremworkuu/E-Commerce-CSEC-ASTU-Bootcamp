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
    required: false
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
      content: "This is a modern e-commerce platform offering premium products with excellent service and fast delivery. We deliver our products worldwide with free shipping on orders over $50. Our mission is to provide a seamless shopping experience with a wide range of high-quality products at competitive prices.",
      embedding: undefined
    });
  }
  return about;
};

const About = mongoose.models.About || mongoose.model("About", aboutSchema);

export default About;