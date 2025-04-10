import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ProductoForm } from './components/ProductoForm';
import { ListaProductos } from './components/ListaProductos';
import { GestionRacks } from './components/GestionRacks';
import { Navigation } from './components/Navigation';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Producto, ProductoFormData, Rack } from './types';
import { Boxes, Moon, Sun, Plus } from 'lucide-react';
import { api } from './services/api';

function App() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [racks, setRacks] = useState<Rack[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [activeView, setActiveView] = useState<'inventario' | 'agregar' | 'editar' | 'racks'>('inventario');
  const [productoEnEdicion, setProductoEnEdicion] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar productos y racks al iniciar
  useEffect(() => {
    Promise.all([loadProductos(), loadRacks()])
      .catch(err => {
        setError('Error al cargar los datos');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const loadProductos = async () => {
    try {
      const data = await api.getProductos();
      setProductos(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar productos');
      console.error(err);
    }
  };

  const loadRacks = async () => {
    try {
      const data = await api.getRacks();
      setRacks(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar racks');
      console.error(err);
    }
  };

  const handleSubmit = async (productoData: ProductoFormData) => {
    try {
      setActionLoading(true);
      if (productoEnEdicion) {
        const productoActualizado = await api.updateProducto(productoEnEdicion._id, productoData);
        setProductos(productos.map(p => p._id === productoEnEdicion._id ? productoActualizado : p));
        setProductoEnEdicion(null);
      } else {
        const nuevoProducto = await api.createProducto(productoData);
        setProductos([...productos, nuevoProducto]);
      }
      setActiveView('inventario');
    } catch (err) {
      console.error('Error al guardar producto:', err);
      setError('Error al guardar el producto');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setActionLoading(true);
      await api.deleteProducto(id);
      setProductos(productos.filter(p => p._id !== id));
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      setError('Error al eliminar el producto');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (producto: Producto) => {
    setProductoEnEdicion(producto);
    setActiveView('editar');
  };

  const handleCancelEdit = () => {
    setProductoEnEdicion(null);
    setActiveView('inventario');
  };

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <header className={`${darkMode ? 'bg-gray-800 shadow-gray-900' : 'bg-white'} shadow transition-colors duration-200`}>
          <div className="w-full px-4 py-4 sm:py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center w-full sm:w-auto justify-center sm:justify-start">
                <Boxes className={`w-6 h-6 sm:w-8 sm:h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mr-2 sm:mr-3`} />
                <h1 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Sistema de Inventario
                </h1>
              </div>
              <div className="flex items-center">
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

        <main className="w-full px-4 py-4 sm:py-6 sm:px-6 lg:px-8">
          <Navigation
            activeView={activeView}
            setActiveView={(view) => {
              if (view !== 'editar') {
                setProductoEnEdicion(null);
              }
              setActiveView(view);
            }}
            darkMode={darkMode}
          />
          
          {error && (
            <div className={`mb-4 p-4 rounded-md ${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'}`}>
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <LoadingSpinner size={40} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
              <p className={`mt-4 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Cargando datos...
              </p>
            </div>
          ) : activeView === 'racks' ? (
            <GestionRacks darkMode={darkMode} />
          ) : activeView === 'agregar' ? (
            <div className="max-w-full sm:max-w-2xl mx-auto">
              <ProductoForm 
                onSubmit={handleSubmit} 
                darkMode={darkMode}
                racks={racks}
              />
            </div>
          ) : activeView === 'editar' && productoEnEdicion ? (
            <div className="max-w-full sm:max-w-2xl mx-auto">
              <ProductoForm 
                onSubmit={handleSubmit}
                darkMode={darkMode}
                racks={racks}
                productoInicial={productoEnEdicion}
              />
            </div>
          ) : (
            <ListaProductos 
              productos={productos} 
              racks={racks}
              darkMode={darkMode} 
              onDelete={handleDelete}
              onEdit={handleEdit}
              isLoading={actionLoading}
            />
          )}
        </main>
      </div>
    </Router>
  );
}

export default App;