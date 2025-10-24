import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  discount: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  validUntil: {
    type: Date
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed_amount', 'buy_one_get_one'],
    default: 'percentage'
  },
  conditions: {
    minQuantity: {
      type: Number,
      default: 1
    },
    maxUsage: {
      type: Number
    },
    applicableColors: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageCount: {
    type: Number,
    default: 0
  },
  maxUsage: {
    type: Number
  }
}, {
  timestamps: true
});

// Indexes
offerSchema.index({ vehicleId: 1 });
offerSchema.index({ isActive: 1 });
offerSchema.index({ validUntil: 1 });
offerSchema.index({ validFrom: 1 });

const Offer = mongoose.model('Offer', offerSchema);

export default Offer;
