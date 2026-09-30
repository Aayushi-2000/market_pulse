import type { IProduct } from "../types/product.type.js";
import type { FilterQuery } from "mongoose";
interface FindProductsOptions {
    filter: FilterQuery<IProduct>;
    sort: Record<string, 1 | -1>;
    skip: number;
    limit: number;
}
interface CursorProductsOptions {
    filter: FilterQuery<IProduct>;
    cursor?: string;
    limit: number;
}
export declare const createProduct: (data: IProduct) => Promise<import("mongoose").Document<unknown, {}, IProduct, {}, import("mongoose").DefaultSchemaOptions> & IProduct & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}>;
export declare const findProducts: ({ filter, sort, skip, limit, }: FindProductsOptions) => Promise<{
    products: (IProduct & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[];
    total: number;
}>;
export declare const findProductById: (id: string) => Promise<(import("mongoose").Document<unknown, {}, IProduct, {}, import("mongoose").DefaultSchemaOptions> & IProduct & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | null>;
export declare const findProductBySlug: (slug: string) => Promise<(import("mongoose").Document<unknown, {}, IProduct, {}, import("mongoose").DefaultSchemaOptions> & IProduct & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | null>;
export declare const updateProduct: (id: string, data: Partial<IProduct>) => Promise<(import("mongoose").Document<unknown, {}, IProduct, {}, import("mongoose").DefaultSchemaOptions> & IProduct & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | null>;
export declare const deleteProduct: (id: string) => Promise<(import("mongoose").Document<unknown, {}, IProduct, {}, import("mongoose").DefaultSchemaOptions> & IProduct & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | null>;
export declare const getCategorySummary: () => Promise<any[]>;
export declare const getPriceDistribution: () => Promise<any[]>;
export declare const getTopRatedProducts: (limit?: number) => Promise<any[]>;
export declare const findProductsByCursor: ({ filter, cursor, limit, }: CursorProductsOptions) => Promise<(IProduct & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
})[]>;
export {};
//# sourceMappingURL=product.repository.d.ts.map