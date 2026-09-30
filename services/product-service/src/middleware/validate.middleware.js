export const validate = (schema) => {
    return (req, _res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
//# sourceMappingURL=validate.middleware.js.map