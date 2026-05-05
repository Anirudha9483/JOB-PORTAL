const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');
const Admin = require('../models/Admin');

// --- REGISTRATION LOGIC ---
exports.register = async (req, res) => {
    try {
        const { name, companyName, email, password, role } = req.body;
        const normalizedEmail = email?.trim().toLowerCase();
        const validRoles = ['User', 'Company', 'Admin'];

        if (!normalizedEmail || !password || !role) {
            return res.status(400).json({ message: "Please provide all required fields." });
        }
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role selected." });
        }

        let existingAccount;
        // Check if email already exists in the specific collection
        if (role === 'User') existingAccount = await User.findOne({ email: normalizedEmail });
        else if (role === 'Company') existingAccount = await Company.findOne({ email: normalizedEmail });
        else if (role === 'Admin') existingAccount = await Admin.findOne({ email: normalizedEmail });

        if (existingAccount) {
            return res.status(400).json({ message: "Email already in use." });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the new account based on the role
        let newAccount;
        if (role === 'User') {
            newAccount = new User({ name, email: normalizedEmail, password: hashedPassword, role });
        } else if (role === 'Company') {
            newAccount = new Company({ companyName, email: normalizedEmail, password: hashedPassword, role });
        } else if (role === 'Admin') {
            newAccount = new Admin({ name, email: normalizedEmail, password: hashedPassword, role });
        }

        await newAccount.save();
        res.status(201).json({ message: `${role} registered successfully!` });

    } catch (error) {
        res.status(500).json({ message: "Server error during registration.", error: error.message });
    }
};

// --- LOGIN LOGIC ---
exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const normalizedEmail = email?.trim().toLowerCase();
        const validRoles = ['User', 'Company', 'Admin'];

        if (!normalizedEmail || !password || !role) {
            return res.status(400).json({ message: "Please provide email, password, and role." });
        }
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role selected." });
        }

        // Find the user in the correct collection
        let account;
        if (role === 'User') account = await User.findOne({ email: normalizedEmail });
        else if (role === 'Company') account = await Company.findOne({ email: normalizedEmail });
        else if (role === 'Admin') account = await Admin.findOne({ email: normalizedEmail });

        if (!account) {
            const roleMap = {
                User: await User.findOne({ email: normalizedEmail }),
                Company: await Company.findOne({ email: normalizedEmail }),
                Admin: await Admin.findOne({ email: normalizedEmail })
            };
            const matchedRole = Object.keys(roleMap).find((key) => Boolean(roleMap[key]));

            if (matchedRole && matchedRole !== role) {
                return res.status(404).json({ message: `Account exists as ${matchedRole}. Please select the correct role.` });
            }
            return res.status(404).json({ message: "Account not found." });
        }

        // Compare the provided password with the hashed password in the DB
        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // Generate a JWT Token
        const token = jwt.sign(
            { id: account._id, role: account.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' } // Token expires in 1 day
        );

        // Send token and basic user info back to the frontend
        res.status(200).json({ 
            token, 
            user: { id: account._id, role: account.role, email: account.email } 
        });

    } catch (error) {
        res.status(500).json({ message: "Server error during login.", error: error.message });
    }
};

// --- GET CURRENT USER (ME) ---
exports.getMe = async (req, res) => {
    try {
        const { role, id } = req.user;
        
        let account;
        if (role === 'User') account = await User.findById(id);
        else if (role === 'Company') account = await Company.findById(id);
        else if (role === 'Admin') account = await Admin.findById(id);

        if (!account) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ 
            user: { 
                id: account._id, 
                role: account.role, 
                email: account.email 
            } 
        });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching user data.", error: error.message });
    }
};
