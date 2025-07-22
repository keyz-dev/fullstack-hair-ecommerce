const express = require('express');
const { authenticateUser } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { qnaAskSchema, qnaAnswerSchema } = require('../schema/qnaSchema');
const qnaController = require('../controller/qna');

const router = express.Router();

router.post('/ask', authenticateUser, validate(qnaAskSchema), qnaController.askQuestion);
router.patch('/answer/:id', authenticateUser, validate(qnaAnswerSchema), qnaController.answerQuestion);
router.get('/target/:targetId', qnaController.getQnAForTarget);

module.exports = router; 