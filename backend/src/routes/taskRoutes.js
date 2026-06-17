const express = require('express');
const router = express.Router({ mergeParams: true }); // важно для вложенных роутов
const { getTasks, createTask, updateTaskStatus, deleteTask } = require('../controllers/taskController');
const auth = require('../middleware/auth');

router.get('/', auth, getTasks);
router.post('/', auth, createTask);
router.patch('/:taskId/status', auth, updateTaskStatus);
router.delete('/:taskId', auth, deleteTask);

module.exports = router;