import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Rack, Producto, api } from '../services/api';
import { LoadingSpinner } from './LoadingSpinner';
import { Box, Package } from 'lucide-react';

interface RackViewProps {
  darkMode: boolean;
}

export const RackView: React.FC<RackViewProps> = ({ darkMode }) => {
  const { id } = useParams<{ id: string }>();
  const [rack, setRack] = useState<Rack | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      cargarDatos(id);
    }
  }, [id]);

  const cargarDatos = async (rackId: string) => {
    try {
      setLoading(true);
      const [rackData, productosData] = await Promise.all([
        api.getRacks().then(racks => racks.find(r => r._id === rackId) || null),
        api.getProductos().then(productos => productos.filter(p => p.rack._id === rackId))
      ]);
      setRack(rackData);
      setProductos(productosData);
    } catch (err) {
      console.error('Error al cargar los datos del rack:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size={40} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
      </div>
    );
  }

  if (!rack) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        <Box className="w-16 h-16 mb-4 opacity-50" />
        <h2 className="text-xl font-semibold mb-2">Rack no encontrado</h2>
        <p>El rack que buscas no existe o ha sido eliminado.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className={`rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg overflow-hidden`}>
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <Box className={`w-8 h-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {rack.nombre}
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {rack.ubicacion}
              </p>
            </div>
          </div>

          <div className={`p-4 rounded-md mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h2 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              Información del Rack
            </h2>
            <div className="space-y-2">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className="font-medium">Descripción:</span> {rack.descripcion || 'Sin descripción'}
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className="font-medium">Categorías:</span> {rack.categorias.join(', ') || 'Sin categorías'}
              </p>
            </div>
          </div>

          <div>
            <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              Productos en este Rack
            </h2>
            {productos.length === 0 ? (
              <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg mb-1">No hay productos</p>
                <p className="text-sm">Este rack está vacío actualmente</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {productos.map(producto => (
                  <div
                    key={producto._id}
                    className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                  >
                    <h3 className={`font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {producto.nombre}
                    </h3>
                    <div className="space-y-1">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Cantidad: {producto.cantidad}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Precio: ${producto.precio}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Categoría: {producto.categoria}
                      </p>
                      {producto.descripcion && (
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {producto.descripcion}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 