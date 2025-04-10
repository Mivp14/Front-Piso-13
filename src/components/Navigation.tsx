import React from 'react';
import { ListFilter, PlusCircle } from 'lucide-react';

interface NavigationProps {
  activeView: 'inventario' | 'agregar';
  setActiveView: (view: 'inventario' | 'agregar') => void;
  darkMode: boolean;
}

export function Navigation({ activeView, setActiveView, darkMode }: NavigationProps) {
  const buttonBaseClasses = "flex items-center px-4 py-2 rounded-md transition-colors duration-200";
  const activeClasses = darkMode
    ? "bg-blue-500 text-white"
    : "bg-blue-600 text-white";
  const inactiveClasses = darkMode
    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
    : "bg-gray-100 text-gray-600 hover:bg-gray-200";

  return (
    <div className="flex space-x-4 mb-6">
      <button
        onClick={() => setActiveView('inventario')}
        className={`${buttonBaseClasses} ${activeView === 'inventario' ? activeClasses : inactiveClasses}`}
      >
        <ListFilter className="w-4 h-4 mr-2" />
        Inventario
      </button>
      <button
        onClick={() => setActiveView('agregar')}
        className={`${buttonBaseClasses} ${activeView === 'agregar' ? activeClasses : inactiveClasses}`}
      >
        <PlusCircle className="w-4 h-4 mr-2" />
        Agregar Producto
      </button>
    </div>
  );
}