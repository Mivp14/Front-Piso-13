import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Rack {
  _id: string;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  categorias: string[];
  bodega: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bodega {
  _id: string;
  nombre: string;
  ubicacion: string;
  descripcion: string;
  esCentral: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Producto {
  _id: string;
  nombre: string;
  descripcion: string;
  cantidad: number;
  precio: number;
  categoria: string;
  rack: string;
  bodega: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductoFormData {
  nombre: string;
  descripcion: string;
  cantidad: number;
  precio: number;
  categoria: string;
  rack: string;
  bodega: string;
}

export const api = {
  // Operaciones de Productos
  getProductos: async (): Promise<Producto[]> => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  },

  getProducto: async (id: string): Promise<Producto> => {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  },

  createProducto: async (producto: ProductoFormData): Promise<Producto> => {
    const response = await axios.post(`${API_URL}/products`, producto);
    return response.data;
  },

  updateProducto: async (id: string, producto: ProductoFormData): Promise<Producto> => {
    const response = await axios.put(`${API_URL}/products/${id}`, producto);
    return response.data;
  },

  deleteProducto: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/products/${id}`);
  },

  // Operaciones de Racks
  getRacks: async (): Promise<Rack[]> => {
    const response = await axios.get(`${API_URL}/racks`);
    return response.data;
  },

  createRack: async (rack: Omit<Rack, '_id' | 'createdAt' | 'updatedAt'>): Promise<Rack> => {
    const response = await axios.post(`${API_URL}/racks`, rack);
    return response.data;
  },

  updateRack: async (id: string, rack: Partial<Rack>): Promise<Rack> => {
    const response = await axios.put(`${API_URL}/racks/${id}`, rack);
    return response.data;
  },

  deleteRack: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/racks/${id}`);
  },

  // Operaciones de Bodegas
  getBodegas: async (): Promise<Bodega[]> => {
    const response = await axios.get(`${API_URL}/bodegas`);
    return response.data;
  },

  createBodega: async (bodega: Omit<Bodega, '_id' | 'createdAt' | 'updatedAt'>): Promise<Bodega> => {
    const response = await axios.post(`${API_URL}/bodegas`, bodega);
    return response.data;
  },

  updateBodega: async (id: string, bodega: Partial<Bodega>): Promise<Bodega> => {
    const response = await axios.put(`${API_URL}/bodegas/${id}`, bodega);
    return response.data;
  },

  deleteBodega: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/bodegas/${id}`);
  }
};
