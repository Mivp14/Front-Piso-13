import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Estacion, Bodega, Rack, Producto, api } from '../services/api';
import { LoadingSpinner } from './LoadingSpinner';
import { Building2, Package, Box, ChevronDown, ChevronRight, Plus, Edit, Trash2, AlertCircle } from 'lucide-react';

interface InventarioViewProps {
  darkMode: boolean;
}

export const InventarioView: React.FC<InventarioViewProps> = ({ darkMode }) => {
  const [estaciones, setEstaciones] = useState<Estacion[]>([]);
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [racks, setRacks] = useState<Rack[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [estacionSeleccionada, setEstacionSeleccionada] = useState<string>('');
  const [mostrarFormularioEstacion, setMostrarFormularioEstacion] = useState(false);
  const [estacionEnEdicion, setEstacionEnEdicion] = useState<Estacion | null>(null);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error', texto: string } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ 
    show: boolean; 
    id: string | null;
  }>({ show: false, id: null });
  const [formDataEstacion, setFormDataEstacion] = useState({
    nombre: '',
    ubicacion: '',
    descripcion: '',
    tipo: 'SUBESTACION' as 'CENTRAL' | 'SUBESTACION',
    estado: 'activa' as 'activa' | 'inactiva'
  });
  const [expandedItems, setExpandedItems] = useState<{
    estaciones: string[];
    bodegas: string[];
    racks: string[];
  }>({
    estaciones: [],
    bodegas: [],
    racks: []
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [estacionesData, bodegasData, racksData, productosData] = await Promise.all([
        api.getEstaciones(),
        api.getBodegas(),
        api.getRacks(),
        api.getProductos()
      ]);
      setEstaciones(estacionesData);
      setBodegas(bodegasData);
      setRacks(racksData);
      setProductos(productosData);
    } catch (err) {
      console.error('Error al cargar los datos:', err);
      setMensaje({ tipo: 'error', texto: 'Error al cargar los datos' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEstacion = async (id: string) => {
    try {
      await api.deleteEstacion(id);
      setMensaje({ tipo: 'success', texto: 'Estación eliminada correctamente' });
      cargarDatos();
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'Error al eliminar la estación' });
      console.error(err);
    } finally {
      setConfirmDialog({ show: false, id: null });
    }
  };

  const handleSubmitEstacion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (estacionEnEdicion) {
        await api.updateEstacion(estacionEnEdicion._id, formDataEstacion);
        setMensaje({ tipo: 'success', texto: 'Estación actualizada correctamente' });
      } else {
        await api.createEstacion(formDataEstacion);
        setMensaje({ tipo: 'success', texto: 'Estación creada correctamente' });
      }
      setFormDataEstacion({
        nombre: '',
        ubicacion: '',
        descripcion: '',
        tipo: 'SUBESTACION',
        estado: 'activa'
      });
      setEstacionEnEdicion(null);
      setMostrarFormularioEstacion(false);
      cargarDatos();
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'Error al guardar la estación' });
      console.error(err);
    }
  };

  const handleEditEstacion = (estacion: Estacion) => {
    setEstacionEnEdicion(estacion);
    setFormDataEstacion({
      nombre: estacion.nombre,
      ubicacion: estacion.ubicacion,
      descripcion: estacion.descripcion || '',
      tipo: estacion.tipo,
      estado: estacion.estado
    });
    setMostrarFormularioEstacion(true);
  };

  const toggleExpanded = (type: 'estaciones' | 'bodegas' | 'racks', id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [type]: prev[type].includes(id) 
        ? prev[type].filter(item => item !== id)
        : [...prev[type], id]
    }));
  };

  const getBodegasDeEstacion = (estacionId: string) => {
    return bodegas.filter(bodega => bodega.estacion._id === estacionId);
  };

  const getRacksDeBodega = (bodegaId: string) => {
    return racks.filter(rack => rack.bodega === bodegaId);
  };

  const getProductosDeRack = (rackId: string) => {
    return productos.filter(producto => producto.rack._id === rackId);
  };

  const getUbicacionCompleta = (rackId: string, bodegaId: string) => {
    const rack = racks.find(r => r._id === rackId);
    const bodega = bodegas.find(b => b._id === bodegaId);
    const estacion = bodega ? estaciones.find(e => e._id === bodega.estacion._id) : null;

    if (!rack || !bodega || !estacion) return '';

    return `${bodega.nombre} (${estacion.tipo === 'CENTRAL' ? 'Central' : 'Secundaria'}), ${rack.nombre}`;
  };

  const renderProductos = (rackId: string) => {
    const productosRack = getProductosDeRack(rackId);
    const rack = racks.find(r => r._id === rackId);
    if (!rack || productosRack.length === 0) return null;

    return (
      <div className="ml-6 space-y-2 mt-2">
        {productosRack.map(producto => (
          <div
            key={producto._id}
            className={`p-3 rounded-lg ${
              darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
            } shadow-sm transition-colors duration-200 border ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Package className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <div>
                  <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    {producto.nombre}
                  </h4>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Cantidad: {producto.cantidad}
                    </span>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Precio: ${producto.precio}
                    </span>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                    Ubicación: {getUbicacionCompleta(producto.rack._id, producto.bodega._id)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderRacks = (bodegaId: string) => {
    const racksData = getRacksDeBodega(bodegaId);
    if (racksData.length === 0) return null;

    return (
      <div className="ml-4 space-y-3 mt-3">
        {racksData.map(rack => (
          <div
            key={rack._id}
            className={`p-4 rounded-lg ${
              darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
            } shadow-sm transition-all duration-200 border ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleExpanded('racks', rack._id)}
            >
              <div className="flex items-center space-x-3">
                <Box className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <div>
                  <Link
                    to={`/rack/${rack._id}`}
                    className={`font-medium hover:underline ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
                  >
                    {rack.nombre}
                  </Link>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                    {rack.ubicacion}
                  </p>
                </div>
              </div>
              {getProductosDeRack(rack._id).length > 0 && (
                <button
                  className={`p-1.5 rounded-full ${
                    darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                  } transition-colors duration-200`}
                >
                  {expandedItems.racks.includes(rack._id) ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
            {expandedItems.racks.includes(rack._id) && renderProductos(rack._id)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {mensaje && (
        <div className={`fixed bottom-4 right-4 left-4 sm:left-auto sm:w-96 z-50 p-4 rounded-md shadow-lg ${
          mensaje.tipo === 'success'
            ? darkMode
              ? 'bg-green-900 text-green-200'
              : 'bg-green-100 text-green-700'
            : darkMode
              ? 'bg-red-900 text-red-200'
              : 'bg-red-100 text-red-700'
        }`}>
          {mensaje.texto}
        </div>
      )}

      {confirmDialog.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 sm:p-6 w-full max-w-sm mx-auto shadow-xl`}>
            <div className="flex items-center mb-4">
              <AlertCircle className={`w-6 h-6 ${darkMode ? 'text-red-400' : 'text-red-600'} mr-2`} />
              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Confirmar eliminación
              </h3>
            </div>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              ¿Estás seguro de que deseas eliminar esta estación?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setConfirmDialog({ show: false, id: null })}
                className={`px-4 py-2 rounded-md ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (confirmDialog.id) {
                    handleDeleteEstacion(confirmDialog.id);
                  }
                }}
                className={`px-4 py-2 rounded-md ${
                  darkMode
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h2 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Inventario General
          </h2>
          <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Visualiza y gestiona el inventario por estaciones
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={estacionSeleccionada}
            onChange={(e) => setEstacionSeleccionada(e.target.value)}
            className={`px-3 py-2 text-sm rounded-lg border ${
              darkMode
                ? 'bg-gray-800 border-gray-700 text-gray-200'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">Todas las estaciones</option>
            {estaciones.map(estacion => (
              <option key={estacion._id} value={estacion._id}>
                {estacion.nombre}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setMostrarFormularioEstacion(true);
              setEstacionEnEdicion(null);
              setFormDataEstacion({
                nombre: '',
                ubicacion: '',
                descripcion: '',
                tipo: 'SUBESTACION',
                estado: 'activa'
              });
            }}
            className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            <Plus className="w-4 h-4" />
            Nueva Estación
          </button>
        </div>
      </div>

      {mostrarFormularioEstacion && (
        <div className={`mb-6 p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <form onSubmit={handleSubmitEstacion} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Nombre
                </label>
                <input
                  type="text"
                  value={formDataEstacion.nombre}
                  onChange={(e) => setFormDataEstacion({ ...formDataEstacion, nombre: e.target.value })}
                  required
                  className={`w-full px-3 py-2 rounded-md border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Ubicación
                </label>
                <input
                  type="text"
                  value={formDataEstacion.ubicacion}
                  onChange={(e) => setFormDataEstacion({ ...formDataEstacion, ubicacion: e.target.value })}
                  required
                  className={`w-full px-3 py-2 rounded-md border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Descripción
              </label>
              <textarea
                value={formDataEstacion.descripcion}
                onChange={(e) => setFormDataEstacion({ ...formDataEstacion, descripcion: e.target.value })}
                className={`w-full px-3 py-2 rounded-md border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                rows={3}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Tipo
              </label>
              <select
                value={formDataEstacion.tipo}
                onChange={(e) => setFormDataEstacion({ ...formDataEstacion, tipo: e.target.value as 'CENTRAL' | 'SUBESTACION' })}
                className={`w-full px-3 py-2 rounded-md border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="CENTRAL">Central</option>
                <option value="SUBESTACION">Subestación</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setMostrarFormularioEstacion(false);
                  setEstacionEnEdicion(null);
                  setFormDataEstacion({
                    nombre: '',
                    ubicacion: '',
                    descripcion: '',
                    tipo: 'SUBESTACION',
                    estado: 'activa'
                  });
                }}
                className={`w-full sm:w-auto px-4 py-2 rounded-md ${
                  darkMode
                    ? 'bg-gray-600 hover:bg-gray-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`w-full sm:w-auto px-4 py-2 rounded-md ${
                  darkMode
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {estacionEnEdicion ? 'Actualizar' : 'Crear'} Estación
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size={40} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
        </div>
      ) : (
        <div className="space-y-6">
          {(estacionSeleccionada ? estaciones.filter(e => e._id === estacionSeleccionada) : estaciones).map(estacion => (
            <div
              key={estacion._id}
              className={`rounded-lg overflow-hidden border ${
                darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div
                className={`p-4 cursor-pointer transition-colors duration-200 ${
                  darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
                onClick={() => toggleExpanded('estaciones', estacion._id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Building2 className={`w-6 h-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <div>
                      <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {estacion.nombre}
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {estacion.ubicacion} - {estacion.tipo}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditEstacion(estacion);
                      }}
                      className={`p-1.5 rounded-md ${
                        darkMode
                          ? 'hover:bg-gray-700 text-blue-400'
                          : 'hover:bg-gray-100 text-blue-600'
                      }`}
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDialog({ show: true, id: estacion._id });
                      }}
                      className={`p-1.5 rounded-md ${
                        darkMode
                          ? 'hover:bg-gray-700 text-red-400'
                          : 'hover:bg-gray-100 text-red-600'
                      }`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button
                      className={`p-1.5 rounded-full ${
                        darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                      } transition-colors duration-200`}
                    >
                      {expandedItems.estaciones.includes(estacion._id) ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              {expandedItems.estaciones.includes(estacion._id) && (
                <div className={`p-4 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                  <div className="space-y-4">
                    {getBodegasDeEstacion(estacion._id).map(bodega => (
                      <div
                        key={bodega._id}
                        className={`rounded-lg ${
                          darkMode ? 'bg-gray-800' : 'bg-gray-50'
                        } overflow-hidden border ${
                          darkMode ? 'border-gray-700' : 'border-gray-200'
                        }`}
                      >
                        <div
                          className={`p-4 cursor-pointer transition-colors duration-200 ${
                            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                          }`}
                          onClick={() => toggleExpanded('bodegas', bodega._id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Package className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                              <div>
                                <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                                  {bodega.nombre}
                                </h4>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {bodega.descripcion}
                                </p>
                              </div>
                            </div>
                            {getRacksDeBodega(bodega._id).length > 0 && (
                              <button
                                className={`p-1.5 rounded-full ${
                                  darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                                } transition-colors duration-200`}
                              >
                                {expandedItems.bodegas.includes(bodega._id) ? (
                                  <ChevronDown className="w-5 h-5" />
                                ) : (
                                  <ChevronRight className="w-5 h-5" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                        {expandedItems.bodegas.includes(bodega._id) && renderRacks(bodega._id)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 