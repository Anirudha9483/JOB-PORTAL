const express = require('express');
const router = express.Router();
const Test = require('../models/Test');
const authMiddleware = require('../middleware/authMiddleware');

// 1. @route   POST /api/tests
//    @desc    Company creates a new custom test (Assessment or Practice)
router.post('/', authMiddleware(['Company']), async (req, res) => {
  try {
    const { testName, role, duration, testType, questions } = req.body;

    const newTest = new Test({
      companyId: req.user.id,
      testName,
      role,
      duration,
      testType, // Saves whether it is 'Assessment' or 'Practice'
      questions
    });

    const savedTest = await newTest.save();
    res.status(201).json({ message: 'Test created successfully', test: savedTest });

  } catch (error) {
    console.error('Error creating test:', error);
    if (error.name === 'ValidationError' || error.message?.startsWith('Validation Failed')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// 2. @route   GET /api/tests/company
//    @desc    Get ALL tests created by the logged-in company
router.get('/company', authMiddleware(['Company']), async (req, res) => {
  try {
    const tests = await Test.find({ companyId: req.user.id }).sort({ createdAt: -1 });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// 3. @route   GET /api/tests/practice
//    @desc    Candidates fetch all globally available Practice Tests
// IMPORTANT: This must be placed BEFORE /:testId
router.get('/practice', authMiddleware(['User', 'Company']), async (req, res) => {
  try {
    // Find all tests where the company marked it as 'Practice'
    const practiceTests = await Test.find({ testType: 'Practice' }).sort({ createdAt: -1 });
    res.json(practiceTests);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// 4. @route   GET /api/tests/:testId
//    @desc    Candidate fetches specific test to take it OR Company fetches to preview it
router.get('/:testId', authMiddleware(['User', 'Company']), async (req, res) => {
  try {
    const test = await Test.findById(req.params.testId);
    
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    
    res.json(test);
  } catch (error) {
    console.error("Fetch test error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// 5. @route   PUT /api/tests/:testId
//    @desc    Company updates/edits an existing test
router.put('/:testId', authMiddleware(['Company']), async (req, res) => {
  try {
    // findOneAndUpdate ensures the company only edits THEIR OWN tests
    const updatedTest = await Test.findOneAndUpdate(
      { _id: req.params.testId, companyId: req.user.id },
      req.body,
      { new: true, runValidators: true } // Returns the newly updated document
    );

    if (!updatedTest) {
      return res.status(404).json({ message: 'Test not found or unauthorized' });
    }

    res.json({ message: 'Test updated successfully', test: updatedTest });
  } catch (error) {
    console.error('Update test error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// 6. @route   DELETE /api/tests/:testId
//    @desc    Company deletes an assessment from their library
router.delete('/:testId', authMiddleware(['Company']), async (req, res) => {
  try {
    // Find the test and ensure ONLY the company who created it can delete it
    const test = await Test.findOneAndDelete({ 
        _id: req.params.testId, 
        companyId: req.user.id 
    });
    
    if (!test) {
      return res.status(404).json({ message: 'Test not found or unauthorized' });
    }

    res.json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    console.error('Delete test error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;