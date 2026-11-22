import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { RobotHeadIcon } from '../components/RobotHeadIcon';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const authenticatedUser = login(email, password);
    if (!authenticatedUser) {
      setError('Informe um e-mail válido e uma senha com pelo menos 4 caracteres.');
      return;
    }

    navigate(authenticatedUser.role === 'admin' ? '/admin' : '/painel');
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#09090b] p-6 sm:p-8 shadow-2xl">
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Voltar ao início</span>
          </Link>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2">
            <RobotHeadIcon className="h-6 w-6" />
            <span className="text-lg font-semibold text-white">JobHunter AI</span>
          </div>
          <h1 className="mt-4 text-xl font-semibold text-white">Entrar na plataforma</h1>
          <p className="mt-1 text-xs text-zinc-400">
            Acesse seu painel de oportunidades
          </p>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-900/60 bg-red-950/50 px-3 py-2.5 text-xs text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-xs font-medium text-zinc-300">
              E-mail
            </label>
            <div className="relative mt-1.5">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="w-full rounded-xl border border-zinc-800 bg-[#111114] py-2.5 pl-10 pr-3 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-[#60a5fa]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="block text-xs font-medium text-zinc-300">
              Senha
            </label>
            <div className="relative mt-1.5">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-zinc-800 bg-[#111114] py-2.5 pl-10 pr-3 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-[#60a5fa]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-zinc-100 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-white cursor-pointer"
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-400">
          Ainda não possui conta?{' '}
          <Link to="/cadastro" className="font-medium text-[#60a5fa] hover:underline">
            Criar cadastro
          </Link>
        </p>
      </div>
    </div>
  );
}