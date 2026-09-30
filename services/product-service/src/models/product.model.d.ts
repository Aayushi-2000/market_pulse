import mongoose from "mongoose";
import type { IProduct } from "../types/product.type.js";
export declare const Product: mongoose.Model<IProduct, {}, {}, {}, mongoose.Document<unknown, {}, IProduct, {}, mongoose.DefaultSchemaOptions> & IProduct & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IProduct>;
//# sourceMappingURL=product.model.d.ts.map