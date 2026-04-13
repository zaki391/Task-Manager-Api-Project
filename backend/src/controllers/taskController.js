const { generateId } = require('../utils/idGenerator');

// In-memory storage
let tasks = [];

const createTask = (req, res, next) => {
    try {
        const { title, description } = req.body;

        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Title is required and must be a non-empty string'
            });
        }

        const newTask = {
            id: generateId(),
            title: title.trim(),
            description: description ? String(description).trim() : '',
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        tasks.push(newTask);

        res.status(201).json({
            success: true,
            data: newTask
        });
    } catch (err) {
        next(err);
    }
};

const getAllTasks = (req, res, next) => {
    try {
        const { status, sort } = req.query;
        let result = [...tasks];

        // Filtering
        if (status) {
            result = result.filter(task => task.status === status);
        }

        // Sorting by createdAt
        if (sort === 'createdAt') {
            result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        next(err);
    }
};

const getTaskById = (req, res, next) => {
    try {
        const { id } = req.params;
        const task = tasks.find(t => t.id === id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task with given ID not found'
            });
        }

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (err) {
        next(err);
    }
};

const updateTask = (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        const taskIndex = tasks.findIndex(t => t.id === id);

        if (taskIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Task with given ID not found'
            });
        }
        
        if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
             return res.status(400).json({
                success: false,
                message: 'Title must be a non-empty string if provided'
            });
        }

        const task = tasks[taskIndex];
        
        if (title !== undefined) {
             task.title = title.trim();
        }
        if (description !== undefined) {
             task.description = String(description).trim();
        }

        tasks[taskIndex] = task;

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (err) {
        next(err);
    }
};

const markTaskAsDone = (req, res, next) => {
    try {
        const { id } = req.params;
        const taskIndex = tasks.findIndex(t => t.id === id);

        if (taskIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Task with given ID not found'
            });
        }

        tasks[taskIndex].status = 'done';

        res.status(200).json({
            success: true,
            data: tasks[taskIndex]
        });
    } catch (err) {
        next(err);
    }
};

const deleteTask = (req, res, next) => {
    try {
        const { id } = req.params;
        const taskIndex = tasks.findIndex(t => t.id === id);

        if (taskIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Task with given ID not found'
            });
        }

        tasks.splice(taskIndex, 1);

        res.status(200).json({
            success: true,
            data: null
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    markTaskAsDone,
    deleteTask
};
