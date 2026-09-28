import * as productRepository from "../repositories/product.repository.js";
import type { ProductQuery } from "../types/product-query.types.js";
import type { IProduct } from "../types/product.type.js";
import type { FilterQuery } from "mongoose";
import { AppError } from "../utils/app-error.js";
import type { ProductCursorQuery } from "../types/product-cursor-query.types.js";
import { getCache, setCache } from "../utils/cache.js";
import { invalidateProductCache } from "../utils/product-cache.js";
export const createProduct = async (
  data: IProduct
) => {
  const existingProduct =
    await productRepository.findProductBySlug(data.slug);

  if (existingProduct) {
    throw new AppError("Product with this slug already exists", 409);
  }

  return productRepository.createProduct(data);
};

export const getProducts = async (
  query: ProductQuery,
  cacheKey: string
) => {
  const filter: FilterQuery<IProduct> = {
    isActive: true,
  };
  const cachedProducts =
    await getCache(cacheKey);
  if (cachedProducts) {
    console.log("Redis CACHE HIT");

    return cachedProducts;
  }
  if (query.search) {
    filter.name = {
      $regex: query.search,
      $options: "i",
    };
  }

  if (query.category) {
    filter.category = query.category;
  }


  if (query.brand) {
    filter.brand = query.brand;
  }


  if (query.minPrice || query.maxPrice) {
    filter.price = {};

    if (query.minPrice) {
      filter.price.$gte = Number(query.minPrice);
    }

    if (query.maxPrice) {
      filter.price.$lte = Number(query.maxPrice);
    }
  }


  if (query.minRating) {
    filter.rating = {
      $gte: Number(query.minRating),
    };
  }

  const page = Math.max(Number(query.page) || 1, 1);

  const limit = Math.min(
    Math.max(Number(query.limit) || 10, 1),
    100
  );

  const skip = (page - 1) * limit;

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    newest: {
      createdAt: -1,
    },

    oldest: {
      createdAt: 1,
    },

    price_asc: {
      price: 1,
    },

    price_desc: {
      price: -1,
    },

    rating: {
      rating: -1,
    },
  };

  const sort =
    sortMap[query.sort || "newest"] || {
      createdAt: -1,
    };

  
  const result =
    await productRepository.findProducts({
      filter,
      sort,
      skip,
      limit,
    });


  const totalPages = Math.ceil(
    result.total / limit
  );


  console.log("CACHE DEBUG:", {
  cacheKey,
  products: result.products,
  productsType: typeof result.products,
  productsLength: result.products?.length,
});
  const response= {
    products: result.products,

    pagination: {
      page,
      limit,

      total: result.total,

      totalPages,

      hasNextPage: page < totalPages,

      hasPreviousPage: page > 1,
    },
  };
    await setCache(
    cacheKey,
    response,
    60
  );
  return response
};

export const getProductById = async (
  id: string
) => {
  const product =
    await productRepository.findProductById(id);

  if (!product) {
    throw new AppError("Product not found",400);
  }

  return product;
};

export const updateProduct = async (
  id: string,
  data: Partial<IProduct>
) => {
  const product =
    await productRepository.updateProduct(id,data);

  if (!product) {
    throw new AppError("Product not found",400);
  }
 await invalidateProductCache();
  return product;
};

export const deleteProduct = async (
  id: string
) => {
  const product =
    await productRepository.deleteProduct(id);

  if (!product) {
    throw new AppError("Product not found",400);
  }
  await invalidateProductCache();
  return product;
};

export const getCategorySummary = async () => {
  return productRepository.getCategorySummary();
};

export const getPriceDistribution = async () => {
  return productRepository.getPriceDistribution();
};

export const getTopRatedProducts = async (
  limit?: number
) => {
  return productRepository.getTopRatedProducts(
    limit
  );
};

export const getProductsByCursor = async (
  query: ProductCursorQuery
) => {
  const filter: FilterQuery<IProduct> = {
    isActive: true,
  };

  if (query.category) {
    filter.category = query.category;
  }

  if (query.brand) {
    filter.brand = query.brand;
  }

  const limit = Math.min(
    Math.max(Number(query.limit) || 10, 1),
    100
  );

  let products;

  try {
    products =
      await productRepository.findProductsByCursor({
        filter,
        cursor: query.cursor,
        limit,
      });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Invalid cursor"
    ) {
      throw new AppError(
        "Invalid or expired cursor",
        400
      );
    }

    throw error;
  }

  const hasNextPage =
    products.length > limit;


  if (hasNextPage) {
    products.pop();
  }
  const nextCursor =
    hasNextPage && products.length > 0
      ? products[products.length - 1]._id.toString()
      : null;

  return {
    products,

    pagination: {
      limit,
      hasNextPage,
      nextCursor,
    },
  };
};