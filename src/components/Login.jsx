import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6" style={{ background: 'linear-gradient(180deg, #0d9488 0%, #059669 100%)' }}>
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold">Ecoar</h1>
            <p className="text-sm mt-1">Sistema de Gestão de Energia</p>
          </div>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div>
              <label className="block text-xs font-semibold text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="seu@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Sua senha"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded font-medium hover:from-teal-600 hover:to-teal-700 transition"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
