export interface IProduct {
    name: string;
    slug: string;
    description: string;
    price: number;
    discountPrice?: number;
    category: string;
    brand: string;
    images: string[];
    stock: number;
    rating: number;
    reviewCount: number;
    createdAt: Date;
    isActive: boolean;
}
//# sourceMappingURL=product.type.d.ts.map