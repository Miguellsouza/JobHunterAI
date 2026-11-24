import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { BrowserRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { Turnstile } from '@marsidev/react-turnstile';
import {
  ArrowLeftRight, Bell, Bookmark, Briefcase, CheckCircle2, ChevronDown, Crown, ExternalLink, FileText,
  Filter, Laptop, LogOut, MapPin, Menu, Moon, Search, Send, Settings, Sparkles, Sun, User, X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';


// ============================================================
// TIPOS
// ============================================================
type Modality = 'Remoto' | 'Presencial' | 'Híbrido';
type TabType = 'ia' | 'salvas' | 'candidaturas';

interface Job {
  id: number;
  title: string;
  company: string;
  modality: Modality;
  place: string;
  area: string;
  level: string;
  contract: string;
  match: number;
  logoLetter: string;
  logoClass: string;
  description: string;
  saved: boolean;
  applied: boolean;
}

interface PlanOption {
  id: string;
  tier: string;
  name: string;
  extra: number;
  price: string;
  popular?: boolean;
}

interface FilterState {
  modality: Modality | null;
  modalityApplied: boolean;
  area: string;
  level: string;
  contract: string;
}


// ============================================================
// DADOS
// ============================================================
const AREAS = ['Desenvolvimento Backend', 'Desenvolvimento Frontend/Web', 'Suporte & Infraestrutura'];
const LEVELS = ['Estágio', 'Júnior', 'Pleno'];
const CONTRACTS = ['CLT', 'Estágio', 'PJ'];

const INITIAL_JOBS: Job[] = [
  {
    id: 1,
    title: 'Desenvolvedor(a) Java Júnior',
    company: 'Nexa Tecnologia',
    modality: 'Remoto',
    place: 'Remoto',
    area: 'Desenvolvimento Backend',
    level: 'Júnior',
    contract: 'CLT',
    match: 94,
    logoLetter: 'N',
    logoClass: 'bg-[#191A36] text-[#3B82F6]',
    description:
      'Atue no desenvolvimento de APIs REST com Java e Spring Boot, participe de revisões de código e ajude a evoluir a arquitetura de serviços da plataforma.',
    saved: false,
    applied: false,
  },
  {
    id: 2,
    title: 'Estágio em Desenvolvimento Web',
    company: 'Orbit Sistemas',
    modality: 'Híbrido',
    place: 'Híbrido · Salvador, BA',
    area: 'Desenvolvimento Frontend/Web',
    level: 'Estágio',
    contract: 'Estágio',
    match: 88,
    logoLetter: 'O',
    logoClass: 'border border-gray-200 bg-white text-[#7C3AED]',
    description:
      'Construa interfaces responsivas com React e TypeScript ao lado de uma equipe de produto, com mentoria semanal e foco em aprendizado prático.',
    saved: true,
    applied: false,
  },
  {
    id: 3,
    title: 'Analista de Suporte Técnico',
    company: 'Conecta Tech',
    modality: 'Presencial',
    place: 'Presencial · Salvador, BA',
    area: 'Suporte & Infraestrutura',
    level: 'Pleno',
    contract: 'PJ',
    match: 81,
    logoLetter: 'C',
    logoClass: 'bg-[#262730] text-white',
    description:
      'Preste suporte de nível 2 a clientes corporativos, monitore ambientes e documente soluções para a base de conhecimento do time de infraestrutura.',
    saved: false,
    applied: false,
  },
];

const PLANS: PlanOption[] = [
  { id: 'starter', tier: 'Plano Básico', name: 'Starter', extra: 50, price: 'R$ 19,99' },
  { id: 'plus', tier: 'Plano Intermediário', name: 'Plus', extra: 75, price: 'R$ 39,90', popular: true },
  { id: 'pro', tier: 'Plano Avançado', name: 'Pro', extra: 100, price: 'R$ 49,90' },
];


// ============================================================
// Modal
// ============================================================
interface ModalProps {
  title: string;
  onClose: () => void;
  wide?: boolean;
  children: ReactNode;
}

function Modal({ title, onClose, wide = false, children }: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={`relative max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-[#1B1C3A] ${wide ? 'max-w-3xl' : 'max-w-lg'}`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
}


// ============================================================
// AdherenceRing
// ============================================================
interface AdherenceRingProps {
  value: number;
}

const RADIUS = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function AdherenceRing({ value }: AdherenceRingProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-12 w-12" role="img" aria-label={`Aderência de ${value}%`}>
        <svg viewBox="0 0 48 48" className="h-12 w-12 -rotate-90" aria-hidden="true">
          <circle cx="24" cy="24" r={RADIUS} fill="none" stroke="#D1E7E2" strokeWidth="4" />
          <circle
            cx="24"
            cy="24"
            r={RADIUS}
            fill="none"
            stroke="#189A82"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${(value / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-900 dark:text-white">
          {value}%
        </span>
      </div>
      <span className="text-sm font-medium text-[#189A82]">Aderência</span>
    </div>
  );
}


// ============================================================
// Sidebar
// ============================================================
interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onPlans: () => void;
}

const NAV = [
  { to: '/', label: 'Vagas', icon: Briefcase },
  { to: '/perfil', label: 'Meu perfil', icon: User },
  { to: '/curriculo', label: 'Currículo', icon: FileText },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
];

function Sidebar({ open, onClose, onPlans }: SidebarProps) {
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onClose} aria-hidden="true" />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-[#191A36] px-4 py-6 transition-transform duration-200 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5D65D8]">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">
            <span className="text-white">Job</span>
            <span className="text-[#8B92F2]">Hunter</span>
          </span>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-[#2B2D5B] text-white' : 'text-[#B4B7D4] hover:bg-[#23244A]'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-4 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={onPlans}
            className="flex w-full items-center gap-3 rounded-xl bg-[#5B61D6] px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4E54C8]"
          >
            <Crown className="h-5 w-5" />
            Planos
          </button>
        </div>

        <div className="mt-auto border-t border-white/10 pt-4">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#B4B7D4] transition-colors hover:bg-[#23244A]"
          >
            <LogOut className="h-5 w-5" />
            Sair da conta
          </button>
        </div>
      </aside>
    </>
  );
}


// ============================================================
// Header
// ============================================================
interface HeaderProps {
  title: string;
  subtitle: string;
  dark: boolean;
  onToggleTheme: () => void;
  onMenu: () => void;
}

function Header({ title, subtitle, dark, onToggleTheme, onMenu }: HeaderProps) {
  return (
    <header className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Abrir menu"
          className="mt-1 rounded-lg p-1.5 text-gray-700 hover:bg-gray-200 lg:hidden dark:text-gray-200 dark:hover:bg-white/10"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#111827] sm:text-[28px] dark:text-white">{title}</h1>
          <p className="text-sm text-[#6B7280] dark:text-gray-400">{subtitle}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
          <Sun className="h-4 w-4" />
          <button
            type="button"
            role="switch"
            aria-checked={dark}
            aria-label="Alternar tema escuro"
            onClick={onToggleTheme}
            className="relative h-6 w-11 rounded-full bg-[#25264B]"
          >
            <span
              className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${dark ? 'translate-x-5' : ''}`}
            />
          </button>
          <Moon className="h-4 w-4" />
        </div>

        <button
          type="button"
          aria-label="Notificações"
          className="relative rounded-lg p-1.5 text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-white/10"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <button type="button" aria-label="Menu do usuário" className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4349B8] text-sm font-bold text-white">
            MR
          </span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}


// ============================================================
// DailyQuotaCard
// ============================================================
interface DailyQuotaCardProps {
  used: number;
  limit: number;
}

function DailyQuotaCard({ used, limit }: DailyQuotaCardProps) {
  const remaining = Math.max(limit - used, 0);
  const pct = Math.min(100, Math.round((used / limit) * 100));

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:gap-6 dark:border-white/10 dark:bg-[#1B1C3A]">
      <div className="flex items-center gap-3">
        <Search className="h-6 w-6 text-gray-700 dark:text-gray-200" />
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Buscas diárias</p>
          <p className="text-gray-900 dark:text-white">
            <strong className="font-bold">{used}</strong> de {limit} vagas utilizadas
          </p>
        </div>
      </div>

      <div
        role="progressbar"
        aria-label="Uso da cota diária"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2.5 w-full max-w-md flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10"
      >
        <div className="h-full rounded-full bg-[#474EC4] transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>

      <p className="text-gray-900 dark:text-white">
        <strong className="font-bold">{remaining}</strong> buscas restantes hoje
      </p>
    </section>
  );
}


// ============================================================
// JobFiltersCard
// ============================================================
interface JobFiltersCardProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

const MODALITIES: { label: Modality; icon: LucideIcon }[] = [
  { label: 'Remoto', icon: Laptop },
  { label: 'Presencial', icon: MapPin },
  { label: 'Híbrido', icon: ArrowLeftRight },
];

interface SelectFieldProps {
  label: string;
  allLabel: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

function SelectField({ label, allLabel, options, value, onChange }: SelectFieldProps) {
  return (
    <label className="block min-w-40 flex-1 sm:flex-none">
      <span className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{label}</span>
      <span className="relative block">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-3 pr-9 text-sm text-gray-800 outline-none focus:border-[#474EC4] focus:ring-2 focus:ring-[#474EC4]/20 dark:border-white/10 dark:bg-[#23244A] dark:text-white"
        >
          <option value="">{allLabel}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      </span>
    </label>
  );
}

function JobFiltersCard({ filters, onChange }: JobFiltersCardProps) {
  const pickModality = (m: Modality) =>
    onChange({
      ...filters,
      modality: filters.modality === m && filters.modalityApplied ? null : m,
      modalityApplied: true,
    });

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#1B1C3A]">
      <div className="mb-4 flex items-start gap-3">
        <Filter className="mt-0.5 h-5 w-5 text-gray-700 dark:text-gray-200" />
        <div>
          <h2 className="font-bold text-gray-900 dark:text-white">Filtro de vagas</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Defina suas preferências para encontrar as melhores oportunidades.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-x-3 gap-y-4">
        <div className="flex flex-wrap gap-2">
          {MODALITIES.map(({ label, icon: Icon }) => {
            const active = filters.modality === label;
            return (
              <button
                key={label}
                type="button"
                aria-pressed={active}
                onClick={() => pickModality(label)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'border-[#474EC4] bg-[#474EC4] text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:bg-[#23244A] dark:text-gray-200 dark:hover:bg-[#2B2D5B]'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </div>

        <div className="hidden h-10 w-px bg-gray-200 lg:block dark:bg-white/10" />

        <div className="flex flex-1 flex-wrap gap-3">
          <SelectField label="Área" allLabel="Todas as áreas" options={AREAS} value={filters.area} onChange={(area) => onChange({ ...filters, area })} />
          <SelectField label="Nível" allLabel="Todos os níveis" options={LEVELS} value={filters.level} onChange={(level) => onChange({ ...filters, level })} />
          <SelectField label="Tipo de contrato" allLabel="Todos os tipos" options={CONTRACTS} value={filters.contract} onChange={(contract) => onChange({ ...filters, contract })} />
        </div>
      </div>
    </section>
  );
}


// ============================================================
// JobCard
// ============================================================
interface JobCardProps {
  job: Job;
  onToggleSave: (id: number) => void;
  onView: (id: number) => void;
}

function JobCard({ job, onToggleSave, onView }: JobCardProps) {
  return (
    <article className="flex flex-wrap items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs sm:flex-nowrap dark:border-white/10 dark:bg-[#1B1C3A]">
      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl font-extrabold ${job.logoClass}`}>
        {job.logoLetter}
      </div>

      <div className="min-w-0 flex-1 basis-48">
        <h3 className="text-base font-bold text-[#111827] dark:text-white">{job.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{job.company}</p>
        <p className="mt-0.5 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <MapPin className="h-3.5 w-3.5" />
          {job.place}
        </p>
      </div>

      <div className="border-gray-200 sm:border-l sm:px-6 dark:border-white/10">
        <AdherenceRing value={job.match} />
      </div>

      <div className="border-gray-200 sm:border-l sm:px-6 dark:border-white/10">
        <button
          type="button"
          onClick={() => onToggleSave(job.id)}
          aria-pressed={job.saved}
          aria-label={job.saved ? 'Remover das vagas salvas' : 'Salvar vaga'}
          className="rounded-lg p-1 transition-colors hover:bg-gray-100 dark:hover:bg-white/10"
        >
          <Bookmark
            className={`h-6 w-6 ${job.saved ? 'fill-[#474EC4] text-[#474EC4]' : 'text-gray-700 dark:text-gray-300'}`}
          />
        </button>
      </div>

      <button
        type="button"
        onClick={() => onView(job.id)}
        className="inline-flex items-center gap-2 rounded-xl bg-[#474EC4] px-5 py-2.5 font-medium text-white transition-colors hover:bg-[#3B42B0]"
      >
        Ver vaga
        <ExternalLink className="h-4 w-4" />
      </button>
    </article>
  );
}


// ============================================================
// JobDetailsModal
// ============================================================
interface JobDetailsModalProps {
  job: Job;
  onClose: () => void;
  onApply: (id: number) => void;
  onToggleSave: (id: number) => void;
}

function JobDetailsModal({ job, onClose, onApply, onToggleSave }: JobDetailsModalProps) {
  return (
    <Modal title={job.title} onClose={onClose}>
      <div className="flex items-center gap-4 pr-8">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl font-extrabold ${job.logoClass}`}>
          {job.logoLetter}
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#111827] dark:text-white">{job.title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">{job.company}</p>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="h-3.5 w-3.5" />
            {job.place}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <AdherenceRing value={job.match} />
      </div>

      <p className="mt-5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{job.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {[job.area, job.level, job.contract].map((tag) => (
          <span key={tag} className="rounded-full bg-[#474EC4]/10 px-3 py-1 text-xs font-medium text-[#474EC4] dark:text-[#8B92F2]">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {job.applied ? (
          <span className="inline-flex items-center gap-2 rounded-xl bg-[#189A82]/10 px-5 py-2.5 font-medium text-[#189A82]">
            <CheckCircle2 className="h-5 w-5" />
            Candidatura enviada
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onApply(job.id)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#474EC4] px-5 py-2.5 font-medium text-white transition-colors hover:bg-[#3B42B0]"
          >
            <Send className="h-4 w-4" />
            Candidatar-me
          </button>
        )}
        <button
          type="button"
          onClick={() => onToggleSave(job.id)}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/10"
        >
          <Bookmark className={`h-4 w-4 ${job.saved ? 'fill-[#474EC4] text-[#474EC4]' : ''}`} />
          {job.saved ? 'Vaga salva' : 'Salvar vaga'}
        </button>
      </div>
    </Modal>
  );
}


// ============================================================
// PlansModal
// ============================================================
interface PlansModalProps {
  onClose: () => void;
  onPurchase: (extra: number) => void;
}

function PlansModal({ onClose, onPurchase }: PlansModalProps) {
  const [selected, setSelected] = useState<PlanOption | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [done, setDone] = useState<PlanOption | null>(null);

  const confirm = () => {
    if (!selected || !token) return;
    onPurchase(selected.extra);
    setDone(selected);
  };

  if (done) {
    return (
      <Modal title="Plano contratado" onClose={onClose}>
        <div className="flex flex-col items-center py-6 text-center">
          <CheckCircle2 className="h-14 w-14 text-[#189A82]" />
          <h2 className="mt-4 text-xl font-bold text-[#111827] dark:text-white">Plano {done.name} contratado!</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            +{done.extra} vagas foram adicionadas à sua cota diária.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-6 rounded-xl bg-[#474EC4] px-6 py-2.5 font-medium text-white transition-colors hover:bg-[#3B42B0]"
          >
            Voltar às vagas
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="Planos" onClose={onClose} wide>
      <div className="mb-6 flex items-center gap-3 pr-8">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#5B61D6]">
          <Crown className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#111827] dark:text-white">Expanda sua cota diária</h2>
          <p className="text-sm text-[#6B7280] dark:text-gray-400">Escolha um pacote para buscar mais vagas todos os dias.</p>
        </div>
      </div>

      <div className="grid gap-4 pt-3 sm:grid-cols-3">
        {PLANS.map((plan) => {
          const active = selected?.id === plan.id;
          return (
            <button
              key={plan.id}
              type="button"
              aria-pressed={active}
              onClick={() => setSelected(plan)}
              className={`relative flex flex-col items-start rounded-2xl border bg-white p-5 text-left transition-colors dark:bg-[#23244A] ${
                active ? 'border-[#474EC4] ring-2 ring-[#474EC4]' : 'border-gray-200 hover:border-[#474EC4] dark:border-white/10'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-5 rounded-full bg-[#474EC4] px-3 py-0.5 text-xs font-semibold text-white">
                  Mais Popular
                </span>
              )}
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{plan.tier}</span>
              <span className="text-lg font-bold text-[#111827] dark:text-white">{plan.name}</span>
              <span className="mt-3 text-sm font-semibold text-[#189A82]">+{plan.extra} vagas na cota diária</span>
              <span className="mt-4 text-2xl font-extrabold text-[#111827] dark:text-white">{plan.price}</span>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl bg-[#F3F4F8] p-5 dark:bg-[#15162E]">
          <p className="text-sm text-gray-700 dark:text-gray-200">
            Plano <strong>{selected.name}</strong> · +{selected.extra} vagas por {selected.price}
          </p>
          <Turnstile
            siteKey="1x00000000000000000000AA"
            onSuccess={setToken}
            onExpire={() => setToken(null)}
            onError={() => setToken(null)}
          />
          <button
            type="button"
            onClick={confirm}
            disabled={!token}
            className="rounded-xl bg-[#474EC4] px-6 py-2.5 font-medium text-white transition-colors hover:bg-[#3B42B0] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Confirmar contratação
          </button>
        </div>
      )}
    </Modal>
  );
}


// ============================================================
// App (estado, rotas e layout)
// ============================================================
const TABS: { id: TabType; label: string; icon: LucideIcon }[] = [
  { id: 'ia', label: 'Selecionadas pela IA', icon: Sparkles },
  { id: 'salvas', label: 'Vagas salvas', icon: Bookmark },
  { id: 'candidaturas', label: 'Candidaturas', icon: Briefcase },
];

const EMPTY: Record<TabType, string> = {
  ia: 'Nenhuma vaga encontrada com esses filtros. Ajuste suas preferências e tente de novo.',
  salvas: 'Você ainda não salvou nenhuma vaga. Toque no marcador de uma vaga para guardá-la aqui.',
  candidaturas: 'Você ainda não se candidatou a nenhuma vaga. Abra uma vaga e escolha “Candidatar-me”.',
};

const PAGES: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Encontre sua próxima oportunidade', subtitle: 'Vagas selecionadas pela IA de acordo com o seu perfil' },
  '/perfil': { title: 'Meu perfil', subtitle: 'Gerencie suas informações e preferências profissionais' },
  '/curriculo': { title: 'Currículo', subtitle: 'Mantenha seu currículo atualizado para melhorar a aderência' },
  '/configuracoes': { title: 'Configurações', subtitle: 'Personalize sua experiência no JobHunter' },
};

const INITIAL_FILTERS: FilterState = { modality: 'Remoto', modalityApplied: false, area: '', level: '', contract: '' };

const readTheme = (): boolean => {
  try {
    return localStorage.getItem('jh-theme') === 'dark';
  } catch {
    return false;
  }
};

function Shell() {
  const { pathname } = useLocation();
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [tab, setTab] = useState<TabType>('ia');
  const [quota, setQuota] = useState({ used: 32, limit: 50 });
  const [dark, setDark] = useState<boolean>(readTheme);
  const [menuOpen, setMenuOpen] = useState(false);
  const [plansOpen, setPlansOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try {
      localStorage.setItem('jh-theme', dark ? 'dark' : 'light');
    } catch {
      /* armazenamento indisponível: o tema vale apenas para esta sessão */
    }
  }, [dark]);

  const toggleSave = (id: number) =>
    setJobs((js) => js.map((j) => (j.id === id ? { ...j, saved: !j.saved } : j)));
  const apply = (id: number) =>
    setJobs((js) => js.map((j) => (j.id === id ? { ...j, applied: true } : j)));
  const purchase = (extra: number) => setQuota((q) => ({ ...q, limit: q.limit + extra }));

  const visible = jobs.filter((j) => {
    if (tab === 'salvas' && !j.saved) return false;
    if (tab === 'candidaturas' && !j.applied) return false;
    if (filters.modalityApplied && filters.modality && j.modality !== filters.modality) return false;
    if (filters.area && j.area !== filters.area) return false;
    if (filters.level && j.level !== filters.level) return false;
    if (filters.contract && j.contract !== filters.contract) return false;
    return true;
  });

  const selectedJob = jobs.find((j) => j.id === selectedId) ?? null;
  const page = PAGES[pathname] ?? PAGES['/'];

  const vagas = (
    <>
      <DailyQuotaCard used={quota.used} limit={quota.limit} />
      <JobFiltersCard filters={filters} onChange={setFilters} />

      <nav role="tablist" className="flex gap-8 overflow-x-auto border-b border-gray-200 dark:border-white/10">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          const count = id === 'salvas' ? jobs.filter((j) => j.saved).length : id === 'candidaturas' ? jobs.filter((j) => j.applied).length : 0;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(id)}
              className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 px-1 pb-3 text-sm transition-colors ${
                active
                  ? 'border-[#474EC4] font-semibold text-[#474EC4] dark:border-[#8B92F2] dark:text-[#8B92F2]'
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
              {count > 0 && (
                <span className="rounded-full bg-[#474EC4]/10 px-2 text-xs font-semibold text-[#474EC4] dark:text-[#8B92F2]">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {visible.length > 0 ? (
        <div className="flex flex-col gap-3">
          {visible.map((job) => (
            <JobCard key={job.id} job={job} onToggleSave={toggleSave} onView={setSelectedId} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-600 dark:border-white/20 dark:text-gray-400">
          {EMPTY[tab]}
        </p>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-[#F3F4F8] font-sans text-[#111827] dark:bg-[#0F1020]">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} onPlans={() => { setMenuOpen(false); setPlansOpen(true); }} />

      <div className="lg:pl-60">
        <main className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 sm:px-8">
          <Header title={page.title} subtitle={page.subtitle} dark={dark} onToggleTheme={() => setDark((d) => !d)} onMenu={() => setMenuOpen(true)} />
          <Routes>
            <Route path="/" element={vagas} />
            <Route
              path="*"
              element={
                <p className="rounded-2xl border border-gray-200 bg-white p-8 text-sm text-gray-600 shadow-xs dark:border-white/10 dark:bg-[#1B1C3A] dark:text-gray-300">
                  Esta seção estará disponível em breve.
                </p>
              }
            />
          </Routes>
        </main>
      </div>

      {selectedJob && (
        <JobDetailsModal job={selectedJob} onClose={() => setSelectedId(null)} onApply={apply} onToggleSave={toggleSave} />
      )}
      {plansOpen && <PlansModal onClose={() => setPlansOpen(false)} onPurchase={purchase} />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}
