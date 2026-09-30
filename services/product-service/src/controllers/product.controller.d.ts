import type { NextFunction, Request, Response } from "express";
export declare const createProduct: (req: Request, res: Response, next: NextFunction) => void;
export declare const getProducts: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getProduct: (req: Request, res: Response, next: NextFunction) => void;
export declare const updateProduct: (req: Request, res: Response, next: NextFunction) => void;
export declare const deleteProduct: (req: Request, res: Response, next: NextFunction) => void;
export declare const getCategorySummary: (req: Request, res: Response, next: NextFunction) => void;
export declare const getPriceDistribution: (req: Request, res: Response, next: NextFunction) => void;
export declare const getTopRatedProducts: (req: Request, res: Response, next: NextFunction) => void;
export declare const getProductsByCursor: (req: Request, res: Response, next: NextFunction) => void;
export declare const getProductsController: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=product.controller.d.ts.map