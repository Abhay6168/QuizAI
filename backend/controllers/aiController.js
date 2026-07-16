const { extractTextFromBuffer, generateAIQuestions, generateReplacementQuestion, rewriteQuestion } = require('../services/geminiService');

// @desc    Generate quiz questions from uploaded files or raw text notes
// @route   POST /api/ai/generate
// @access  Private (Teacher, Admin)
const generateQuizFromUpload = async (req, res) => {
  try {
    const { text, difficulty, count, type, language } = req.body;
    
    let sourceInput;

    if (req.file) {
      console.log(`📂 Processing uploaded file: ${req.file.originalname}`);
      const extractedText = await extractTextFromBuffer(req.file.buffer, req.file.originalname);
      sourceInput = { file: req.file, text: `${text || ''}\n\n[Uploaded Document Content]:\n${extractedText}` };
    } else if (text) {
      sourceInput = text;
    } else {
      return res.status(400).json({ success: false, message: 'Please provide either an uploaded document file or text notes.' });
    }

    const questionCount = parseInt(count) || 5;
    const level = difficulty || 'medium';
    const qType = type || 'mixed';
    const lang = language || 'English';

    console.log(`🤖 Requesting ${questionCount} ${qType} ${level} questions in ${lang}`);
    const questions = await generateAIQuestions(sourceInput, questionCount, level, qType, lang);

    return res.status(200).json({
      success: true,
      message: 'Questions generated successfully',
      data: {
        extractedTextSnippet: typeof sourceInput === 'string' ? sourceInput.substring(0, 200) + '...' : `[Document Upload: ${req.file.originalname}]`,
        questions
      }
    });
  } catch (error) {
    console.error('Quiz generation error:', error);
    return res.status(500).json({ success: false, message: `Failed to generate questions: ${error.message}` });
  }
};

// @desc    Regenerate a single replacement question card based on a deleted topic
// @route   POST /api/ai/regenerate
// @access  Private (Teacher, Admin)
const regenerateQuestion = async (req, res) => {
  try {
    const { topic, difficulty, language } = req.body;

    if (!topic) {
      return res.status(400).json({ success: false, message: 'Topic parameter is required to generate a matching replacement.' });
    }

    const level = difficulty || 'medium';
    const lang = language || 'English';

    console.log(`♻️ Regenerating replacement for deleted topic: "${topic}"`);
    const replacement = await generateReplacementQuestion(topic, level, lang);

    return res.status(200).json({
      success: true,
      message: 'Replacement question card created successfully',
      data: replacement
    });
  } catch (error) {
    console.error('Single card regeneration error:', error);
    return res.status(500).json({ success: false, message: `Failed to regenerate replacement: ${error.message}` });
  }
};

// @desc    Rewrite a single question card based on quality criteria
// @route   POST /api/ai/rewrite
// @access  Private (Teacher, Admin)
const rewriteQuestionCard = async (req, res) => {
  try {
    const { questionCard, language } = req.body;

    if (!questionCard) {
      return res.status(400).json({ success: false, message: 'Question card object is required to execute a rewrite.' });
    }

    const lang = language || 'English';

    console.log(`🔮 Initiating rewrite request for concept: "${questionCard.concept}"`);
    const rewritten = await rewriteQuestion(questionCard, lang);

    return res.status(200).json({
      success: true,
      message: 'Question card rewritten successfully',
      data: rewritten
    });
  } catch (error) {
    console.error('Question card rewrite error:', error);
    return res.status(500).json({ success: false, message: `Failed to rewrite question card: ${error.message}` });
  }
};

module.exports = {
  generateQuizFromUpload,
  regenerateQuestion,
  rewriteQuestionCard
};
