// src/pages/ApiTestPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { testApi, getHistorial } from '../api/authApi';
import { FaPlay, FaTrash, FaPlus, FaEdit, FaSearch, FaRecycle } from 'react-icons/fa';

const ApiTestPage = () => {
  const { token } = useAuth();
  const [method, setMethod] = useState('GET');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [postData, setPostData] = useState('{"nombre": "test", "valor": 123}');
  const [historial, setHistorial] = useState([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    try {
      let data = null;
      if (method === 'POST' || method === 'PUT') {
        try {
          data = JSON.parse(postData);
        } catch (e) {
          data = { error: 'JSON inválido' };
        }
      }
      const res = await testApi(method, data);
      setResponse({
        status: res.status,
        data: res.data,
        success: true
      });
    } catch (error) {
      setResponse({
        status: error.response?.status || 500,
        data: error.response?.data || { error: error.message },
        success: false
      });
    }
    setLoading(false);
  };

  const handleConsultarHistorial = async () => {
    setLoading(true);
    try {
      const res = await getHistorial();
      setHistorial(res.data || []);
      setMostrarHistorial(true);
      setResponse({
        status: 200,
        data: { mensaje: `Encontrados ${res.data?.length || 0} registros` },
        success: true
      });
    } catch (error) {
      setResponse({
        status: error.response?.status || 500,
        data: error.response?.data || { error: error.message },
        success: false
      });
    }
    setLoading(false);
  };

  // Contar reciclajes por material
  const contarMateriales = () => {
    const conteo = {};
    historial.forEach(item => {
      const material = item.material || 'desconocido';
      conteo[material] = (conteo[material] || 0) + 1;
    });
    return conteo;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">
        <FaPlay className="inline text-green-400 mr-2" />
        API Test
      </h1>

      {/* Botón para consultar historial */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          <FaRecycle className="inline text-green-400 mr-2" />
          Consultar reciclajes del usuario
        </h3>
        <button
          onClick={handleConsultarHistorial}
          disabled={loading}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
        >
          {loading ? 'Consultando...' : '📊 Ver mis reciclajes'}
        </button>

        {mostrarHistorial && historial.length > 0 && (
          <div className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {Object.entries(contarMateriales()).map(([material, count]) => (
                <div key={material} className="bg-white/5 rounded-lg p-3 text-center text-white">
                  <div className="text-2xl">
                    {material === 'plastico' ? '🥤' : 
                     material === 'vidrio' ? '🍾' : 
                     material === 'lata' ? '🥫' : 
                     material === 'papel' ? '📄' : 
                     material === 'carton' ? '📦' : 
                     material === 'basura' ? '🗑️' : '♻️'}
                  </div>
                  <div className="text-sm capitalize">{material}</div>
                  <div className="font-bold text-green-400">{count} veces</div>
                </div>
              ))}
            </div>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {historial.slice(0, 15).map((item, i) => (
                <div key={i} className="flex justify-between text-sm text-gray-300 border-b border-white/5 py-1">
                  <span className="capitalize">{item.material}</span>
                  <span>+{item.puntos} pts</span>
                  <span className="text-gray-500">{new Date(item.fecha).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 text-sm text-gray-400">
              Total: {historial.length} reciclajes
            </div>
          </div>
        )}
      </div>

      {/* Test API */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Probar Endpoints</h3>
        
        <div className="flex flex-wrap gap-4 mb-4">
          {['GET', 'POST', 'PUT', 'DELETE'].map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                method === m
                  ? 'bg-green-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {(method === 'POST' || method === 'PUT') && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Datos (JSON)
            </label>
            <textarea
              value={postData}
              onChange={(e) => setPostData(e.target.value)}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-green-500"
              rows={3}
            />
          </div>
        )}

        <button
          onClick={handleTest}
          disabled={loading}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
        >
          {loading ? 'Enviando...' : `▶️ Enviar ${method}`}
        </button>

        {response && (
          <div className="mt-4">
            <div className={`p-4 rounded-lg ${
              response.success ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'
            }`}>
              <div className="text-sm text-gray-300">
                <span className="font-semibold">Status:</span> {response.status}
              </div>
              <pre className="mt-2 text-sm text-white overflow-auto max-h-60">
                {JSON.stringify(response.data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiTestPage;