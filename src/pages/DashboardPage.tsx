import React, { useEffect, useState } from 'react';

/* ============================================================================
   1. INTERFACES E TIPOS (CONSOLIDADOS)
   ============================================================================ */

export type DashboardTab = 'vagas' | 'perfil' | 'curriculo' | 'configuracoes';

export type WorkModality = 'todos' | 'remoto' | 'presencial' | 'hibrido';

export type UserSex = 'masculino' | 'feminino' | 'outro' | 'prefiro_nao_informar' | '';

export type LanguageProficiency =
  | 'basico'
  | 'intermediario'
  | 'avancado'
  | 'fluente'
  | 'nativo';

export interface UserProfile {
  id: string;
  nome: string;
  sobrenome: string;
  idade: number | '';
  sexo: UserSex;
  email: string;
}

export interface ExperienceItem {
  id: string;
  cargo: string;
  empresa: string;
  periodo: string;
  descricao: string;
}

export interface PersonalProjectItem {
  id: string;
  nome: string;
  tecnologias: string;
  link: string;
  descricao: string;
}

export interface LanguageItem {
  id: string;
  idioma: string;
  nivel: LanguageProficiency;
}

export interface EducationItem {
  id: string;
  tipo: 'faculdade' | 'curso' | 'certificado';
  titulo: string;
  instituicao: string;
  periodo: string;
}

export interface UserResume {
  arquivoNome?: string;
  arquivoUrl?: string;
  sobre: string;
  experiencias: ExperienceItem[];
  projetosPessoais: PersonalProjectItem[];
  habilidades: string[];
  idiomas: LanguageItem[];
  formacoes: EducationItem[];
}

export interface JobListing {
  id: string;
  titulo: string;
  empresa: string;
  modalidade: Exclude<WorkModality, 'todos'>;
  localizacao: string;
  tipoContrato?: string;
  salario?: string;
  aderenciaPercentual: number;
  urlVaga: string;
  salva: boolean;
  candidatada: boolean;
  dataCandidatura?: string;
  resumo?: string;
}

export interface JobFilterParams {
  palavraChave: string;
  modalidade: WorkModality;
  localizacao: string;
  tipoContrato: string;
  aderenciaMinima: number;
}

export interface DailyQuotaStatus {
  limiteBaseDiario: number; // 50 vagas/dia
  bonusAdquirido: number;
  consumidasHoje: number;
  restantesHoje: number;
  resetEm: string;
}

export interface QuotaPlan {
  id: 'plan_50' | 'plan_75' | 'plan_100';
  nome: string;
  vagasExtras: number;
  precoReais: number;
  precoFormatado: string;
  descricao: string;
}

export interface DashboardPageProps {
  onRedirectLogin?: () => void;
}

export type UserDashboardPageProps = DashboardPageProps;

/* ============================================================================
   2. CSS EMBUTIDO (IDENTIDADE VISUAL DARK / BEGE DA REFERÊNCIA)
   ============================================================================ */

