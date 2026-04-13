const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    // Check if error has status and message, otherwise default to 500
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message: message
    });
};

module.exports = errorHandler;
