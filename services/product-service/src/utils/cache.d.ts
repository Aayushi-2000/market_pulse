export declare const setCache: (key: string, value: unknown, ttlSeconds: number) => Promise<void>;
export declare const getCache: <T>(key: string) => Promise<T | null>;
export declare const deleteCache: (key: string) => Promise<void>;
export declare const deleteCacheByPattern: (pattern: string) => Promise<void>;
//# sourceMappingURL=cache.d.ts.map