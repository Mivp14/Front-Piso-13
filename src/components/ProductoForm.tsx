import React, { useState } from 'react';
import { ProductoFormData, Rack } from '../types';
import { Plus } from 'lucide-react';

interface ProductoFormProps {
  onSubmit: (producto: ProductoFormData) => void;
  darkMode: boolean;
  racks: Rack[];
}

export function ProductoForm({ onSubmit, darkMode, racks }: ProductoFormProps) {
  const [formData, setFormData] = useState<ProductoFormData>({
    nombre: '',
    descripcion: '',
    cantidad: 0,
    ubicacion: racks[0]?.nombre || '',
    categoria: '',
    precio: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      nombre: '',
      descripcion: '',
      cantidad: 0,
      ubicacion: racks[0]?.nombre || '',
      categoria: '',
      precio: 0
    });
  };

  const inputClasses = `mt-1 block w-full rounded-md border ${
    darkMode
      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-blue-400'
      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500'
  } shadow-sm focus:ring-2 focus:ring-opacity-50 transition-colors duration-200`;

  const selectClasses = `mt-1 block w-full rounded-md border ${
    darkMode
      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-blue-400'
      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500'
  } shadow-sm focus:ring-2 focus:ring-opacity-50 transition-colors duration-200 py-2 px-3`;

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 p-6 rounded-lg shadow-lg transition-colors duration-200 ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Agregar Nuevo Producto
      </h2>
      
      <div>
        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Nombre
        </label>
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          className={inputClasses}
          placeholder="Nombre del producto"
          required
        />
      </div>

      <div>
        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Descripción
        </label>
        <textarea
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          className={inputClasses}
          placeholder="Descripción del producto"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Cantidad
          </label>
          <input
            type="number"
            value={formData.cantidad}
            onChange={(e) => setFormData({ ...formData, cantidad: Number(e.target.value) })}
            className={inputClasses}
            min="0"
            placeholder="0"
            required
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Precio
          </label>
          <input
            type="number"
            value={formData.precio}
            onChange={(e) => setFormData({ ...formData, precio: Number(e.target.value) })}
            className={inputClasses}
            min="0"
            step="0.01"
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Ubicación
        </label>
        <select
          value={formData.ubicacion}
          onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
          className={selectClasses}
          required
        >
          {racks.map((rack) => (
            <option key={rack.id} value={rack.nombre}>
              {rack.nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Categoría
        </label>
        <input
          type="text"
          value={formData.categoria}
          onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
          className={inputClasses}
          placeholder="Categoría del producto"
          required
        />
      </div>

      <button
        type="submit"
        className={`w-full flex items-center justify-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white transition-colors duration-200 ${
          darkMode
            ? 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-400'
            : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        } focus:outline-none focus:ring-2 focus:ring-offset-2`}
      >
        <Plus className="w-4 h-4 mr-2" />
        Agregar Producto
      </button>
    </form>
  );
}