import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, Warehouse, Menu, X } from 'lucide-react';

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
    { to: "/productos", icon: <Package className="w-5 h-5 mr-2" />, text: "Inventario" },
    { to: "/bodegas", icon: <Warehouse className="w-5 h-5 mr-2" />, text: "Gestionar Bodegas" }
  ];

  return (
    <nav className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
      <div className="container mx-auto px-6">
        {/* Título centrado */}
        <div className="flex justify-center items-center py-6">
          <Package className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mr-3`} />
          <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Sistema de Inventario
          </span>
        </div>

        {/* Menú móvil botón */}
        <div className="md:hidden flex justify-center pb-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-2 rounded-md ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menú escritorio */}
        <div className="hidden md:flex justify-center items-center space-x-4 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                isActive(link.to)
                  ? 'bg-blue-600 text-white'
                  : darkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {link.icon}
              {link.text}
            </Link>
          ))}
        </div>

        {/* Menú móvil expandido */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    isActive(link.to)
                      ? 'bg-blue-600 text-white'
                      : darkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {link.icon}
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};