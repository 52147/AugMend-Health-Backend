const express = require("express");
const router = express.Router();
const pool = require("../db");
const { encryptFeedback } = require("../utils/encryption");
const { decryptFeedback } = require("../utils/decryptFeedback");
require("dotenv").config();
const { body, validationResult } = require("express-validator");

// Validation Rules
const validateSurveyInputs = [
  body("patientName")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Patient Name should be between 3 and 50 characters"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("age")
    .isInt({ min: 1, max: 120 })
    .withMessage("Age should be a number between 1 and 120"),
  body("maritalStatus")
    .isIn(["Single", "Married", "Widowed", "Other"])
    .withMessage("Invalid marital status"),
  body("seenTherapist")
    .isIn(["Yes", "No"])
    .withMessage("Invalid response for seeing a therapist"),
  body("takingMedications")
    .isIn(["Yes", "No"])
    .withMessage("Invalid response for taking medications"),
  body("therapySatisfaction")
    .isInt({ min: 0, max: 5 })
    .withMessage("Satisfaction with Therapy should be between 0 and 5"),
  body("engagementFeedback")
    .isInt({ min: 0, max: 5 })
    .withMessage("Level of Engagement should be between 0 and 5"),
];

// Validation Middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Insert Feedback
router.post(
  "/feedback",
  validateSurveyInputs,
  handleValidationErrors,
  async (req, res) => {
    const {
      patientName,
      email,
      age,
      maritalStatus,
      otherMaritalStatus,
      seenTherapist,
      takingMedications,
      medications,
      therapySatisfaction,
      experienceFeedback,
      engagementFeedback,
      additionalComments,
    } = req.body;

    try {
      const query = `
            INSERT INTO feedback
            (patientName, email, age, maritalStatus, otherMaritalStatus, seenTherapist, takingMedications, medications, therapySatisfaction, experienceFeedback, engagementFeedback, additionalComments)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

      const [results] = await pool.execute(query, [
        encryptFeedback(patientName || ""),
        encryptFeedback(email || ""),
        age || null,
        maritalStatus || "",
        otherMaritalStatus || null,
        seenTherapist || "",
        takingMedications || "",
        takingMedications === "Yes"
          ? encryptFeedback(JSON.stringify(medications))
          : null,
        therapySatisfaction || 0,
        encryptFeedback(experienceFeedback || ""),
        engagementFeedback || 0,
        encryptFeedback(additionalComments || ""),
      ]);

      res
        .status(201)
        .json({
          message: "Feedback stored successfully",
          id: results.insertId,
        });
    } catch (error) {
      console.error("Error storing feedback:", error);
      res.status(500).json({ message: "Error storing feedback", error });
    }
  }
);

// Get All Feedback
router.get("/feedback", async (req, res) => {
  try {
    const query = `
            SELECT id, patientName, email, age, maritalStatus, otherMaritalStatus, seenTherapist,
                   takingMedications, medications, therapySatisfaction, experienceFeedback, engagementFeedback,
                   additionalComments
            FROM feedback
        `;
    const [rows] = await pool.query(query);

    // Decrypt sensitive fields
    const decryptedRows = rows.map((row) => ({
      ...row,
      patientName: decryptFeedback(row.patientName),
      email: decryptFeedback(row.email),
      experienceFeedback: decryptFeedback(row.experienceFeedback),
      additionalComments: decryptFeedback(row.additionalComments),
      medications: row.medications
        ? JSON.parse(decryptFeedback(row.medications))
        : null,
    }));

    res.status(200).json(decryptedRows);
  } catch (error) {
    console.error("Error retrieving feedback:", error);
    res.status(500).json({ message: "Error retrieving feedback", error });
  }
});

module.exports = router;
