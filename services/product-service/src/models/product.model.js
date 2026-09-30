import mongoose, { Schema } from "mongoose";
const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    discountPrice: {
        type: Number,
        min: 0,
    },
    category: {
        type: String,
        required: true,
        index: true,
    },
    brand: {
        type: String,
        required: true,
        index: true,
    },
    images: {
        type: [String],
        default: [],
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    reviewCount: {
        type: Number,
        default: 0,
        min: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true,
    },
}, {
    timestamps: true,
});
productSchema.index({
    category: 1,
    price: 1,
});
productSchema.index({
    brand: 1,
    createdAt: -1,
});
productSchema.index({
    isActive: 1,
    rating: -1,
});
export const Product = mongoose.model("Product", productSchema);
//# sourceMappingURL=product.model.js.map