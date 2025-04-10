export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  cantidad: number;
  ubicacion: string;
  categoria: string;
  precio: number;
  fechaIngreso: string;
}

export type ProductoFormData = Omit<Producto, 'id' | 'fechaIngreso'>;

export interface Rack {
  id: number;
  nombre: string;
}