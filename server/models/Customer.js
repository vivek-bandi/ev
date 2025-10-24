import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  preferences: {
    vehicleType: [String],
    priceRange: {
      min: Number,
      max: Number
    },
    colors: [String]
  },
  purchaseHistory: [{
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle'
    },
    purchaseDate: Date,
    amount: Number,
    offerUsed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Offer'
    }
  }],
  testDriveHistory: [{
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle'
    },
    scheduledDate: Date,
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled'
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastContactDate: Date,
  notes: String
}, {
  timestamps: true
});

// Indexes
customerSchema.index({ email: 1 });
customerSchema.index({ phone: 1 });
customerSchema.index({ 'address.city': 1 });
customerSchema.index({ isActive: 1 });

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
