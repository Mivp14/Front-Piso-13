import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Rack {
  _id: string;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  createdAt: string;
  updatedAt: string;
}

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

export const api = {
  // Operaciones de Productos
  getProductos: async (): Promise<Producto[]> => {
    const response = await axios.get(`${API_URL}/api/products`);
    return response.data;
  },

  createProducto: async (producto: ProductoFormData): Promise<Producto> => {
    const response = await axios.post(`${API_URL}/api/products`, producto);
    return response.data;
  },

  updateProducto: async (id: string, producto: ProductoFormData): Promise<Producto> => {
    const response = await axios.put(`${API_URL}/api/products/${id}`, producto);
    return response.data;
  },

  deleteProducto: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/api/products/${id}`);
  },

  // Operaciones de Racks
  getRacks: async (): Promise<Rack[]> => {
    const response = await axios.get(`${API_URL}/api/racks`);
    return response.data;
  },

  createRack: async (rack: Omit<Rack, '_id' | 'createdAt' | 'updatedAt'>): Promise<Rack> => {
    const response = await axios.post(`${API_URL}/api/racks`, rack);
    return response.data;
  },

  updateRack: async (id: string, rack: Partial<Rack>): Promise<Rack> => {
    const response = await axios.put(`${API_URL}/api/racks/${id}`, rack);
    return response.data;
  },

  deleteRack: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/api/racks/${id}`);
  }
};
