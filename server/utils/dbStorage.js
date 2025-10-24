import Vehicle from '../models/Vehicle.js';
import Offer from '../models/Offer.js';
import Customer from '../models/Customer.js';
import Inquiry from '../models/Inquiry.js';
import Achievement from '../models/Achievement.js';

// Simple wrapper functions used by existing routes to minimize code changes
export const vehicleStorage = {
  getAll: async (criteria = {}) => Vehicle.find(criteria).lean(),
  getById: async (id) => Vehicle.findById(id).lean(),
  create: async (data) => {
    const doc = new Vehicle(data);
    await doc.save();
    return doc.toObject();
  },
  update: async (id, data) => {
    const updated = await Vehicle.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
    if (!updated) throw new Error(`vehicles with id ${id} not found`);
    return updated;
  },
  delete: async (id) => {
    const res = await Vehicle.findByIdAndDelete(id).lean();
    if (!res) throw new Error(`vehicles with id ${id} not found`);
    return { success: true };
  },
  find: async (criteria = {}) => Vehicle.find(criteria).lean(),
  count: async (criteria = {}) => Vehicle.countDocuments(criteria)
};

export const offerStorage = {
  getAll: async (criteria = {}) => Offer.find(criteria).lean(),
  getById: async (id) => Offer.findById(id).lean(),
  create: async (data) => {
    const doc = new Offer(data);
    await doc.save();
    return doc.toObject();
  },
  update: async (id, data) => {
    const updated = await Offer.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
    if (!updated) throw new Error(`offers with id ${id} not found`);
    return updated;
  },
  delete: async (id) => {
    const res = await Offer.findByIdAndDelete(id).lean();
    if (!res) throw new Error(`offers with id ${id} not found`);
    return { success: true };
  },
  find: async (criteria = {}) => Offer.find(criteria).lean(),
  count: async (criteria = {}) => Offer.countDocuments(criteria)
};

export const customerStorage = {
  getAll: async (criteria = {}) => Customer.find(criteria).lean(),
  getById: async (id) => Customer.findById(id).lean(),
  create: async (data) => {
    const doc = new Customer(data);
    await doc.save();
    return doc.toObject();
  },
  update: async (id, data) => {
    const updated = await Customer.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
    if (!updated) throw new Error(`customers with id ${id} not found`);
    return updated;
  },
  delete: async (id) => {
    const res = await Customer.findByIdAndDelete(id).lean();
    if (!res) throw new Error(`customers with id ${id} not found`);
    return { success: true };
  },
  find: async (criteria = {}) => Customer.find(criteria).lean(),
  count: async (criteria = {}) => Customer.countDocuments(criteria)
};

export const inquiryStorage = {
  getAll: async (criteria = {}) => Inquiry.find(criteria).lean(),
  getById: async (id) => Inquiry.findById(id).lean(),
  create: async (data) => {
    const doc = new Inquiry(data);
    await doc.save();
    return doc.toObject();
  },
  update: async (id, data) => {
    const updated = await Inquiry.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
    if (!updated) throw new Error(`inquiries with id ${id} not found`);
    return updated;
  },
  delete: async (id) => {
    const res = await Inquiry.findByIdAndDelete(id).lean();
    if (!res) throw new Error(`inquiries with id ${id} not found`);
    return { success: true };
  },
  find: async (criteria = {}) => Inquiry.find(criteria).lean(),
  count: async (criteria = {}) => Inquiry.countDocuments(criteria)
};

export const achievementStorage = {
  getAll: async (criteria = {}) => Achievement.find(criteria).lean(),
  getById: async (id) => Achievement.findById(id).lean(),
  create: async (data) => {
    const doc = new Achievement(data);
    await doc.save();
    return doc.toObject();
  },
  update: async (id, data) => {
    const updated = await Achievement.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
    if (!updated) throw new Error(`achievements with id ${id} not found`);
    return updated;
  },
  delete: async (id) => {
    const res = await Achievement.findByIdAndDelete(id).lean();
    if (!res) throw new Error(`achievements with id ${id} not found`);
    return { success: true };
  },
  find: async (criteria = {}) => Achievement.find(criteria).lean(),
  count: async (criteria = {}) => Achievement.countDocuments(criteria)
};

export default {
  vehicleStorage,
  offerStorage,
  customerStorage,
  inquiryStorage,
  achievementStorage
};
