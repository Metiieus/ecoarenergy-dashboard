import { useState } from 'react';
import { Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simular autenticação
    setTimeout(() => {
      if (email && password) {
        onLogin({ email, password });
      } else {
        setError('Por favor, preencha todos os campos');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-teal-50 via-cyan-50 to-teal-50">
      {/* Background Lightning Icons - Low Opacity */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Lightning Icon 1 - Top Left */}
        <div className="absolute top-10 left-10 opacity-5 text-teal-500 animate-pulse">
          <Zap size={120} strokeWidth={1.5} />
        </div>

        {/* Lightning Icon 2 - Top Right */}
        <div className="absolute top-20 right-20 opacity-5 text-teal-600 animate-pulse" style={{ animationDelay: '1s' }}>
          <Zap size={100} strokeWidth={1.5} />
        </div>

        {/* Lightning Icon 3 - Bottom Left */}
        <div className="absolute bottom-20 left-20 opacity-5 text-teal-500 animate-pulse" style={{ animationDelay: '2s' }}>
          <Zap size={140} strokeWidth={1.5} />
        </div>

        {/* Lightning Icon 4 - Bottom Right */}
        <div className="absolute bottom-10 right-10 opacity-5 text-teal-600 animate-pulse" style={{ animationDelay: '0.5s' }}>
          <Zap size={110} strokeWidth={1.5} />
        </div>

        {/* Lightning Icon 5 - Center Right */}
        <div className="absolute top-1/3 right-1/4 opacity-5 text-teal-500 animate-pulse" style={{ animationDelay: '1.5s' }}>
          <Zap size={90} strokeWidth={1.5} />
        </div>

        {/* Lightning Icon 6 - Center Left */}
        <div className="absolute bottom-1/3 left-1/4 opacity-5 text-teal-600 animate-pulse" style={{ animationDelay: '0.8s' }}>
          <Zap size={130} strokeWidth={1.5} />
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        {/* Login Card - White Translucent Background */}
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-3 rounded-full">
                  <Zap className="text-white" size={32} />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Ecoar</h1>
              <p className="text-gray-600">Dashboard de Monitoramento de Energia</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/50 border-gray-200 focus:border-teal-500 focus:ring-teal-500 placeholder:text-gray-400"
                  disabled={isLoading}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/50 border-gray-200 focus:border-teal-500 focus:ring-teal-500 placeholder:text-gray-400"
                  disabled={isLoading}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-2 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Entrando...
                  </span>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>

            {/* Footer */}
            <p className="text-center text-xs text-gray-500 mt-6">
              © 2024 Ecoar. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
