import React, { useState, useEffect } from 'react';
import { Rack } from '../services/api';
import { api } from '../services/api';
import { LoadingSpinner } from './LoadingSpinner';
import { Plus, Edit, Trash2, AlertCircle, Package } from 'lucide-react';

interface GestionRacksProps {
  darkMode: boolean;
}

export const GestionRacks: React.FC<GestionRacksProps> = ({ darkMode }) => {
  const [racks, setRacks] = useState<Rack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rackEnEdicion, setRackEnEdicion] = useState<Rack | null>(null);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error', texto: string } | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    ubicacion: ''
  });

  useEffect(() => {
    cargarRacks();
  }, []);

  const cargarRacks = async () => {
    try {
      setLoading(true);
      const data = await api.getRacks();
      setRacks(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los racks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (rackEnEdicion) {
        await api.updateRack(rackEnEdicion._id, formData);
        setMensaje({ tipo: 'success', texto: 'Rack actualizado correctamente' });
      } else {
        await api.createRack(formData);
        setMensaje({ tipo: 'success', texto: 'Rack creado correctamente' });
      }
      setFormData({ nombre: '', descripcion: '', ubicacion: '' });
      setRackEnEdicion(null);
      setMostrarFormulario(false);
      cargarRacks();
    } catch (err) {
      setError('Error al guardar el rack');
      setMensaje({ tipo: 'error', texto: 'Error al guardar el rack' });
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteRack(id);
      setMensaje({ tipo: 'success', texto: 'Rack eliminado correctamente' });
      cargarRacks();
    } catch (err) {
      setError('Error al eliminar el rack');
      setMensaje({ tipo: 'error', texto: 'Error al eliminar el rack' });
      console.error(err);
    } finally {
      setConfirmDialog({ show: false, rackId: null });
    }
  };

  const handleEdit = (rack: Rack) => {
    setRackEnEdicion(rack);
    setFormData({
      nombre: rack.nombre,
      descripcion: rack.descripcion || '',
      ubicacion: rack.ubicacion || ''
    });
    setMostrarFormulario(true);
  };

  const handleCancelEdit = () => {
    setRackEnEdicion(null);
    setFormData({ nombre: '', descripcion: '', ubicacion: '' });
    setMostrarFormulario(false);
  };

  const [confirmDialog, setConfirmDialog] = useState<{ show: boolean; rackId: string | null }>({ show: false, rackId: null });

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
    <div className="space-y-6">
      {/* Diálogo de confirmación */}
      {confirmDialog.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl`}>
            <div className="flex items-center mb-4">
              <AlertCircle className={`w-6 h-6 ${darkMode ? 'text-red-400' : 'text-red-600'} mr-2`} />
              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Confirmar eliminación
              </h3>
            </div>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              ¿Estás seguro de que deseas eliminar este rack?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setConfirmDialog({ show: false, rackId: null })}
                className={`px-4 py-2 rounded-md ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={() => confirmDialog.rackId && handleDelete(confirmDialog.rackId)}
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
        <div
          className={`p-4 rounded-md ${
            mensaje.tipo === 'success'
              ? darkMode
                ? 'bg-green-900 text-green-200'
                : 'bg-green-100 text-green-700'
              : darkMode
                ? 'bg-red-900 text-red-200'
                : 'bg-red-100 text-red-700'
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      {/* Encabezado y botón de agregar */}
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {mostrarFormulario ? (rackEnEdicion ? 'Editar Rack' : 'Nuevo Rack') : 'Gestión de Racks'}
        </h2>
        <button
          onClick={() => {
            setMostrarFormulario(!mostrarFormulario);
            if (!mostrarFormulario) {
              setRackEnEdicion(null);
              setFormData({ nombre: '', descripcion: '', ubicacion: '' });
            }
          }}
          className={`flex items-center px-4 py-2 rounded-md ${
            darkMode
              ? mostrarFormulario 
                ? 'bg-gray-600 hover:bg-gray-500'
                : 'bg-blue-500 hover:bg-blue-600'
              : mostrarFormulario
                ? 'bg-gray-200 hover:bg-gray-300'
                : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {mostrarFormulario ? (
            <>
              <Package className="w-5 h-5 mr-2" />
              Volver a la lista
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 mr-2" />
              Nuevo Rack
            </>
          )}
        </button>
      </div>

      {/* Formulario o Lista (no ambos) */}
      {mostrarFormulario ? (
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
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
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                rows={3}
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
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancelEdit}
                className={`px-4 py-2 rounded-md ${
                  darkMode
                    ? 'bg-gray-600 hover:bg-gray-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-md ${
                  darkMode
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {rackEnEdicion ? 'Actualizar' : 'Agregar'} Rack
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Lista de Racks */
        <div className={`overflow-x-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
          {loading ? (
            <div className="flex justify-center p-8">
              <LoadingSpinner size={40} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
            </div>
          ) : racks.length === 0 ? (
            <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <Package className="w-12 h-12 mx-auto mb-2" />
              <p>No hay racks registrados</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Nombre
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Descripción
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Ubicación
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y divide-gray-200 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                {racks.map((rack) => (
                  <tr key={rack._id}>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {rack.nombre}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {rack.descripcion || '-'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {rack.ubicacion || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(rack)}
                          className={`p-1 rounded-md ${
                            darkMode
                              ? 'hover:bg-gray-700 text-blue-400'
                              : 'hover:bg-gray-100 text-blue-600'
                          }`}
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setConfirmDialog({ show: true, rackId: rack._id })}
                          className={`p-1 rounded-md ${
                            darkMode
                              ? 'hover:bg-gray-700 text-red-400'
                              : 'hover:bg-gray-100 text-red-600'
                          }`}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}; 