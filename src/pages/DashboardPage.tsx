import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Bookmark,
  BookmarkCheck,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CreditCard,
  ExternalLink,
  Home,
  Lock,
  LogOut,
  Moon,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Sun,
  Trash2,
  Upload,
  X,
} from 'lucide-react';

export type ThemeMode = 'dark' | 'light';
export type DashboardTab = 'vagas' | 'usuario' | 'curriculo' | 'configuracoes';
export type WorkModality = 'todas' | 'remoto' | 'hibrido' | 'presencial';
export type SeniorityLevel = 'todos' | 'estagio' | 'junior' | 'pleno' | 'senior';
export type LanguageProficiency =
  | 'basico'
  | 'intermediario'
  | 'avancado'
  | 'fluente_nativo';
export type ApplicationStatus =
  | 'Enviada'
  | 'Pendente'
  | 'Em análise'
  | 'Entrevista'
  | 'Recusada';

export interface JobFilters {
  keywords: string;
  modality: WorkModality;
  seniority: SeniorityLevel;
  location: string;
  onlySaved: boolean;
}

export interface RecommendedJob {
  id: string;
  title: string;
  company: string;
  modality: Exclude<WorkModality, 'todas'>;
  location?: string;
  foundAt: string;
  isNew?: boolean;
  matchPercentage: number;
  compatibilitySummary: string;
  requirements: string[];
  externalUrl: string;
  isSaved: boolean;
}

export interface JobApplication {
  id: string;
  company: string;
  roleTitle?: string;
  appliedAt: string;
  status: ApplicationStatus;
}

export interface DailyQuota {
  usedToday: number;
  dailyLimit: number;
}

export interface QuotaPackage {
  id: 'pack_50' | 'pack_75' | 'pack_100';
  extraJobs: number;
  priceBRL: number;
  formattedPrice: string;
  label: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  age: number | '';
  gender: 'masculino' | 'feminino' | 'outro' | 'prefiro_nao_informar' | '';
  email: string;
}

export interface ResumeLanguage {
  id: string;
  language: string;
  level: LanguageProficiency;
}

export interface ResumeData {
  fileName: string | null;
  fileUrl?: string | null;
  about: string;
  experiences: string;
  personalProjects: string;
  skills: string;
  languages: ResumeLanguage[];
  education: string;
}

export interface DashboardServices {
  onSearchJobs?: (filters: JobFilters) => Promise<RecommendedJob[]>;
  onToggleSaveJob?: (jobId: string, nextSavedState: boolean) => Promise<void>;
  onPurchaseQuotaPackage?: (pkg: QuotaPackage) => Promise<{ newDailyLimit: number }>;
  onUpdateProfile?: (profile: Omit<UserProfile, 'email'>) => Promise<void>;
  onUploadResumeFile?: (file: File) => Promise<{ fileName: string; fileUrl?: string }>;
  onExtractResumeWithAI?: (file?: File) => Promise<Omit<ResumeData, 'fileName' | 'fileUrl'>>;
  onSaveResumeData?: (data: ResumeData) => Promise<void>;
  onChangeEmail?: (newEmail: string, currentPassword: string) => Promise<void>;
  onChangePassword?: (currentPassword: string, newPassword: string) => Promise<void>;
  onDeleteAccount?: (confirmationText: string) => Promise<void>;
  onLogout?: () => Promise<void>;
}

export interface DashboardPageProps {
  initialProfile?: UserProfile;
  initialResume?: ResumeData;
  initialJobs?: RecommendedJob[];
  initialApplications?: JobApplication[];
  initialQuota?: DailyQuota;
  services?: DashboardServices;
}

const QUOTA_PACKAGES: QuotaPackage[] = [
  {
    id: 'pack_50',
    extraJobs: 50,
    priceBRL: 19.99,
    formattedPrice: 'R$ 19,99',
    label: '+50 vagas por dia',
  },
  {
    id: 'pack_75',
    extraJobs: 75,
    priceBRL: 39.9,
    formattedPrice: 'R$ 39,90',
    label: '+75 vagas por dia',
  },
  {
    id: 'pack_100',
    extraJobs: 100,
    priceBRL: 49.9,
    formattedPrice: 'R$ 49,90',
    label: '+100 vagas por dia',
  },
];

const EMPTY_PROFILE: UserProfile = {
  firstName: '',
  lastName: '',
  age: '',
  gender: '',
  email: '',
};

const EMPTY_RESUME: ResumeData = {
  fileName: null,
  fileUrl: null,
  about: '',
  experiences: '',
  personalProjects: '',
  skills: '',
  languages: [],
  education: '',
};

