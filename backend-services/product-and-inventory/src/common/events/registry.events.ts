export const CategoryEvents = {
  CREATE: 'create_category',
  UPDATE: 'update_category',
  DELETE: 'remove_category',
  FIND_SUBCATEGORIES_BY_ID: 'find_all_subcategories_by_id',
  FIND_ALL_PARENTS: 'find_all_parent_categories',
  FIND_ONE_BY_ID: 'find_one_category_by_id',
  FIND_ALL: 'find_all_categories',
  FIND_CATEGORY_TREE: 'find_category_tree',
} as const;

export const ProductEvents = {
  CREATE: 'create_product',
  UPDATE: 'update_product',
  DELETE: 'remove_product',
  FIND_ALL: 'find_all_products',
  FIND_ONE_BY_ID: 'find_one_product',
  FIND_STOCK_BY_ID: 'find_stock',
  REDUCE_STOCK: 'reduce_stock',
  INCREASE_STOCK: 'increase_stock',
  ROLLBACK_STOCK: 'rollback_stock',
  FIND_BY_NAME: 'find_by_name',
  FIND_BY_CATEGORY: 'find_by_category',
} as const;
