export interface ProductQuery {
  search?: string;
  category?: string;
  brand?: string;

  minPrice?: string;
  maxPrice?: string;

  minRating?: string;

  sort?: string;

  page?: string;
  limit?: string;
}