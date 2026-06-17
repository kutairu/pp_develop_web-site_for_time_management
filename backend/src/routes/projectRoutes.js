const express = require('express');
const router = express.Router();
const { getProjects, createProject, deleteProject } = require('../controllers/projectController');
const auth = require('../middleware/auth');

router.get('/', auth, getProjects);
router.post('/', auth, createProject);
router.delete('/:projectId', auth, deleteProject);

module.exports = router;
