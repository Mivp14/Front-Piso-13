export const PRODUCT_CATEGORIES = [
  'Limpieza',
  'Herramientas',
  'Papelería',
  'Electrónica',
  'Mobiliario',
  'Seguridad',
  'Mantenimiento',
  'Otros'
] as const;

export const RACK_CATEGORIES = [
  'Almacenamiento General',
  'Alta Rotación',
  'Productos Frágiles',
  'Productos Pesados',
  'Productos Químicos',
  'Herramientas',
  'Documentos',
  'Otros'
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];
export type RackCategory = typeof RACK_CATEGORIES[number]; 