import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Zap, CheckCircle2, LayoutDashboard } from 'lucide-react';
import { RobotHeadIcon } from '../components/RobotHeadIcon';
import { useAuth } from '../context/AuthContext';

export function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col">
      {/* Barra de Navegação */}
      <nav className="border-b border-zinc-900 bg-black/80 backdrop-blur-xs sticky top-0 z-40">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <RobotHeadIcon className="h-6 w-6" />
            <span className="text-lg font-semibold tracking-tight text-white">
              JobHunter AI
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/painel"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs sm:text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-700 hover:text-white"
                >
                  <LayoutDashboard className="h-4 w-4 text-[#60a5fa]" />
                  <span>Meu Painel</span>
                </Link>
                <Link
                  to="/admin"
                  className="rounded-lg bg-zinc-100 px-3.5 py-2 text-xs sm:text-sm font-semibold text-zinc-950 transition-colors hover:bg-white"
                >
                  Admin
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
                >
                  Entrar
                </Link>
                <Link
                  to="/cadastro"
                  className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-white"
                >
                  Criar conta
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#065f46] bg-[#052e16] px-3.5 py-1 text-xs font-medium text-[#10b981]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Agente autônomo de busca e triagem de oportunidades</span>
        </div>

        <h1 className="mt-6 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-5xl">
          Encontre oportunidades compatíveis com o seu perfil técnico
        </h1>

        <p className="mt-4 max-w-xl text-base text-zinc-400 leading-relaxed">
          O JobHunter AI analisa requisitos, calcula sua aderência técnica em tempo real e
          centraliza o histórico das suas candidaturas em um único painel.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {user ? (
            <>
              <Link
                to="/painel"
                className="inline-flex items-center gap-2 rounded-xl bg-[#60a5fa] px-6 py-3 text-sm font-semibold text-zinc-950 transition-opacity hover:opacity-90"
              >
                <span>Abrir Painel de Oportunidades</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-6 py-3 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-700 hover:text-white"
              >
                <span>Gerenciar no Admin</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/cadastro"
                className="inline-flex items-center gap-2 rounded-xl bg-[#60a5fa] px-6 py-3 text-sm font-semibold text-zinc-950 transition-opacity hover:opacity-90"
              >
                <span>Começar agora</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-6 py-3 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-700 hover:text-white"
              >
                <span>Já tenho conta</span>
              </Link>
            </>
          )}
        </div>

        {/* Grade de Recursos */}
        <div className="mt-20 grid w-full grid-cols-1 gap-4 text-left sm:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800/90 bg-[#09090b] p-5">
            <Zap className="h-5 w-5 text-[#60a5fa]" />
            <h2 className="mt-3 text-sm font-semibold text-white">Varredura Contínua</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
              Monitoramento automatizado de novas vagas remotas e híbridas alinhadas às suas stacks.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800/90 bg-[#09090b] p-5">
            <CheckCircle2 className="h-5 w-5 text-[#10b981]" />
            <h2 className="mt-3 text-sm font-semibold text-white">Score de Aderência</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
              Comparação direta entre requisitos técnicos da vaga e suas competências mapeadas.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800/90 bg-[#09090b] p-5">
            <ShieldCheck className="h-5 w-5 text-[#60a5fa]" />
            <h2 className="mt-3 text-sm font-semibold text-white">Painel Administrativo</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
              Publique oportunidades, controle o status do agente e acompanhe candidaturas em tempo real.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-500">
        JobHunter AI · Plataforma de inteligência para carreira
      </footer>
    </div>
  );
}