const USER_DASHBOARD_CSS = `
.ud-app {
  --bg-main: #000000;
  --bg-surface: #111111;
  --bg-card: #222222;
  --border-color: #333333;
  --border-subtle: #222222;
  --text-primary: #eae4d9;
  --text-muted: #888888;
  --accent-beige: #d4c4a8;
  --accent-blue: #3b82f6;
  --accent-blue-soft: rgba(59, 130, 246, 0.15);
  --status-ok: #7fff00;
  --status-err: #dc143c;
  --status-warn: #facc15;

  display: flex;
  min-height: 100vh;
  font-family: sans-serif;
  background-color: var(--bg-main);
  color: var(--text-primary);
  transition: 0.35s ease;
}

.ud-app *,
.ud-app *::before,
.ud-app *::after {
  box-sizing: border-box;
}

.ud-app h1,
.ud-app h2,
.ud-app h3,
.ud-app h4 {
  color: var(--text-primary);
  margin: 0;
  transition: 0.35s ease;
}

.ud-app p {
  color: var(--text-muted);
  margin: 0;
  transition: 0.35s ease;
}

/* Sidebar Fixa (280px) */
.ud-sidebar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 280px;
  min-width: 280px;
  height: 100vh;
  position: sticky;
  top: 0;
  left: 0;
  background-color: var(--bg-surface);
  border-right: 2px solid var(--border-subtle);
  padding: 24px 16px;
  overflow-y: auto;
  transition: 0.35s ease;
}

.ud-sidebar-top {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.ud-brand-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px 16px 12px;
  border-bottom: 1px solid var(--border-subtle);
}

.ud-brand-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background-color: var(--accent-blue-soft);
  border: 1px solid var(--accent-blue);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-blue);
  font-size: 18px;
  flex-shrink: 0;
}

.ud-brand-title h2 {
  font-size: 17px;
  letter-spacing: 0.3px;
}

.ud-brand-title span {
  display: block;
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 2px;
}

.ud-nav-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ud-nav-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-muted);
  padding: 4px 12px;
}

.ud-nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: 10px;
  color: var(--text-muted);
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  text-align: left;
  transition: 0.2s;
}

.ud-nav-item i {
  width: 20px;
  text-align: center;
  font-size: 15px;
}

.ud-nav-item:hover {
  background-color: var(--bg-card);
  color: var(--text-primary);
}

.ud-nav-item.active {
  background-color: var(--bg-card);
  border-color: var(--accent-blue);
  color: var(--text-primary);
}

.ud-nav-item.active i {
  color: var(--accent-blue);
}

.ud-sidebar-bottom {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border-subtle);
}

.ud-btn-outline {
  width: 100%;
  height: 44px;
  background-color: var(--bg-surface);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  font-weight: bold;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: 0.2s;
}

.ud-btn-outline:hover {
  background-color: var(--bg-card);
  border-color: var(--accent-blue);
}

.ud-btn-outline.danger:hover {
  border-color: var(--status-err);
  color: #f87171;
}

/* Área Principal e Header */
.ud-main {
  flex: 1;
  padding: 24px 40px 48px 40px;
  max-width: calc(100vw - 280px);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.ud-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-subtle);
  flex-wrap: wrap;
}

.ud-header-context h1 {
  font-size: 24px;
}

.ud-header-context p {
  font-size: 13px;
  margin-top: 4px;
}

.ud-header-controls {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

/* Switch de Tema */
.ud-theme-switch {
  width: 90px;
  height: 44px;
  background-color: #333333;
  box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.5);
  border-radius: 50px;
  border: none;
  position: relative;
  cursor: pointer;
  transition: 0.4s;
  flex-shrink: 0;
}

.ud-theme-indicator {
  display: flex;
  width: 44px;
  height: 44px;
  top: 0;
  left: 0;
  align-items: center;
  justify-content: center;
  background-color: #000000;
  border-radius: 25px;
  transform: scale(0.88);
  color: #eae4d9;
  position: absolute;
  transition: 0.4s;
}

.ud-theme-switch.light {
  background-color: #bba98e;
}

.ud-theme-switch.light .ud-theme-indicator {
  left: 46px;
  background-color: #eae4d9;
  color: #000000;
}

/* Faixa de Telemetria e Cards de Métricas */
.ud-telemetry-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 14px 20px;
}

.ud-telemetry-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-right: 1px solid var(--border-subtle);
  padding-right: 12px;
}

.ud-telemetry-item:last-child {
  border-right: none;
  padding-right: 0;
}

.ud-telemetry-item span {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
}

.ud-telemetry-item strong {
  font-size: 14px;
  color: var(--text-primary);
}

.ud-metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.ud-metric-card {
  display: flex;
  align-items: center;
  min-height: 110px;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 16px 20px;
  gap: 18px;
  transition: 0.2s;
}

.ud-metric-card:hover {
  background-color: var(--bg-surface);
  border-color: var(--accent-blue);
}

.ud-metric-card i {
  font-size: 32px;
  flex-shrink: 0;
}

.ud-metric-card h2 {
  font-size: 26px;
}

.ud-metric-card p {
  font-size: 13px;
  margin-top: 4px;
}

/* Painéis, Formulários, Botões e Badges */
.ud-panel {
  background-color: var(--bg-surface);
  border: 2px solid var(--border-subtle);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ud-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.ud-panel-header h3 {
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.ud-panel-header h3 i {
  color: var(--accent-blue);
}

.ud-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  align-items: end;
}

.ud-form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ud-form-group label {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: bold;
}

.ud-input,
.ud-select,
.ud-textarea {
  background-color: var(--bg-main);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 13px;
  padding: 0 12px;
  outline: none;
  transition: 0.2s;
  font-family: inherit;
  width: 100%;
}

.ud-input,
.ud-select {
  height: 40px;
}

.ud-textarea {
  padding: 10px 12px;
  min-height: 92px;
  resize: vertical;
}

.ud-input:focus,
.ud-select:focus,
.ud-textarea:focus {
  border-color: var(--accent-blue);
}

.ud-input:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  border-style: dashed;
}

.ud-btn-primary {
  background-color: var(--accent-blue);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  height: 40px;
  padding: 0 18px;
  font-weight: bold;
  font-size: 13px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
  transition: 0.2s;
}

.ud-btn-primary:hover:not(:disabled) {
  filter: brightness(1.1);
}

.ud-btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ud-btn-secondary {
  background-color: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  height: 38px;
  padding: 0 14px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  text-decoration: none;
  transition: 0.2s;
}

.ud-btn-secondary:hover:not(:disabled) {
  border-color: var(--accent-blue);
}

.ud-btn-secondary.saved {
  border-color: var(--accent-beige);
  color: var(--accent-beige);
}

.ud-btn-danger {
  background-color: rgba(220, 20, 60, 0.15);
  color: #f87171;
  border: 1px solid rgba(248, 113, 113, 0.5);
  border-radius: 8px;
  height: 40px;
  padding: 0 18px;
  font-weight: bold;
  font-size: 13px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.ud-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: bold;
}

.ud-badge-neutral {
  background-color: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.ud-badge-blue {
  background-color: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.4);
}

.ud-badge-ok {
  background-color: rgba(127, 255, 0, 0.12);
  color: #84cc16;
  border: 1px solid rgba(132, 204, 22, 0.4);
}

.ud-badge-warn {
  background-color: rgba(250, 204, 21, 0.15);
  color: #facc15;
  border: 1px solid rgba(250, 204, 21, 0.4);
}

.ud-alert {
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  border: 1px solid var(--border-color);
  background-color: var(--bg-main);
  color: var(--text-muted);
}

.ud-alert.error {
  border-color: rgba(248, 113, 113, 0.5);
  background-color: rgba(220, 20, 60, 0.1);
  color: #f87171;
}

.ud-alert.warn {
  border-color: rgba(250, 204, 21, 0.5);
  background-color: rgba(250, 204, 21, 0.08);
  color: #facc15;
}

.ud-alert.ok {
  border-color: rgba(132, 204, 22, 0.4);
  background-color: rgba(127, 255, 0, 0.08);
  color: #84cc16;
}

/* Grid de Vagas e Modal de Planos */
.ud-jobs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;
}

.ud-job-card {
  background-color: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 14px;
  transition: 0.2s;
}

.ud-job-card:hover {
  border-color: var(--accent-blue);
}

.ud-job-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.ud-job-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 12px;
  color: var(--text-muted);
}

.ud-adherence-bar {
  width: 100%;
  height: 6px;
  background-color: var(--bg-card);
  border-radius: 999px;
  overflow: hidden;
}

.ud-adherence-fill {
  height: 100%;
  background-color: var(--accent-blue);
  border-radius: 999px;
}

.ud-job-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--border-subtle);
}

.ud-modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.ud-modal-card {
  background-color: var(--bg-surface);
  border: 2px solid var(--border-color);
  border-radius: 14px;
  width: 100%;
  max-width: 780px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.ud-plans-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.ud-plan-card {
  background-color: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 14px;
}

.ud-plan-card.featured {
  border-color: var(--accent-blue);
}

.ud-plan-price {
  font-size: 26px;
  font-weight: bold;
  color: var(--text-primary);
}

/* Modo Claro (.light) */
.ud-app.light {
  background-color: #eae4d9;
  color: #000000;
}

.ud-app.light h1,
.ud-app.light h2,
.ud-app.light h3,
.ud-app.light h4,
.ud-app.light .ud-telemetry-item strong,
.ud-app.light .ud-plan-price {
  color: #000000;
}

.ud-app.light p,
.ud-app.light .ud-nav-label,
.ud-app.light .ud-telemetry-item span {
  color: #444444;
}

.ud-app.light .ud-sidebar {
  background-color: #eae4d9;
  border-right: none;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
}

.ud-app.light .ud-brand-header,
.ud-app.light .ud-sidebar-bottom,
.ud-app.light .ud-header {
  border-color: rgba(0, 0, 0, 0.12);
}

.ud-app.light .ud-nav-item {
  color: #444444;
}

.ud-app.light .ud-nav-item:hover,
.ud-app.light .ud-nav-item.active {
  background-color: rgba(0, 0, 0, 0.06);
  color: #000000;
}

.ud-app.light .ud-metric-card,
.ud-app.light .ud-panel,
.ud-app.light .ud-telemetry-strip,
.ud-app.light .ud-btn-outline,
.ud-app.light .ud-modal-card {
  background-color: #eae4d9;
  border: 1px solid rgba(0, 0, 0, 0.14);
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.12);
  color: #000000;
}

.ud-app.light .ud-input,
.ud-app.light .ud-select,
.ud-app.light .ud-textarea,
.ud-app.light .ud-job-card,
.ud-app.light .ud-plan-card,
.ud-app.light .ud-btn-secondary,
.ud-app.light .ud-badge-neutral,
.ud-app.light .ud-alert {
  background-color: #dfd7c8;
  color: #000000;
  border-color: rgba(0, 0, 0, 0.16);
}

/* Responsividade */
@media (max-width: 1100px) {
  .ud-metrics-grid,
  .ud-telemetry-strip {
    grid-template-columns: repeat(2, 1fr);
  }
  .ud-plans-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .ud-app {
    flex-direction: column;
  }
  .ud-sidebar {
    width: 100%;
    min-width: 100%;
    height: auto;
    position: static;
    border-right: none;
    border-bottom: 2px solid var(--border-subtle);
  }
  .ud-nav-menu {
    flex-direction: row;
    overflow-x: auto;
  }
  .ud-nav-item {
    white-space: nowrap;
  }
  .ud-main {
    max-width: 100vw;
    padding: 20px;
  }
  .ud-metrics-grid,
  .ud-telemetry-strip,
  .ud-jobs-grid {
    grid-template-columns: 1fr;
  }
}
`;

/* ============================================================================
   3. CLIENTE HTTP E CONSTANTES DE PLANOS
   ============================================================================ */

const API_BASE_URL =
  (typeof import.meta !== 'undefined' &&
    (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL) ||
  '/api';

class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('auth_token');
  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    let errorMessage = `Erro na requisição (${response.status})`;
    let errorCode: string | undefined;
    try {
      const payload = await response.json();
      errorMessage = payload.message || payload.detail || errorMessage;
      errorCode = payload.code;
    } catch {
      // Mantém mensagem padrão se resposta não for JSON
    }
    throw new ApiError(errorMessage, response.status, errorCode);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

const userDashboardApi = {
  obterCotaDiaria: () => apiRequest<DailyQuotaStatus>('/user/jobs/quota'),
  criarSessaoPagamentoPlano: (planId: QuotaPlan['id']) =>
    apiRequest<{ checkoutUrl: string }>('/billing/quota-checkout', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    }),
  listarVagasSelecionadasIA: () => apiRequest<JobListing[]>('/user/jobs/ai-selected'),
  filtrarVagas: (filtros: JobFilterParams) => {
    const params = new URLSearchParams();
    if (filtros.palavraChave) params.set('q', filtros.palavraChave);
    if (filtros.modalidade && filtros.modalidade !== 'todos') {
      params.set('modalidade', filtros.modalidade);
    }
    if (filtros.localizacao) params.set('localizacao', filtros.localizacao);
    if (filtros.tipoContrato) params.set('contrato', filtros.tipoContrato);
    if (filtros.aderenciaMinima > 0) {
      params.set('aderenciaMinima', String(filtros.aderenciaMinima));
    }
    return apiRequest<{ vagas: JobListing[]; cota: DailyQuotaStatus }>(
      `/user/jobs/search?${params.toString()}`
    );
  },
  listarVagasCandidatadas: () => apiRequest<JobListing[]>('/user/jobs/applied'),
  alternarSalvarVaga: (jobId: string, salvar: boolean) =>
    apiRequest<{ jobId: string; salva: boolean }>(`/user/jobs/${jobId}/save`, {
      method: salvar ? 'POST' : 'DELETE',
    }),
  obterPerfil: () => apiRequest<UserProfile>('/user/profile'),
  atualizarPerfil: (dados: Omit<UserProfile, 'id' | 'email'>) =>
    apiRequest<UserProfile>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(dados),
    }),
  obterCurriculo: () => apiRequest<UserResume>('/user/resume'),
  enviarArquivoCurriculoIA: (arquivo: File) => {
    const formData = new FormData();
    formData.append('file', arquivo);
    return apiRequest<UserResume>('/user/resume/parse-ai', {
      method: 'POST',
      body: formData,
    });
  },
  salvarCurriculo: (curriculo: UserResume) =>
    apiRequest<UserResume>('/user/resume', {
      method: 'PUT',
      body: JSON.stringify(curriculo),
    }),
  alterarEmail: (novoEmail: string, senhaAtual: string) =>
    apiRequest<{ email: string }>('/user/account/email', {
      method: 'PATCH',
      body: JSON.stringify({ novoEmail, senhaAtual }),
    }),
  alterarSenha: (senhaAtual: string, novaSenha: string) =>
    apiRequest<void>('/user/account/password', {
      method: 'PATCH',
      body: JSON.stringify({ senhaAtual, novaSenha }),
    }),
  excluirConta: (senhaAtual: string) =>
    apiRequest<void>('/user/account', {
      method: 'DELETE',
      body: JSON.stringify({ senhaAtual }),
    }),
  logout: () =>
    apiRequest<void>('/auth/logout', {
      method: 'POST',
    }),
};

