import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  ArrowDown,
  CheckCircle2,
  X,
  RefreshCw,
  Briefcase,
  MapPin,
  Calendar,
  Sparkles,
  Check,
  Shield,
  LogOut,
  Home,
} from 'lucide-react';
import { RobotHeadIcon } from '../components/RobotHeadIcon';
import { useAuth } from '../context/AuthContext';
import { useJobs, Opportunity } from '../context/JobsContext';

export function DashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const {
    isAgentActive,
    toggleAgentStatus,
    foundCount,
    compatibleCount,
    applicationsCount,
    incrementScanStats,
    opportunities,
    applications,
    hasAlreadyApplied,
    registerApplication,
  } = useJobs();

  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanFeedback, setScanFeedback] = useState<string | null>(null);
  const [expandedRequirements, setExpandedRequirements] = useState<Record<string, boolean>>({});
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  const historySectionRef = useRef<HTMLElement | null>(null);

  const handleToggleAgentStatus = () => {
    const nextState = toggleAgentStatus();
    setScanFeedback(
      nextState
        ? 'Agente reativado e monitorando novas vagas.'
        : 'Agente pausado temporariamente.'
    );
    setTimeout(() => setScanFeedback(null), 3200);
  };

  const handleSimulateScan = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAgentActive || isScanning) return;

    setIsScanning(true);
    setScanFeedback('Executando nova varredura de oportunidades...');

    setTimeout(() => {
      setIsScanning(false);
      incrementScanStats();
      setScanFeedback('Varredura concluída: +1 oportunidade compatível identificada.');
      setTimeout(() => setScanFeedback(null), 3500);
    }, 750);
  };

  const toggleRequirementsPanel = (opportunityId: string) => {
    setExpandedRequirements((prev) => ({
      ...prev,
      [opportunityId]: !prev[opportunityId],
    }));
  };

  const handleApply = (opportunity: Opportunity) => {
    const created = registerApplication(opportunity);
    if (!created) return;

    setScanFeedback(`Candidatura enviada para ${opportunity.company}.`);
    setTimeout(() => setScanFeedback(null), 3200);
  };

  const handleScrollToHistory = () => {
    historySectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full bg-[#000000] text-[#f8fafc] antialiased selection:bg-[#60a5fa]/30 selection:text-white">
      <main className="mx-auto w-full max-w-[820px] px-6 py-6">
        {/* 1. BLOCO SUPERIOR (HEADER CARD) */}
        <header
          className="rounded-[16px] border border-[#1e293b] p-5 sm:p-6 shadow-lg"
          style={{
            background: 'linear-gradient(180deg, #172033 0%, #111827 100%)',
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <RobotHeadIcon className="h-[22px] w-[22px] shrink-0" />
              <h1 className="text-[17px] font-semibold tracking-[-0.01em] text-[#f8fafc]">
                JobHunter AI
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/"
                title="Ir para o site inicial"
                className="inline-flex items-center gap-1 rounded-full border border-[#334155]/70 bg-[#1e293b]/70 px-2.5 py-1 text-[11.5px] font-medium text-[#cbd5e1] transition-colors hover:border-[#60a5fa]/50 hover:text-white"
              >
                <Home className="h-3 w-3" />
                <span className="hidden sm:inline">Início</span>
              </Link>

              <Link
                to="/admin"
                title="Gerenciar vagas no painel Admin"
                className="inline-flex items-center gap-1 rounded-full border border-[#334155]/70 bg-[#1e293b]/70 px-2.5 py-1 text-[11.5px] font-medium text-[#cbd5e1] transition-colors hover:border-[#60a5fa]/50 hover:text-white"
              >
                <Shield className="h-3 w-3 text-[#60a5fa]" />
                <span>Admin</span>
              </Link>

              {isAgentActive && (
                <button
                  type="button"
                  onClick={handleSimulateScan}
                  disabled={isScanning}
                  title="Simular nova varredura"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#334155]/70 bg-[#1e293b]/70 px-2.5 py-1 text-[11.5px] font-medium text-[#cbd5e1] transition-colors hover:border-[#60a5fa]/50 hover:text-white disabled:opacity-60 cursor-pointer"
                >
                  <RefreshCw
                    className={`h-3 w-3 text-[#60a5fa] ${isScanning ? 'animate-spin' : ''}`}
                  />
                  <span className="hidden sm:inline">
                    {isScanning ? 'Varrendo...' : 'Nova varredura'}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={handleToggleAgentStatus}
                aria-pressed={isAgentActive}
                title="Clique para alternar o status do agente"
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-medium transition-all cursor-pointer ${
                  isAgentActive
                    ? 'border-[#065f46] bg-[#052e16] text-[#10b981] hover:brightness-110'
                    : 'border-[#3f3f46] bg-[#18181b] text-[#a1a1aa] hover:border-[#52525b] hover:text-[#e4e4e7]'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isAgentActive ? 'bg-[#10b981] animate-pulse' : 'bg-[#71717a]'
                  }`}
                />
                {isAgentActive ? 'Agente ativo' : 'Agente pausado'}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                title="Encerrar sessão"
                className="inline-flex items-center gap-1 rounded-full border border-red-900/50 bg-red-950/40 px-2.5 py-1 text-[11.5px] font-medium text-red-300 transition-colors hover:bg-red-950/70 cursor-pointer"
              >
                <LogOut className="h-3 w-3" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>

          <p className="mt-2.5 text-[13.5px] text-[#cbd5e1]">
            Painel pessoal de oportunidades e candidaturas
          </p>

          {scanFeedback && (
            <div
              role="status"
              className="mt-3 flex items-center justify-between rounded-[10px] border border-[#1e293b] bg-[#0f172a]/90 px-3 py-2 text-[12px] text-[#cbd5e1]"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-[#60a5fa] shrink-0" />
                {scanFeedback}
              </span>
              <button
                type="button"
                onClick={() => setScanFeedback(null)}
                className="text-[#94a3b8] hover:text-white cursor-pointer"
                aria-label="Fechar aviso"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Grid de KPIs */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-[12px] bg-[#253349] px-4 py-3.5 transition-transform duration-150 hover:bg-[#293850]">
              <div className="text-[24px] font-bold leading-tight text-white">
                {foundCount}
              </div>
              <div className="mt-1 text-[13px] text-[#cbd5e1]">Encontradas</div>
            </div>

            <div className="rounded-[12px] bg-[#253349] px-4 py-3.5 transition-transform duration-150 hover:bg-[#293850]">
              <div className="text-[24px] font-bold leading-tight text-white">
                {compatibleCount}
              </div>
              <div className="mt-1 text-[13px] text-[#cbd5e1]">Compatíveis</div>
            </div>

            <div className="rounded-[12px] bg-[#253349] px-4 py-3.5 transition-transform duration-150 hover:bg-[#293850]">
              <div className="text-[24px] font-bold leading-tight text-white">
                {applicationsCount}
              </div>
              <div className="mt-1 text-[13px] text-[#cbd5e1]">Candidaturas</div>
            </div>
          </div>
        </header>

        {/* 2. OPORTUNIDADES RECOMENDADAS */}
        <section aria-labelledby="recommended-heading" className="mt-7">
          <h2
            id="recommended-heading"
            className="mb-3.5 text-[16px] font-medium text-[#f4f4f5]"
          >
            Oportunidades recomendadas
          </h2>

          <div className="space-y-3.5">
            {opportunities.map((opportunity) => {
              const isExpanded = !!expandedRequirements[opportunity.id];
              const isApplied = hasAlreadyApplied(opportunity.company);

              return (
                <article
                  key={opportunity.id}
                  className="rounded-[12px] border border-[#27272a] bg-[#09090b] p-[20px] transition-colors hover:border-[#3f3f46]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="text-[15.5px] font-medium text-[#f4f4f5]">
                      {opportunity.title}
                    </h3>
                    <span className="inline-flex items-center rounded-full border border-[#065f46]/70 bg-[#052e16] px-2.5 py-0.5 text-[12px] font-medium text-[#10b981]">
                      {opportunity.matchPercentage}% aderência
                    </span>
                  </div>

                  <p className="mt-1.5 text-[13.5px] text-[#d4d4d8]">
                    {opportunity.company} · {opportunity.location}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[13px]">
                    <span className="text-[#a1a1aa]">
                      Encontrada em {opportunity.foundDate}
                    </span>
                    {opportunity.isNew && (
                      <span className="font-medium text-[#10b981]">
                        Nova oportunidade
                      </span>
                    )}
                  </div>

                  <hr className="my-3.5 border-0 border-t border-[#1f1f23]" />

                  {opportunity.hasExpandableRequirements && (
                    <>
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[13px]">
                        <span className="text-[#e4e4e7]">
                          {opportunity.compatibilityNote}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleRequirementsPanel(opportunity.id)}
                          aria-expanded={isExpanded}
                          className="font-medium text-[#e4e4e7] transition-colors hover:text-white underline-offset-4 hover:underline cursor-pointer"
                        >
                          {isExpanded ? 'Ocultar requisitos' : 'Ver requisitos'}
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="mt-3.5 rounded-[10px] border border-[#27272a] bg-[#111114] p-3.5">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-[12px] font-medium text-[#a1a1aa]">
                                Requisitos técnicos mapeados:
                              </p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {opportunity.requirements.map((skill) => (
                                  <span
                                    key={skill}
                                    className="inline-flex items-center gap-1 rounded-md border border-[#27272a] bg-[#18181b] px-2.5 py-1 text-[12px] font-medium text-[#e4e4e7]"
                                  >
                                    <Check className="h-3 w-3 text-[#10b981]" />
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleApply(opportunity)}
                              disabled={isApplied}
                              className={`inline-flex items-center gap-1.5 rounded-[8px] px-3.5 py-2 text-[12.5px] font-medium transition-all cursor-pointer ${
                                isApplied
                                  ? 'border border-[#065f46] bg-[#052e16] text-[#10b981] cursor-default'
                                  : 'bg-[#f4f4f5] text-[#09090b] hover:bg-white'
                              }`}
                            >
                              {isApplied ? (
                                <>
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  Candidatura registrada
                                </>
                              ) : (
                                'Registrar candidatura'
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <div className={opportunity.hasExpandableRequirements ? 'mt-3' : ''}>
                    <button
                      type="button"
                      onClick={() => setSelectedOpportunity(opportunity)}
                      className="inline-flex items-center gap-1 text-[13px] text-[#d4d4d8] transition-colors hover:text-white cursor-pointer"
                    >
                      <span>Link: visualizar oportunidade</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-[#a1a1aa]" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 3. HISTÓRICO DE CANDIDATURAS */}
        <section
          ref={historySectionRef}
          aria-labelledby="history-heading"
          className="mt-7 scroll-mt-6"
        >
          <h2
            id="history-heading"
            className="mb-3 text-[16px] font-medium text-[#f4f4f5]"
          >
            Histórico de candidaturas
          </h2>

          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[#1f1f23] text-[13px] font-medium text-[#e4e4e7]">
                  <th scope="col" className="w-[42%] py-2.5 pr-4 font-medium">
                    Empresa
                  </th>
                  <th scope="col" className="w-[38%] py-2.5 pr-4 font-medium">
                    Inscrição
                  </th>
                  <th scope="col" className="w-[20%] py-2.5 text-right font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {applications.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[#1f1f23] text-[13.5px] transition-colors hover:bg-[#09090b]"
                  >
                    <td className="py-3 pr-4 text-[#e4e4e7]">{item.company}</td>
                    <td className="py-3 pr-4 text-[#e4e4e7]">{item.appliedDate}</td>
                    <td className="py-3 text-right">
                      {item.status === 'Enviada' ? (
                        <span className="inline-flex items-center rounded-full border border-[#065f46]/70 bg-[#052e16] px-2.5 py-0.5 text-[12px] font-medium text-[#10b981]">
                          Enviada
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full border border-[#7c2d12]/70 bg-[#431407] px-2.5 py-0.5 text-[12px] font-medium text-[#f97316]">
                          Pendente
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. RODAPÉ */}
        <footer className="mt-4 pb-2">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleScrollToHistory}
              aria-label="Rolar até o histórico de candidaturas"
              title="Ir para o histórico de candidaturas"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#27272a] bg-[#09090b] text-[#a1a1aa] transition-colors hover:border-[#3f3f46] hover:text-white cursor-pointer"
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </button>
          </div>

          <p className="mt-2 text-[12px] text-[#a1a1aa]">
            Interface conceitual com dados fictícios.
          </p>
        </footer>
      </main>

      {/* 5. MODAL DE DETALHES */}
      {selectedOpportunity && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-opportunity-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs"
          onClick={() => setSelectedOpportunity(null)}
        >
          <div
            className="w-full max-w-[540px] rounded-[16px] border border-[#27272a] bg-[#09090b] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full border border-[#065f46]/70 bg-[#052e16] px-2.5 py-0.5 text-[12px] font-medium text-[#10b981]">
                    {selectedOpportunity.matchPercentage}% aderência
                  </span>
                  <span className="text-[12px] text-[#10b981]">Nova oportunidade</span>
                </div>
                <h3
                  id="modal-opportunity-title"
                  className="mt-2.5 text-[18px] font-semibold text-[#f8fafc]"
                >
                  {selectedOpportunity.title}
                </h3>
                <p className="mt-1 text-[13.5px] text-[#d4d4d8]">
                  {selectedOpportunity.company} · {selectedOpportunity.location}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOpportunity(null)}
                aria-label="Fechar detalhes da oportunidade"
                className="rounded-lg border border-[#27272a] bg-[#111114] p-1.5 text-[#a1a1aa] transition-colors hover:border-[#3f3f46] hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2.5 rounded-[12px] border border-[#1f1f23] bg-[#111114] p-3.5 text-[12.5px] text-[#cbd5e1] sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#60a5fa] shrink-0" />
                <span>{selectedOpportunity.modalityDetails}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-3.5 w-3.5 text-[#60a5fa] shrink-0" />
                <span>{selectedOpportunity.compensation}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-[#60a5fa] shrink-0" />
                <span>Encontrada em {selectedOpportunity.foundDate}</span>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-[13.5px]">
              <div>
                <h4 className="text-[12.5px] font-medium uppercase tracking-wider text-[#a1a1aa]">
                  Resumo da oportunidade
                </h4>
                <p className="mt-1 leading-relaxed text-[#e4e4e7]">
                  {selectedOpportunity.summary}
                </p>
              </div>

              <div>
                <h4 className="text-[12.5px] font-medium uppercase tracking-wider text-[#a1a1aa]">
                  Principais atividades
                </h4>
                <ul className="mt-1.5 space-y-1.5 text-[#d4d4d8]">
                  {selectedOpportunity.activities.map((activity, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#60a5fa] shrink-0" />
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-[12.5px] font-medium uppercase tracking-wider text-[#a1a1aa]">
                  Competências identificadas
                </h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedOpportunity.requirements.map((req) => (
                    <span
                      key={req}
                      className="rounded-md border border-[#27272a] bg-[#18181b] px-2.5 py-1 text-[12px] text-[#e4e4e7]"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-end gap-2.5 border-t border-[#1f1f23] pt-4">
              <button
                type="button"
                onClick={() => setSelectedOpportunity(null)}
                className="rounded-[8px] border border-[#27272a] bg-transparent px-4 py-2 text-[13px] font-medium text-[#d4d4d8] transition-colors hover:border-[#3f3f46] hover:text-white cursor-pointer"
              >
                Fechar
              </button>

              {hasAlreadyApplied(selectedOpportunity.company) ? (
                <span className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#065f46] bg-[#052e16] px-4 py-2 text-[13px] font-medium text-[#10b981]">
                  <CheckCircle2 className="h-4 w-4" />
                  Candidatura já registrada
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleApply(selectedOpportunity)}
                  className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#f8fafc] px-4 py-2 text-[13px] font-semibold text-[#09090b] transition-colors hover:bg-white cursor-pointer"
                >
                  Registrar candidatura
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
