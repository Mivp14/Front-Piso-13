import React, { useState, useEffect } from 'react';
import { Producto, Rack } from '../types';
import { Package, Trash2, Edit } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';
import { ConfirmDialog } from './ConfirmDialog';
import { FiltrosProductos } from './FiltrosProductos';
import { useSearchParams } from 'react-router-dom';

interface ListaProductosProps {
  productos: Producto[];
  racks: Rack[];
  darkMode: boolean;
  onDelete: (id: string) => void;
  onEdit: (producto: Producto) => void;
  isLoading?: boolean;
}

export const ListaProductos: React.FC<ListaProductosProps> = ({ 
  productos, 
  racks,
  darkMode, 
  onDelete, 
  onEdit,
  isLoading = false
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtros, setFiltros] = useState({
    busqueda: '',
    rack: '',
    categoria: ''
  });
  const [productoAEliminar, setProductoAEliminar] = useState<Producto | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Aplicar filtros desde la URL al cargar el componente
  useEffect(() => {
    const rack = searchParams.get('rack');
    const categoria = searchParams.get('categoria');
    const busqueda = searchParams.get('busqueda') || '';

    if (rack || categoria || busqueda) {
      setFiltros({
        rack: rack || '',
        categoria: categoria || '',
        busqueda: busqueda
      });
    }
  }, [searchParams]);

  const handleFiltroChange = (nuevosFiltros: {
    busqueda: string;
    rack: string;
    categoria: string;
  }) => {
    setFiltros(nuevosFiltros);
    // Actualizar la URL con los nuevos filtros
    const params = new URLSearchParams();
    if (nuevosFiltros.rack) params.set('rack', nuevosFiltros.rack);
    if (nuevosFiltros.categoria) params.set('categoria', nuevosFiltros.categoria);
    if (nuevosFiltros.busqueda) params.set('busqueda', nuevosFiltros.busqueda);
    setSearchParams(params);
  };

  const productosFiltrados = productos.filter(producto => {
    const coincideBusqueda = producto.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
                            producto.descripcion.toLowerCase().includes(filtros.busqueda.toLowerCase());
    const coincideRack = !filtros.rack || producto.rack === filtros.rack;
    const coincideCategoria = !filtros.categoria || producto.categoria === filtros.categoria;
    
    return coincideBusqueda && coincideRack && coincideCategoria;
  });

  const handleDelete = async () => {
    if (!productoAEliminar) return;
    
    try {
      setDeleteLoading(true);
      await onDelete(productoAEliminar._id);
    } finally {
      setDeleteLoading(false);
      setProductoAEliminar(null);
    }
  };

  // Función para obtener el nombre del rack
  const getRackNombre = (rackId: string) => {
    const rack = racks.find(r => r._id === rackId);
    return rack ? rack.nombre : rackId;
  };

  return (
    <>
    <div className={`rounded-lg shadow-lg p-6 transition-colors duration-200 ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Inventario Actual
      </h2>
      
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Buscar producto
            </label>
            <input
              type="text"
              value={filtros.busqueda}
              onChange={(e) => handleFiltroChange({
                busqueda: e.target.value,
                rack: filtros.rack,
                categoria: filtros.categoria
              })}
              placeholder="Nombre o descripción..."
              className={`w-full px-3 py-2 rounded-md border ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Filtrar por Rack
            </label>
            <select
              value={filtros.rack}
              onChange={(e) => handleFiltroChange({
                busqueda: filtros.busqueda,
                rack: e.target.value,
                categoria: filtros.categoria
              })}
              className={`w-full px-3 py-3 sm:py-2 text-base sm:text-sm rounded-md border appearance-none bg-no-repeat bg-right ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='${
                  darkMode ? '%23ffffff' : '%236B7280'
                }' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundSize: '1.5em 1.5em'
              }}
            >
              <option value="">Todos los racks</option>
              {racks.map((rack) => (
                <option key={rack._id} value={rack._id}>
                  {rack.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Filtrar por Categoría
            </label>
            <select
              value={filtros.categoria}
              onChange={(e) => handleFiltroChange({
                busqueda: filtros.busqueda,
                rack: filtros.rack,
                categoria: e.target.value
              })}
              className={`w-full px-3 py-3 sm:py-2 text-base sm:text-sm rounded-md border appearance-none bg-no-repeat bg-right ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='${
                  darkMode ? '%23ffffff' : '%236B7280'
                }' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundSize: '1.5em 1.5em'
              }}
            >
              <option value="">Todas las categorías</option>
              {Array.from(new Set(productos.map(p => p.categoria))).map(categoria => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>
        </div>

        {productosFiltrados.length === 0 ? (
        <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <Package className="w-12 h-12 mx-auto mb-2" />
          <p>No hay productos en el inventario</p>
        </div>
      ) : (
          <div className={`overflow-x-auto rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <table className="min-w-full divide-y divide-gray-200">
            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th scope="col" className="hidden sm:table-cell px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th scope="col" className="hidden sm:table-cell px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Rack
                  </th>
                  <th scope="col" className="hidden sm:table-cell px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Ubicación
                  </th>
                  <th scope="col" className="hidden sm:table-cell px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {productosFiltrados.map((producto) => (
                  <tr key={producto._id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                    <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm">
                      <div className={darkMode ? 'text-white' : 'text-gray-900'}>{producto.nombre}</div>
                      <div className="sm:hidden text-xs text-gray-500">{producto.descripcion}</div>
                      <div className="sm:hidden text-xs text-gray-500">
                        Rack: {racks.find(r => r._id === producto.rack)?.nombre || 'N/A'}
                      </div>
                      <div className="sm:hidden text-xs text-gray-500">
                        Ubicación: {producto.ubicacion}
                      </div>
                      <div className="sm:hidden text-xs text-gray-500">
                        Categoría: {producto.categoria}
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-4 py-3 whitespace-nowrap text-xs sm:text-sm">
                      <div className={darkMode ? 'text-white' : 'text-gray-900'}>{producto.descripcion}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm">
                      <div className={darkMode ? 'text-white' : 'text-gray-900'}>{producto.cantidad}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm">
                      <div className={darkMode ? 'text-white' : 'text-gray-900'}>
                        ${producto.precio.toLocaleString('es-CL')}
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-4 py-3 whitespace-nowrap text-xs sm:text-sm">
                      <div className={darkMode ? 'text-white' : 'text-gray-900'}>
                        {racks.find(r => r._id === producto.rack)?.nombre || 'N/A'}
                    </div>
                  </td>
                    <td className="hidden sm:table-cell px-4 py-3 whitespace-nowrap text-xs sm:text-sm">
                      <div className={darkMode ? 'text-white' : 'text-gray-900'}>
                        {producto.ubicacion}
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-4 py-3 whitespace-nowrap text-xs sm:text-sm">
                      <div className={darkMode ? 'text-white' : 'text-gray-900'}>{producto.categoria}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-xs sm:text-sm">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => onEdit(producto)}
                          className="p-1 rounded-md text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-gray-700"
                        >
                          <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                          onClick={() => setProductoAEliminar(producto)}
                          disabled={isLoading || deleteLoading}
                          className="p-1 rounded-md text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-gray-700 disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
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

      <ConfirmDialog
        isOpen={!!productoAEliminar}
        onClose={() => setProductoAEliminar(null)}
        onConfirm={handleDelete}
        title="Eliminar Producto"
        message="¿Estás seguro de que deseas eliminar este producto?"
        darkMode={darkMode}
        isLoading={deleteLoading}
      />
    </>
  );
};