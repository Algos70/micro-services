export const CategoryEvents = {
  CREATE: 'create-category',
  UPDATE: 'update-category',
  DELETE: 'remove-category',
  FIND_SUBCATEGORIES_BY_ID: 'find-all-subcategories-by-id',
  FIND_ALL_PARENTS: 'find-all-parent-categories',
  FIND_ONE_BY_ID: 'find-one-category-by-id',
  FIND_ALL: 'find-all-categories',
  FIND_CATEGORY_TREE: 'find-category-tree',
} as const;

export const ProductEvents = {
  CREATE: 'create-product',
  UPDATE: 'update-product',
  DELETE: 'remove-product',
  FIND_ALL: 'find-all-products',
  FIND_ONE_BY_ID: 'find-one-product',
  FIND_STOCK_BY_ID: 'find-stock',
  UPDATE_STOCK: 'update-stock',
  FIND_BY_NAME: 'find-by-name',
  FIND_BY_CATEGORY: 'find-by-category',
} as const;