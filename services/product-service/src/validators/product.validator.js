import { z } from "zod";
const productBaseSchema = z.object({
    name: z
        .string()
        .min(2),
    slug: z
        .string()
        .min(2),
    description: z
        .string()
        .min(10),
    price: z
        .number()
        .positive(),
    discountPrice: z
        .number()
        .positive()
        .optional(),
    category: z
        .string()
        .min(2),
    brand: z
        .string()
        .min(2),
    images: z
        .array(z.string())
        .optional(),
    stock: z
        .number()
        .int()
        .min(0),
    rating: z
        .number()
        .min(0)
        .max(5)
        .optional(),
    reviewCount: z
        .number()
        .int()
        .min(0)
        .optional(),
    isActive: z
        .boolean()
        .optional(),
});
export const createProductSchema = productBaseSchema.refine((data) => {
    if (data.discountPrice !== undefined &&
        data.discountPrice >= data.price) {
        return false;
    }
    return true;
}, {
    message: "Discount price must be less than price",
    path: ["discountPrice"],
});
export const updateProductSchema = productBaseSchema.partial();
//# sourceMappingURL=product.validator.js.map