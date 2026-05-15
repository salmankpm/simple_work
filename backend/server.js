const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/food_delivery_mini';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // For demo purposes, we can seed some restaurants if the db is empty
    const Restaurant = require('./models/Restaurant');
    Restaurant.countDocuments().then(count => {
      if(count === 0) {
        const seedRestaurants = [
          {
            name: "Burger Haven",
            cuisine: "American",
            rating: 4.5,
            deliveryTime: "25-35 min",
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
            menu: [
              { name: "Classic Cheeseburger", price: 8.99, description: "Juicy beef patty with cheese", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&q=80" },
              { name: "Crispy Fries", price: 3.99, description: "Golden crispy potato fries", image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=300&q=80" }
            ]
          },
          {
            name: "Pizza Paradise",
            cuisine: "Italian",
            rating: 4.7,
            deliveryTime: "30-45 min",
            image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&q=80",
            menu: [
              { name: "Margherita Pizza", price: 12.99, description: "Classic cheese and tomato", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&q=80" },
              { name: "Pepperoni Pizza", price: 14.99, description: "Loaded with pepperoni", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&q=80" }
            ]
          },
          {
            name: "Sushi World",
            cuisine: "Japanese",
            rating: 4.8,
            deliveryTime: "40-55 min",
            image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80",
            menu: [
              { name: "Spicy Tuna Roll", price: 11.99, description: "Fresh tuna with spicy mayo", image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&q=80" },
              { name: "Salmon Nigiri", price: 9.99, description: "Fresh salmon over rice", image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=300&q=80" }
            ]
          }
        ];
        Restaurant.insertMany(seedRestaurants).then(() => console.log('Seeded restaurants'));
      }
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
