const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  // Links the test to the specific employer
  companyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // NEW: Differentiates between Official and Practice tests
  testType: {
    type: String,
    enum: ['Assessment', 'Practice'],
    default: 'Assessment'
  },
  
  testName: { 
    type: String, 
    required: true,
    trim: true // Automatically removes accidental spaces at the beginning/end
  },
  
  role: { 
    type: String, 
    required: true,
    trim: true
  },
  
  duration: { 
    type: Number, 
    required: true,
    min: [1, 'Test duration must be at least 1 minute'] 
  }, 

  // Allows companies to hide/archive tests without losing historical data
  isActive: {
    type: Boolean,
    default: true 
  },
  
  // This array holds all the custom questions the employer types in
  questions: [{
    questionText: { 
        type: String, 
        required: true,
        trim: true
    },
    // Validation to ensure they provide at least 2 options
    options: {
        type: [{ 
            type: String, 
            required: true,
            trim: true
        }],
        validate: [arrayLimit, 'A question must have at least 2 options.']
    }, 
    correctAnswer: { 
        type: String, 
        required: true,
        trim: true
    }
  }]
}, { timestamps: true });

// --- CUSTOM VALIDATORS ---

// 1. Function to enforce the minimum number of options
function arrayLimit(val) {
  return val.length >= 2;
}

// 2. Pre-save hook: Runs when CREATING a new test
testSchema.pre('save', function () {
  for (let i = 0; i < this.questions.length; i++) {
    const q = this.questions[i];
    if (!q.options.includes(q.correctAnswer)) {
      throw new Error(`Validation Failed on Question ${i + 1}: The correct answer ("${q.correctAnswer}") is not listed in the options.`);
    }
  }
});

// 3. Pre-findOneAndUpdate hook: Runs when EDITING an existing test
testSchema.pre('findOneAndUpdate', function () {
  const update = this.getUpdate();
  
  // Safely check if questions are being updated
  const updatedQuestions = update.questions || (update.$set && update.$set.questions);
  
  if (updatedQuestions) {
    for (let i = 0; i < updatedQuestions.length; i++) {
      const q = updatedQuestions[i];
      if (!q.options.includes(q.correctAnswer)) {
        throw new Error(`Validation Failed on Question ${i + 1}: The correct answer ("${q.correctAnswer}") is not listed in the options.`);
      }
    }
  }
});

module.exports = mongoose.model('Test', testSchema);