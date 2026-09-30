import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error.js";
export declare const errorHandler: (error: Error | AppError, _req: Request, res: Response, _next: NextFunction) => Response<any, Record<string, any>>;
//# sourceMappingURL=error.middleware.d.ts.map