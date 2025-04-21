import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ProductoForm } from './components/ProductoForm';
import { ListaProductos } from './components/ListaProductos';
import { GestionBodegas } from './components/GestionBodegas';
import { GestionEstaciones } from './components/GestionEstaciones';
import { InventarioView } from './components/InventarioView';
import { RackView } from './components/RackView';
import { Navigation } from './components/Navigation';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Moon, Sun } from 'lucide-react';
import { api } from './services/api';
import { Rack, ProductoFormData } from './services/api';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [racks, setRacks] = useState<Rack[]>([]);

  useEffect(() => {
    const cargarRacks = async () => {
      try {
        const racksData = await api.getRacks();
        setRacks(racksData);
      } catch (error) {
        console.error('Error al cargar racks:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarRacks();
  }, []);

  const AppContent = () => {
    const navigate = useNavigate();

    const handleCreateProductoWithNavigate = async (productoData: ProductoFormData) => {
      try {
        await api.createProducto(productoData);
        navigate('/productos');
      } catch (error) {
        console.error('Error al crear producto:', error);
      }
    };

    const handleUpdateProductoWithNavigate = async (productoData: ProductoFormData) => {
      try {
        const id = window.location.pathname.split('/').pop();
        if (id) {
          await api.updateProducto(id, productoData);
          navigate('/productos');
        }
      } catch (error) {
        console.error('Error al actualizar producto:', error);
      }
    };

    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <Navigation darkMode={darkMode} />
        
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="fixed bottom-4 right-4 p-2 rounded-full bg-gray-800 text-white shadow-lg hover:bg-gray-700 transition-colors"
        >
          {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>

        <main className="container mx-auto px-4 py-4 sm:py-6 sm:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <LoadingSpinner size={40} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
              <p className={`mt-4 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Cargando datos...
              </p>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<Navigate to="/inventario" replace />} />
              <Route path="/inventario" element={<InventarioView darkMode={darkMode} />} />
              <Route path="/rack/:id" element={<RackView darkMode={darkMode} />} />
              <Route path="/productos" element={<ListaProductos darkMode={darkMode} />} />
              <Route 
                path="/productos/nuevo" 
                element={
                  <ProductoForm 
                    darkMode={darkMode} 
                    isNew={true} 
                    racks={racks}
                    onSubmit={handleCreateProductoWithNavigate}
                  />
                } 
              />
              <Route 
                path="/productos/editar/:id" 
                element={
                  <ProductoForm 
                    darkMode={darkMode} 
                    isNew={false} 
                    racks={racks}
                    onSubmit={handleUpdateProductoWithNavigate}
                  />
                } 
              />
              <Route path="/estaciones" element={<GestionEstaciones darkMode={darkMode} />} />
              <Route path="/bodegas" element={<GestionBodegas darkMode={darkMode} />} />
            </Routes>
          )}
        </main>
      </div>
    );
  };

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;