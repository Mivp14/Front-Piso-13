import axios from 'axios';

// Eliminar cualquier barra final de la URL base
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

// Configuración de rutas
const ROUTES = {
  productos: '/api/products',
  racks: '/api/racks',
  bodegas: '/api/bodegas',
  estaciones: '/api/estaciones'
};

// Agregar interceptor para logs
axios.interceptors.request.use(request => {
  console.log('Realizando petición a:', request.url);
  return request;
});

axios.interceptors.response.use(
  response => {
    console.log('Respuesta recibida:', response.status, response.data);
    return response;
  },
  error => {
    console.error('Error en la petición:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

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

export interface Estacion {
  _id: string;
  nombre: string;
  ubicacion: string;
  descripcion: string;
  tipo: 'CENTRAL' | 'SUBESTACION';
  estado: 'activa' | 'inactiva';
  createdAt: string;
  updatedAt: string;
}

export interface Bodega {
  _id: string;
  nombre: string;
  descripcion: string;
  estacion: {
    _id: string;
    nombre: string;
    ubicacion: string;
  };
  racks: string[];
  createdAt?: string;
  updatedAt?: string;
}

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

export const api = {
  // Operaciones de Productos
  getProductos: async (): Promise<Producto[]> => {
    const response = await axios.get(`${API_URL}${ROUTES.productos}`);
    return response.data;
  },

  getProducto: async (id: string): Promise<Producto> => {
    const response = await axios.get(`${API_URL}${ROUTES.productos}/${id}`);
    return response.data;
  },

  createProducto: async (producto: ProductoFormData): Promise<Producto> => {
    const response = await axios.post(`${API_URL}${ROUTES.productos}`, producto);
    return response.data;
  },

  updateProducto: async (id: string, producto: ProductoFormData): Promise<Producto> => {
    const response = await axios.put(`${API_URL}${ROUTES.productos}/${id}`, producto);
    return response.data;
  },

  deleteProducto: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}${ROUTES.productos}/${id}`);
  },

  // Operaciones de Racks
  getRacks: async (): Promise<Rack[]> => {
    const response = await axios.get(`${API_URL}${ROUTES.racks}`);
    return response.data;
  },

  createRack: async (rack: Omit<Rack, '_id' | 'createdAt' | 'updatedAt'>): Promise<Rack> => {
    const response = await axios.post(`${API_URL}${ROUTES.racks}`, rack);
    return response.data;
  },

  updateRack: async (id: string, rack: Partial<Rack>): Promise<Rack> => {
    const response = await axios.put(`${API_URL}${ROUTES.racks}/${id}`, rack);
    return response.data;
  },

  deleteRack: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}${ROUTES.racks}/${id}`);
  },

  // Operaciones de Bodegas
  getBodegas: async (): Promise<Bodega[]> => {
    const response = await axios.get(`${API_URL}${ROUTES.bodegas}`);
    return response.data;
  },

  createBodega: async (bodega: Omit<Bodega, '_id' | 'createdAt' | 'updatedAt'>): Promise<Bodega> => {
    const response = await axios.post(`${API_URL}${ROUTES.bodegas}`, bodega);
    return response.data;
  },

  updateBodega: async (id: string, bodega: Partial<Bodega>): Promise<Bodega> => {
    const response = await axios.put(`${API_URL}${ROUTES.bodegas}/${id}`, bodega);
    return response.data;
  },

  deleteBodega: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}${ROUTES.bodegas}/${id}`);
  },

  // Operaciones de Estaciones
  getEstaciones: async (): Promise<Estacion[]> => {
    const response = await axios.get(`${API_URL}${ROUTES.estaciones}`);
    return response.data;
  },

  createEstacion: async (estacion: Omit<Estacion, '_id' | 'createdAt' | 'updatedAt'>): Promise<Estacion> => {
    const response = await axios.post(`${API_URL}${ROUTES.estaciones}`, estacion);
    return response.data;
  },

  updateEstacion: async (id: string, estacion: Partial<Estacion>): Promise<Estacion> => {
    const response = await axios.put(`${API_URL}${ROUTES.estaciones}/${id}`, estacion);
    return response.data;
  },

  deleteEstacion: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}${ROUTES.estaciones}/${id}`);
  }
};
