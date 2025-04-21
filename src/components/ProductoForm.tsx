import React, { useState, useEffect } from 'react';
import { ProductoFormData, Rack, Bodega, Estacion } from '../services/api';
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
    estacion: '',
    rack: '',
    bodega: ''
  });

  const [estaciones, setEstaciones] = useState<Estacion[]>([]);
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [precioInput, setPrecioInput] = useState('0');
  const [cantidadInput, setCantidadInput] = useState('0');
  const [estacionSeleccionada, setEstacionSeleccionada] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const [estacionesData, bodegasData] = await Promise.all([
          api.getEstaciones(),
          api.getBodegas()
        ]);
        
        setEstaciones(estacionesData);
        setBodegas(bodegasData);
        
        if (!isNew && id) {
          const producto = await api.getProducto(id);
          if (producto) {
            setEstacionSeleccionada(producto.estacion._id);
            setFormData({
              nombre: producto.nombre || '',
              descripcion: producto.descripcion || '',
              cantidad: producto.cantidad || 0,
              precio: producto.precio || 0,
              categoria: producto.categoria || '',
              estacion: producto.estacion._id || '',
              rack: producto.rack._id || '',
              bodega: producto.bodega._id || ''
            });
            setPrecioInput(producto.precio?.toString() || '0');
            setCantidadInput(producto.cantidad?.toString() || '0');
          }
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
          estacion: '',
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
    } else if (name === 'estacion') {
      setEstacionSeleccionada(value);
      setFormData(prev => ({
        ...prev,
        estacion: value,
        bodega: '',
        rack: ''
      }));
    } else if (name === 'bodega') {
      setFormData(prev => ({
        ...prev,
        bodega: value,
        rack: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const bodegasDisponibles = bodegas.filter(bodega => bodega.estacion._id === estacionSeleccionada);
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
      <form onSubmit={handleSubmit} className={`space-y-4 p-6 rounded-lg shadow-lg ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <h2 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {isNew ? 'Nuevo Producto' : 'Editar Producto'}
          </h2>
        </div>
        
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Estación
            </label>
            <select
              name="estacion"
              value={estacionSeleccionada}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2.5 text-sm rounded-md border appearance-none bg-no-repeat ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="">Seleccione una estación</option>
              {estaciones.map(estacion => (
                <option key={estacion._id} value={estacion._id}>
                  {estacion.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Bodega
            </label>
            <select
              name="bodega"
              value={formData.bodega}
              onChange={handleChange}
              required
              disabled={!estacionSeleccionada}
              className={`w-full px-3 py-2.5 text-sm rounded-md border appearance-none bg-no-repeat ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } ${!estacionSeleccionada ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <option value="">Seleccione una bodega</option>
              {bodegasDisponibles.map(bodega => (
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
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } ${!formData.bodega ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <option value="">Seleccione un rack</option>
              {racksDisponibles.map(rack => (
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
            className={`w-full px-3 py-2.5 text-sm rounded-md border appearance-none bg-no-repeat ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">Seleccione una categoría</option>
            {PRODUCT_CATEGORIES.map(categoria => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/productos')}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-md text-sm font-medium ${
              darkMode
                ? 'bg-gray-600 hover:bg-gray-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-colors rounded-md bg-blue-600 hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
          >
            {isSubmitting ? 'Guardando...' : isNew ? 'Crear Producto' : 'Actualizar Producto'}
          </button>
        </div>
      </form>
    </div>
  );
};