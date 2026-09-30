import { Product } from "../models/product.model.js";
export const createProduct = async (data) => {
    return Product.create(data);
};
export const findProducts = async ({ filter, sort, skip, limit, }) => {
    const [products, total] = await Promise.all([
        Product.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean(),
        Product.countDocuments(filter),
    ]);
    return {
        products,
        total,
    };
};
export const findProductById = async (id) => {
    return Product.findById(id);
};
export const findProductBySlug = async (slug) => {
    return Product.findOne({ slug });
};
export const updateProduct = async (id, data) => {
    return Product.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
};
export const deleteProduct = async (id) => {
    return Product.findByIdAndUpdate(id, {
        isActive: false,
    }, {
        new: true,
    });
};
export const getCategorySummary = async () => {
    return Product.aggregate([
        {
            $match: {
                isActive: true,
            },
        },
        {
            $group: {
                _id: "$category",
                totalProducts: {
                    $sum: 1,
                },
                averagePrice: {
                    $avg: "$price",
                },
                averageRating: {
                    $avg: "$rating",
                },
                totalStock: {
                    $sum: "$stock",
                },
            },
        },
        {
            $sort: {
                totalProducts: -1,
            },
        },
        {
            $project: {
                _id: 0,
                category: "$_id",
                totalProducts: 1,
                averagePrice: {
                    $round: ["$averagePrice", 2],
                },
                averageRating: {
                    $round: ["$averageRating", 2],
                },
                totalStock: 1,
            },
        },
    ]);
};
export const getPriceDistribution = async () => {
    return Product.aggregate([
        {
            $match: {
                isActive: true,
            },
        },
        {
            $bucket: {
                groupBy: "$price",
                boundaries: [
                    0,
                    30000,
                    70000,
                    1000000,
                ],
                default: "Other",
                output: {
                    totalProducts: {
                        $sum: 1,
                    },
                    averagePrice: {
                        $avg: "$price",
                    },
                },
            },
        },
        {
            $project: {
                _id: 0,
                priceRange: "$_id",
                totalProducts: 1,
                averagePrice: {
                    $round: [
                        "$averagePrice",
                        2,
                    ],
                },
            },
        },
    ]);
};
export const getTopRatedProducts = async (limit = 10) => {
    return Product.aggregate([
        {
            $match: {
                isActive: true,
            },
        },
        {
            $sort: {
                rating: -1,
                reviewCount: -1,
            },
        },
        {
            $limit: limit,
        },
        {
            $project: {
                name: 1,
                slug: 1,
                price: 1,
                rating: 1,
                reviewCount: 1,
                category: 1,
                brand: 1,
            },
        },
    ]);
};
export const findProductsByCursor = async ({ filter, cursor, limit, }) => {
    if (cursor) {
        const cursorProduct = await Product.findById(cursor)
            .select("createdAt")
            .lean();
        if (!cursorProduct) {
            throw new Error("Invalid cursor");
        }
        filter.$or = [
            {
                createdAt: {
                    $lt: cursorProduct.createdAt,
                },
            },
            {
                createdAt: cursorProduct.createdAt,
                _id: {
                    $lt: new mongoose.Types.ObjectId(cursor),
                },
            },
        ];
    }
    const products = await Product.find(filter)
        .sort({
        createdAt: -1,
        _id: -1,
    })
        .limit(limit + 1)
        .select("name slug price discountPrice images rating reviewCount brand category stock createdAt")
        .lean();
    return products;
};
//# sourceMappingURL=product.repository.js.map