# EV Vehicle Management System

A comprehensive electric vehicle management system with MongoDB backend and React frontend.

## Features

### Admin Dashboard
- **Dashboard**: Overview of key metrics and quick actions
- **Vehicle Management**: Add, edit, delete vehicles with detailed specifications
- **Offer Management**: Create and manage promotional offers
- **Inventory Management**: Track stock levels and vehicle status
- **Customer Management**: Manage customer database and interactions
- **Inquiry Management**: Handle customer inquiries and support requests
- **Analytics**: Comprehensive reports and data visualization
- **Notifications**: System alerts and important updates
- **Settings**: Configure system preferences and options

### User Features
- Browse electric vehicles with detailed specifications
- View active offers and discounts
- Interactive vehicle comparison
- Color selection and customization
- Responsive design for all devices

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Radix UI components
- React Router for navigation
- Axios for API calls
- Recharts for data visualization

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Express validation
- CORS and security middleware
- RESTful API design

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd EV/server
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp env.example .env
```

4. Update `.env` with your MongoDB connection string:
```
MONGODB_URI=mongodb://localhost:27017/ev_vehicles
PORT=5000
JWT_SECRET=your-secret-key
```

5. Start the server:
```bash
npm run dev
```

6. (Optional) Seed the database:
```bash
npm run seed
```

### Frontend Setup

1. Navigate to the main directory:
```bash
cd EV
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp env.example .env
```

4. Update `.env` with your API URL:
```
VITE_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `POST /api/vehicles` - Create new vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle
- `PATCH /api/vehicles/:id/inventory` - Update inventory

### Offers
- `GET /api/offers` - Get all offers
- `POST /api/offers` - Create new offer
- `PUT /api/offers/:id` - Update offer
- `DELETE /api/offers/:id` - Delete offer

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `POST /api/customers/:id/purchases` - Add purchase record

### Analytics
- `GET /api/analytics/dashboard` - Dashboard data
- `GET /api/analytics/sales` - Sales analytics
- `GET /api/analytics/inventory` - Inventory analytics

## Database Schema

### Vehicle
- Basic info: name, brand, price, year
- Specifications: charging time, range, battery, top speed
- Inventory: stock, reserved, status
- Metadata: colors, images, tags, category

### Offer
- Vehicle reference
- Discount details
- Validity period
- Usage tracking

### Customer
- Personal information
- Contact details
- Purchase history
- Test drive history

### Inquiry
- Customer reference
- Inquiry type and priority
- Message and responses
- Status tracking

## Development

### Running Tests
```bash
# Backend tests
cd server && npm test

# Frontend tests
npm test
```

### Building for Production
```bash
# Backend
cd server && npm run build

# Frontend
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.