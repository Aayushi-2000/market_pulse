import { deleteCacheByPattern } from "./cache.js";
export const invalidateProductCache = async () => {
    await deleteCacheByPattern("products:*");
    console.log("Product cache invalidated");
};
//# sourceMappingURL=product-cache.js.map