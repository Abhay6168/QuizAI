const express = require('express');
const router = express.Router();
const { 
  createQuiz, 
  getQuizzes, 
  getQuizById, 
  updateQuiz, 
  deleteQuiz, 
  getDashboardStats 
} = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/dashboard/stats', protect, authorize('teacher', 'admin'), getDashboardStats);

router.route('/')
  .post(protect, authorize('teacher', 'admin'), createQuiz)
  .get(protect, authorize('teacher', 'admin'), getQuizzes);

router.route('/:id')
  .get(protect, getQuizById)
  .put(protect, authorize('teacher', 'admin'), updateQuiz)
  .delete(protect, authorize('teacher', 'admin'), deleteQuiz);

module.exports = router;
