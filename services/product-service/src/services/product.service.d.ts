import type { ProductQuery } from "../types/product-query.types.js";
import type { IProduct } from "../types/product.type.js";
import type { ProductCursorQuery } from "../types/product-cursor-query.types.js";
export declare const createProduct: (data: IProduct) => Promise<import("mongoose").Document<unknown, {}, IProduct, {}, import("mongoose").DefaultSchemaOptions> & IProduct & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}>;
export declare const getProducts: (query: ProductQuery, cacheKey: string) => Promise<{}>;
export declare const getProductById: (id: string) => Promise<import("mongoose").Document<unknown, {}, IProduct, {}, import("mongoose").DefaultSchemaOptions> & IProduct & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}>;
export declare const updateProduct: (id: string, data: Partial<IProduct>) => Promise<import("mongoose").Document<unknown, {}, IProduct, {}, import("mongoose").DefaultSchemaOptions> & IProduct & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}>;
export declare const deleteProduct: (id: string) => Promise<import("mongoose").Document<unknown, {}, IProduct, {}, import("mongoose").DefaultSchemaOptions> & IProduct & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}>;
export declare const getCategorySummary: () => Promise<any[]>;
export declare const getPriceDistribution: () => Promise<any[]>;
export declare const getTopRatedProducts: (limit?: number) => Promise<any[]>;
export declare const getProductsByCursor: (query: ProductCursorQuery) => Promise<{
    products: (IProduct & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[];
    pagination: {
        limit: number;
        hasNextPage: boolean;
        nextCursor: string | null;
    };
}>;
//# sourceMappingURL=product.service.d.ts.map