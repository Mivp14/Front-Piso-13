import React, { useState, useEffect } from 'react';
import { ProductoFormData, Rack, Bodega } from '../services/api';
import { LoadingSpinner } from './LoadingSpinner';
import { api } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { PRODUCT_CATEGORIES } from '../constants/categories';

interface ProductoFormProps {
  onSubmit: (productoData: ProductoFormData) => Promise<void>;
  darkMode: boolean;
  racks: Rack[];
  isNew?: boolean;
}

export const ProductoForm: React.FC<ProductoFormProps> = ({
  onSubmit,
  darkMode,
  racks,
  isNew = true
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductoFormData>({
    nombre: '',
    descripcion: '',
    cantidad: 0,
    precio: 0,
    categoria: '',
    rack: '',
    bodega: ''
  });

  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [precioInput, setPrecioInput] = useState('0');
  const [cantidadInput, setCantidadInput] = useState('0');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const [bodegasData] = await Promise.all([
          api.getBodegas(),
          ...(!isNew && id ? [api.getProducto(id)] : [])
        ]);
        
        setBodegas(bodegasData);
        
        if (!isNew && id) {
          const producto = await api.getProducto(id);
          setFormData({
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            cantidad: producto.cantidad,
            precio: producto.precio,
            categoria: producto.categoria,
            rack: producto.rack,
            bodega: producto.bodega
          });
          setPrecioInput(producto.precio.toString());
          setCantidadInput(producto.cantidad.toString());
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [isNew, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const dataToSubmit = {
        ...formData,
        precio: parseInt(precioInput) || 0,
        cantidad: parseInt(cantidadInput) || 0
      };
      await onSubmit(dataToSubmit);
      if (!isNew && id) {
        setFormData({
          nombre: '',
          descripcion: '',
          cantidad: 0,
          precio: 0,
          categoria: '',
          rack: '',
          bodega: ''
        });
        setPrecioInput('0');
        setCantidadInput('0');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'precio') {
      if (value === '' || /^\d*$/.test(value)) {
        setPrecioInput(value);
        setFormData(prev => ({
          ...prev,
          precio: parseInt(value) || 0
        }));
      }
    } else if (name === 'cantidad') {
      if (value === '' || /^\d*$/.test(value)) {
        setCantidadInput(value);
        setFormData(prev => ({
          ...prev,
          cantidad: parseInt(value) || 0
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const racksDisponibles = racks.filter(rack => rack.bodega === formData.bodega);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <LoadingSpinner size={40} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className={`space-y-4 p-4 sm:p-6 rounded-lg shadow-lg ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h2 className={`text-lg sm:text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {isNew ? 'Agregar Nuevo Producto' : 'Editar Producto'}
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
              type="text"
              name="cantidad"
              value={cantidadInput}
              onChange={handleChange}
              required
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
              type="text"
              name="precio"
              value={precioInput}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 text-sm sm:text-base rounded-md border ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Bodega
            </label>
            <select
              name="bodega"
              value={formData.bodega}
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
              <option value="">Seleccionar bodega</option>
              {bodegas.map((bodega) => (
                <option key={bodega._id} value={bodega._id}>
                  {bodega.nombre}
                </option>
              ))}
            </select>
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
              disabled={!formData.bodega}
              className={`w-full px-3 py-2.5 text-sm rounded-md border appearance-none bg-no-repeat ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white hover:border-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                !formData.bodega ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='${
                  darkMode ? '%23ffffff' : '%236B7280'
                }' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundSize: '1.25em 1.25em'
              }}
            >
              <option value="">Seleccionar rack</option>
              {racksDisponibles.map((rack) => (
                <option key={rack._id} value={rack._id}>
                  {rack.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Categoría
          </label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 text-sm sm:text-base rounded-md border ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          >
            <option value="">Seleccionar categoría</option>
            {PRODUCT_CATEGORIES.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/productos')}
            className={`w-full sm:w-auto px-4 py-2 rounded-md ${
              darkMode
                ? 'bg-gray-600 hover:bg-gray-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            Volver
          </button>
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
                {isNew ? 'Agregando...' : 'Guardando...'}
              </>
            ) : (
              isNew ? 'Agregar Producto' : 'Guardar Cambios'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};