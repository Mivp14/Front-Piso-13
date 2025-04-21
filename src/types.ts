export interface Producto {
  _id: string;
  nombre: string;
  descripcion: string;
  cantidad: number;
  precio: number;
  categoria: string;
  estacion: {
    _id: string;
    nombre: string;
    ubicacion: string;
  };
  rack: {
    _id: string;
    nombre: string;
  };
  bodega: {
    _id: string;
    nombre: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductoFormData {
  nombre: string;
  descripcion: string;
  cantidad: number;
  precio: number;
  categoria: string;
  estacion: string;
  rack: string;
  bodega: string;
}

export interface Rack {
  _id: string;
  nombre: string;
  descripcion?: string;
  ubicacion?: string;
  categorias: string[];
  bodega: string;
  createdAt?: string;
  updatedAt?: string;
}