import { z } from "zod";
export declare const createProductSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    description: z.ZodString;
    price: z.ZodNumber;
    discountPrice: z.ZodOptional<z.ZodNumber>;
    category: z.ZodString;
    brand: z.ZodString;
    images: z.ZodOptional<z.ZodArray<z.ZodString>>;
    stock: z.ZodNumber;
    rating: z.ZodOptional<z.ZodNumber>;
    reviewCount: z.ZodOptional<z.ZodNumber>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const updateProductSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodNumber>;
    discountPrice: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    category: z.ZodOptional<z.ZodString>;
    brand: z.ZodOptional<z.ZodString>;
    images: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    stock: z.ZodOptional<z.ZodNumber>;
    rating: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    reviewCount: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    isActive: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
//# sourceMappingURL=product.validator.d.ts.map