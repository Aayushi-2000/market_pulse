export const generateProductsCacheKey = (req) => {
    const query = new URLSearchParams();
    Object.keys(req.query)
        .sort()
        .forEach((key) => {
        const value = req.query[key];
        if (value !== undefined) {
            query.append(key, String(value));
        }
    });
    return `products:${query.toString() || "default"}`;
};
//# sourceMappingURL=product-cache-key.js.map