const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config(); // To load your MONGO_URI
const Admin = require('./models/Admin');

const seedAdmin = async () => {
    try {
        // 1. Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // 2. Check if an admin already exists
        const adminExists = await Admin.findOne({ email: 'admin@jobportal.com' });
        if (adminExists) {
            console.log('⚠️ Admin already exists in the database!');
            process.exit();
        }

        // 3. Hash the secure password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('SuperSecretPassword123!', salt);

        // 4. Create the Admin in the database
        const superAdmin = new Admin({
            name: 'System Administrator',
            email: 'admin@jobportal.com',
            password: hashedPassword,
            role: 'Admin'
        });

        await superAdmin.save();
        console.log('👑 Super Admin successfully created in the database!');
        process.exit(); // Stop the script
        
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
};

// Run the function
seedAdmin();