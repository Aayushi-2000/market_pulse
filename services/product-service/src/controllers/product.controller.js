import * as productService from "../services/product.service.js";
import { asyncHandler } from "../utils/async-handler.js";
import { generateProductsCacheKey } from "../utils/product-cache-key.js";
import { invalidateProductCache } from "../utils/product-cache.js";
export const createProduct = asyncHandler(async (req, res) => {
    const product = await productService.createProduct(req.body);
    await invalidateProductCache();
    res.status(201).json({
        success: true,
        data: product,
    });
});
export const getProducts = async (req, res, next) => {
    try {
        const result = await productService.getProducts(req.query);
        res.status(200).json({
            success: true,
            data: result.products,
            pagination: result.pagination,
        });
    }
    catch (error) {
        next(error);
    }
};
export const getProduct = asyncHandler(async (req, res) => {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json({
        success: true,
        data: product,
    });
});
export const updateProduct = asyncHandler(async (req, res) => {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.status(200).json({
        success: true,
        data: product,
    });
});
export const deleteProduct = asyncHandler(async (req, res) => {
    await productService.deleteProduct(req.params.id);
    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
});
export const getCategorySummary = asyncHandler(async (eq, res) => {
    const data = await productService.getCategorySummary();
    res.status(200).json({
        success: true,
        data,
    });
});
export const getPriceDistribution = asyncHandler(async (_req, res) => {
    const data = await productService.getPriceDistribution();
    res.status(200).json({
        success: true,
        data,
    });
});
export const getTopRatedProducts = asyncHandler(async (req, res) => {
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const data = await productService.getTopRatedProducts(limit);
    res.status(200).json({
        success: true,
        data,
    });
});
export const getProductsByCursor = asyncHandler(async (req, res) => {
    const result = await productService.getProductsByCursor(req.query);
    res.status(200).json({
        success: true,
        data: result.products,
        pagination: result.pagination,
    });
});
export const getProductsController = async (req, res, next) => {
    try {
        const cacheKey = generateProductsCacheKey(req);
        const products = await productService.getProducts(req.query, cacheKey);
        res.status(200).json({
            success: true,
            data: products,
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=product.controller.js.map