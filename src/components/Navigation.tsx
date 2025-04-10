import React from 'react';
import { Boxes, Plus, Settings } from 'lucide-react';

interface NavigationProps {
  activeView: 'inventario' | 'agregar' | 'editar' | 'racks';
  setActiveView: (view: 'inventario' | 'agregar' | 'editar' | 'racks') => void;
  darkMode: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeView,
  setActiveView,
  darkMode
}) => {
  return (
    <nav className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => setActiveView('inventario')}
        className={`flex-1 sm:flex-none min-w-[120px] flex items-center justify-center px-3 py-2 text-sm sm:text-base rounded-md ${
          activeView === 'inventario'
            ? darkMode
              ? 'bg-blue-500 text-white'
              : 'bg-blue-600 text-white'
            : darkMode
              ? 'text-gray-300 hover:bg-gray-700'
              : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Boxes className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
        Inventario
      </button>

      <button
        onClick={() => setActiveView('agregar')}
        className={`flex-1 sm:flex-none min-w-[120px] flex items-center justify-center px-3 py-2 text-sm sm:text-base rounded-md ${
          activeView === 'agregar'
            ? darkMode
              ? 'bg-blue-500 text-white'
              : 'bg-blue-600 text-white'
            : darkMode
              ? 'text-gray-300 hover:bg-gray-700'
              : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
        Agregar Producto
      </button>

      <button
        onClick={() => setActiveView('racks')}
        className={`flex-1 sm:flex-none min-w-[120px] flex items-center justify-center px-3 py-2 text-sm sm:text-base rounded-md ${
          activeView === 'racks'
            ? darkMode
              ? 'bg-blue-500 text-white'
              : 'bg-blue-600 text-white'
            : darkMode
              ? 'text-gray-300 hover:bg-gray-700'
              : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Settings className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
        Gestionar Racks
      </button>
    </nav>
  );
};