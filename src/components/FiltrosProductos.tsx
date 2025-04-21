import React from 'react';
import { Bodega, Rack } from '../services/api';

interface FiltrosProductosProps {
  darkMode: boolean;
  filtros: {
    bodega: string;
    rack: string;
    categoria: string;
    nombre: string;
  };
  setFiltros: React.Dispatch<React.SetStateAction<{
    bodega: string;
    rack: string;
    categoria: string;
    nombre: string;
  }>>;
  bodegas: Bodega[];
  racks: Rack[];
}

export const FiltrosProductos: React.FC<FiltrosProductosProps> = ({
  darkMode,
  filtros,
  setFiltros,
  bodegas,
  racks
}) => {
  const racksFiltrados = filtros.bodega
    ? racks.filter(rack => rack.bodega === filtros.bodega)
    : racks;

  return (
    <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Bodega
          </label>
          <select
            value={filtros.bodega}
            onChange={(e) => setFiltros({ ...filtros, bodega: e.target.value, rack: '' })}
            className={`w-full px-3 py-2 rounded-md border ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
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

        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Rack
          </label>
          <select
            value={filtros.rack}
            onChange={(e) => setFiltros({ ...filtros, rack: e.target.value })}
            className={`w-full px-3 py-2 rounded-md border ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
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
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Categoría
          </label>
          <input
            type="text"
            value={filtros.categoria}
            onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
            placeholder="Buscar por categoría..."
            className={`w-full px-3 py-2 rounded-md border ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Nombre
          </label>
          <input
            type="text"
            value={filtros.nombre}
            onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
            placeholder="Buscar por nombre..."
            className={`w-full px-3 py-2 rounded-md border ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
      </div>
    </div>
  );
}; 