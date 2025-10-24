import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vehicle from '../models/Vehicle.js';
import Offer from '../models/Offer.js';

dotenv.config();

const createSampleOffer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ev_vehicles');

    const vehicle = await Vehicle.findOne().lean();
    if (!vehicle) {
      console.log('No vehicles found. Please seed the database first (npm run seed).');
      return;
    }

    console.log('Creating offer for vehicle:', vehicle.name);

    const offerData = {
      vehicleId: vehicle._id,
      title: `Special Launch Offer - ${vehicle.name}`,
      description: `Get amazing discount on the all-new ${vehicle.name} by ${vehicle.brand}. Limited time offer!`,
      discount: 25,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      validFrom: new Date(),
      type: 'percentage',
      isActive: true,
      usageCount: 0,
      maxUsage: 100
    };

    const created = await Offer.create(offerData);
    console.log('Sample offer created:', created);
  } catch (error) {
    console.error('Error creating sample offer:', error);
  } finally {
    await mongoose.connection.close();
  }
};

createSampleOffer();
