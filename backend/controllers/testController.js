const Test = require('../models/Test');

exports.createTest = async (req, res) => {
    try {
        const { testName, role, duration, questions } = req.body;

        const newTest = new Test({
            companyId: req.user.id,
            testName,
            role,
            duration,
            questions
        });

        await newTest.save();
        res.status(201).json({ message: "Test created successfully!", test: newTest });
    } catch (error) {
        res.status(500).json({ message: "Error creating test", error: error.message });
    }
};

exports.getCompanyTests = async (req, res) => {
    try {
        const tests = await Test.find({ companyId: req.user.id });
        res.status(200).json(tests);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tests", error: error.message });
    }
};