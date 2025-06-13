const mongoose = require('mongoose');
const Car = require('../models/Car');

// MongoDB connection string - update with your connection string
const MONGODB_URI = 'mongodb://localhost:27017/your_database';

const carData = [
    {
        name: "Toyota Camry",
        model: "2023",
        price: 25000,
        description: "Reliable sedan with great fuel economy"
    },
    {
        name: "Honda Civic",
        model: "2023",
        price: 22000,
        description: "Popular compact car with modern features"
    },
    {
        name: "Tesla Model 3",
        model: "2023",
        price: 45000,
        description: "Electric vehicle with cutting-edge technology"
    },
    {
        name: "Ford Mustang",
        model: "2023",
        price: 35000,
        description: "Classic American muscle car"
    },
    {
        name: "BMW 3 Series",
        model: "2023",
        price: 42000,
        description: "Luxury sedan with premium features"
    },
    // Add more cars to test pagination
    {
        name: "Audi A4",
        model: "2023",
        price: 40000,
        description: "Premium sedan with advanced technology"
    },
    {
        name: "Mercedes C-Class",
        model: "2023",
        price: 43000,
        description: "Luxury vehicle with elegant design"
    },
    {
        name: "Volkswagen Golf",
        model: "2023",
        price: 25000,
        description: "Practical hatchback with good performance"
    },
    {
        name: "Hyundai Sonata",
        model: "2023",
        price: 24000,
        description: "Mid-size sedan with modern features"
    },
    {
        name: "Kia K5",
        model: "2023",
        price: 23500,
        description: "Stylish sedan with great value"
    },
    {
        name: "Mazda 3",
        model: "2023",
        price: 23000,
        description: "Compact car with premium feel"
    },
    {
        name: "Subaru Impreza",
        model: "2023",
        price: 24000,
        description: "All-wheel drive compact car"
    }
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing cars
        await Car.deleteMany({});
        console.log('Cleared existing cars');

        // Insert new cars
        const cars = await Car.insertMany(carData);
        console.log(`Successfully seeded ${cars.length} cars`);

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase(); 