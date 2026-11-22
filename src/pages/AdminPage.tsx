import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Plus,
  Trash2,
  LogOut,
  Briefcase,
  CheckCircle2,
  Home,
  LayoutDashboard,
} from 'lucide-react';
import { RobotHeadIcon } from '../components/RobotHeadIcon';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobsContext';

export function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const {
    isAgentActive,
    toggleAgentStatus,
    opportunities,
    compatibleCount,
    applicationsCount,
    addOpportunity,
    removeOpportunity,
  } = useJobs();

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('Remoto');
  const [matchPercentage, setMatchPercentage] = useState(90);
  const [skillsInput, setSkillsInput] = useState('Python, TypeScript, SQL, Git');
  const [summary, setSummary] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddOpportunity = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim()) return;

    const parsedSkills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    addOpportunity({
      title: title.trim(),
      company: company.trim(),
      location,
      matchPercentage: Number(matchPercentage),
      requirements: parsedSkills,
      summary,
    });

    setTitle('');
    setCompany('');
    setSummary('');
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <div className="mx-auto max-w-4xl px-6 py-6 space-y-6">
        {/* Cabeçalho Administrativo */}
        <header
          className="rounded-2xl border border-[#1e293b] p-6 shadow-lg"
          style={{ background: 'linear-gradient(180deg, #172033 0%, #111827 100%)' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <RobotHeadIcon className="h-6 w-6" />
              <div>
                <h1 className="text-lg font-semibold text-white">
                  JobHunter AI · Administração
                </h1>
                <p className="text-xs text-slate-300">
                  Logado como <span className="font-medium text-white">{user?.email}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-slate-500 hover:text-white"
              >
                <Home className="h-3.5 w-3.5" />
                <span>Início</span>
              </Link>

              <Link
                to="/painel"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-slate-500 hover:text-white"
              >
                <LayoutDashboard className="h-3.5 w-3.5 text-[#60a5fa]" />
                <span>Painel de Vagas</span>
              </Link>

              <button
                type="button"
                onClick={toggleAgentStatus}
                className={`rounded-full border px-3 py-1 text-xs font-medium cursor-pointer ${
                  isAgentActive
                    ? 'border-[#065f46] bg-[#052e16] text-[#10b981]'
                    : 'border-zinc-700 bg-zinc-900 text-zinc-400'
                }`}
              >
                {isAgentActive ? 'Agente ativo' : 'Agente pausado'}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-900/60 bg-red-950/40 px-3 py-1.5 text-xs font-medium text-red-300 transition-colors hover:bg-red-950/70 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sair</span>
              </button>
            </div>
          </div>

          {/* KPIs */}
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-[#253349] px-4 py-3.5">
              <div className="text-2xl font-bold text-white">{opportunities.length}</div>
              <div className="mt-1 text-xs text-slate-300">Vagas publicadas</div>
            </div>
            <div className="rounded-xl bg-[#253349] px-4 py-3.5">
              <div className="text-2xl font-bold text-white">{compatibleCount}</div>
              <div className="mt-1 text-xs text-slate-300">Perfis compatíveis</div>
            </div>
            <div className="rounded-xl bg-[#253349] px-4 py-3.5">
              <div className="text-2xl font-bold text-white">{applicationsCount}</div>
              <div className="mt-1 text-xs text-slate-300">Candidaturas registradas</div>
            </div>
          </div>
        </header>

        {/* Formulário de Publicação */}
        <section className="rounded-2xl border border-zinc-800 bg-[#09090b] p-6">
          <h2 className="text-base font-medium text-white flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-[#60a5fa]" />
            <span>Cadastrar nova oportunidade</span>
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            As vagas publicadas aqui aparecem imediatamente no Painel de Vagas do usuário.
          </p>

          <form onSubmit={handleAddOpportunity} className="mt-4 space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Cargo (ex: Dev Node.js Jr)"
                className="rounded-xl border border-zinc-800 bg-[#111114] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#60a5fa]"
              />

              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Nome da empresa"
                className="rounded-xl border border-zinc-800 bg-[#111114] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#60a5fa]"
              />

              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="rounded-xl border border-zinc-800 bg-[#111114] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#60a5fa]"
              >
                <option value="Remoto">Remoto</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Presencial">Presencial</option>
              </select>

              <div className="flex gap-2">
                <input
                  type="number"
                  min={50}
                  max={100}
                  value={matchPercentage}
                  onChange={(e) => setMatchPercentage(Number(e.target.value))}
                  title="Percentual de aderência"
                  className="w-20 rounded-xl border border-zinc-800 bg-[#111114] px-3 py-2.5 text-sm text-white outline-none focus:border-[#60a5fa]"
                />
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-zinc-100 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-white cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Publicar</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="Requisitos separados por vírgula (ex: React, TypeScript, Node.js)"
                className="rounded-xl border border-zinc-800 bg-[#111114] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#60a5fa]"
              />
              <input
                type="text"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Resumo breve da vaga (opcional)"
                className="rounded-xl border border-zinc-800 bg-[#111114] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#60a5fa]"
              />
            </div>
          </form>
        </section>

        {/* Lista de Vagas Gerenciadas */}
        <section className="rounded-2xl border border-zinc-800 bg-[#09090b] p-6">
          <h2 className="text-base font-medium text-white mb-4">
            Oportunidades ativas no sistema ({opportunities.length})
          </h2>

          {opportunities.length === 0 ? (
            <p className="text-xs text-zinc-400">
              Nenhuma oportunidade cadastrada no momento. Utilize o formulário acima para publicar.
            </p>
          ) : (
            <div className="divide-y divide-zinc-800/80">
              {opportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-white">{opp.title}</span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#065f46] bg-[#052e16] px-2.5 py-0.5 text-[11px] font-medium text-[#10b981]">
                        <CheckCircle2 className="h-3 w-3" />
                        {opp.matchPercentage}% aderência
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-zinc-400">
                      {opp.company} · {opp.location} · Publicada em {opp.foundDate}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeOpportunity(opp.id)}
                    title="Remover oportunidade"
                    className="rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 transition-colors hover:border-red-900/60 hover:text-red-400 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
