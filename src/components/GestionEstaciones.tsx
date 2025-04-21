import React, { useState, useEffect } from 'react';
import { Estacion, Bodega, api } from '../services/api';
import { LoadingSpinner } from './LoadingSpinner';
import { Plus, Edit, Trash2, Building2, ChevronDown, ChevronRight, AlertCircle, Warehouse } from 'lucide-react';

interface GestionEstacionesProps {
  darkMode: boolean;
}

export const GestionEstaciones: React.FC<GestionEstacionesProps> = ({ darkMode }) => {
  const [estaciones, setEstaciones] = useState<Estacion[]>([]);
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [loading, setLoading] = useState(true);
  const [estacionEnEdicion, setEstacionEnEdicion] = useState<Estacion | null>(null);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error', texto: string } | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [estacionExpandida, setEstacionExpandida] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    ubicacion: '',
    descripcion: '',
    tipo: 'SUBESTACION' as 'CENTRAL' | 'SUBESTACION',
    estado: 'activa' as 'activa' | 'inactiva'
  });

  const [confirmDialog, setConfirmDialog] = useState<{ 
    show: boolean; 
    id: string | null;
  }>({ show: false, id: null });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [estacionesData, bodegasData] = await Promise.all([
        api.getEstaciones(),
        api.getBodegas()
      ]);
      setEstaciones(estacionesData);
      setBodegas(bodegasData);
      setMensaje(null);
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'Error al cargar los datos' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (estacionEnEdicion) {
        await api.updateEstacion(estacionEnEdicion._id, formData);
        setMensaje({ tipo: 'success', texto: 'Estación actualizada correctamente' });
      } else {
        await api.createEstacion(formData);
        setMensaje({ tipo: 'success', texto: 'Estación creada correctamente' });
      }
      setFormData({
        nombre: '',
        ubicacion: '',
        descripcion: '',
        tipo: 'SUBESTACION',
        estado: 'activa'
      });
      setEstacionEnEdicion(null);
      setMostrarFormulario(false);
      cargarDatos();
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'Error al guardar la estación' });
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
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

  const handleEdit = (estacion: Estacion) => {
    setEstacionEnEdicion(estacion);
    setFormData({
      nombre: estacion.nombre,
      ubicacion: estacion.ubicacion,
      descripcion: estacion.descripcion,
      tipo: estacion.tipo,
      estado: estacion.estado
    });
    setMostrarFormulario(true);
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      ubicacion: '',
      descripcion: '',
      tipo: 'SUBESTACION',
      estado: 'activa'
    });
  };

  const getBodegasDeEstacion = (estacionId: string) => {
    return bodegas.filter(bodega => bodega.estacion._id === estacionId);
  };

  // Limpiar mensaje después de 3 segundos
  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => {
        setMensaje(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              ¿Estás seguro de que deseas eliminar esta estación? Esta acción no se puede deshacer.
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
                onClick={() => confirmDialog.id && handleDelete(confirmDialog.id)}
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

      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h2 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {mostrarFormulario ? (estacionEnEdicion ? 'Editar Estación' : 'Nueva Estación') : 'Gestión de Estaciones'}
            </h2>
            {!mostrarFormulario && (
              <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Administra las estaciones y sus bodegas asociadas
              </p>
            )}
          </div>
          {!mostrarFormulario && (
            <button
              onClick={() => {
                setMostrarFormulario(true);
                setEstacionEnEdicion(null);
                resetForm();
              }}
              className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              <Plus className="w-4 h-4" />
              Nueva Estación
            </button>
          )}
        </div>

        {mostrarFormulario ? (
          <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow max-w-3xl mx-auto`}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
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
                    value={formData.ubicacion}
                    onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
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
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
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
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'CENTRAL' | 'SUBESTACION' })}
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
                    setMostrarFormulario(false);
                    setEstacionEnEdicion(null);
                    resetForm();
                  }}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-md text-sm font-medium ${
                    darkMode
                      ? 'bg-gray-600 hover:bg-gray-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-md text-sm font-medium ${
                    darkMode
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {estacionEnEdicion ? 'Actualizar Estación' : 'Crear Estación'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className={`rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {loading ? (
              <div className="flex justify-center p-8">
                <LoadingSpinner size={40} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
              </div>
            ) : estaciones.length === 0 ? (
              <div className={`text-center py-12 px-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <Building2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  No hay estaciones registradas
                </h3>
                <p className="text-sm max-w-sm mx-auto">
                  Las estaciones te permiten organizar tus bodegas por ubicación. Comienza creando una nueva estación.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {estaciones.map((estacion) => (
                  <div key={estacion._id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                    <div
                      className="px-4 sm:px-6 py-4 cursor-pointer"
                      onClick={() => setEstacionExpandida(estacionExpandida === estacion._id ? null : estacion._id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {estacionExpandida === estacion._id ? (
                            <ChevronDown className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          ) : (
                            <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {estacion.nombre}
                              </h3>
                              <span className={`px-2 py-0.5 text-xs rounded-full ${
                                estacion.tipo === 'CENTRAL' 
                                  ? darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                                  : darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'
                              }`}>
                                {estacion.tipo}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {estacion.ubicacion}
                              </p>
                              <span className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                <Warehouse className="w-4 h-4 mr-1" />
                                {getBodegasDeEstacion(estacion._id).length} bodegas
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(estacion);
                            }}
                            className={`p-2 rounded-md ${
                              darkMode
                                ? 'hover:bg-gray-600 text-blue-400'
                                : 'hover:bg-gray-100 text-blue-600'
                            }`}
                            title="Editar estación"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDialog({ show: true, id: estacion._id });
                            }}
                            className={`p-2 rounded-md ${
                              darkMode
                                ? 'hover:bg-gray-600 text-red-400'
                                : 'hover:bg-gray-100 text-red-600'
                            }`}
                            title="Eliminar estación"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Panel expandible con las bodegas */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out
                        ${estacionExpandida === estacion._id ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
                      `}
                    >
                      <div className={`px-4 sm:px-6 py-4 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                        <div className="ml-8">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                              Bodegas en esta estación
                            </h4>
                          </div>
                          {getBodegasDeEstacion(estacion._id).length === 0 ? (
                            <div className={`text-center py-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              <Warehouse className="w-8 h-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">
                                No hay bodegas registradas en esta estación
                              </p>
                            </div>
                          ) : (
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                              {getBodegasDeEstacion(estacion._id).map((bodega) => (
                                <div
                                  key={bodega._id}
                                  className={`p-4 rounded-lg ${
                                    darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
                                  } shadow-sm transition-colors duration-200`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                                        {bodega.nombre}
                                      </h4>
                                      <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {bodega.descripcion || 'Sin descripción'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 