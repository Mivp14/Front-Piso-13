import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, Warehouse, Menu, X, LayoutGrid } from 'lucide-react';

interface NavigationProps {
  darkMode: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ darkMode }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { to: "/inventario", icon: <LayoutGrid className="w-5 h-5" />, text: "Vista General" },
    { to: "/productos", icon: <Package className="w-5 h-5" />, text: "Productos" },
    { to: "/bodegas", icon: <Warehouse className="w-5 h-5" />, text: "Bodegas" }
  ];

  return (
    <nav className={`${darkMode ? 'bg-gray-900' : 'bg-white'} border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y título */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Package className={`w-8 h-8 ${darkMode ? 'text-blue-500' : 'text-blue-600'}`} />
              <span className={`ml-2 text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                PISO 13
              </span>
            </div>
          </div>

          {/* Navegación escritorio */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2
                  ${isActive(link.to)
                    ? darkMode
                      ? 'bg-gray-800 text-blue-400'
                      : 'bg-blue-50 text-blue-700'
                    : darkMode
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                {link.icon}
                <span>{link.text}</span>
              </Link>
            ))}
          </div>

          {/* Botón menú móvil */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md
                ${darkMode
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className={`px-2 pt-2 pb-3 space-y-1 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 flex items-center space-x-2
                  ${isActive(link.to)
                    ? darkMode
                      ? 'bg-gray-800 text-blue-400'
                      : 'bg-blue-50 text-blue-700'
                    : darkMode
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                {link.icon}
                <span>{link.text}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};