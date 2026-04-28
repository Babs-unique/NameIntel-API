const loggerMiddleware = (req, res, next) => {
        req.time = new Date(Date.now()).toString();
        res.on('finish', () => {
            console.log(`[${req.time}] ${req.method} ${req.originalUrl} - ${res.statusCode}`);
        });
    next();
}


export default loggerMiddleware;