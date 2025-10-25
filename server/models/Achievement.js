import mongoose from 'mongoose';

// Expanded achievement schema to match frontend fields.
// Frontend expects fields like shortDescription, detailedDescription, image, icon, issuer, location, tags and date.
// Keep legacy 'description' and 'images' for backward compatibility.
const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  // Short description used in cards
  shortDescription: { type: String, trim: true },
  // Detailed description used in modals or full views
  detailedDescription: { type: String, trim: true },
  // Backwards-compatible single 'description' field
  description: { type: String, trim: true },
  category: { type: String, trim: true },
  featured: { type: Boolean, default: false },
  // Primary image (single) used by frontend components
  image: { type: String, trim: true },
  // Legacy images array
  images: [{ type: String, trim: true }],
  // Optional icon (emoji or URL)
  icon: { type: String, trim: true },
  issuer: { type: String, trim: true },
  location: { type: String, trim: true },
  // Tags for filtering/searching
  tags: [{ type: String, trim: true }],
  // Date string (ISO) or date-only string used by frontend
  date: { type: String, trim: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

achievementSchema.index({ category: 1 });
achievementSchema.index({ featured: 1 });

const Achievement = mongoose.model('Achievement', achievementSchema);

export default Achievement;
