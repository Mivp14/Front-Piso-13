import React, { useState } from 'react';
import { ProductoForm } from './components/ProductoForm';
import { ListaProductos } from './components/ListaProductos';
import { Navigation } from './components/Navigation';
import { Producto, ProductoFormData, Rack } from './types';
import { Boxes, Moon, Sun, Plus } from 'lucide-react';

function App() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [activeView, setActiveView] = useState<'inventario' | 'agregar'>('inventario');
  const [racks, setRacks] = useState<Rack[]>([
    { id: 1, nombre: 'Rack 1' }
  ]);

  const handleSubmit = (productoData: ProductoFormData) => {
    const nuevoProducto: Producto = {
      ...productoData,
      id: crypto.randomUUID(),
      fechaIngreso: new Date().toISOString(),
    };
    setProductos([...productos, nuevoProducto]);
    setActiveView('inventario'); // Cambiar a la vista de inventario después de agregar
  };

  const agregarRack = () => {
    const ultimoRack = racks[racks.length - 1];
    const nuevoId = ultimoRack ? ultimoRack.id + 1 : 1;
    setRacks([...racks, { id: nuevoId, nombre: `Rack ${nuevoId}` }]);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <header className={`${darkMode ? 'bg-gray-800 shadow-gray-900' : 'bg-white'} shadow transition-colors duration-200`}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Boxes className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mr-3`} />
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Sistema de Inventario
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={agregarRack}
                className={`flex items-center px-4 py-2 rounded-md ${
                  darkMode
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } transition-colors duration-200`}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Rack
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                } transition-colors duration-200`}
                aria-label="Alternar modo oscuro"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Navigation
          activeView={activeView}
          setActiveView={setActiveView}
          darkMode={darkMode}
        />
        
        {activeView === 'agregar' ? (
          <div className="max-w-2xl mx-auto">
            <ProductoForm onSubmit={handleSubmit} darkMode={darkMode} racks={racks} />
          </div>
        ) : (
          <ListaProductos productos={productos} darkMode={darkMode} />
        )}
      </main>
    </div>
  );
}

export default App;