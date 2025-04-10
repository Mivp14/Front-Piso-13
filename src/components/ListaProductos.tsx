import React from 'react';
import { Producto } from '../types';
import { Package } from 'lucide-react';

interface ListaProductosProps {
  productos: Producto[];
  darkMode: boolean;
}

export function ListaProductos({ productos, darkMode }: ListaProductosProps) {
  return (
    <div className={`rounded-lg shadow-lg p-6 transition-colors duration-200 ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Inventario Actual
      </h2>
      
      {productos.length === 0 ? (
        <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <Package className="w-12 h-12 mx-auto mb-2" />
          <p>No hay productos en el inventario</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg">
          <table className={`min-w-full divide-y ${
            darkMode ? 'divide-gray-700' : 'divide-gray-200'
          }`}>
            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>Nombre</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>Cantidad</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>Ubicación</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>Categoría</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>Precio</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {productos.map((producto) => (
                <tr key={producto.id} className={`transition-colors duration-200 ${
                  darkMode 
                    ? 'hover:bg-gray-700 bg-gray-800' 
                    : 'hover:bg-gray-50 bg-white'
                }`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className={`text-sm font-medium ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>{producto.nombre}</div>
                      <div className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>{producto.descripcion}</div>
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>{producto.cantidad}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>{producto.ubicacion}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>{producto.categoria}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    ${producto.precio.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}