const ACCEPTED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export function DashboardPage({
  initialProfile = EMPTY_PROFILE,
  initialResume = EMPTY_RESUME,
  initialJobs = [],
  initialApplications = [],
  initialQuota = { usedToday: 0, dailyLimit: 50 },
  services,
}: DashboardPageProps) {
  const navigate = useNavigate();

  // Tema Claro / Escuro (padrão escuro conforme Anexo 2)
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const isDark = theme === 'dark';

  // Navegação por abas
  const [activeTab, setActiveTab] = useState<DashboardTab>('vagas');

  // Estados principais
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [resume, setResume] = useState<ResumeData>(initialResume);
  const [jobs, setJobs] = useState<RecommendedJob[]>(initialJobs);
  const [applications] = useState<JobApplication[]>(initialApplications);
  const [quota, setQuota] = useState<DailyQuota>(initialQuota);

  // Estados da aba Vagas
  const [filters, setFilters] = useState<JobFilters>({
    keywords: '',
    modality: 'todas',
    seniority: 'todos',
    location: '',
    onlySaved: false,
  });
  const [isSearching, setIsSearching] = useState(false);
  const [savingJobId, setSavingJobId] = useState<string | null>(null);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [showAllApplications, setShowAllApplications] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Modal de Planos e Ampliação de Limite
  const [plansModalOpen, setPlansModalOpen] = useState(false);
  const [limitExceeded, setLimitExceeded] = useState(false);
  const [purchasingPkgId, setPurchasingPkgId] = useState<string | null>(null);
  const [planError, setPlanError] = useState<string | null>(null);

  // Estados da aba Usuário (sem foto de perfil; e-mail bloqueado)
  const [firstName, setFirstName] = useState(initialProfile.firstName);
  const [lastName, setLastName] = useState(initialProfile.lastName);
  const [age, setAge] = useState<number | ''>(initialProfile.age);
  const [gender, setGender] = useState<UserProfile['gender']>(initialProfile.gender);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Estados da aba Currículo
  const [selectedResumeFile, setSelectedResumeFile] = useState<File | undefined>(undefined);
  const [extractingResume, setExtractingResume] = useState(false);
  const [savingResume, setSavingResume] = useState(false);
  const [resumeFeedback, setResumeFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Estados da aba Configurações
  const [newEmail, setNewEmail] = useState(initialProfile.email);
  const [emailPassword, setEmailPassword] = useState('');
  const [savingEmail, setSavingEmail] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteFeedback, setDeleteFeedback] = useState<string | null>(null);

  // Tokens visuais alinhados ao Anexo 2 (Dark) e alternativa Light
  const ui = {
    page: isDark ? 'bg-[#000000] text-[#f8fafc]' : 'bg-slate-100 text-slate-900',
    heroCard: isDark
      ? 'bg-[#0f172a] border-[#1e293b]'
      : 'bg-white border-slate-200 shadow-sm',
    metricCard: isDark
      ? 'bg-[#1e293b]/90 border-[#2d3b52]'
      : 'bg-slate-50 border-slate-200',
    card: isDark
      ? 'bg-[#0a0a0a] border-[#1f242d]'
      : 'bg-white border-slate-200 shadow-sm',
    divider: isDark ? 'border-[#1a1e26]' : 'border-slate-200',
    pillBtn: isDark
      ? 'bg-[#1e293b] hover:bg-[#293548] border-[#2d3b52] text-slate-200'
      : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800',
    primaryBtn:
      'bg-blue-600 hover:bg-blue-500 border-blue-500 text-white',
    dangerBtn: isDark
      ? 'bg-red-950/60 hover:bg-red-950 border-red-900/80 text-red-400'
      : 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700',
    emeraldBadge: isDark
      ? 'bg-emerald-950/90 border-emerald-800/80 text-emerald-400'
      : 'bg-emerald-50 border-emerald-200 text-emerald-700',
    amberBadge: isDark
      ? 'bg-amber-950/90 border-amber-800/80 text-amber-400'
      : 'bg-amber-50 border-amber-200 text-amber-700',
    input: isDark
      ? 'bg-[#0d1117] border-[#262c36] text-slate-100 placeholder:text-slate-500 focus:border-blue-500'
      : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600',
    subText: isDark ? 'text-slate-400' : 'text-slate-600',
    mutedText: isDark ? 'text-slate-500' : 'text-slate-500',
  };

  // Métricas superiores
  const foundCount = jobs.length;
  const compatibleCount = jobs.filter((job) => job.matchPercentage >= 70).length;
  const applicationsCount = applications.length;
  const remainingDailyQuota = Math.max(0, quota.dailyLimit - quota.usedToday);

  // Handlers de navegação e sessão
  const handleLogout = async () => {
    if (services?.onLogout) {
      await services.onLogout();
    }
    navigate('/login');
  };

  // Busca de vagas com controle de limite diário (50 vagas/dia)
  const executeJobSearch = async () => {
    setSearchError(null);

    if (quota.usedToday >= quota.dailyLimit) {
      setLimitExceeded(true);
      setPlansModalOpen(true);
      return;
    }

    if (!services?.onSearchJobs) {
      setSearchError('Serviço de busca de vagas não conectado à API.');
      return;
    }

    setIsSearching(true);
    try {
      const results = await services.onSearchJobs(filters);
      const availableSlots = Math.max(0, quota.dailyLimit - quota.usedToday);
      const allowedResults = results.slice(0, availableSlots);

      setJobs(allowedResults);
      const nextUsed = Math.min(quota.dailyLimit, quota.usedToday + allowedResults.length);
      setQuota((prev) => ({ ...prev, usedToday: nextUsed }));

      if (results.length > availableSlots || nextUsed >= quota.dailyLimit) {
        setLimitExceeded(true);
        setPlansModalOpen(true);
      }
    } catch (err) {
      setSearchError(
        err instanceof Error ? err.message : 'Erro ao buscar vagas recomendadas pela IA.'
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleFilterSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void executeJobSearch();
  };

  const handleToggleSaveJob = async (job: RecommendedJob) => {
    const nextSaved = !job.isSaved;
    setSavingJobId(job.id);
    try {
      if (services?.onToggleSaveJob) {
        await services.onToggleSaveJob(job.id, nextSaved);
      }
      setJobs((prev) =>
        prev.map((item) => (item.id === job.id ? { ...item, isSaved: nextSaved } : item))
      );
    } finally {
      setSavingJobId(null);
    }
  };

  const handlePurchasePackage = async (pkg: QuotaPackage) => {
    setPlanError(null);
    setPurchasingPkgId(pkg.id);
    try {
      if (services?.onPurchaseQuotaPackage) {
        const { newDailyLimit } = await services.onPurchaseQuotaPackage(pkg);
        setQuota((prev) => ({ ...prev, dailyLimit: newDailyLimit }));
      } else {
        setQuota((prev) => ({ ...prev, dailyLimit: prev.dailyLimit + pkg.extraJobs }));
      }
      setLimitExceeded(false);
      setPlansModalOpen(false);
    } catch (err) {
      setPlanError(
        err instanceof Error ? err.message : 'Não foi possível concluir o pagamento do pacote.'
      );
    } finally {
      setPurchasingPkgId(null);
    }
  };

  // Handlers Aba Usuário
  const handleSaveProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileFeedback(null);
    setSavingProfile(true);
    try {
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        age,
        gender,
      };
      if (services?.onUpdateProfile) {
        await services.onUpdateProfile(payload);
      }
      setProfile((prev) => ({ ...prev, ...payload }));
      setProfileFeedback({ type: 'success', text: 'Informações do perfil salvas com sucesso.' });
    } catch (err) {
      setProfileFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Erro ao atualizar informações do perfil.',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  // Handlers Aba Currículo
  const handleResumeFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const lower = file.name.toLowerCase();
    const validExt = lower.endsWith('.pdf') || lower.endsWith('.docx');
    const validMime = ACCEPTED_MIME_TYPES.includes(file.type) || validExt;

    if (!validMime) {
      setResumeFeedback({
        type: 'error',
        text: 'Formato inválido. Selecione apenas arquivos PDF ou DOCX.',
      });
      e.target.value = '';
      return;
    }

    setResumeFeedback(null);
    setSelectedResumeFile(file);

    try {
      if (services?.onUploadResumeFile) {
        const uploaded = await services.onUploadResumeFile(file);
        setResume((prev) => ({
          ...prev,
          fileName: uploaded.fileName,
          fileUrl: uploaded.fileUrl ?? prev.fileUrl,
        }));
      } else {
        setResume((prev) => ({ ...prev, fileName: file.name }));
      }
      setResumeFeedback({
        type: 'success',
        text: `Documento "${file.name}" carregado com sucesso.`,
      });
    } catch (err) {
      setResumeFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Falha ao enviar o currículo.',
      });
    }
  };

  const handleExtractResumeAI = async () => {
    if (!services?.onExtractResumeWithAI) {
      setResumeFeedback({
        type: 'error',
        text: 'Serviço de extração de currículo por IA não conectado.',
      });
      return;
    }

    setResumeFeedback(null);
    setExtractingResume(true);
    try {
      const extracted = await services.onExtractResumeWithAI(selectedResumeFile);
      setResume((prev) => ({ ...prev, ...extracted }));
      setResumeFeedback({
        type: 'success',
        text: 'Campos preenchidos automaticamente pela inteligência artificial.',
      });
    } catch (err) {
      setResumeFeedback({
        type: 'error',
        text:
          err instanceof Error
            ? err.message
            : 'Não foi possível extrair os dados do currículo com IA.',
      });
    } finally {
      setExtractingResume(false);
    }
  };

  const handleAddLanguage = () => {
    setResume((prev) => ({
      ...prev,
      languages: [
        ...prev.languages,
        { id: `lang_${Date.now()}`, language: '', level: 'intermediario' },
      ],
    }));
  };

  const handleUpdateLanguage = (
    id: string,
    field: 'language' | 'level',
    value: string
  ) => {
    setResume((prev) => ({
      ...prev,
      languages: prev.languages.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleRemoveLanguage = (id: string) => {
    setResume((prev) => ({
      ...prev,
      languages: prev.languages.filter((item) => item.id !== id),
    }));
  };

  const handleSaveResume = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResumeFeedback(null);
    setSavingResume(true);
    try {
      if (services?.onSaveResumeData) {
        await services.onSaveResumeData(resume);
      }
      setResumeFeedback({ type: 'success', text: 'Currículo atualizado com sucesso.' });
    } catch (err) {
      setResumeFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Erro ao salvar dados do currículo.',
      });
    } finally {
      setSavingResume(false);
    }
  };

  // Handlers Aba Configurações
  const handleChangeEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailFeedback(null);
    setSavingEmail(true);
    try {
      if (services?.onChangeEmail) {
        await services.onChangeEmail(newEmail.trim(), emailPassword);
      }
      setProfile((prev) => ({ ...prev, email: newEmail.trim() }));
      setEmailPassword('');
      setEmailFeedback({ type: 'success', text: 'E-mail atualizado com sucesso.' });
    } catch (err) {
      setEmailFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Erro ao alterar o e-mail.',
      });
    } finally {
      setSavingEmail(false);
    }
  };

  const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordFeedback(null);
    if (newPassword !== confirmPassword) {
      setPasswordFeedback({
        type: 'error',
        text: 'A nova senha e a confirmação não coincidem.',
      });
      return;
    }
    setSavingPassword(true);
    try {
      if (services?.onChangePassword) {
        await services.onChangePassword(currentPassword, newPassword);
      }
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordFeedback({ type: 'success', text: 'Senha alterada com sucesso.' });
    } catch (err) {
      setPasswordFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Erro ao alterar a senha.',
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteAccount = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDeleteFeedback(null);
    if (deleteConfirmText !== 'EXCLUIR') {
      setDeleteFeedback('Digite EXCLUIR em letras maiúsculas para confirmar a exclusão.');
      return;
    }
    setDeletingAccount(true);
    try {
      if (services?.onDeleteAccount) {
        await services.onDeleteAccount(deleteConfirmText);
      }
      navigate('/');
    } catch (err) {
      setDeleteFeedback(
        err instanceof Error ? err.message : 'Não foi possível excluir a conta.'
      );
      setDeletingAccount(false);
    }
  };

  const visibleJobs = filters.onlySaved ? jobs.filter((job) => job.isSaved) : jobs;
  const visibleApplications = showAllApplications ? applications : applications.slice(0, 5);

  const modalityLabel: Record<RecommendedJob['modality'], string> = {
    remoto: 'Remoto',
    hibrido: 'Híbrida',
    presencial: 'Presencial',
  };

  const tabs: { id: DashboardTab; label: string }[] = [
    { id: 'vagas', label: 'Vagas' },
    { id: 'usuario', label: 'Usuário' },
    { id: 'curriculo', label: 'Currículo' },
    { id: 'configuracoes', label: 'Configurações' },
  ];

  return (
    <div className={`min-h-screen px-4 py-7 sm:px-6 transition-colors duration-200 ${ui.page}`}>
      <div className="mx-auto flex max-w-[920px] flex-col gap-7">
        {/* Card Superior Principal (Fiel ao Anexo 2) */}
        <header className={`rounded-2xl border p-5 sm:p-6 transition-colors ${ui.heroCard}`}>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <div className="flex items-center gap-2.5">
                <Bot className="h-5 w-5 text-blue-500" />
                <h1 className="text-lg font-bold tracking-tight">JobHunter AI</h1>
              </div>
              <p className={`mt-1 text-sm ${ui.subText}`}>
                Painel pessoal de oportunidades e candidaturas
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/')}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${ui.pillBtn}`}
              >
                <Home className="h-3.5 w-3.5" />
                Início
              </button>

              <button
                type="button"
                onClick={() => void executeJobSearch()}
                disabled={isSearching}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 ${ui.pillBtn}`}
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isSearching ? 'animate-spin' : ''}`} />
                {isSearching ? 'Varrendo...' : 'Nova varredura'}
              </button>

              <span
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium ${ui.emeraldBadge}`}
                title="Cota diária restante de busca de vagas"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Agente ativo · {remainingDailyQuota}/{quota.dailyLimit} vagas
              </span>

              <button
                type="button"
                onClick={() => {
                  setLimitExceeded(false);
                  setPlansModalOpen(true);
                }}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${ui.primaryBtn}`}
              >
                <CreditCard className="h-3.5 w-3.5" />
                Planos
              </button>

              <button
                type="button"
                onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${ui.pillBtn}`}
                aria-label="Alternar modo claro e escuro"
              >
                {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                {isDark ? 'Modo claro' : 'Modo escuro'}
              </button>

              <button
                type="button"
                onClick={() => void handleLogout()}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${ui.dangerBtn}`}
              >
                <LogOut className="h-3.5 w-3.5" />
                Sair
              </button>
            </div>
          </div>

          {/* Métricas internas (Anexo 2) */}
          <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
            <div className={`rounded-xl border px-5 py-4 ${ui.metricCard}`}>
              <div className="text-2xl font-bold">{foundCount}</div>
              <div className={`mt-1 text-xs ${ui.subText}`}>Encontradas</div>
            </div>
            <div className={`rounded-xl border px-5 py-4 ${ui.metricCard}`}>
              <div className="text-2xl font-bold">{compatibleCount}</div>
              <div className={`mt-1 text-xs ${ui.subText}`}>Compatíveis</div>
            </div>
            <div className={`rounded-xl border px-5 py-4 ${ui.metricCard}`}>
              <div className="text-2xl font-bold">{applicationsCount}</div>
              <div className={`mt-1 text-xs ${ui.subText}`}>Candidaturas</div>
            </div>
          </div>

          {/* Abas de navegação do Dashboard */}
          <nav
            aria-label="Seções do painel"
            className={`mt-5 flex flex-wrap gap-2 border-t pt-4 ${ui.divider}`}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? isDark
                        ? 'bg-[#1e293b] text-white border border-[#2d3b52]'
                        : 'bg-slate-900 text-white border border-slate-900'
                      : `${ui.subText} hover:opacity-90`
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </header>

        {/* ==================== ABA 1: VAGAS ==================== */}
        {activeTab === 'vagas' && (
          <main className="flex flex-col gap-7">
            {/* Filtro de Preferências de Vagas (independente do currículo) */}
            <section className={`rounded-xl border p-5 ${ui.card}`}>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-base font-semibold">Preferências e filtro de vagas</h2>
                <span className={`text-xs ${ui.mutedText}`}>
                  Limite diário: {quota.usedToday} de {quota.dailyLimit} vagas procuradas hoje
                </span>
              </div>

              {searchError && (
                <div className={`mb-4 flex items-center gap-2 rounded-lg border p-3 text-xs ${ui.dangerBtn}`}>
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{searchError}</span>
                </div>
              )}

              <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="job-keywords" className={`text-xs font-medium ${ui.subText}`}>
                    Cargo ou palavras-chave desejadas
                  </label>
                  <input
                    id="job-keywords"
                    type="text"
                    placeholder="Ex.: Desenvolvedor Python, Estágio IA..."
                    value={filters.keywords}
                    onChange={(e) => setFilters({ ...filters, keywords: e.target.value })}
                    className={`rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${ui.input}`}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="job-modality" className={`text-xs font-medium ${ui.subText}`}>
                    Modalidade desejada (independente do currículo)
                  </label>
                  <select
                    id="job-modality"
                    value={filters.modality}
                    onChange={(e) =>
                      setFilters({ ...filters, modality: e.target.value as WorkModality })
                    }
                    className={`rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${ui.input}`}
                  >
                    <option value="todas">Todas (Remoto, Híbrida e Presencial)</option>
                    <option value="remoto">Remoto</option>
                    <option value="hibrido">Híbrida</option>
                    <option value="presencial">Presencial</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="job-seniority" className={`text-xs font-medium ${ui.subText}`}>
                    Nível da vaga
                  </label>
                  <select
                    id="job-seniority"
                    value={filters.seniority}
                    onChange={(e) =>
                      setFilters({ ...filters, seniority: e.target.value as SeniorityLevel })
                    }
                    className={`rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${ui.input}`}
                  >
                    <option value="todos">Todos os níveis</option>
                    <option value="estagio">Estágio</option>
                    <option value="junior">Júnior</option>
                    <option value="pleno">Pleno</option>
                    <option value="senior">Sênior</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="job-location" className={`text-xs font-medium ${ui.subText}`}>
                    Cidade / Estado (para híbrido ou presencial)
                  </label>
                  <input
                    id="job-location"
                    type="text"
                    placeholder="Ex.: Salvador - BA, São Paulo - SP..."
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    className={`rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${ui.input}`}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2 pt-1">
                  <label className={`inline-flex items-center gap-2 text-xs cursor-pointer ${ui.subText}`}>
                    <input
                      type="checkbox"
                      checked={filters.onlySaved}
                      onChange={(e) => setFilters({ ...filters, onlySaved: e.target.checked })}
                      className="rounded border-slate-600"
                    />
                    Exibir apenas vagas salvas
                  </label>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setLimitExceeded(false);
                        setPlansModalOpen(true);
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer ${ui.pillBtn}`}
                    >
                      Ampliar limite diário
                    </button>

                    <button
                      type="submit"
                      disabled={isSearching}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 ${ui.primaryBtn}`}
                    >
                      <Search className="h-3.5 w-3.5" />
                      {isSearching ? 'Buscando vagas...' : 'Procurar vagas com IA'}
                    </button>
                  </div>
                </div>
              </form>
            </section>

            {/* Oportunidades Recomendadas pela IA (Anexos 1 e 2) */}
            <section>
              <div className="mb-3.5 flex items-center justify-between">
                <h2 className="text-base font-semibold">Oportunidades recomendadas</h2>
                <span className={`text-xs ${ui.mutedText}`}>
                  {visibleJobs.length} vaga(s) exibida(s)
                </span>
              </div>

              {visibleJobs.length === 0 ? (
                <div className={`rounded-xl border p-6 text-sm ${ui.card} ${ui.subText}`}>
                  Nenhuma vaga selecionada pela IA encontrada para os critérios atuais. Utilize o
                  filtro acima ou clique em <strong>Nova varredura</strong> para buscar
                  oportunidades.
                </div>
              ) : (
                <div className="flex flex-col gap-3.5">
                  {visibleJobs.map((job) => {
                    const isExpanded = expandedJobId === job.id;
                    return (
                      <article key={job.id} className={`rounded-xl border p-5 ${ui.card}`}>
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                          <div>
                            <h3 className="text-base font-semibold">{job.title}</h3>
                            <p className={`mt-1 text-xs sm:text-sm ${ui.subText}`}>
                              {job.company} · {modalityLabel[job.modality]}
                              {job.location ? ` (${job.location})` : ''}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-semibold ${ui.emeraldBadge}`}
                            >
                              {job.matchPercentage}% aderência
                            </span>

                            <button
                              type="button"
                              onClick={() => void handleToggleSaveJob(job)}
                              disabled={savingJobId === job.id}
                              aria-pressed={job.isSaved}
                              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                                job.isSaved ? ui.primaryBtn : ui.pillBtn
                              }`}
                            >
                              {job.isSaved ? (
                                <>
                                  <BookmarkCheck className="h-3.5 w-3.5" />
                                  Salva
                                </>
                              ) : (
                                <>
                                  <Bookmark className="h-3.5 w-3.5" />
                                  Salvar
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="mt-2.5 flex items-center justify-between text-xs">
                          <span className={ui.mutedText}>Encontrada em {job.foundAt}</span>
                          {job.isNew && (
                            <span className="font-medium text-emerald-400">Nova oportunidade</span>
                          )}
                        </div>

                        <hr className={`my-3.5 border-t ${ui.divider}`} />

                        <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                          <span className={ui.subText}>{job.compatibilitySummary}</span>
                          <button
                            type="button"
                            onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                            className="font-medium hover:underline cursor-pointer shrink-0"
                          >
                            {isExpanded ? 'Ocultar requisitos' : 'Ver requisitos'}
                          </button>
                        </div>

                        {isExpanded && job.requirements.length > 0 && (
                          <ul
                            className={`mt-3 list-disc space-y-1 rounded-lg border p-3.5 pl-7 text-xs ${ui.metricCard} ${ui.subText}`}
                          >
                            {job.requirements.map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        )}

                        <div className="mt-4 flex items-center justify-between">
                          <a
                            href={job.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium hover:underline"
                          >
                            Link: visualizar oportunidade
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Histórico de Candidaturas (Anexos 1 e 2) */}
            <section>
              <h2 className="mb-3.5 text-base font-semibold">Histórico de candidaturas</h2>

              <div className={`rounded-xl border p-5 ${ui.card}`}>
                {applications.length === 0 ? (
                  <p className={`text-sm ${ui.subText}`}>
                    Nenhuma candidatura registrada até o momento.
                  </p>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr className={`border-b text-left text-xs ${ui.divider} ${ui.subText}`}>
                            <th className="py-2.5 font-medium">Empresa</th>
                            <th className="py-2.5 font-medium">Inscrição</th>
                            <th className="py-2.5 text-right font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {visibleApplications.map((app) => {
                            const isPositive =
                              app.status === 'Enviada' || app.status === 'Entrevista';
                            return (
                              <tr key={app.id} className={`border-b ${ui.divider}`}>
                                <td className="py-3.5 font-medium">
                                  {app.company}
                                  {app.roleTitle ? (
                                    <span className={`ml-2 text-xs font-normal ${ui.subText}`}>
                                      · {app.roleTitle}
                                    </span>
                                  ) : null}
                                </td>
                                <td className={`py-3.5 text-xs sm:text-sm ${ui.subText}`}>
                                  {app.appliedAt}
                                </td>
                                <td className="py-3.5 text-right">
                                  <span
                                    className={`inline-block rounded-full border px-3 py-0.5 text-xs font-medium ${
                                      isPositive ? ui.emeraldBadge : ui.amberBadge
                                    }`}
                                  >
                                    {app.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {applications.length > 5 && (
                      <div className="mt-4 flex justify-center">
                        <button
                          type="button"
                          onClick={() => setShowAllApplications((prev) => !prev)}
                          aria-label={
                            showAllApplications ? 'Recolher histórico' : 'Expandir histórico'
                          }
                          className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors cursor-pointer ${ui.pillBtn}`}
                        >
                          {showAllApplications ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </section>
          </main>
        )}

        {/* ==================== ABA 2: USUÁRIO (SEM FOTO DE PERFIL) ==================== */}
        {activeTab === 'usuario' && (
          <main className={`rounded-xl border p-5 sm:p-6 ${ui.card}`}>
            <div className="mb-5">
              <h2 className="text-base font-semibold">Informações do Usuário</h2>
              <p className={`mt-1 text-xs sm:text-sm ${ui.subText}`}>
                Dados cadastrais da sua conta. O e-mail permanece bloqueado nesta aba por segurança.
              </p>
            </div>

            {profileFeedback && (
              <div
                className={`mb-4 flex items-center gap-2 rounded-lg border p-3 text-xs ${
                  profileFeedback.type === 'success' ? ui.emeraldBadge : ui.dangerBtn
                }`}
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{profileFeedback.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="user-first-name" className={`text-xs font-medium ${ui.subText}`}>
                  Nome
                </label>
                <input
                  id="user-first-name"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`rounded-lg border px-3 py-2 text-sm outline-none ${ui.input}`}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="user-last-name" className={`text-xs font-medium ${ui.subText}`}>
                  Sobrenome
                </label>
                <input
                  id="user-last-name"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={`rounded-lg border px-3 py-2 text-sm outline-none ${ui.input}`}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="user-age" className={`text-xs font-medium ${ui.subText}`}>
                  Idade
                </label>
                <input
                  id="user-age"
                  type="number"
                  min={14}
                  max={120}
                  required
                  value={age}
                  onChange={(e) =>
                    setAge(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  className={`rounded-lg border px-3 py-2 text-sm outline-none ${ui.input}`}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="user-gender" className={`text-xs font-medium ${ui.subText}`}>
                  Sexo
                </label>
                <select
                  id="user-gender"
                  required
                  value={gender}
                  onChange={(e) => setGender(e.target.value as UserProfile['gender'])}
                  className={`rounded-lg border px-3 py-2 text-sm outline-none ${ui.input}`}
                >
                  <option value="">Selecione</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="outro">Outro</option>
                  <option value="prefiro_nao_informar">Prefiro não informar</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label
                  htmlFor="user-locked-email"
                  className={`inline-flex items-center gap-1.5 text-xs font-medium ${ui.subText}`}
                >
                  <Lock className="h-3.5 w-3.5" />
                  E-mail (bloqueado para alteração nesta aba)
                </label>
                <input
                  id="user-locked-email"
                  type="email"
                  value={profile.email}
                  disabled
                  readOnly
                  className={`rounded-lg border px-3 py-2 text-sm opacity-65 cursor-not-allowed ${ui.input}`}
                />
                <p className={`text-xs ${ui.mutedText}`}>
                  Para alterar o seu endereço de e-mail, utilize a aba{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('configuracoes')}
                    className="text-blue-500 underline cursor-pointer"
                  >
                    Configurações
                  </button>
                  .
                </p>
              </div>

              <div className="flex justify-end sm:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className={`rounded-lg border px-4 py-2 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 ${ui.primaryBtn}`}
                >
                  {savingProfile ? 'Salvando...' : 'Salvar informações'}
                </button>
              </div>
            </form>
          </main>
        )}

        {/* ==================== ABA 3: CURRÍCULO ==================== */}
        {activeTab === 'curriculo' && (
          <main className={`rounded-xl border p-5 sm:p-6 ${ui.card}`}>
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-base font-semibold">Currículo</h2>
                <p className={`mt-1 text-xs sm:text-sm ${ui.subText}`}>
                  Envie seu currículo em PDF ou DOCX e preencha os campos manualmente ou com IA.
                </p>
              </div>

              <button
                type="button"
                onClick={() => void handleExtractResumeAI()}
                disabled={extractingResume || (!selectedResumeFile && !resume.fileName)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 ${ui.primaryBtn}`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {extractingResume ? 'Preenchendo com IA...' : 'Preencher campos com IA'}
              </button>
            </div>

            {resumeFeedback && (
              <div
                className={`mb-4 flex items-center gap-2 rounded-lg border p-3 text-xs ${
                  resumeFeedback.type === 'success' ? ui.emeraldBadge : ui.dangerBtn
                }`}
              >
                <span>{resumeFeedback.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveResume} className="flex flex-col gap-4">
              {/* Upload PDF ou DOCX */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="resume-doc-input"
                  className={`inline-flex items-center gap-1.5 text-xs font-medium ${ui.subText}`}
                >
                  <Upload className="h-3.5 w-3.5" />
                  Arquivo do currículo (somente PDF ou DOCX)
                </label>
                <input
                  id="resume-doc-input"
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e) => void handleResumeFileChange(e)}
                  className={`rounded-lg border px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-1 file:text-xs file:font-medium file:text-white hover:file:bg-blue-500 ${ui.input}`}
                />
                {resume.fileName && (
                  <span className={`text-xs ${ui.mutedText}`}>
                    Documento anexado: <strong>{resume.fileName}</strong>
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="resume-about" className={`text-xs font-medium ${ui.subText}`}>
                  Sobre
                </label>
                <textarea
                  id="resume-about"
                  rows={3}
                  placeholder="Resumo profissional e objetivos..."
                  value={resume.about}
                  onChange={(e) => setResume({ ...resume, about: e.target.value })}
                  className={`rounded-lg border px-3 py-2 text-sm outline-none ${ui.input}`}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="resume-experiences" className={`text-xs font-medium ${ui.subText}`}>
                  Experiências
                </label>
                <textarea
                  id="resume-experiences"
                  rows={4}
                  placeholder="Histórico profissional, cargos, empresas e responsabilidades..."
                  value={resume.experiences}
                  onChange={(e) => setResume({ ...resume, experiences: e.target.value })}
                  className={`rounded-lg border px-3 py-2 text-sm outline-none ${ui.input}`}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="resume-projects" className={`text-xs font-medium ${ui.subText}`}>
                  Projetos pessoais
                </label>
                <textarea
                  id="resume-projects"
                  rows={3}
                  placeholder="Projetos desenvolvidos, tecnologias utilizadas e resultados..."
                  value={resume.personalProjects}
                  onChange={(e) => setResume({ ...resume, personalProjects: e.target.value })}
                  className={`rounded-lg border px-3 py-2 text-sm outline-none ${ui.input}`}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="resume-skills" className={`text-xs font-medium ${ui.subText}`}>
                  Habilidades
                </label>
                <textarea
                  id="resume-skills"
                  rows={3}
                  placeholder="Linguagens, frameworks, ferramentas e competências..."
                  value={resume.skills}
                  onChange={(e) => setResume({ ...resume, skills: e.target.value })}
                  className={`rounded-lg border px-3 py-2 text-sm outline-none ${ui.input}`}
                />
              </div>

              {/* Idiomas e seu nível */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${ui.subText}`}>
                    Idiomas e seu nível
                  </span>
                  <button
                    type="button"
                    onClick={handleAddLanguage}
                    className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium cursor-pointer ${ui.pillBtn}`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Adicionar idioma
                  </button>
                </div>

                {resume.languages.length === 0 ? (
                  <p className={`text-xs ${ui.mutedText}`}>Nenhum idioma adicionado.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {resume.languages.map((item) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_200px_auto]"
                      >
                        <input
                          type="text"
                          placeholder="Ex.: Inglês, Espanhol..."
                          value={item.language}
                          onChange={(e) =>
                            handleUpdateLanguage(item.id, 'language', e.target.value)
                          }
                          className={`rounded-lg border px-3 py-2 text-sm outline-none ${ui.input}`}
                        />
                        <select
                          value={item.level}
                          onChange={(e) =>
                            handleUpdateLanguage(
                              item.id,
                              'level',
                              e.target.value as LanguageProficiency
                            )
                          }
                          className={`rounded-lg border px-3 py-2 text-sm outline-none ${ui.input}`}
                        >
                          <option value="basico">Básico</option>
                          <option value="intermediario">Intermediário</option>
                          <option value="avancado">Avançado</option>
                          <option value="fluente_nativo">Fluente / Nativo</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleRemoveLanguage(item.id)}
                          aria-label="Remover idioma"
                          className={`inline-flex items-center justify-center rounded-lg border px-3 py-2 text-xs font-medium cursor-pointer ${ui.dangerBtn}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="resume-education" className={`text-xs font-medium ${ui.subText}`}>
                  Formações (faculdades, cursos e certificados)
                </label>
                <textarea
                  id="resume-education"
                  rows={3}
                  placeholder="Graduação, cursos complementares, certificações e instituições..."
                  value={resume.education}
                  onChange={(e) => setResume({ ...resume, education: e.target.value })}
                  className={`rounded-lg border px-3 py-2 text-sm outline-none ${ui.input}`}
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={savingResume}
                  className={`rounded-lg border px-4 py-2 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 ${ui.primaryBtn}`}
                >
                  {savingResume ? 'Salvando currículo...' : 'Salvar currículo'}
                </button>
              </div>
            </form>
          </main>
        )}

        {/* ==================== ABA 4: CONFIGURAÇÕES ==================== */}
        {activeTab === 'configuracoes' && (
          <main className="flex flex-col gap-5">
            {/* Alterar E-mail */}
            <section className={`rounded-xl border p-5 sm:p-6 ${ui.card}`}>
              <h2 className="mb-4 text-base font-semibold">Alterar E-mail</h2>

              {emailFeedback && (
                <div
                  className={`mb-4 rounded-lg border p-3 text-xs ${
                    emailFeedback.type === 'success' ? ui.emeraldBadge : ui.dangerBtn
                  }`}
                >
                  {emailFeedback.text}
                </div>
              )}

              <form onSubmit={handleChangeEmail} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="cfg-new-email" className={`text-xs font-medium ${ui.subText}`}>
                    Novo e-mail
                  </label>
                  <input
                    id="cfg-new-email"
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className={`rounded-lg border px-3 py-2 text-sm outline-none ${ui.input}`}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="cfg-email-pass" className={`text-xs font-medium ${ui.subText}`}>
                    Senha atual para confirmação
                  </label>
                  <input
                    id="cfg-email-pass"
                    type="password"
                    required
                    value={emailPassword}
                    onChange={(e) => setEmailPassword(e.target.value)}
                    className={`rounded-lg border px-3 py-2 text-sm outline-none ${ui.input}`}
                  />
                </div>

                <div className="flex justify-end sm:col-span-2">
                  <button
                    type="submit"
                    disabled={savingEmail}
                    className={`rounded-lg border px-4 py-2 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 ${ui.primaryBtn}`}
                  >
                    {savingEmail ? 'Atualizando...' : 'Atualizar e-mail'}
                  </button>
                </div>
              </form>
            </section>

            {/* Alterar Senha */}
            <section className={`rounded-xl border p-5 sm:p-6 ${ui.card}`}>
              <h2 className="mb-4 text-base font-semibold">Alterar Senha</h2>

              {passwordFeedback && (
                <div
                  className={`mb-4 rounded-lg border p-3 text-xs ${
                    passwordFeedback.type === 'success' ? ui.emeraldBadge : ui.dangerBtn
                  }`}
                >
                  {passwordFeedback.text}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="cfg-curr-pass" className={`text-xs font-medium ${ui.subText}`}>
                    Senha atual
                  </label>
                  <input
                    id="cfg-curr-pass"
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={`rounded-lg border px-3 py-2 text-sm outline-none ${ui.input}`}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="cfg-new-pass" className={`text-xs font-medium ${ui.subText}`}>
                    Nova senha
                  </label>
                  <input
                    id="cfg-new-pass"
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`rounded-lg border px-3 py-2 text-sm outline-none ${ui.input}`}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="cfg-conf-pass" className={`text-xs font-medium ${ui.subText}`}>
                    Confirmar nova senha
                  </label>
                  <input
                    id="cfg-conf-pass"
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`rounded-lg border px-3 py-2 text-sm outline-none ${ui.input}`}
                  />
                </div>

                <div className="flex justify-end sm:col-span-2">
                  <button
                    type="submit"
                    disabled={savingPassword}
                    className={`rounded-lg border px-4 py-2 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 ${ui.primaryBtn}`}
                  >
                    {savingPassword ? 'Alterando...' : 'Alterar senha'}
                  </button>
                </div>
              </form>
            </section>

            {/* Logout e Exclusão da Conta */}
            <section className={`rounded-xl border p-5 sm:p-6 ${ui.card}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold">Sessão e Exclusão de Conta</h2>
                  <p className={`mt-1 text-xs ${ui.subText}`}>
                    Encerre sua sessão atual ou exclua sua conta permanentemente.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer ${ui.dangerBtn}`}
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Fazer logout
                </button>
              </div>

              <hr className={`my-4 border-t ${ui.divider}`} />

              {deleteFeedback && (
                <div className={`mb-4 rounded-lg border p-3 text-xs ${ui.dangerBtn}`}>
                  {deleteFeedback}
                </div>
              )}

              <form onSubmit={handleDeleteAccount} className="flex flex-col gap-3">
                <label htmlFor="cfg-delete-confirm" className={`text-xs font-medium ${ui.subText}`}>
                  Para excluir permanentemente sua conta e todos os seus dados, digite{' '}
                  <strong>EXCLUIR</strong>:
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    id="cfg-delete-confirm"
                    type="text"
                    placeholder="EXCLUIR"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm outline-none ${ui.input}`}
                  />
                  <button
                    type="submit"
                    disabled={deletingAccount}
                    className={`rounded-lg border px-4 py-2 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 ${ui.dangerBtn}`}
                  >
                    {deletingAccount ? 'Excluindo...' : 'Excluir conta'}
                  </button>
                </div>
              </form>
            </section>
          </main>
        )}
      </div>

      {/* ==================== MODAL DE PLANOS E PACOTES DE VAGAS ==================== */}
      {plansModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="plans-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
        >
          <div className={`w-full max-w-2xl rounded-2xl border p-6 shadow-2xl ${ui.heroCard}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="plans-modal-title" className="text-base font-semibold">
                  Planos e Ampliação de Limite Diário
                </h2>
                <p className={`mt-1 text-xs ${ui.subText}`}>
                  Consumo atual: {quota.usedToday} de {quota.dailyLimit} vagas procuradas hoje.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPlansModalOpen(false)}
                aria-label="Fechar modal de planos"
                className={`rounded-lg border p-1.5 cursor-pointer ${ui.pillBtn}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {limitExceeded && (
              <div className={`mt-4 flex items-center gap-2 rounded-lg border p-3 text-xs ${ui.amberBadge}`}>
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>
                  Você atingiu o limite diário de {quota.dailyLimit} vagas. Para continuar
                  procurando vagas hoje, escolha um dos pacotes pagos abaixo.
                </span>
              </div>
            )}

            {planError && (
              <div className={`mt-4 rounded-lg border p-3 text-xs ${ui.dangerBtn}`}>
                {planError}
              </div>
            )}

            <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
              {QUOTA_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`flex flex-col justify-between gap-4 rounded-xl border p-4 ${ui.card}`}
                >
                  <div>
                    <div className="text-xl font-bold">{pkg.formattedPrice}</div>
                    <div className="mt-1 text-sm font-semibold text-blue-500">{pkg.label}</div>
                    <p className={`mt-2 text-xs ${ui.subText}`}>
                      Libera imediatamente +{pkg.extraJobs} buscas de vagas no seu limite diário.
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={purchasingPkgId !== null}
                    onClick={() => void handlePurchasePackage(pkg)}
                    className={`w-full rounded-lg border px-3 py-2 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 ${ui.primaryBtn}`}
                  >
                    {purchasingPkgId === pkg.id ? 'Processando...' : 'Adquirir pacote'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;