import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Produktname ist erforderlich').max(200),
  description: z.string().nullable().default(null),
  price: z.number().positive('Preis muss positiv sein'),
  category: z.string().min(1, 'Kategorie ist erforderlich'),
  image_url: z.string().url().nullable().default(null),
  in_stock: z.boolean().default(true),
});

export const productSearchSchema = z.object({
  query: z.string().min(1, 'Suchbegriff erforderlich').max(100),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ProductSearchInput = z.infer<typeof productSearchSchema>;
