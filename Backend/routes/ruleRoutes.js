const express = require('express');
const router = express.Router();
const ruleController = require('../controllers/ruleController');

// Define API routes
router.post('/create-rule', ruleController.createRule);
router.post('/combine-rules', ruleController.combineRules);
router.post('/evaluate-rule', ruleController.evaluateRule);

module.exports = router;
