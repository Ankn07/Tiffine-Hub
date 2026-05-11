const mongoose = require("mongoose");
const env = require("../config/env");
const Zone = require("../models/zone.model");
const Administrator = require("../models/administrator.model");
const { hashPassword } = require("../utils/authUtils");

async function seedDatabase(username, password) {
  try {
    await mongoose.connect(env.MONGO_URI);

    console.log("✅ Connected to MongoDB for seeding");

    // Clear old data
    await Zone.deleteMany({});
    await Administrator.deleteMany({});

    // Seed Administrator
    const adminPassword = await hashPassword(password );

    const admin = await Administrator.create({
      name: "Super Admin",
      username: username ,
      phone: 9830640814,
      password: adminPassword,
    });

    console.log("✅ Administrator seeded");

    // Seed Zones
    const zones = [
      {
        area: "North Kolkata",
        zone_name: "North Zone",
        latitude: 22.6067,
        longitude: 88.3733,
        operator_id: "OP-NORTH-001",
        created_by: admin._id.toString(),
        updated_by: admin._id.toString(),
        zone: [
          {
            post_office: "Shyambazar",
            pin_code: 700004,
          },
          {
            post_office: "Dum Dum",
            pin_code: 700028,
          },
          {
            post_office: "Baranagar",
            pin_code: 700036,
          },
        ],
      },
      {
        area: "South Kolkata",
        zone_name: "South Zone",
        latitude: 22.5016,
        longitude: 88.3615,
        operator_id: "OP-SOUTH-001",
        created_by: admin._id.toString(),
        updated_by: admin._id.toString(),
        zone: [
          {
            post_office: "Garia",
            pin_code: 700084,
          },
          {
            post_office: "Jadavpur",
            pin_code: 700032,
          },
          {
            post_office: "Tollygunge",
            pin_code: 700033,
          },
        ],
      },
      {
        area: "Central Kolkata",
        zone_name: "Central Zone",
        latitude: 22.5726,
        longitude: 88.3639,
        operator_id: "OP-CENTRAL-001",
        created_by: admin._id.toString(),
        updated_by: admin._id.toString(),
        zone: [
          {
            post_office: "Park Street",
            pin_code: 700016,
          },
          {
            post_office: "Esplanade",
            pin_code: 700069,
          },
          {
            post_office: "Burrabazar",
            pin_code: 700007,
          },
        ],
      },
      {
        area: "East Kolkata",
        zone_name: "East Zone",
        latitude: 22.5797,
        longitude: 88.4120,
        operator_id: "OP-EAST-001",
        created_by: admin._id.toString(),
        updated_by: admin._id.toString(),
        zone: [
          {
            post_office: "Salt Lake",
            pin_code: 700091,
          },
          {
            post_office: "New Town",
            pin_code: 700156,
          },
          {
            post_office: "Rajarhat",
            pin_code: 700135,
          },
        ],
      },
      {
        area: "West Kolkata",
        zone_name: "West Zone",
        latitude: 22.5958,
        longitude: 88.2636,
        operator_id: "OP-WEST-001",
        created_by: admin._id.toString(),
        updated_by: admin._id.toString(),
        zone: [
          {
            post_office: "Howrah",
            pin_code: 711101,
          },
          {
            post_office: "Shibpur",
            pin_code: 711102,
          },
          {
            post_office: "Santragachi",
            pin_code: 711104,
          },
        ],
      },
    ];

    await Zone.insertMany(zones);

    console.log("✅ Zones seeded successfully");
    console.log("✅ Database seeding completed");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}


export default seedDatabase;