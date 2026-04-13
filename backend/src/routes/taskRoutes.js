const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Helper middleware for 405 Method Not Allowed
const methodNotAllowed = (req, res) => {
    res.status(405).json({
        success: false,
        message: 'Method Not Allowed'
    });
};

router.route('/')
    .post(taskController.createTask)
    .get(taskController.getAllTasks)
    .all(methodNotAllowed);

router.route('/:id')
    .get(taskController.getTaskById)
    .put(taskController.updateTask)
    .delete(taskController.deleteTask)
    .all(methodNotAllowed);

router.route('/:id/done')
    .patch(taskController.markTaskAsDone)
    .all(methodNotAllowed);

module.exports = router;
