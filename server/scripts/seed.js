import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import Offer from '../models/Offer.js';
import Customer from '../models/Customer.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ev_vehicles');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await Offer.deleteMany({});
    await Customer.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: process.env.ADMIN_EMAIL || 'admin@ev.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin',
      profile: {
        firstName: 'Admin',
        lastName: 'User'
      },
      permissions: {
        vehicles: { create: true, read: true, update: true, delete: true },
        offers: { create: true, read: true, update: true, delete: true },
        customers: { create: true, read: true, update: true, delete: true },
        analytics: { read: true }
      }
    });

    await adminUser.save();
    console.log('👤 Created admin user');

    // Create sample vehicles
    const vehicles = [
      {
        name: 'EcoRide X1',
        brand: 'Tesla',
        price: 45000,
        year: 2024,
        fuelType: 'Electric',
        chargingTime: '6 hours',
        range: '95 km',
        battery: '2.3 kWh',
        topSpeed: '65 km/hr',
        colors: ['Red', 'Blue', 'White', 'Black'],
        featured: true,
        category: 'scooter',
        inventory: {
          stock: 15,
          reserved: 2,
          status: 'available'
        },
        specifications: {
          acceleration: '0-50 km/h in 4.2s',
          weight: '85 kg',
          dimensions: '1800 x 700 x 1200 mm',
          warranty: '2 years',
          chargingPort: 'Type 2'
        },
        tags: ['eco-friendly', 'urban', 'commuter']
      },
      {
        name: 'GreenSpeed Pro',
        brand: 'BMW',
        price: 55000,
        year: 2024,
        fuelType: 'Electric',
        chargingTime: '8 hours',
        range: '120 km',
        battery: '3.2 kWh',
        topSpeed: '80 km/hr',
        colors: ['Silver', 'Black', 'Green'],
        featured: true,
        category: 'motorcycle',
        inventory: {
          stock: 8,
          reserved: 1,
          status: 'available'
        },
        specifications: {
          acceleration: '0-60 km/h in 3.8s',
          weight: '120 kg',
          dimensions: '2100 x 800 x 1300 mm',
          warranty: '3 years',
          chargingPort: 'CCS'
        },
        tags: ['premium', 'sport', 'long-range']
      },
      {
        name: 'CityCruiser',
        brand: 'Honda',
        price: 35000,
        year: 2024,
        fuelType: 'Electric',
        chargingTime: '4 hours',
        range: '75 km',
        battery: '1.8 kWh',
        topSpeed: '55 km/hr',
        colors: ['White', 'Red', 'Blue'],
        featured: false,
        category: 'scooter',
        inventory: {
          stock: 25,
          reserved: 3,
          status: 'available'
        },
        specifications: {
          acceleration: '0-40 km/h in 5.0s',
          weight: '75 kg',
          dimensions: '1700 x 650 x 1100 mm',
          warranty: '2 years',
          chargingPort: 'Type 1'
        },
        tags: ['budget', 'city', 'lightweight']
      },
      {
        name: 'ThunderBolt',
        brand: 'Ducati',
        price: 75000,
        year: 2024,
        fuelType: 'Electric',
        chargingTime: '10 hours',
        range: '150 km',
        battery: '4.5 kWh',
        topSpeed: '100 km/hr',
        colors: ['Red', 'Black', 'Yellow'],
        featured: true,
        category: 'motorcycle',
        inventory: {
          stock: 5,
          reserved: 0,
          status: 'available'
        },
        specifications: {
          acceleration: '0-80 km/h in 3.2s',
          weight: '150 kg',
          dimensions: '2200 x 850 x 1400 mm',
          warranty: '3 years',
          chargingPort: 'CCS'
        },
        tags: ['premium', 'racing', 'high-performance']
      },
      {
        name: 'UrbanGlide',
        brand: 'Yamaha',
        price: 40000,
        year: 2024,
        fuelType: 'Electric',
        chargingTime: '5 hours',
        range: '85 km',
        battery: '2.0 kWh',
        topSpeed: '60 km/hr',
        colors: ['Blue', 'White', 'Gray'],
        featured: false,
        category: 'scooter',
        inventory: {
          stock: 20,
          reserved: 2,
          status: 'available'
        },
        specifications: {
          acceleration: '0-45 km/h in 4.5s',
          weight: '80 kg',
          dimensions: '1750 x 680 x 1150 mm',
          warranty: '2 years',
          chargingPort: 'Type 2'
        },
        tags: ['reliable', 'urban', 'comfortable']
      }
    ];

    const createdVehicles = await Vehicle.insertMany(vehicles);
    console.log(`🚗 Created ${createdVehicles.length} vehicles`);

    // Create sample offers
    const offers = [
      {
        vehicleId: createdVehicles[0]._id,
        title: 'Summer Sale',
        description: 'Special discount for summer season',
        discount: 15,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        type: 'percentage',
        isActive: true
      },
      {
        vehicleId: createdVehicles[1]._id,
        title: 'Premium Package',
        description: 'Limited time offer on premium vehicles',
        discount: 20,
        validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
        type: 'percentage',
        isActive: true
      },
      {
        vehicleId: createdVehicles[2]._id,
        title: 'Student Discount',
        description: 'Special pricing for students',
        discount: 10,
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        type: 'percentage',
        isActive: true
      }
    ];

    await Offer.insertMany(offers);
    console.log(`🎯 Created ${offers.length} offers`);

    // Create sample customers
    const customers = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+91 9876543210',
        address: {
          street: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          country: 'India'
        },
        preferences: {
          vehicleType: ['scooter', 'motorcycle'],
          priceRange: { min: 30000, max: 60000 },
          colors: ['Red', 'Blue', 'Black']
        },
        purchaseHistory: [
          {
            vehicleId: createdVehicles[0]._id,
            purchaseDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            amount: 45000
          }
        ],
        testDriveHistory: [
          {
            vehicleId: createdVehicles[1]._id,
            scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            status: 'scheduled'
          }
        ]
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+91 9876543211',
        address: {
          street: '456 Park Avenue',
          city: 'Delhi',
          state: 'Delhi',
          zipCode: '110001',
          country: 'India'
        },
        preferences: {
          vehicleType: ['scooter'],
          priceRange: { min: 25000, max: 40000 },
          colors: ['White', 'Silver']
        },
        testDriveHistory: [
          {
            vehicleId: createdVehicles[2]._id,
            scheduledDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            status: 'completed'
          }
        ]
      },
      {
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@example.com',
        phone: '+91 9876543212',
        address: {
          street: '789 Tech Park',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560001',
          country: 'India'
        },
        preferences: {
          vehicleType: ['motorcycle'],
          priceRange: { min: 50000, max: 80000 },
          colors: ['Red', 'Black']
        },
        purchaseHistory: [
          {
            vehicleId: createdVehicles[3]._id,
            purchaseDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
            amount: 75000
          }
        ]
      }
    ];

    await Customer.insertMany(customers);
    console.log(`👥 Created ${customers.length} customers`);

    console.log('🌱 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Admin user: ${adminUser.email}`);
    console.log(`- Vehicles: ${createdVehicles.length}`);
    console.log(`- Offers: ${offers.length}`);
    console.log(`- Customers: ${customers.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

seedData();
