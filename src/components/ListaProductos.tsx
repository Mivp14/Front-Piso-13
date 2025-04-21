import React, { useState, useEffect } from 'react';
import { Producto, Bodega, Rack } from '../services/api';
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
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error', texto: string } | null>(null);
  const [filtros, setFiltros] = useState({
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
      const [productosData, bodegasData, racksData] = await Promise.all([
        api.getProductos(),
        api.getBodegas(),
        api.getRacks()
      ]);
      setProductos(productosData);
      setBodegas(bodegasData);
      setRacks(racksData);
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

  const getUbicacionCompleta = (producto: Producto) => {
    const bodega = bodegas.find(b => b._id === producto.bodega);
    const rack = racks.find(r => r._id === producto.rack);
    if (!bodega || !rack) return 'Ubicación no disponible';
    const tipoBodega = bodega.esCentral ? 'Central' : 'Secundaria';
    return `${bodega.nombre} (${tipoBodega}), ${rack.nombre}`;
  };

  const productosFiltrados = productos.filter(producto => {
    const cumpleBodega = !filtros.bodega || producto.bodega === filtros.bodega;
    const cumpleRack = !filtros.rack || producto.rack === filtros.rack;
    const terminoBusqueda = filtros.nombre.toLowerCase();
    const cumpleBusqueda = !terminoBusqueda || 
      producto.nombre.toLowerCase().includes(terminoBusqueda) ||
      producto.categoria.toLowerCase().includes(terminoBusqueda);
    return cumpleBodega && cumpleRack && cumpleBusqueda;
  });

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
        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Inventario Actual
        </h2>
        <button
          onClick={() => navigate('/productos/nuevo')}
          className={`w-full sm:w-auto flex items-center justify-center px-4 py-2 rounded-md ${
            darkMode
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          <Plus className="w-5 h-5 mr-2" />
          Agregar Producto
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-2 sm:max-w-3xl mx-auto justify-center">
        <div className="w-full sm:w-48">
          <label className={`block text-xs font-medium mb-0.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Bodega
          </label>
          <select
            value={filtros.bodega}
            onChange={(e) => setFiltros({ ...filtros, bodega: e.target.value })}
            className={`w-full px-2 py-1.5 text-sm rounded-md border ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">Todas las bodegas</option>
            {bodegas.map((bodega) => (
              <option key={bodega._id} value={bodega._id}>
                {bodega.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-48">
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
            {racks.map((rack) => (
              <option key={rack._id} value={rack._id}>
                {rack.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-64">
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
                  <th className={`px-4 sm:px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Cantidad
                  </th>
                  <th className={`hidden sm:table-cell px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Precio
                  </th>
                  <th className={`hidden md:table-cell px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Ubicación
                  </th>
                  <th className={`px-4 sm:px-6 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y divide-gray-200 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                {productosFiltrados.map((producto) => (
                  <tr key={producto._id}>
                    <td className={`px-4 sm:px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      <div>{producto.nombre}</div>
                      <div className="md:hidden text-xs mt-1 text-gray-500">
                        {getUbicacionCompleta(producto)}
                      </div>
                    </td>
                    <td className={`hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {producto.categoria}
                    </td>
                    <td className={`px-4 sm:px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {producto.cantidad}
                    </td>
                    <td className={`hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(producto.precio)}
                    </td>
                    <td className={`hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {getUbicacionCompleta(producto)}
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