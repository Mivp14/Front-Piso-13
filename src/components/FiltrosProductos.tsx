import React, { useState, useEffect } from 'react';
import { Producto, Rack } from '../types';

interface FiltrosProductosProps {
  productos: Producto[];
  racks: Rack[];
  onFiltroChange: (filtro: {
    busqueda: string;
    rack: string;
    categoria: string;
  }) => void;
  darkMode: boolean;
}

export const FiltrosProductos: React.FC<FiltrosProductosProps> = ({
  productos,
  racks,
  onFiltroChange,
  darkMode
}) => {
  const [busqueda, setBusqueda] = useState('');
  const [rack, setRack] = useState('');
  const [categoria, setCategoria] = useState('');

  // Obtener categorías únicas
  const categorias = [...new Set(productos.map(p => p.categoria))];

  useEffect(() => {
    onFiltroChange({ busqueda, rack, categoria });
  }, [busqueda, rack, categoria, onFiltroChange]);

  return (
    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow mb-4`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Buscar producto
          </label>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Nombre o descripción..."
            className={`w-full px-3 py-2 rounded-md border ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Filtrar por Rack
          </label>
          <select
            value={rack}
            onChange={(e) => setRack(e.target.value)}
            className={`w-full px-3 py-2 rounded-md border ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">Todos los racks</option>
            {racks.map((r) => (
              <option key={r._id} value={r._id}>
                {r.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Filtrar por Categoría
          </label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className={`w-full px-3 py-2 rounded-md border ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}; 