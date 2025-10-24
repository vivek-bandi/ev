import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vehicle from './models/Vehicle.js';
import Offer from './models/Offer.js';

dotenv.config();

const sampleVehicles = [
  {
    name: 'Tesla Model 3',
    brand: 'Tesla',
    price: 45000,
    year: 2024,
    fuelType: 'Electric',
    chargingTime: '30 minutes',
    range: '358 miles',
    battery: '75 kWh',
    topSpeed: '140 mph',
    colors: ['White', 'Black', 'Silver', 'Blue', 'Red'],
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
      'https://images.unsplash.com/photo-1549317336-206569e8475c?w=800',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800'
    ],
    colorImages: [
      {
        color: 'White',
        images: [
          'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
          'https://images.unsplash.com/photo-1549317336-206569e8475c?w=800'
        ],
        primaryImage: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800'
      },
      {
        color: 'Black',
        images: [
          'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
          'https://images.unsplash.com/photo-1549317336-206569e8475c?w=800'
        ],
        primaryImage: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800'
      }
    ],
    category: 'car',
    featured: true,
    inventory: {
      stock: 15,
      reserved: 3,
      status: 'available'
    },
    specifications: {
      acceleration: '0-60 mph in 3.1s',
      weight: '3,582 lbs',
      dimensions: '184.8" x 72.8" x 56.8"',
      warranty: '4 years/50,000 miles',
      chargingPort: 'Tesla Supercharger'
    },
    tags: ['luxury', 'autopilot', 'premium'],
    isActive: true
  },
  {
    name: 'Zero SR/F',
    brand: 'Zero',
    price: 18995,
    year: 2024,
    fuelType: 'Electric',
    chargingTime: '2 hours',
    range: '161 miles',
    battery: '14.4 kWh',
    topSpeed: '124 mph',
    colors: ['Black', 'White', 'Blue'],
    images: [
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800',
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800'
    ],
    colorImages: [
      {
        color: 'Black',
        images: [
          'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800'
        ],
        primaryImage: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800'
      }
    ],
    category: 'motorcycle',
    featured: true,
    inventory: {
      stock: 8,
      reserved: 1,
      status: 'available'
    },
    specifications: {
      acceleration: '0-60 mph in 3.0s',
      weight: '485 lbs',
      dimensions: '84.2" x 32.7" x 45.3"',
      warranty: '2 years unlimited mileage',
      chargingPort: 'Level 2 AC'
    },
    tags: ['sport', 'performance', 'electric'],
    isActive: true
  },
  {
    name: 'Segway Ninebot G30P',
    brand: 'Segway',
    price: 699,
    year: 2024,
    fuelType: 'Electric',
    chargingTime: '4 hours',
    range: '40 miles',
    battery: '551 Wh',
    topSpeed: '18.6 mph',
    colors: ['Black', 'White'],
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
    ],
    colorImages: [
      {
        color: 'Black',
        images: [
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
        ],
        primaryImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
      }
    ],
    category: 'scooter',
    featured: false,
    inventory: {
      stock: 25,
      reserved: 5,
      status: 'available'
    },
    specifications: {
      acceleration: '0-15 mph in 3.2s',
      weight: '44 lbs',
      dimensions: '45.9" x 18.1" x 46.8"',
      warranty: '1 year',
      chargingPort: 'Standard AC'
    },
    tags: ['commuter', 'portable', 'urban'],
    isActive: true
  }
];

const sampleOffers = [
  {
    vehicleId: null, // Will be set after vehicles are created
    title: 'Tesla Model 3 Flash Sale',
    description: 'Limited time offer! Get 10% off on Tesla Model 3. Don\'t miss this exclusive deal!',
    discount: 10,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    type: 'percentage',
    isActive: true,
    usageCount: 0,
    maxUsage: 100
  },
  {
    vehicleId: null, // Will be set after vehicles are created
    title: 'Zero SR/F Launch Offer',
    description: 'Be among the first to own the revolutionary Zero SR/F! Special launch pricing available.',
    discount: 15,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    type: 'percentage',
    isActive: true,
    usageCount: 0,
    maxUsage: 50
  },
  {
    vehicleId: null, // Will be set after vehicles are created
    title: 'Segway Ninebot Weekend Special',
    description: 'Perfect for urban commuting! Get 20% off on Segway Ninebot G30P this weekend only.',
    discount: 20,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    type: 'percentage',
    isActive: true,
    usageCount: 0,
    maxUsage: 200
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ev_vehicles');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Vehicle.deleteMany({});
    await Offer.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Insert sample vehicles
    const vehicles = await Vehicle.insertMany(sampleVehicles);
    console.log(`✅ Inserted ${vehicles.length} vehicles`);

    // Update offers with vehicle IDs
    sampleOffers[0].vehicleId = vehicles[0]._id; // Tesla offer
    sampleOffers[1].vehicleId = vehicles[1]._id; // Zero offer
    sampleOffers[2].vehicleId = vehicles[2]._id; // Segway offer

    // Insert sample offers
    const offers = await Offer.insertMany(sampleOffers);
    console.log(`✅ Inserted ${offers.length} offers`);

    console.log('🎉 Database seeded successfully!');
    console.log('📊 Sample data:');
    console.log(`   - ${vehicles.length} vehicles`);
    console.log(`   - ${offers.length} offers`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

seedDatabase();