const QUOTA_PLANS: QuotaPlan[] = [
  {
    id: 'plan_50',
    nome: 'Pacote Básico +50',
    vagasExtras: 50,
    precoReais: 19.99,
    precoFormatado: 'R$ 19,99',
    descricao: 'Amplia seu limite diário em +50 buscas de vagas.',
  },
  {
    id: 'plan_75',
    nome: 'Pacote Intermediário +75',
    vagasExtras: 75,
    precoReais: 39.9,
    precoFormatado: 'R$ 39,90',
    descricao: 'Amplia seu limite diário em +75 buscas de vagas.',
  },
  {
    id: 'plan_100',
    nome: 'Pacote Avançado +100',
    vagasExtras: 100,
    precoReais: 49.9,
    precoFormatado: 'R$ 49,90',
    descricao: 'Amplia seu limite diário em +100 buscas de vagas.',
  },
];

const EMPTY_RESUME: UserResume = {
  sobre: '',
  experiencias: [],
  projetosPessoais: [],
  habilidades: [],
  idiomas: [],
  formacoes: [],
};

const TAB_METADATA: Record<DashboardTab, { title: string; subtitle: string }> = {
  vagas: {
    title: 'Vagas & Recomendações IA',
    subtitle: 'Vagas selecionadas por aderência, filtros personalizados e histórico de candidaturas',
  },
  perfil: {
    title: 'Perfil do Usuário',
    subtitle: 'Gerenciamento das informações pessoais da conta',
  },
  curriculo: {
    title: 'Currículo',
    subtitle: 'Upload de documento PDF/DOCX com extração por IA e edição manual completa',
  },
  configuracoes: {
    title: 'Configurações da Conta',
    subtitle: 'Alteração de e-mail, senha, encerramento de sessão e exclusão de conta',
  },
};

function generateItemId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/* ============================================================================
   4. COMPONENTE PRINCIPAL UNIFICADO (EXPORTADO COMO DashboardPage E UserDashboardPage)
   ============================================================================ */

