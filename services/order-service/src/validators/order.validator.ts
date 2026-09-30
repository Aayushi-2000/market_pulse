import { z } from 'zod';

export const createOrderSchema = z.object({
    items: z
        .array(
            z.object({
                productId: z.string().min(1),
                name:      z.string().min(1),
                price:     z.number().positive(),
                quantity:  z.number().int().positive(),
            })
        )
        .min(1, 'Order must have at least one item'),
});
