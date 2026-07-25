require("dotenv").config();

const bcrypt = require("bcryptjs");

const connectDB = require("./src/config/db");

const User = require("./src/models/User");

const seedUsers = async () => {
  try {
    await connectDB();

    console.log("Connected to MongoDB");

    // Admin credentials
    const adminEmail = "admin@leadflow.com";
    const adminPassword = "Admin@12345";

    // Member credentials
    const memberEmail = "member@leadflow.com";
    const memberPassword = "Member@12345";

    // Check Admin
    const existingAdmin = await User.findOne({
      email: adminEmail,
    });

    if (!existingAdmin) {
      const adminPasswordHash =
        await bcrypt.hash(
          adminPassword,
          12
        );

      await User.create({
        name: "LeadFlow Admin",
        email: adminEmail,
        passwordHash: adminPasswordHash,
        role: "ADMIN",
      });

      console.log(
        "Admin user created successfully"
      );
    } else {
      console.log(
        "Admin user already exists"
      );
    }

    // Check Member
    const existingMember = await User.findOne({
      email: memberEmail,
    });

    if (!existingMember) {
      const memberPasswordHash =
        await bcrypt.hash(
          memberPassword,
          12
        );

      await User.create({
        name: "LeadFlow Member",
        email: memberEmail,
        passwordHash: memberPasswordHash,
        role: "MEMBER",
      });

      console.log(
        "Member user created successfully"
      );
    } else {
      console.log(
        "Member user already exists"
      );
    }

    console.log(
      "\nSeed completed successfully!"
    );

    console.log(
      "\nAdmin:"
    );

    console.log(
      "Email:",
      adminEmail
    );

    console.log(
      "Password:",
      adminPassword
    );

    console.log(
      "\nMember:"
    );

    console.log(
      "Email:",
      memberEmail
    );

    console.log(
      "Password:",
      memberPassword
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Seed failed:",
      error
    );

    process.exit(1);
  }
};

seedUsers();