export const DashboardPage: React.FC<DashboardPageProps> = ({ onRedirectLogin }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('vagas');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('dashboard_theme') as 'dark' | 'light') || 'dark';
  });

  // Estados Globais
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [resume, setResume] = useState<UserResume>(EMPTY_RESUME);
  const [aiJobs, setAiJobs] = useState<JobListing[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<JobListing[]>([]);
  const [quota, setQuota] = useState<DailyQuotaStatus | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Modal de Planos
  const [plansModalOpen, setPlansModalOpen] = useState(false);
  const [plansLimitReached, setPlansLimitReached] = useState(false);
  const [loadingPlanId, setLoadingPlanId] = useState<QuotaPlan['id'] | null>(null);
  const [planError, setPlanError] = useState<string | null>(null);

  // Aba Vagas
  const [jobsSubView, setJobsSubView] = useState<'recomendadas' | 'candidatadas'>('recomendadas');
  const [filters, setFilters] = useState<JobFilterParams>({
    palavraChave: '',
    modalidade: 'todos',
    localizacao: '',
    tipoContrato: '',
    aderenciaMinima: 0,
  });
  const [searchingJobs, setSearchingJobs] = useState(false);
  const [savingJobId, setSavingJobId] = useState<string | null>(null);
  const [jobsError, setJobsError] = useState<string | null>(null);

  // Aba Perfil
  const [perfilNome, setPerfilNome] = useState('');
  const [perfilSobrenome, setPerfilSobrenome] = useState('');
  const [perfilIdade, setPerfilIdade] = useState<number | ''>('');
  const [perfilSexo, setPerfilSexo] = useState<UserSex>('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  // Aba Currículo
  const [skillInput, setSkillInput] = useState('');
  const [selectedResumeFile, setSelectedResumeFile] = useState<File | null>(null);
  const [parsingResumeAI, setParsingResumeAI] = useState(false);
  const [savingResume, setSavingResume] = useState(false);
  const [resumeMsg, setResumeMsg] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  // Aba Configurações
  const [novoEmail, setNovoEmail] = useState('');
  const [senhaParaEmail, setSenhaParaEmail] = useState('');
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  const [loadingSenha, setLoadingSenha] = useState(false);
  const [senhaExclusao, setSenhaExclusao] = useState('');
  const [confirmacaoExclusao, setConfirmacaoExclusao] = useState('');
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  useEffect(() => {
    localStorage.setItem('dashboard_theme', theme);
  }, [theme]);

  useEffect(() => {
    let active = true;
    async function loadAllData() {
      setLoadingInitial(true);
      const [profileRes, resumeRes, aiJobsRes, appliedRes, quotaRes] = await Promise.allSettled([
        userDashboardApi.obterPerfil(),
        userDashboardApi.obterCurriculo(),
        userDashboardApi.listarVagasSelecionadasIA(),
        userDashboardApi.listarVagasCandidatadas(),
        userDashboardApi.obterCotaDiaria(),
      ]);

      if (!active) return;

      if (profileRes.status === 'fulfilled') {
        const p = profileRes.value;
        setProfile(p);
        setPerfilNome(p.nome || '');
        setPerfilSobrenome(p.sobrenome || '');
        setPerfilIdade(p.idade ?? '');
        setPerfilSexo(p.sexo || '');
      }
      if (resumeRes.status === 'fulfilled') {
        setResume({ ...EMPTY_RESUME, ...resumeRes.value });
      }
      if (aiJobsRes.status === 'fulfilled') setAiJobs(aiJobsRes.value);
      if (appliedRes.status === 'fulfilled') setAppliedJobs(appliedRes.value);
      if (quotaRes.status === 'fulfilled') setQuota(quotaRes.value);

      setLoadingInitial(false);
    }

    loadAllData();
    return () => {
      active = false;
    };
  }, []);

  const limiteTotal = quota ? quota.limiteBaseDiario + quota.bonusAdquirido : 50;
  const consumidas = quota?.consumidasHoje ?? 0;
  const restantes = quota?.restantesHoje ?? Math.max(0, limiteTotal - consumidas);
  const limiteEsgotado = quota !== null && restantes <= 0;
  const currentMeta = TAB_METADATA[activeTab];

  const handleOpenPlans = (limitReached = false) => {
    setPlanError(null);
    setPlansLimitReached(limitReached);
    setPlansModalOpen(true);
  };

  const handleSelectPlan = async (plan: QuotaPlan) => {
    setPlanError(null);
    setLoadingPlanId(plan.id);
    try {
      const { checkoutUrl } = await userDashboardApi.criarSessaoPagamentoPlano(plan.id);
      if (checkoutUrl) window.location.href = checkoutUrl;
    } catch (err) {
      setPlanError(
        err instanceof ApiError
          ? err.message
          : 'Não foi possível iniciar o pagamento. Verifique a integração com o gateway.'
      );
    } finally {
      setLoadingPlanId(null);
    }
  };

  const handleLoggedOut = () => {
    localStorage.removeItem('auth_token');
    if (onRedirectLogin) {
      onRedirectLogin();
    } else {
      window.location.href = '/login';
    }
  };

  // Handlers Aba Vagas
  const handleFilterJobs = async (e: React.FormEvent) => {
    e.preventDefault();
    setJobsError(null);
    if (limiteEsgotado) {
      handleOpenPlans(true);
      return;
    }
    setSearchingJobs(true);
    try {
      const res = await userDashboardApi.filtrarVagas(filters);
      setAiJobs(res.vagas);
      setQuota(res.cota);
      setJobsSubView('recomendadas');
    } catch (err) {
      if (
        err instanceof ApiError &&
        (err.status === 402 || err.status === 429 || err.code === 'DAILY_LIMIT_REACHED')
      ) {
        handleOpenPlans(true);
      } else {
        setJobsError(err instanceof ApiError ? err.message : 'Erro ao buscar vagas filtradas.');
      }
    } finally {
      setSearchingJobs(false);
    }
  };

  const handleToggleSaveJob = async (job: JobListing) => {
    setSavingJobId(job.id);
    setJobsError(null);
    try {
      const res = await userDashboardApi.alternarSalvarVaga(job.id, !job.salva);
      setAiJobs((prev) =>
        prev.map((item) => (item.id === job.id ? { ...item, salva: res.salva } : item))
      );
    } catch (err) {
      setJobsError(
        err instanceof ApiError ? err.message : 'Não foi possível atualizar o salvamento da vaga.'
      );
    } finally {
      setSavingJobId(null);
    }
  };

  // Handlers Aba Perfil
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      const updated = await userDashboardApi.atualizarPerfil({
        nome: perfilNome.trim(),
        sobrenome: perfilSobrenome.trim(),
        idade: perfilIdade === '' ? '' : Number(perfilIdade),
        sexo: perfilSexo,
      });
      setProfile(updated);
      setProfileMsg({ type: 'ok', text: 'Informações do perfil atualizadas com sucesso.' });
    } catch (err) {
      setProfileMsg({
        type: 'error',
        text: err instanceof ApiError ? err.message : 'Erro ao salvar dados do perfil.',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  // Handlers Aba Currículo
  const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResumeMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const lower = file.name.toLowerCase();
    const validExt = lower.endsWith('.pdf') || lower.endsWith('.docx');
    const validMime =
      !file.type ||
      file.type === 'application/pdf' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    if (!validExt || !validMime) {
      setResumeMsg({
        type: 'error',
        text: 'Formato inválido. Envie apenas arquivos em PDF (.pdf) ou DOCX (.docx).',
      });
      e.target.value = '';
      setSelectedResumeFile(null);
      return;
    }
    setSelectedResumeFile(file);
  };

  const handleExtractResumeAI = async () => {
    if (!selectedResumeFile) return;
    setParsingResumeAI(true);
    setResumeMsg(null);
    try {
      const extracted = await userDashboardApi.enviarArquivoCurriculoIA(selectedResumeFile);
      setResume({ ...EMPTY_RESUME, ...extracted });
      setResumeMsg({
        type: 'ok',
        text: 'Currículo processado pela IA e campos preenchidos automaticamente.',
      });
    } catch (err) {
      setResumeMsg({
        type: 'error',
        text: err instanceof ApiError ? err.message : 'Falha ao processar o currículo com a IA.',
      });
    } finally {
      setParsingResumeAI(false);
    }
  };

  const handleSaveResume = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingResume(true);
    setResumeMsg(null);
    try {
      const saved = await userDashboardApi.salvarCurriculo(resume);
      setResume({ ...EMPTY_RESUME, ...saved });
      setResumeMsg({ type: 'ok', text: 'Currículo salvo com sucesso.' });
    } catch (err) {
      setResumeMsg({
        type: 'error',
        text: err instanceof ApiError ? err.message : 'Erro ao salvar o currículo.',
      });
    } finally {
      setSavingResume(false);
    }
  };

  // Handlers Aba Configurações
  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingEmail(true);
    setSettingsMsg(null);
    try {
      const res = await userDashboardApi.alterarEmail(novoEmail.trim(), senhaParaEmail);
      const updatedEmail = res.email || novoEmail.trim();
      setProfile((prev) => (prev ? { ...prev, email: updatedEmail } : prev));
      setNovoEmail('');
      setSenhaParaEmail('');
      setSettingsMsg({ type: 'ok', text: 'E-mail alterado com sucesso.' });
    } catch (err) {
      setSettingsMsg({
        type: 'error',
        text: err instanceof ApiError ? err.message : 'Erro ao alterar e-mail.',
      });
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsMsg(null);
    if (novaSenha !== confirmarNovaSenha) {
      setSettingsMsg({ type: 'error', text: 'A nova senha e a confirmação não coincidem.' });
      return;
    }
    setLoadingSenha(true);
    try {
      await userDashboardApi.alterarSenha(senhaAtual, novaSenha);
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarNovaSenha('');
      setSettingsMsg({ type: 'ok', text: 'Senha alterada com sucesso.' });
    } catch (err) {
      setSettingsMsg({
        type: 'error',
        text: err instanceof ApiError ? err.message : 'Erro ao alterar a senha.',
      });
    } finally {
      setLoadingSenha(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsMsg(null);
    if (confirmacaoExclusao !== 'EXCLUIR') {
      setSettingsMsg({
        type: 'error',
        text: 'Digite EXCLUIR em letras maiúsculas para confirmar a exclusão permanente.',
      });
      return;
    }
    setLoadingDelete(true);
    try {
      await userDashboardApi.excluirConta(senhaExclusao);
      handleLoggedOut();
    } catch (err) {
      setSettingsMsg({
        type: 'error',
        text: err instanceof ApiError ? err.message : 'Erro ao excluir a conta.',
      });
    } finally {
      setLoadingDelete(false);
    }
  };

  const formatModalidade = (mod: JobListing['modalidade']) => {
    if (mod === 'remoto') return 'Remoto';
    if (mod === 'presencial') return 'Presencial';
    return 'Híbrido';
  };

  const vagasExibidas = jobsSubView === 'recomendadas' ? aiJobs : appliedJobs;

  return (
    <div className={`ud-app ${theme === 'light' ? 'light' : ''}`}>
      <style>{USER_DASHBOARD_CSS}</style>

      {/* SIDEBAR FIXA */}
      <aside className="ud-sidebar">
        <div className="ud-sidebar-top">
          <div className="ud-brand-header">
            <div className="ud-brand-icon">
              <i className="fa-solid fa-layer-group"></i>
            </div>
            <div className="ud-brand-title">
              <h2>Painel do Candidato</h2>
              <span>AI Job Matching</span>
            </div>
          </div>

          <nav className="ud-nav-menu" aria-label="Navegação do Painel">
            <span className="ud-nav-label">Menu Principal</span>

            <button
              type="button"
              className={`ud-nav-item ${activeTab === 'vagas' ? 'active' : ''}`}
              onClick={() => setActiveTab('vagas')}
            >
              <i className="fa-solid fa-briefcase"></i>
              <span>Vagas</span>
            </button>

            <button
              type="button"
              className={`ud-nav-item ${activeTab === 'perfil' ? 'active' : ''}`}
              onClick={() => setActiveTab('perfil')}
            >
              <i className="fa-solid fa-user"></i>
              <span>Perfil</span>
            </button>

            <button
              type="button"
              className={`ud-nav-item ${activeTab === 'curriculo' ? 'active' : ''}`}
              onClick={() => setActiveTab('curriculo')}
            >
              <i className="fa-solid fa-file-lines"></i>
              <span>Currículo</span>
            </button>

            <button
              type="button"
              className={`ud-nav-item ${activeTab === 'configuracoes' ? 'active' : ''}`}
              onClick={() => setActiveTab('configuracoes')}
            >
              <i className="fa-solid fa-gear"></i>
              <span>Configurações</span>
            </button>
          </nav>
        </div>

        <div className="ud-sidebar-bottom">
          <span className="ud-nav-label" style={{ paddingLeft: 4 }}>
            Cota & Sessão
          </span>
          <button type="button" className="ud-btn-outline" onClick={() => handleOpenPlans(false)}>
            <i className="fa-solid fa-bolt" style={{ color: '#3b82f6' }}></i>
            <span>
              Ampliar Limite ({restantes}/{limiteTotal})
            </span>
          </button>

          <button
            type="button"
            className="ud-btn-outline danger"
            onClick={async () => {
              try {
                await userDashboardApi.logout();
              } finally {
                handleLoggedOut();
              }
            }}
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Sair da Conta</span>
          </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="ud-main">
        <header className="ud-header">
          <div className="ud-header-context">
            <h1>{currentMeta.title}</h1>
            <p>{currentMeta.subtitle}</p>
          </div>

          <div className="ud-header-controls">
            <span className={`ud-badge ${restantes > 0 ? 'ud-badge-blue' : 'ud-badge-warn'}`}>
              <i className="fa-solid fa-magnifying-glass"></i> {restantes}/{limiteTotal} buscas hoje
            </span>

            <button
              type="button"
              className="ud-btn-secondary"
              onClick={() => handleOpenPlans(false)}
            >
              <i className="fa-solid fa-crown"></i> Planos
            </button>

            <button
              type="button"
              className={`ud-theme-switch ${theme === 'light' ? 'light' : ''}`}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Alternar modo claro e escuro"
              aria-label="Alternar modo claro e escuro"
            >
              <span className="ud-theme-indicator">
                <i className={theme === 'dark' ? 'fa-solid fa-cloud-moon' : 'fa-solid fa-sun'}></i>
              </span>
            </button>
          </div>
        </header>

        {/* Faixa de Resumo */}
        <section className="ud-telemetry-strip">
          <div className="ud-telemetry-item">
            <span>Candidato</span>
            <strong>{profile ? `${profile.nome} ${profile.sobrenome}`.trim() || '--' : '--'}</strong>
          </div>
          <div className="ud-telemetry-item">
            <span>Limite Diário de Busca</span>
            <strong>{limiteTotal} vagas / dia</strong>
          </div>
          <div className="ud-telemetry-item">
            <span>Vagas Salvas</span>
            <strong>{aiJobs.filter((j) => j.salva).length}</strong>
          </div>
          <div className="ud-telemetry-item">
            <span>Candidaturas Realizadas</span>
            <strong>{appliedJobs.length}</strong>
          </div>
        </section>

        {/* ================================================================
            ABA 1: VAGAS
            ================================================================ */}
        {activeTab === 'vagas' && (
          <>
            <div className="ud-metrics-grid">
              <div className="ud-metric-card">
                <i className="fa-solid fa-wand-magic-sparkles" style={{ color: 'cornflowerblue' }}></i>
                <div>
                  <h2>{aiJobs.length}</h2>
                  <p>Selecionadas pela IA</p>
                </div>
              </div>
              <div className="ud-metric-card">
                <i className="fa-solid fa-paper-plane" style={{ color: 'chartreuse' }}></i>
                <div>
                  <h2>{appliedJobs.length}</h2>
                  <p>Já candidatadas</p>
                </div>
              </div>
              <div className="ud-metric-card">
                <i className="fa-solid fa-bookmark" style={{ color: '#d4c4a8' }}></i>
                <div>
                  <h2>{aiJobs.filter((j) => j.salva).length}</h2>
                  <p>Vagas salvas</p>
                </div>
              </div>
              <div className="ud-metric-card">
                <i
                  className="fa-solid fa-gauge-high"
                  style={{ color: limiteEsgotado ? 'crimson' : 'yellow' }}
                ></i>
                <div>
                  <h2>
                    {restantes}/{limiteTotal}
                  </h2>
                  <p>Buscas restantes hoje</p>
                </div>
              </div>
            </div>

            {limiteEsgotado && (
              <div className="ud-alert warn">
                <span>
                  <i className="fa-solid fa-triangle-exclamation"></i> Limite diário de{' '}
                  {limiteTotal} vagas atingido. Amplie sua cota para continuar procurando hoje.
                </span>
                <button type="button" className="ud-btn-primary" onClick={() => handleOpenPlans(true)}>
                  <i className="fa-solid fa-bolt"></i> Ver Planos de Ampliação
                </button>
              </div>
            )}

            {jobsError && (
              <div className="ud-alert error">
                <span>
                  <i className="fa-solid fa-circle-exclamation"></i> {jobsError}
                </span>
              </div>
            )}

            {/* Formulário de Filtro (inclui valores além do currículo: remoto, presencial, híbrido) */}
            <div className="ud-panel">
              <div className="ud-panel-header">
                <h3>
                  <i className="fa-solid fa-filter"></i> Filtro de Busca de Vagas
                </h3>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span className="ud-badge ud-badge-neutral">
                    Cota diária: {consumidas} de {limiteTotal} utilizadas
                  </span>
                  <button
                    type="button"
                    className="ud-btn-secondary"
                    onClick={() => handleOpenPlans(false)}
                  >
                    <i className="fa-solid fa-crown"></i> Planos
                  </button>
                </div>
              </div>

              <form onSubmit={handleFilterJobs} className="ud-form-grid">
                <div className="ud-form-group">
                  <label htmlFor="filtro-palavra">Cargo ou Palavra-chave</label>
                  <input
                    id="filtro-palavra"
                    type="text"
                    className="ud-input"
                    placeholder="Ex: Desenvolvedor Python, Backend..."
                    value={filters.palavraChave}
                    onChange={(e) => setFilters({ ...filters, palavraChave: e.target.value })}
                  />
                </div>

                <div className="ud-form-group">
                  <label htmlFor="filtro-modalidade">Modalidade de Trabalho</label>
                  <select
                    id="filtro-modalidade"
                    className="ud-select"
                    value={filters.modalidade}
                    onChange={(e) =>
                      setFilters({ ...filters, modalidade: e.target.value as WorkModality })
                    }
                  >
                    <option value="todos">Todas as modalidades</option>
                    <option value="remoto">Remoto</option>
                    <option value="presencial">Presencial</option>
                    <option value="hibrido">Híbrido</option>
                  </select>
                </div>

                <div className="ud-form-group">
                  <label htmlFor="filtro-local">Cidade / Estado / País</label>
                  <input
                    id="filtro-local"
                    type="text"
                    className="ud-input"
                    placeholder="Ex: São Paulo, Brasil, Remoto Global"
                    value={filters.localizacao}
                    onChange={(e) => setFilters({ ...filters, localizacao: e.target.value })}
                  />
                </div>

                <div className="ud-form-group">
                  <label htmlFor="filtro-contrato">Tipo de Contratação</label>
                  <select
                    id="filtro-contrato"
                    className="ud-select"
                    value={filters.tipoContrato}
                    onChange={(e) => setFilters({ ...filters, tipoContrato: e.target.value })}
                  >
                    <option value="">Qualquer formato</option>
                    <option value="clt">CLT</option>
                    <option value="pj">PJ</option>
                    <option value="estagio">Estágio</option>
                    <option value="freelance">Freelance / Temporário</option>
                  </select>
                </div>

                <div className="ud-form-group">
                  <label htmlFor="filtro-aderencia">Aderência Mínima (%)</label>
                  <input
                    id="filtro-aderencia"
                    type="number"
                    min={0}
                    max={100}
                    className="ud-input"
                    value={filters.aderenciaMinima}
                    onChange={(e) =>
                      setFilters({ ...filters, aderenciaMinima: Number(e.target.value) || 0 })
                    }
                  />
                </div>

                <div className="ud-form-group">
                  <button type="submit" className="ud-btn-primary" disabled={searchingJobs}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                    {searchingJobs ? 'Buscando...' : 'Buscar Vagas'}
                  </button>
                </div>
              </form>
            </div>

            {/* Listagem: Selecionadas pela IA vs Já Candidatadas */}
            <div className="ud-panel">
              <div className="ud-panel-header">
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className={
                      jobsSubView === 'recomendadas' ? 'ud-btn-primary' : 'ud-btn-secondary'
                    }
                    onClick={() => setJobsSubView('recomendadas')}
                  >
                    <i className="fa-solid fa-robot"></i> Selecionadas pela IA ({aiJobs.length})
                  </button>
                  <button
                    type="button"
                    className={
                      jobsSubView === 'candidatadas' ? 'ud-btn-primary' : 'ud-btn-secondary'
                    }
                    onClick={() => setJobsSubView('candidatadas')}
                  >
                    <i className="fa-solid fa-circle-check"></i> Já Candidatadas (
                    {appliedJobs.length})
                  </button>
                </div>
              </div>

              {loadingInitial ? (
                <p style={{ padding: '24px 0', textAlign: 'center' }}>
                  Carregando vagas sincronizadas com o servidor...
                </p>
              ) : vagasExibidas.length === 0 ? (
                <p style={{ padding: '24px 0', textAlign: 'center' }}>
                  {jobsSubView === 'recomendadas'
                    ? 'Nenhuma vaga selecionada pela IA encontrada para os critérios atuais.'
                    : 'Você ainda não possui candidaturas registradas.'}
                </p>
              ) : (
                <div className="ud-jobs-grid">
                  {vagasExibidas.map((job) => (
                    <article key={job.id} className="ud-job-card">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div className="ud-job-top">
                          <div>
                            <h4 style={{ fontSize: 16 }}>{job.titulo}</h4>
                            <span style={{ fontSize: 13, color: '#888888' }}>{job.empresa}</span>
                          </div>
                          <span
                            className={`ud-badge ${
                              job.aderenciaPercentual >= 80
                                ? 'ud-badge-ok'
                                : job.aderenciaPercentual >= 50
                                ? 'ud-badge-blue'
                                : 'ud-badge-warn'
                            }`}
                          >
                            {job.aderenciaPercentual}% de aderência
                          </span>
                        </div>

                        <div className="ud-adherence-bar">
                          <div
                            className="ud-adherence-fill"
                            style={{
                              width: `${Math.min(100, Math.max(0, job.aderenciaPercentual))}%`,
                            }}
                          />
                        </div>

                        <div className="ud-job-meta">
                          <span className="ud-badge ud-badge-neutral">
                            <i className="fa-solid fa-location-dot"></i>{' '}
                            {formatModalidade(job.modalidade)}
                          </span>
                          {job.localizacao && <span>• {job.localizacao}</span>}
                          {job.tipoContrato && <span>• {job.tipoContrato}</span>}
                          {job.salario && <span>• {job.salario}</span>}
                        </div>

                        {job.resumo && <p style={{ fontSize: 13, lineHeight: 1.45 }}>{job.resumo}</p>}

                        {jobsSubView === 'candidatadas' && job.dataCandidatura && (
                          <span className="ud-badge ud-badge-ok" style={{ alignSelf: 'flex-start' }}>
                            Candidatura enviada em {job.dataCandidatura}
                          </span>
                        )}
                      </div>

                      <div className="ud-job-actions">
                        {jobsSubView === 'recomendadas' && (
                          <button
                            type="button"
                            className={`ud-btn-secondary ${job.salva ? 'saved' : ''}`}
                            disabled={savingJobId === job.id}
                            onClick={() => handleToggleSaveJob(job)}
                          >
                            <i
                              className={
                                job.salva ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark'
                              }
                            ></i>
                            {job.salva ? 'Remover dos Salvos' : 'Salvar Vaga'}
                          </button>
                        )}

                        <a
                          href={job.urlVaga}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ud-btn-primary"
                          style={{ flex: 1 }}
                        >
                          <i className="fa-solid fa-arrow-up-right-from-square"></i> Acessar Vaga
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ================================================================
            ABA 2: PERFIL DO USUÁRIO (SEM FOTO DE PERFIL E COM E-MAIL BLOQUEADO)
            ================================================================ */}
        {activeTab === 'perfil' && (
          <div className="ud-panel">
            <div className="ud-panel-header">
              <h3>
                <i className="fa-solid fa-user"></i> Dados Pessoais do Usuário
              </h3>
              <span className="ud-badge ud-badge-neutral">
                <i className="fa-solid fa-lock"></i> Alteração de e-mail disponível em Configurações
              </span>
            </div>

            {profileMsg && (
              <div className={`ud-alert ${profileMsg.type}`}>
                <span>{profileMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="ud-form-grid">
              <div className="ud-form-group">
                <label htmlFor="perfil-nome">Nome</label>
                <input
                  id="perfil-nome"
                  type="text"
                  className="ud-input"
                  required
                  value={perfilNome}
                  onChange={(e) => setPerfilNome(e.target.value)}
                />
              </div>

              <div className="ud-form-group">
                <label htmlFor="perfil-sobrenome">Sobrenome</label>
                <input
                  id="perfil-sobrenome"
                  type="text"
                  className="ud-input"
                  required
                  value={perfilSobrenome}
                  onChange={(e) => setPerfilSobrenome(e.target.value)}
                />
              </div>

              <div className="ud-form-group">
                <label htmlFor="perfil-idade">Idade</label>
                <input
                  id="perfil-idade"
                  type="number"
                  min={14}
                  max={120}
                  className="ud-input"
                  value={perfilIdade}
                  onChange={(e) =>
                    setPerfilIdade(e.target.value === '' ? '' : Number(e.target.value))
                  }
                />
              </div>

              <div className="ud-form-group">
                <label htmlFor="perfil-sexo">Sexo</label>
                <select
                  id="perfil-sexo"
                  className="ud-select"
                  value={perfilSexo}
                  onChange={(e) => setPerfilSexo(e.target.value as UserSex)}
                >
                  <option value="">Selecione...</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="outro">Outro</option>
                  <option value="prefiro_nao_informar">Prefiro não informar</option>
                </select>
              </div>

              <div className="ud-form-group" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="perfil-email">E-mail (Bloqueado para alteração nesta aba)</label>
                <input
                  id="perfil-email"
                  type="email"
                  className="ud-input"
                  value={profile?.email || ''}
                  disabled
                  readOnly
                  aria-readonly="true"
                />
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="ud-btn-primary" disabled={savingProfile}>
                  <i className="fa-solid fa-floppy-disk"></i>
                  {savingProfile ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================================================================
            ABA 3: CURRÍCULO (UPLOAD PDF/DOCX + IA + CAMPOS MANUAIS)
            ================================================================ */}
        {activeTab === 'curriculo' && (
          <form
            onSubmit={handleSaveResume}
            style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
          >
            {resumeMsg && (
              <div className={`ud-alert ${resumeMsg.type}`}>
                <span>{resumeMsg.text}</span>
              </div>
            )}

            <div className="ud-panel">
              <div className="ud-panel-header">
                <h3>
                  <i className="fa-solid fa-file-arrow-up"></i> Documento do Currículo (PDF ou DOCX)
                </h3>
                {resume.arquivoNome && (
                  <span className="ud-badge ud-badge-blue">
                    Arquivo atual: {resume.arquivoNome}
                  </span>
                )}
              </div>

              <div className="ud-form-grid">
                <div className="ud-form-group" style={{ gridColumn: 'span 2' }}>
                  <label htmlFor="curriculo-arquivo">Selecionar arquivo (.pdf ou .docx)</label>
                  <input
                    id="curriculo-arquivo"
                    type="file"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="ud-input"
                    style={{ paddingTop: 8 }}
                    onChange={handleResumeFileChange}
                  />
                </div>

                <div className="ud-form-group">
                  <button
                    type="button"
                    className="ud-btn-primary"
                    disabled={!selectedResumeFile || parsingResumeAI}
                    onClick={handleExtractResumeAI}
                  >
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                    {parsingResumeAI ? 'Extraindo com IA...' : 'Preencher Campos via IA'}
                  </button>
                </div>
              </div>
            </div>

            <div className="ud-panel">
              <div className="ud-panel-header">
                <h3>
                  <i className="fa-solid fa-align-left"></i> Sobre
                </h3>
              </div>
              <div className="ud-form-group">
                <label htmlFor="cv-sobre">Resumo Profissional</label>
                <textarea
                  id="cv-sobre"
                  className="ud-textarea"
                  placeholder="Descreva sua trajetória, objetivos e principais competências..."
                  value={resume.sobre}
                  onChange={(e) => setResume({ ...resume, sobre: e.target.value })}
                />
              </div>
            </div>

            <div className="ud-panel">
              <div className="ud-panel-header">
                <h3>
                  <i className="fa-solid fa-briefcase"></i> Experiências Profissionais
                </h3>
                <button
                  type="button"
                  className="ud-btn-secondary"
                  onClick={() =>
                    setResume({
                      ...resume,
                      experiencias: [
                        ...resume.experiencias,
                        { id: generateItemId(), cargo: '', empresa: '', periodo: '', descricao: '' },
                      ],
                    })
                  }
                >
                  <i className="fa-solid fa-plus"></i> Adicionar Experiência
                </button>
              </div>

              {resume.experiencias.map((exp, idx) => (
                <div
                  key={exp.id}
                  className="ud-form-grid"
                  style={{ paddingBottom: 12, borderBottom: '1px solid #222222' }}
                >
                  <div className="ud-form-group">
                    <label>Cargo</label>
                    <input
                      type="text"
                      className="ud-input"
                      value={exp.cargo}
                      onChange={(e) => {
                        const next = [...resume.experiencias];
                        next[idx] = { ...exp, cargo: e.target.value };
                        setResume({ ...resume, experiencias: next });
                      }}
                    />
                  </div>
                  <div className="ud-form-group">
                    <label>Empresa</label>
                    <input
                      type="text"
                      className="ud-input"
                      value={exp.empresa}
                      onChange={(e) => {
                        const next = [...resume.experiencias];
                        next[idx] = { ...exp, empresa: e.target.value };
                        setResume({ ...resume, experiencias: next });
                      }}
                    />
                  </div>
                  <div className="ud-form-group">
                    <label>Período</label>
                    <input
                      type="text"
                      className="ud-input"
                      placeholder="Ex: Jan 2025 - Atual"
                      value={exp.periodo}
                      onChange={(e) => {
                        const next = [...resume.experiencias];
                        next[idx] = { ...exp, periodo: e.target.value };
                        setResume({ ...resume, experiencias: next });
                      }}
                    />
                  </div>
                  <div className="ud-form-group">
                    <button
                      type="button"
                      className="ud-btn-danger"
                      onClick={() =>
                        setResume({
                          ...resume,
                          experiencias: resume.experiencias.filter((item) => item.id !== exp.id),
                        })
                      }
                    >
                      <i className="fa-solid fa-trash"></i> Remover
                    </button>
                  </div>
                  <div className="ud-form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Atividades e Resultados</label>
                    <textarea
                      className="ud-textarea"
                      value={exp.descricao}
                      onChange={(e) => {
                        const next = [...resume.experiencias];
                        next[idx] = { ...exp, descricao: e.target.value };
                        setResume({ ...resume, experiencias: next });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="ud-panel">
              <div className="ud-panel-header">
                <h3>
                  <i className="fa-solid fa-code-branch"></i> Projetos Pessoais
                </h3>
                <button
                  type="button"
                  className="ud-btn-secondary"
                  onClick={() =>
                    setResume({
                      ...resume,
                      projetosPessoais: [
                        ...resume.projetosPessoais,
                        {
                          id: generateItemId(),
                          nome: '',
                          tecnologias: '',
                          link: '',
                          descricao: '',
                        },
                      ],
                    })
                  }
                >
                  <i className="fa-solid fa-plus"></i> Adicionar Projeto
                </button>
              </div>

              {resume.projetosPessoais.map((proj, idx) => (
                <div
                  key={proj.id}
                  className="ud-form-grid"
                  style={{ paddingBottom: 12, borderBottom: '1px solid #222222' }}
                >
                  <div className="ud-form-group">
                    <label>Nome do Projeto</label>
                    <input
                      type="text"
                      className="ud-input"
                      value={proj.nome}
                      onChange={(e) => {
                        const next = [...resume.projetosPessoais];
                        next[idx] = { ...proj, nome: e.target.value };
                        setResume({ ...resume, projetosPessoais: next });
                      }}
                    />
                  </div>
                  <div className="ud-form-group">
                    <label>Tecnologias</label>
                    <input
                      type="text"
                      className="ud-input"
                      value={proj.tecnologias}
                      onChange={(e) => {
                        const next = [...resume.projetosPessoais];
                        next[idx] = { ...proj, tecnologias: e.target.value };
                        setResume({ ...resume, projetosPessoais: next });
                      }}
                    />
                  </div>
                  <div className="ud-form-group">
                    <label>Link / Repositório</label>
                    <input
                      type="url"
                      className="ud-input"
                      value={proj.link}
                      onChange={(e) => {
                        const next = [...resume.projetosPessoais];
                        next[idx] = { ...proj, link: e.target.value };
                        setResume({ ...resume, projetosPessoais: next });
                      }}
                    />
                  </div>
                  <div className="ud-form-group">
                    <button
                      type="button"
                      className="ud-btn-danger"
                      onClick={() =>
                        setResume({
                          ...resume,
                          projetosPessoais: resume.projetosPessoais.filter(
                            (item) => item.id !== proj.id
                          ),
                        })
                      }
                    >
                      <i className="fa-solid fa-trash"></i> Remover
                    </button>
                  </div>
                  <div className="ud-form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Descrição</label>
                    <textarea
                      className="ud-textarea"
                      value={proj.descricao}
                      onChange={(e) => {
                        const next = [...resume.projetosPessoais];
                        next[idx] = { ...proj, descricao: e.target.value };
                        setResume({ ...resume, projetosPessoais: next });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="ud-panel">
              <div className="ud-panel-header">
                <h3>
                  <i className="fa-solid fa-tags"></i> Habilidades
                </h3>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  type="text"
                  className="ud-input"
                  style={{ flex: 1 }}
                  placeholder="Digite uma habilidade e clique em Adicionar"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const trimmed = skillInput.trim();
                      if (trimmed && !resume.habilidades.includes(trimmed)) {
                        setResume({ ...resume, habilidades: [...resume.habilidades, trimmed] });
                        setSkillInput('');
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  className="ud-btn-secondary"
                  onClick={() => {
                    const trimmed = skillInput.trim();
                    if (trimmed && !resume.habilidades.includes(trimmed)) {
                      setResume({ ...resume, habilidades: [...resume.habilidades, trimmed] });
                      setSkillInput('');
                    }
                  }}
                >
                  <i className="fa-solid fa-plus"></i> Adicionar
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {resume.habilidades.map((skill) => (
                  <span key={skill} className="ud-badge ud-badge-blue">
                    {skill}
                    <button
                      type="button"
                      onClick={() =>
                        setResume({
                          ...resume,
                          habilidades: resume.habilidades.filter((s) => s !== skill),
                        })
                      }
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'inherit',
                        cursor: 'pointer',
                      }}
                      aria-label={`Remover ${skill}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="ud-panel">
              <div className="ud-panel-header">
                <h3>
                  <i className="fa-solid fa-language"></i> Idiomas e Nível
                </h3>
                <button
                  type="button"
                  className="ud-btn-secondary"
                  onClick={() =>
                    setResume({
                      ...resume,
                      idiomas: [
                        ...resume.idiomas,
                        { id: generateItemId(), idioma: '', nivel: 'intermediario' },
                      ],
                    })
                  }
                >
                  <i className="fa-solid fa-plus"></i> Adicionar Idioma
                </button>
              </div>

              {resume.idiomas.map((lang, idx) => (
                <div key={lang.id} className="ud-form-grid">
                  <div className="ud-form-group">
                    <label>Idioma</label>
                    <input
                      type="text"
                      className="ud-input"
                      placeholder="Ex: Inglês, Espanhol"
                      value={lang.idioma}
                      onChange={(e) => {
                        const next = [...resume.idiomas];
                        next[idx] = { ...lang, idioma: e.target.value };
                        setResume({ ...resume, idiomas: next });
                      }}
                    />
                  </div>
                  <div className="ud-form-group">
                    <label>Nível</label>
                    <select
                      className="ud-select"
                      value={lang.nivel}
                      onChange={(e) => {
                        const next = [...resume.idiomas];
                        next[idx] = {
                          ...lang,
                          nivel: e.target.value as LanguageProficiency,
                        };
                        setResume({ ...resume, idiomas: next });
                      }}
                    >
                      <option value="basico">Básico</option>
                      <option value="intermediario">Intermediário</option>
                      <option value="avancado">Avançado</option>
                      <option value="fluente">Fluente</option>
                      <option value="nativo">Nativo</option>
                    </select>
                  </div>
                  <div className="ud-form-group">
                    <button
                      type="button"
                      className="ud-btn-danger"
                      onClick={() =>
                        setResume({
                          ...resume,
                          idiomas: resume.idiomas.filter((item) => item.id !== lang.id),
                        })
                      }
                    >
                      <i className="fa-solid fa-trash"></i> Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="ud-panel">
              <div className="ud-panel-header">
                <h3>
                  <i className="fa-solid fa-graduation-cap"></i> Formações, Cursos e Certificados
                </h3>
                <button
                  type="button"
                  className="ud-btn-secondary"
                  onClick={() =>
                    setResume({
                      ...resume,
                      formacoes: [
                        ...resume.formacoes,
                        {
                          id: generateItemId(),
                          tipo: 'faculdade',
                          titulo: '',
                          instituicao: '',
                          periodo: '',
                        },
                      ],
                    })
                  }
                >
                  <i className="fa-solid fa-plus"></i> Adicionar Formação
                </button>
              </div>

              {resume.formacoes.map((edu, idx) => (
                <div key={edu.id} className="ud-form-grid">
                  <div className="ud-form-group">
                    <label>Tipo</label>
                    <select
                      className="ud-select"
                      value={edu.tipo}
                      onChange={(e) => {
                        const next = [...resume.formacoes];
                        next[idx] = { ...edu, tipo: e.target.value as EducationItem['tipo'] };
                        setResume({ ...resume, formacoes: next });
                      }}
                    >
                      <option value="faculdade">Faculdade / Graduação</option>
                      <option value="curso">Curso</option>
                      <option value="certificado">Certificado</option>
                    </select>
                  </div>
                  <div className="ud-form-group">
                    <label>Título / Curso</label>
                    <input
                      type="text"
                      className="ud-input"
                      value={edu.titulo}
                      onChange={(e) => {
                        const next = [...resume.formacoes];
                        next[idx] = { ...edu, titulo: e.target.value };
                        setResume({ ...resume, formacoes: next });
                      }}
                    />
                  </div>
                  <div className="ud-form-group">
                    <label>Instituição</label>
                    <input
                      type="text"
                      className="ud-input"
                      value={edu.instituicao}
                      onChange={(e) => {
                        const next = [...resume.formacoes];
                        next[idx] = { ...edu, instituicao: e.target.value };
                        setResume({ ...resume, formacoes: next });
                      }}
                    />
                  </div>
                  <div className="ud-form-group">
                    <label>Período / Conclusão</label>
                    <input
                      type="text"
                      className="ud-input"
                      value={edu.periodo}
                      onChange={(e) => {
                        const next = [...resume.formacoes];
                        next[idx] = { ...edu, periodo: e.target.value };
                        setResume({ ...resume, formacoes: next });
                      }}
                    />
                  </div>
                  <div className="ud-form-group">
                    <button
                      type="button"
                      className="ud-btn-danger"
                      onClick={() =>
                        setResume({
                          ...resume,
                          formacoes: resume.formacoes.filter((item) => item.id !== edu.id),
                        })
                      }
                    >
                      <i className="fa-solid fa-trash"></i> Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="ud-btn-primary" disabled={savingResume}>
                <i className="fa-solid fa-floppy-disk"></i>
                {savingResume ? 'Salvando Currículo...' : 'Salvar Currículo Completo'}
              </button>
            </div>
          </form>
        )}

        {/* ================================================================
            ABA 4: CONFIGURAÇÕES (E-MAIL, SENHA, LOGOUT E EXCLUIR CONTA)
            ================================================================ */}
        {activeTab === 'configuracoes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {settingsMsg && (
              <div className={`ud-alert ${settingsMsg.type}`}>
                <span>{settingsMsg.text}</span>
              </div>
            )}

            <div className="ud-panel">
              <div className="ud-panel-header">
                <h3>
                  <i className="fa-solid fa-envelope"></i> Alterar E-mail
                </h3>
                <span className="ud-badge ud-badge-neutral">Atual: {profile?.email || '--'}</span>
              </div>

              <form onSubmit={handleChangeEmail} className="ud-form-grid">
                <div className="ud-form-group">
                  <label htmlFor="cfg-novo-email">Novo E-mail</label>
                  <input
                    id="cfg-novo-email"
                    type="email"
                    className="ud-input"
                    required
                    value={novoEmail}
                    onChange={(e) => setNovoEmail(e.target.value)}
                  />
                </div>
                <div className="ud-form-group">
                  <label htmlFor="cfg-senha-email">Senha Atual</label>
                  <input
                    id="cfg-senha-email"
                    type="password"
                    className="ud-input"
                    required
                    value={senhaParaEmail}
                    onChange={(e) => setSenhaParaEmail(e.target.value)}
                  />
                </div>
                <div className="ud-form-group">
                  <button type="submit" className="ud-btn-primary" disabled={loadingEmail}>
                    <i className="fa-solid fa-check"></i>
                    {loadingEmail ? 'Atualizando...' : 'Atualizar E-mail'}
                  </button>
                </div>
              </form>
            </div>

            <div className="ud-panel">
              <div className="ud-panel-header">
                <h3>
                  <i className="fa-solid fa-key"></i> Alterar Senha
                </h3>
              </div>

              <form onSubmit={handleChangePassword} className="ud-form-grid">
                <div className="ud-form-group">
                  <label htmlFor="cfg-senha-atual">Senha Atual</label>
                  <input
                    id="cfg-senha-atual"
                    type="password"
                    className="ud-input"
                    required
                    value={senhaAtual}
                    onChange={(e) => setSenhaAtual(e.target.value)}
                  />
                </div>
                <div className="ud-form-group">
                  <label htmlFor="cfg-nova-senha">Nova Senha</label>
                  <input
                    id="cfg-nova-senha"
                    type="password"
                    className="ud-input"
                    minLength={8}
                    required
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                  />
                </div>
                <div className="ud-form-group">
                  <label htmlFor="cfg-confirmar-senha">Confirmar Nova Senha</label>
                  <input
                    id="cfg-confirmar-senha"
                    type="password"
                    className="ud-input"
                    minLength={8}
                    required
                    value={confirmarNovaSenha}
                    onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                  />
                </div>
                <div className="ud-form-group">
                  <button type="submit" className="ud-btn-primary" disabled={loadingSenha}>
                    <i className="fa-solid fa-shield-halved"></i>
                    {loadingSenha ? 'Alterando...' : 'Alterar Senha'}
                  </button>
                </div>
              </form>
            </div>

            <div className="ud-panel">
              <div className="ud-panel-header">
                <h3>
                  <i className="fa-solid fa-right-from-bracket"></i> Sessão e Encerramento
                </h3>
                <button
                  type="button"
                  className="ud-btn-secondary"
                  onClick={async () => {
                    try {
                      await userDashboardApi.logout();
                    } finally {
                      handleLoggedOut();
                    }
                  }}
                >
                  <i className="fa-solid fa-right-from-bracket"></i> Fazer Logout
                </button>
              </div>
              <p style={{ fontSize: 13 }}>
                Encerre sua sessão atual neste dispositivo com segurança.
              </p>
            </div>

            <div className="ud-panel" style={{ borderColor: 'rgba(220, 20, 60, 0.45)' }}>
              <div className="ud-panel-header">
                <h3 style={{ color: '#f87171' }}>
                  <i className="fa-solid fa-user-xmark" style={{ color: '#f87171' }}></i> Excluir
                  Conta
                </h3>
              </div>
              <p style={{ fontSize: 13 }}>
                Esta ação remove permanentemente seu perfil, currículo, candidaturas e histórico de
                buscas.
              </p>

              <form onSubmit={handleDeleteAccount} className="ud-form-grid">
                <div className="ud-form-group">
                  <label htmlFor="cfg-confirmar-excluir">Digite EXCLUIR para confirmar</label>
                  <input
                    id="cfg-confirmar-excluir"
                    type="text"
                    className="ud-input"
                    placeholder="EXCLUIR"
                    required
                    value={confirmacaoExclusao}
                    onChange={(e) => setConfirmacaoExclusao(e.target.value)}
                  />
                </div>
                <div className="ud-form-group">
                  <label htmlFor="cfg-senha-excluir">Senha Atual</label>
                  <input
                    id="cfg-senha-excluir"
                    type="password"
                    className="ud-input"
                    required
                    value={senhaExclusao}
                    onChange={(e) => setSenhaExclusao(e.target.value)}
                  />
                </div>
                <div className="ud-form-group">
                  <button type="submit" className="ud-btn-danger" disabled={loadingDelete}>
                    <i className="fa-solid fa-trash-can"></i>
                    {loadingDelete ? 'Excluindo...' : 'Excluir Minha Conta'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* MODAL DE PLANOS DE AMPLIAÇÃO DE LIMITE */}
      {plansModalOpen && (
        <div
          className="ud-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="plans-modal-title"
        >
          <div className="ud-modal-card">
            <div className="ud-panel-header">
              <div>
                <h3 id="plans-modal-title">
                  <i className="fa-solid fa-bolt"></i> Planos de Ampliação de Limite Diário
                </h3>
                <p style={{ fontSize: 13, marginTop: 4 }}>
                  O limite padrão é de 50 vagas por dia. Escolha um pacote adicional para liberar
                  mais buscas imediatamente.
                </p>
              </div>
              <button
                type="button"
                className="ud-btn-secondary"
                onClick={() => setPlansModalOpen(false)}
              >
                <i className="fa-solid fa-xmark"></i> Fechar
              </button>
            </div>

            {plansLimitReached && (
              <div className="ud-alert warn">
                <span>
                  <i className="fa-solid fa-lock"></i> Você atingiu o limite diário de 50 buscas.
                  Para continuar procurando hoje, selecione um dos pacotes abaixo.
                </span>
              </div>
            )}

            {planError && (
              <div className="ud-alert error">
                <span>
                  <i className="fa-solid fa-triangle-exclamation"></i> {planError}
                </span>
              </div>
            )}

            <div className="ud-plans-grid">
              {QUOTA_PLANS.map((plan, idx) => (
                <div key={plan.id} className={`ud-plan-card ${idx === 1 ? 'featured' : ''}`}>
                  <div>
                    <span className="ud-badge ud-badge-blue">+{plan.vagasExtras} vagas</span>
                    <h4 style={{ marginTop: 12, fontSize: 16 }}>{plan.nome}</h4>
                    <div className="ud-plan-price" style={{ marginTop: 8 }}>
                      {plan.precoFormatado}
                    </div>
                    <p style={{ fontSize: 12, marginTop: 8 }}>{plan.descricao}</p>
                  </div>

                  <button
                    type="button"
                    className="ud-btn-primary"
                    disabled={loadingPlanId !== null}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    <i className="fa-solid fa-credit-card"></i>
                    {loadingPlanId === plan.id ? 'Redirecionando...' : 'Adquirir Pacote'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const UserDashboardPage = DashboardPage;
export default DashboardPage;