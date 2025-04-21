import React, { useState, useEffect } from 'react';
import { Producto, Bodega, Rack, Estacion } from '../services/api';
import { api } from '../services/api';
import { Trash2, AlertCircle, Package, Edit, Plus } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';
import { useNavigate } from 'react-router-dom';

interface ListaProductosProps {
  darkMode: boolean;
}

export const ListaProductos: React.FC<ListaProductosProps> = ({ darkMode }) => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [racks, setRacks] = useState<Rack[]>([]);
  const [estaciones, setEstaciones] = useState<Estacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error', texto: string } | null>(null);
  const [filtros, setFiltros] = useState({
    estacion: '',
    bodega: '',
    rack: '',
    categoria: '',
    nombre: ''
  });
  const [confirmDialog, setConfirmDialog] = useState<{ show: boolean; productoId: string | null }>({ show: false, productoId: null });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [productosData, bodegasData, racksData, estacionesData] = await Promise.all([
        api.getProductos(),
        api.getBodegas(),
        api.getRacks(),
        api.getEstaciones()
      ]);
      setProductos(productosData);
      setBodegas(bodegasData);
      setRacks(racksData);
      setEstaciones(estacionesData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteProducto(id);
      setMensaje({ tipo: 'success', texto: 'Producto eliminado correctamente' });
      cargarDatos();
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'Error al eliminar el producto' });
      console.error(err);
    } finally {
      setConfirmDialog({ show: false, productoId: null });
    }
  };

  // Limpiar mensaje después de 3 segundos
  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => {
        setMensaje(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const productosFiltrados = productos.filter(producto => {
    const cumpleEstacion = !filtros.estacion || producto.estacion._id === filtros.estacion;
    const cumpleBodega = !filtros.bodega || producto.bodega._id === filtros.bodega;
    const cumpleRack = !filtros.rack || producto.rack._id === filtros.rack;
    const terminoBusqueda = filtros.nombre.toLowerCase();
    const cumpleBusqueda = !terminoBusqueda || 
      producto.nombre.toLowerCase().includes(terminoBusqueda) ||
      producto.categoria.toLowerCase().includes(terminoBusqueda);
    return cumpleEstacion && cumpleBodega && cumpleRack && cumpleBusqueda;
  });

  const bodegasFiltradas = bodegas.filter(bodega => 
    !filtros.estacion || bodega.estacion._id === filtros.estacion
  );

  const racksFiltrados = racks.filter(rack => 
    !filtros.bodega || rack.bodega === filtros.bodega
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Diálogo de confirmación */}
      {confirmDialog.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 sm:p-6 w-full max-w-sm mx-auto shadow-xl`}>
            <div className="flex items-center mb-4">
              <AlertCircle className={`w-6 h-6 ${darkMode ? 'text-red-400' : 'text-red-600'} mr-2`} />
              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Confirmar eliminación
              </h3>
            </div>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              ¿Estás seguro de que deseas eliminar este producto?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setConfirmDialog({ show: false, productoId: null })}
                className={`px-4 py-2 rounded-md ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={() => confirmDialog.productoId && handleDelete(confirmDialog.productoId)}
                className={`px-4 py-2 rounded-md ${
                  darkMode
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {mensaje && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-96 z-50">
          <div
            className={`p-4 rounded-md shadow-lg ${
              mensaje.tipo === 'success'
                ? darkMode
                  ? 'bg-green-900 text-green-200'
                  : 'bg-green-100 text-green-700'
                : darkMode
                  ? 'bg-red-900 text-red-200'
                  : 'bg-red-100 text-red-700'
            }`}
          >
            {mensaje.texto}
          </div>
        </div>
      )}

      {/* Encabezado con título y botón de agregar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Inventario Actual
        </h2>
        <button
          onClick={() => navigate('/productos/nuevo')}
          className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          <Plus className="w-4 h-4" />
          Agregar Producto
        </button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:max-w-4xl mx-auto">
        <div>
          <label className={`block text-xs font-medium mb-0.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Estación
          </label>
          <select
            value={filtros.estacion}
            onChange={(e) => setFiltros({ ...filtros, estacion: e.target.value, bodega: '', rack: '' })}
            className={`w-full px-2 py-1.5 text-sm rounded-md border ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">Todas las estaciones</option>
            {estaciones.map((estacion) => (
              <option key={estacion._id} value={estacion._id}>
                {estacion.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-xs font-medium mb-0.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Bodega
          </label>
          <select
            value={filtros.bodega}
            onChange={(e) => setFiltros({ ...filtros, bodega: e.target.value, rack: '' })}
            className={`w-full px-2 py-1.5 text-sm rounded-md border ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">Todas las bodegas</option>
            {bodegasFiltradas.map((bodega) => (
              <option key={bodega._id} value={bodega._id}>
                {bodega.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-xs font-medium mb-0.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Rack
          </label>
          <select
            value={filtros.rack}
            onChange={(e) => setFiltros({ ...filtros, rack: e.target.value })}
            className={`w-full px-2 py-1.5 text-sm rounded-md border ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">Todos los racks</option>
            {racksFiltrados.map((rack) => (
              <option key={rack._id} value={rack._id}>
                {rack.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-xs font-medium mb-0.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Buscar
          </label>
          <input
            type="text"
            value={filtros.nombre}
            onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
            placeholder="Buscar por nombre o categoría..."
            className={`w-full px-2 py-1.5 text-sm rounded-md border ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
      </div>

      {/* Lista de Productos */}
      <div className={`overflow-x-auto -mx-4 sm:mx-0 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
        {loading ? (
          <div className="flex justify-center p-8">
            <LoadingSpinner size={40} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <Package className="w-12 h-12 mx-auto mb-2" />
            <p>No hay productos que coincidan con los filtros</p>
          </div>
        ) : (
          <div className="min-w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-4 sm:px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Nombre
                  </th>
                  <th className={`hidden sm:table-cell px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Categoría
                  </th>
                  <th className={`hidden sm:table-cell px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Estación
                  </th>
                  <th className={`hidden sm:table-cell px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Bodega
                  </th>
                  <th className={`hidden sm:table-cell px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Rack
                  </th>
                  <th className={`px-4 sm:px-6 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y divide-gray-200 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                {productosFiltrados.map((producto) => (
                  <tr key={producto._id} className={`hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors duration-200`}>
                    <td className={`px-4 sm:px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      <div className="flex flex-col">
                        <span className="font-medium">{producto.nombre}</span>
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} sm:hidden`}>
                          {producto.categoria}
                        </span>
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} sm:hidden`}>
                          {producto.estacion.nombre} &gt; {producto.bodega.nombre} &gt; {producto.rack.nombre}
                        </span>
                      </div>
                    </td>
                    <td className={`hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {producto.categoria}
                    </td>
                    <td className={`hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {producto.estacion.nombre}
                    </td>
                    <td className={`hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {producto.bodega.nombre}
                    </td>
                    <td className={`hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {producto.rack.nombre}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => navigate(`/productos/editar/${producto._id}`)}
                          className={`p-1 rounded-md ${
                            darkMode
                              ? 'hover:bg-gray-700 text-blue-400'
                              : 'hover:bg-gray-100 text-blue-600'
                          }`}
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setConfirmDialog({ show: true, productoId: producto._id })}
                          className={`p-1 rounded-md ${
                            darkMode
                              ? 'hover:bg-gray-700 text-red-400'
                              : 'hover:bg-gray-100 text-red-600'
                          }`}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};