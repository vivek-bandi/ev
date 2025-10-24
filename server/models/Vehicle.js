import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 2
  },
  fuelType: {
    type: String,
    default: 'Electric',
    enum: ['Electric', 'Hybrid', 'Plug-in Hybrid']
  },
  chargingTime: {
    type: String,
    trim: true
  },
  range: {
    type: String,
    trim: true
  },
  battery: {
    type: String,
    trim: true
  },
  topSpeed: {
    type: String,
    trim: true
  },
  colors: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String,
    trim: true
  }],
  colorImages: [{
    color: {
      type: String,
      required: true,
      trim: true
    },
    images: [{
      type: String,
      trim: true
    }],
    primaryImage: {
      type: String,
      trim: true
    }
  }],
  featured: {
    type: Boolean,
    default: false
  },
  specifications: {
    acceleration: String,
    weight: String,
    dimensions: String,
    warranty: String,
    chargingPort: String
  },
  inventory: {
    stock: {
      type: Number,
      default: 0,
      min: 0
    },
    reserved: {
      type: Number,
      default: 0,
      min: 0
    },
    status: {
      type: String,
      enum: ['available', 'out_of_stock', 'discontinued'],
      default: 'available'
    }
  },
  category: {
    type: String,
    enum: ['scooter', 'motorcycle', 'car', 'bike'],
    default: 'scooter'
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
vehicleSchema.index({ name: 1, brand: 1 });
vehicleSchema.index({ price: 1 });
vehicleSchema.index({ category: 1 });
vehicleSchema.index({ featured: 1 });
vehicleSchema.index({ isActive: 1 });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;
