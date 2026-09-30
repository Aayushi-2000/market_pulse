export const errorHandler = (err, _req, res, _next) => {
    console.error('API Gateway Error:', err);
    const statusCode = err.status || err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal API Gateway Error',
    });
};
