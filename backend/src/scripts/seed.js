const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDb = require("../config/db");
const User = require("../models/User");
const Car = require("../models/Car");

const OWNER_ID = new mongoose.Types.ObjectId("67fe3467ed8a8fe17d0ba6e2");

const cars = [
  {
    _id: new mongoose.Types.ObjectId("67ff5bc069c03d4e45f30b77"),
    ownerId: OWNER_ID,
    brand: "BMW",
    model: "X5",
    year: 2006,
    pricePerDay: 300,
    category: "SUV",
    transmission: "Semi-Automatic",
    fuelType: "Hybrid",
    seats: 4,
    location: "New York",
    description:
      "The BMW X5 is a mid-size luxury SUV produced by BMW. The X5 made its debut in 1999 as the first SUV ever produced by BMW.",
    features: ["360 Camera", "Bluetooth", "GPS", "Heated Seats", "Rear View Mirror"],
    images: [],
    isAvailable: true
  },
  {
    _id: new mongoose.Types.ObjectId("67ff6b758f1b3684286a2a65"),
    ownerId: OWNER_ID,
    brand: "Toyota",
    model: "Corolla",
    year: 2021,
    pricePerDay: 130,
    category: "Sedan",
    transmission: "Manual",
    fuelType: "Diesel",
    seats: 4,
    location: "Chicago",
    description:
      "The Toyota Corolla is a mid-size luxury sedan produced by Toyota. The Corolla made its debut in 2008 as the first sedan ever produced by Toyota.",
    features: ["Bluetooth", "GPS", "Rear View Mirror", "Eco Mode"],
    images: [],
    isAvailable: true
  },
  {
    _id: new mongoose.Types.ObjectId("67ff6b9f8f1b3684286a2a68"),
    ownerId: OWNER_ID,
    brand: "Jeep",
    model: "Wrangler",
    year: 2023,
    pricePerDay: 200,
    category: "SUV",
    transmission: "Automatic",
    fuelType: "Hybrid",
    seats: 4,
    location: "Los Angeles",
    description:
      "The Jeep Wrangler is a rugged SUV built for both city comfort and off-road adventure.",
    features: ["All-Terrain Mode", "Bluetooth", "360 Camera", "Heated Seats"],
    images: [],
    isAvailable: true
  },
  {
    _id: new mongoose.Types.ObjectId("68009c93a3f5fc6338ea7e34"),
    ownerId: OWNER_ID,
    brand: "Ford",
    model: "Neo 6",
    year: 2022,
    pricePerDay: 209,
    category: "Sedan",
    transmission: "Semi-Automatic",
    fuelType: "Diesel",
    seats: 2,
    location: "Houston",
    description:
      "A sleek sedan with a sporty feel, ideal for short city trips and smooth highway rides.",
    features: ["Premium Audio", "GPS", "Rear View Mirror", "Heated Seats"],
    images: [],
    isAvailable: true
  },
  {
    _id: new mongoose.Types.ObjectId("68009c93a3f5fc6338ea7e35"),
    ownerId: OWNER_ID,
    brand: "BMW",
    model: "M4",
    year: 2021,
    pricePerDay: 220,
    category: "Sedan",
    transmission: "Automatic",
    fuelType: "Hybrid",
    seats: 2,
    location: "New York",
    description:
      "The BMW M4 blends performance engineering with comfort, making it ideal for premium city drives.",
    features: ["Sport Mode", "Bluetooth", "GPS", "Heated Seats", "360 Camera"],
    images: [],
    isAvailable: true
  },
  {
    _id: new mongoose.Types.ObjectId("68009c93a3f5fc6338ea7e36"),
    ownerId: OWNER_ID,
    brand: "Toyota",
    model: "Corolla",
    year: 2021,
    pricePerDay: 130,
    category: "Sedan",
    transmission: "Automatic",
    fuelType: "Diesel",
    seats: 4,
    location: "Los Angeles",
    description:
      "The Toyota Corolla is a reliable sedan with smooth handling and modern comfort.",
    features: ["Rear View Mirror", "Bluetooth", "GPS", "Eco Mode"],
    images: [],
    isAvailable: true
  }
];

async function seed() {
  await connectDb();

  // Ensure owner user exists (password is only for local testing)
  // Hash the password before saving (since $setOnInsert bypasses Mongoose hooks)
  const hashedPassword = await bcrypt.hash("password123", 10);
  
  await User.updateOne(
    { _id: OWNER_ID },
    {
      $setOnInsert: {
        _id: OWNER_ID,
        name: "GreatStack",
        email: "admin@example.com",
        password: hashedPassword,
        role: "owner"
      }
    },
    { upsert: true }
  );
  
  // Always ensure password is correctly hashed (update existing users too)
  const owner = await User.findById(OWNER_ID).select("+password");
  if (owner) {
    // Check if password is already correctly hashed by trying to compare
    // If password is plain text, bcrypt.compare will fail
    let passwordMatch = false;
    try {
      passwordMatch = await bcrypt.compare("password123", owner.password);
    } catch {
      // Password is not a valid bcrypt hash, needs updating
      passwordMatch = false;
    }
    
    if (!passwordMatch) {
      // Password is not hashed or incorrect, update it
      // Use updateOne to bypass the pre-save hook (since we already hashed it)
      await User.updateOne(
        { _id: OWNER_ID },
        { $set: { password: hashedPassword } }
      );
      console.log("Updated owner password to hashed version");
    }
  }

  // Upsert cars by fixed IDs
  for (const car of cars) {
    // eslint-disable-next-line no-await-in-loop
    await Car.updateOne({ _id: car._id }, { $set: car }, { upsert: true });
  }

  console.log("Seed complete.");
  await mongoose.connection.close();
}

seed().catch(async (err) => {
  console.error(err);
  try {
    await mongoose.connection.close();
  } catch {}
  process.exit(1);
});

