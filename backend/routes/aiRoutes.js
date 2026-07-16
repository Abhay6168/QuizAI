const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { generateQuizFromUpload, regenerateQuestion, rewriteQuestionCard } = require('../controllers/aiController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/generate', protect, authorize('teacher', 'admin'), upload.single('file'), generateQuizFromUpload);
router.post('/regenerate', protect, authorize('teacher', 'admin'), regenerateQuestion);
router.post('/rewrite', protect, authorize('teacher', 'admin'), rewriteQuestionCard);

module.exports = router;
