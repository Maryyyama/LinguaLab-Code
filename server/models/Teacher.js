const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  firstName: String,
  lastName: String,
  language: { type: String, enum: ['english', 'german', 'spanish', 'chinese', 'french', 'japanese', 'korean', 'italian'] },
  specialization: [String],
  qualification: String,
  experience: Number,
  education: [{ institution: String, degree: String, year: Number }],
  methodology: String,
  interests: [String],
  contacts: {
    phone: String,
    email: String,
    city: String,
    address: String
  },
  schedule: [{
    day: String,
    time: String,
    format: { type: String, enum: ['online', 'offline'] },
    course: String,
    group: String
  }],
  currentLoad: {
    groups: [String],
    individualStudents: { type: Number, default: 0 },
    totalHours: { type: Number, default: 0 }
  },
  license: {
    number: String,
    issueDate: Date,
    expiryDate: Date,
    status: { type: String, default: 'active' }
  },
  methodologyWork: {
    metrics: [{
      indicator: String,
      value: String,
      dynamics: String,
      norm: String,
      comment: String
    }],
    plan: [{
      task: String,
      status: { type: String, enum: ['done', 'inprogress', 'notstarted'], default: 'notstarted' }
    }],
    resources: [String]
  },
  privacySettings: {
    showFullName: { type: Boolean, default: true },
    showSpecialization: { type: Boolean, default: true },
    showExperience: { type: Boolean, default: true },
    showEducation: { type: Boolean, default: true },
    showMethodology: { type: Boolean, default: true },
    showGroups: { type: Boolean, default: false },
    showIndividualStudents: { type: Boolean, default: false },
    showFormat: { type: Boolean, default: true },
    showContactInfo: { type: Boolean, default: false },
    showToGuests: { type: Boolean, default: false }
  },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', TeacherSchema, 'teachers');