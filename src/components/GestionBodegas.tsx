import React, { useState, useEffect } from 'react';
import { Bodega, Rack, Estacion } from '../services/api';
import { api } from '../services/api';
import { LoadingSpinner } from './LoadingSpinner';
import { Plus, Edit, Trash2, AlertCircle, Package, Box } from 'lucide-react';
import { RACK_CATEGORIES } from '../constants/categories';

interface GestionBodegasProps {
  darkMode: boolean;
}

export const GestionBodegas: React.FC<GestionBodegasProps> = ({ darkMode }) => {
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [racks, setRacks] = useState<Rack[]>([]);
  const [estaciones, setEstaciones] = useState<Estacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [bodegaEnEdicion, setBodegaEnEdicion] = useState<Bodega | null>(null);
  const [rackEnEdicion, setRackEnEdicion] = useState<Rack | null>(null);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error', texto: string } | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarFormularioRack, setMostrarFormularioRack] = useState(false);
  const [bodegaSeleccionada, setBodegaSeleccionada] = useState<Bodega | null>(null);
  const [formDataBodega, setFormDataBodega] = useState({
    nombre: '',
    descripcion: '',
    estacion: '',
    racks: [] as string[]
  });
  const [formDataRack, setFormDataRack] = useState({
    nombre: '',
    ubicacion: '',
    categorias: [] as string[],
    bodega: '',
    descripcion: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [bodegasData, racksData, estacionesData] = await Promise.all([
        api.getBodegas(),
        api.getRacks(),
        api.getEstaciones()
      ]);
      setBodegas(bodegasData);
      setRacks(racksData);
      setEstaciones(estacionesData);
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
      const estacionSeleccionada = estaciones.find(est => est._id === formDataBodega.estacion);
      if (!estacionSeleccionada) {
        setMensaje({ tipo: 'error', texto: 'Por favor seleccione una estación válida' });
        return;
      }

      const bodegaData = {
        nombre: formDataBodega.nombre,
        descripcion: formDataBodega.descripcion,
        estacion: {
          _id: estacionSeleccionada._id,
          nombre: estacionSeleccionada.nombre,
          ubicacion: estacionSeleccionada.ubicacion
        },
        racks: formDataBodega.racks
      };

      if (bodegaEnEdicion) {
        await api.updateBodega(bodegaEnEdicion._id, bodegaData);
        setMensaje({ tipo: 'success', texto: 'Bodega actualizada correctamente' });
      } else {
        await api.createBodega(bodegaData);
        setMensaje({ tipo: 'success', texto: 'Bodega creada correctamente' });
      }
      setFormDataBodega({
        nombre: '',
        descripcion: '',
        estacion: '',
        racks: []
      });
      setBodegaEnEdicion(null);
      setMostrarFormulario(false);
      cargarDatos();
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'Error al guardar la bodega' });
      console.error(err);
    }
  };

  const handleSubmitRack = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (rackEnEdicion) {
        await api.updateRack(rackEnEdicion._id, formDataRack);
        setMensaje({ tipo: 'success', texto: 'Rack actualizado correctamente' });
      } else {
        await api.createRack(formDataRack);
        setMensaje({ tipo: 'success', texto: 'Rack creado correctamente' });
      }
      setFormDataRack({
        nombre: '',
        ubicacion: '',
        categorias: [],
        bodega: bodegaSeleccionada?._id || '',
        descripcion: ''
      });
      setRackEnEdicion(null);
      setMostrarFormularioRack(false);
      cargarDatos();
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'Error al guardar el rack' });
      console.error(err);
    }
  };

  const handleDeleteBodega = async (id: string) => {
    try {
      await api.deleteBodega(id);
      setMensaje({ tipo: 'success', texto: 'Bodega eliminada correctamente' });
      cargarDatos();
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'Error al eliminar la bodega' });
      console.error(err);
    } finally {
      setConfirmDialog({ show: false, id: null, tipo: 'bodega' });
    }
  };

  const handleDeleteRack = async (id: string) => {
    try {
      await api.deleteRack(id);
      setMensaje({ tipo: 'success', texto: 'Rack eliminado correctamente' });
      cargarDatos();
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'Error al eliminar el rack' });
      console.error(err);
    } finally {
      setConfirmDialog({ show: false, id: null, tipo: 'rack' });
    }
  };

  const handleEditBodega = (bodega: Bodega) => {
    setBodegaEnEdicion(bodega);
    setFormDataBodega({
      nombre: bodega.nombre,
      descripcion: bodega.descripcion,
      estacion: bodega.estacion._id,
      racks: bodega.racks
    });
    setMostrarFormulario(true);
  };

  const handleEditRack = (rack: Rack) => {
    setRackEnEdicion(rack);
    setFormDataRack({
      nombre: rack.nombre,
      ubicacion: rack.ubicacion || '',
      categorias: rack.categorias || [],
      bodega: rack.bodega,
      descripcion: rack.descripcion || ''
    });
    setMostrarFormularioRack(true);
  };

  const resetForm = () => {
    setFormDataBodega({
      nombre: '',
      descripcion: '',
      estacion: '',
      racks: []
    });
    setBodegaEnEdicion(null);
    setMostrarFormulario(false);
  };

  const handleCancel = () => {
    resetForm();
  };

  const [confirmDialog, setConfirmDialog] = useState<{ 
    show: boolean; 
    id: string | null;
    tipo: 'bodega' | 'rack';
  }>({ show: false, id: null, tipo: 'bodega' });

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => {
        setMensaje(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const getRacksDeBodega = (bodegaId: string) => {
    return racks.filter(rack => rack.bodega === bodegaId);
  };

  const handleEstacionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormDataBodega({
      ...formDataBodega,
      estacion: e.target.value
    });
  };

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
              ¿Estás seguro de que deseas eliminar este {confirmDialog.tipo}?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setConfirmDialog({ show: false, id: null, tipo: 'bodega' })}
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
                    if (confirmDialog.tipo === 'bodega') {
                      handleDeleteBodega(confirmDialog.id);
                    } else {
                      handleDeleteRack(confirmDialog.id);
                    }
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

      {mensaje && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-96 z-50">
          <div
            className={`p-4 rounded-md shadow-lg ${
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
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Gestión de Bodegas
        </h2>
        <button
          onClick={() => {
            setMostrarFormulario(true);
            setBodegaEnEdicion(null);
            resetForm();
          }}
          className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          <Plus className="w-4 h-4" />
          Nueva Bodega
        </button>
      </div>

      {mostrarFormulario && (
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow max-w-3xl mx-auto`}>
          <h3 className={`text-xl font-medium mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {bodegaEnEdicion ? 'Editar Bodega' : 'Nueva Bodega'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Nombre
                </label>
                <input
                  type="text"
                  value={formDataBodega.nombre}
                  onChange={(e) => setFormDataBodega({ ...formDataBodega, nombre: e.target.value })}
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
                  Ubicación (Estación)
                </label>
                <select
                  value={formDataBodega.estacion}
                  onChange={handleEstacionChange}
                  required
                  className={`w-full px-3 py-2 rounded-md border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Seleccione una estación</option>
                  {estaciones.map(est => (
                    <option key={est._id} value={est._id}>{est.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Descripción
              </label>
              <textarea
                value={formDataBodega.descripcion}
                onChange={(e) => setFormDataBodega({ ...formDataBodega, descripcion: e.target.value })}
                className={`w-full px-3 py-2 rounded-md border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                rows={3}
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <button
                type="button"
                onClick={handleCancel}
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
                {bodegaEnEdicion ? 'Actualizar Bodega' : 'Crear Bodega'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={`overflow-x-auto -mx-4 sm:mx-0 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
        {loading ? (
          <div className="flex justify-center p-8">
            <LoadingSpinner size={40} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
          </div>
        ) : bodegas.length === 0 ? (
          <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <Package className="w-12 h-12 mx-auto mb-2" />
            <p>No hay bodegas registradas</p>
          </div>
        ) : (
          <div className="min-w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-4 sm:px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Nombre
                  </th>
                  <th className={`hidden sm:table-cell px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Estación
                  </th>
                  <th className={`px-4 sm:px-6 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y divide-gray-200 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                {bodegas.map((bodega) => (
                  <React.Fragment key={bodega._id}>
                    <tr 
                      onClick={() => setBodegaSeleccionada(bodegaSeleccionada?._id === bodega._id ? null : bodega)}
                      className={`cursor-pointer hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors duration-200`}
                    >
                      <td className={`px-4 sm:px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'} flex items-center`}>
                        <svg
                          className={`w-4 h-4 mr-2 transform transition-transform duration-200 ${
                            bodegaSeleccionada?._id === bodega._id ? 'rotate-90' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                        {bodega.nombre}
                      </td>
                      <td className={`hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {bodega.estacion?.nombre || 'Sin estación'}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditBodega(bodega);
                            }}
                            className={`p-1 rounded-md ${
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
                              setConfirmDialog({ show: true, id: bodega._id, tipo: 'bodega' });
                            }}
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
                    {bodegaSeleccionada?._id === bodega._id && (
                      <tr>
                        <td colSpan={4} className="px-4 sm:px-6">
                          <div 
                            className={`overflow-hidden transition-all duration-500 ease-in-out
                              ${bodegaSeleccionada?._id === bodega._id ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
                            `}
                          >
                            <div className={`transform transition-all duration-500 ease-in-out py-4
                              ${bodegaSeleccionada?._id === bodega._id ? 'translate-y-0' : '-translate-y-6'}
                            `}>
                              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                                <div className="flex justify-between items-center mb-4">
                                  <div>
                                    <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                      Racks de {bodega.nombre}
                                    </h3>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                      {getRacksDeBodega(bodega._id).length} racks en total
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => {
                                      setMostrarFormularioRack(true);
                                      setRackEnEdicion(null);
                                      setFormDataRack({
                                        nombre: '',
                                        ubicacion: '',
                                        categorias: [],
                                        bodega: bodega._id,
                                        descripcion: ''
                                      });
                                    }}
                                    className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Nuevo Rack
                                  </button>
                                </div>
                                {mostrarFormularioRack ? (
                                  <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow max-w-3xl mx-auto`}>
                                    <form onSubmit={handleSubmitRack} className="space-y-4">
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Nombre
                                          </label>
                                          <input
                                            type="text"
                                            value={formDataRack.nombre}
                                            onChange={(e) => setFormDataRack({ ...formDataRack, nombre: e.target.value })}
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
                                            Ubicación
                                          </label>
                                          <input
                                            type="text"
                                            value={formDataRack.ubicacion}
                                            onChange={(e) => setFormDataRack({ ...formDataRack, ubicacion: e.target.value })}
                                            required
                                            className={`w-full px-3 py-2 rounded-md border ${
                                              darkMode
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                            }`}
                                          />
                                        </div>
                                      </div>

                                      <div>
                                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                          Categorías
                                        </label>
                                        <div className={`grid grid-cols-2 sm:grid-cols-3 gap-2 p-2 rounded-md border ${
                                          darkMode
                                            ? 'bg-gray-700 border-gray-600'
                                            : 'bg-white border-gray-300'
                                        }`}>
                                          {RACK_CATEGORIES.map((categoria) => (
                                            <label key={categoria} className="flex items-center space-x-2">
                                              <input
                                                type="checkbox"
                                                checked={formDataRack.categorias.includes(categoria)}
                                                onChange={(e) => {
                                                  const newCategorias = e.target.checked
                                                    ? [...formDataRack.categorias, categoria]
                                                    : formDataRack.categorias.filter(c => c !== categoria);
                                                  setFormDataRack({ ...formDataRack, categorias: newCategorias });
                                                }}
                                                className={`rounded ${
                                                  darkMode
                                                    ? 'border-gray-500 text-blue-400'
                                                    : 'border-gray-300 text-blue-600'
                                                }`}
                                              />
                                              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {categoria}
                                              </span>
                                            </label>
                                          ))}
                                        </div>
                                      </div>

                                      <div>
                                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                          Descripción
                                        </label>
                                        <textarea
                                          value={formDataRack.descripcion}
                                          onChange={(e) => setFormDataRack({ ...formDataRack, descripcion: e.target.value })}
                                          className={`w-full px-3 py-2 rounded-md border ${
                                            darkMode
                                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                          }`}
                                          rows={3}
                                        />
                                      </div>

                                      <div className="flex flex-col sm:flex-row justify-end gap-4">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setMostrarFormularioRack(false);
                                            setRackEnEdicion(null);
                                            setFormDataRack({
                                              nombre: '',
                                              ubicacion: '',
                                              categorias: [],
                                              bodega: bodega._id,
                                              descripcion: ''
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
                                          {rackEnEdicion ? 'Actualizar' : 'Agregar'} Rack
                                        </button>
                                      </div>
                                    </form>
                                  </div>
                                ) : (
                                  <div className="overflow-x-auto">
                                    {getRacksDeBodega(bodega._id).length === 0 ? (
                                      <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        <Box className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p className="text-lg mb-1">No hay racks registrados</p>
                                        <p className="text-sm">Comienza agregando un nuevo rack a esta bodega</p>
                                      </div>
                                    ) : (
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {getRacksDeBodega(bodega._id).map((rack) => (
                                          <div
                                            key={rack._id}
                                            className={`p-4 rounded-lg border ${
                                              darkMode
                                                ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                                                : 'bg-white border-gray-200 hover:border-gray-300'
                                            } transition-colors duration-200`}
                                          >
                                            <div className="flex justify-between items-start mb-3">
                                              <div>
                                                <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                                                  {rack.nombre}
                                                </h4>
                                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                  {rack.ubicacion}
                                                </p>
                                              </div>
                                              <div className="flex space-x-2">
                                                <button
                                                  onClick={() => handleEditRack(rack)}
                                                  className={`p-1.5 rounded-md ${
                                                    darkMode
                                                      ? 'hover:bg-gray-700 text-blue-400'
                                                      : 'hover:bg-gray-100 text-blue-600'
                                                  }`}
                                                >
                                                  <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                  onClick={() => setConfirmDialog({ show: true, id: rack._id, tipo: 'rack' })}
                                                  className={`p-1.5 rounded-md ${
                                                    darkMode
                                                      ? 'hover:bg-gray-700 text-red-400'
                                                      : 'hover:bg-gray-100 text-red-600'
                                                  }`}
                                                >
                                                  <Trash2 className="w-4 h-4" />
                                                </button>
                                              </div>
                                            </div>
                                            {rack.descripcion && (
                                              <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {rack.descripcion}
                                              </p>
                                            )}
                                            {rack.categorias && rack.categorias.length > 0 && (
                                              <div className="flex flex-wrap gap-2">
                                                {rack.categorias.map((categoria) => (
                                                  <span
                                                    key={categoria}
                                                    className={`px-2 py-1 text-xs rounded-full ${
                                                      darkMode
                                                        ? 'bg-gray-700 text-gray-300'
                                                        : 'bg-gray-100 text-gray-700'
                                                    }`}
                                                  >
                                                    {categoria}
                                                  </span>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}; 