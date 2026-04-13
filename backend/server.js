const express = require('express');
const cors = require('cors');
const taskRoutes = require('./src/routes/taskRoutes');
const errorHandler = require('./src/middlewares/errorHandler');
const notFoundHandler = require('./src/middlewares/notFoundHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/tasks', taskRoutes);

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
