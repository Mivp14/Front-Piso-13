export interface Producto {
  _id: string;
  nombre: string;
  descripcion: string;
  cantidad: number;
  precio: number;
  ubicacion: string;
  categoria: string;
  rack: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductoFormData {
  nombre: string;
  descripcion: string;
  cantidad: number;
  precio: number;
  ubicacion: string;
  categoria: string;
  rack: string;
}

export interface Rack {
  _id: string;
  nombre: string;
  descripcion?: string;
  ubicacion?: string;
  createdAt?: string;
  updatedAt?: string;
}