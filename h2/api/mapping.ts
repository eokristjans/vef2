/**
 * Defines and exports functions that map JSON objects to corresponding interfaces (types).
 */

import { ICategory, IProduct, IOrder, ICart } from './types';

export function mapCategory(item: any): ICategory {
  return {
    id: item.id,
    title: item.title,
  }
}
