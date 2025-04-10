import React, { useState, useEffect } from 'react';
import { Producto, ProductoFormData, Rack } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

interface ProductoFormProps {
  onSubmit: (productoData: ProductoFormData) => Promise<void>;
  darkMode: boolean;
  racks: Rack[];
  productoInicial?: Producto;
}

export const ProductoForm: React.FC<ProductoFormProps> = ({
  onSubmit,
  darkMode,
  racks,
  productoInicial
}) => {
  const [formData, setFormData] = useState<ProductoFormData>({
    nombre: '',
    descripcion: '',
    cantidad: 0,
    precio: 0,
    ubicacion: '',
    categoria: '',
    rack: racks[0]?._id || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (productoInicial) {
      setFormData({
        nombre: productoInicial.nombre,
        descripcion: productoInicial.descripcion,
        cantidad: productoInicial.cantidad,
        precio: productoInicial.precio,
        ubicacion: productoInicial.ubicacion,
        categoria: productoInicial.categoria,
        rack: productoInicial.rack
      });
    }
  }, [productoInicial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      if (!productoInicial) {
        setFormData({
          nombre: '',
          descripcion: '',
          cantidad: 0,
          precio: 0,
          ubicacion: '',
          categoria: '',
          rack: racks[0]?._id || ''
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cantidad' || name === 'precio' ? Number(value) : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 p-4 sm:p-6 rounded-lg shadow-lg ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <h2 className={`text-lg sm:text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {productoInicial ? 'Editar Producto' : 'Agregar Nuevo Producto'}
      </h2>
      
      <div>
        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Nombre
        </label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          className={`w-full px-3 py-2 text-sm sm:text-base rounded-md border ${
            darkMode
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
          placeholder="Nombre del producto"
        />
      </div>

      <div>
        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Descripción
        </label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          className={`w-full px-3 py-2 text-sm sm:text-base rounded-md border ${
            darkMode
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
          placeholder="Descripción del producto"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Cantidad
          </label>
          <input
            type="number"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleChange}
            required
            min="0"
            className={`w-full px-3 py-2 text-sm sm:text-base rounded-md border ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
            placeholder="0"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Precio (CLP)
          </label>
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            required
            min="0"
            className={`w-full px-3 py-2 text-sm sm:text-base rounded-md border ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Rack
        </label>
        <select
          name="rack"
          value={formData.rack}
          onChange={handleChange}
          required
          className={`w-full px-3 py-2.5 text-sm rounded-md border appearance-none bg-no-repeat ${
            darkMode
              ? 'bg-gray-700 border-gray-600 text-white hover:border-gray-500'
              : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400'
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='${
              darkMode ? '%23ffffff' : '%236B7280'
            }' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundSize: '1.25em 1.25em'
          }}
        >
          <option value="">Seleccionar rack</option>
          {racks.map((rack) => (
            <option key={rack._id} value={rack._id}>
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
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          required
          className={`w-full px-3 py-2 text-sm sm:text-base rounded-md border ${
            darkMode
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
          placeholder="Categoría del producto"
        />
      </div>

      <div>
        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Ubicación
        </label>
        <input
          type="text"
          name="ubicacion"
          value={formData.ubicacion}
          onChange={handleChange}
          required
          className={`w-full px-3 py-2 text-sm sm:text-base rounded-md border ${
            darkMode
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
          placeholder="Ubicación del producto"
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full sm:w-auto flex items-center justify-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white ${
            darkMode
              ? isSubmitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
              : isSubmitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner className="mr-2" />
              {productoInicial ? 'Guardando...' : 'Agregando...'}
            </>
          ) : (
            productoInicial ? 'Guardar Cambios' : 'Agregar Producto'
          )}
        </button>
      </div>
    </form>
  );
};