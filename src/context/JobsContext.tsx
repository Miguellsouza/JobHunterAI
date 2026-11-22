import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  foundDate: string;
  matchPercentage: number;
  isNew: boolean;
  compatibilityNote?: string;
  hasExpandableRequirements: boolean;
  requirements: string[];
  summary: string;
  modalityDetails: string;
  compensation: string;
  activities: string[];
}

export interface ApplicationRecord {
  id: string;
  company: string;
  role: string;
  appliedDate: string;
  status: 'Enviada' | 'Pendente';
}

export interface NewOpportunityInput {
  title: string;
  company: string;
  location: string;
  matchPercentage: number;
  requirements: string[];
  summary: string;
}

interface JobsContextType {
  isAgentActive: boolean;
  toggleAgentStatus: () => boolean;
  foundCount: number;
  compatibleCount: number;
  applicationsCount: number;
  incrementScanStats: () => void;
  opportunities: Opportunity[];
  applications: ApplicationRecord[];
  hasAlreadyApplied: (companyName: string) => boolean;
  registerApplication: (opportunity: Opportunity) => boolean;
  addOpportunity: (input: NewOpportunityInput) => void;
  removeOpportunity: (id: string) => void;
}

const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-python-jr',
    title: 'Desenvolvedor Python Júnior',
    company: 'Empresa Exemplo',
    location: 'Remoto',
    foundDate: '22/11/2026',
    matchPercentage: 92,
    isNew: true,
    compatibilityNote: 'Compatibilidade técnica alta',
    hasExpandableRequirements: true,
    requirements: ['Python', 'APIs REST', 'SQL', 'Git'],
    summary:
      'Atuação no desenvolvimento e manutenção de serviços backend escaláveis, integração de APIs RESTful e otimização de consultas em bancos de dados relacionais.',
    modalityDetails: '100% Remoto · Horário flexível',
    compensation: 'R$ 4.200 – R$ 5.400 · CLT',
    activities: [
      'Desenvolver endpoints RESTful em Python com foco em baixa latência',
      'Escrever consultas SQL eficientes e manter migrações de banco de dados',
      'Colaborar em revisões de código e versionamento contínuo com Git',
    ],
  },
  {
    id: 'opp-ia-intern',
    title: 'Estágio em Inteligência Artificial',
    company: 'Outra Empresa',
    location: 'Remoto',
    foundDate: '22/11/2026',
    matchPercentage: 89,
    isNew: true,
    hasExpandableRequirements: false,
    requirements: ['Python', 'Processamento de Linguagem Natural', 'Análise de Dados', 'Git'],
    summary:
      'Apoio na construção de pipelines de avaliação de modelos de linguagem, estruturação de bases de conhecimento e automação de fluxos inteligentes.',
    modalityDetails: '100% Remoto · 30h semanais',
    compensation: 'Bolsa R$ 2.100 + Benefícios',
    activities: [
      'Auxiliar na engenharia de prompts e avaliação de respostas de LLMs',
      'Estruturar scripts de coleta e limpeza de dados em Python',
      'Documentar experimentos e métricas de acurácia com a equipe de P&D',
    ],
  },
];

const INITIAL_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'app-1',
    company: 'Empresa A',
    role: 'Engenheiro de Software Backend',
    appliedDate: '20/11/2026',
    status: 'Enviada',
  },
  {
    id: 'app-2',
    company: 'Empresa B',
    role: 'Desenvolvedor Full Stack Júnior',
    appliedDate: '21/11/2026',
    status: 'Pendente',
  },
];

const OPP_STORAGE_KEY = 'jobhunter_opportunities_v2';
const APP_STORAGE_KEY = 'jobhunter_applications_v2';

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export function JobsProvider({ children }: { children: ReactNode }) {
  const [isAgentActive, setIsAgentActive] = useState<boolean>(true);
  const [foundCount, setFoundCount] = useState<number>(48);
  const [compatibleCount, setCompatibleCount] = useState<number>(17);
  const [applicationsCount, setApplicationsCount] = useState<number>(8);

  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    try {
      const saved = localStorage.getItem(OPP_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as Opportunity[]) : INITIAL_OPPORTUNITIES;
    } catch {
      return INITIAL_OPPORTUNITIES;
    }
  });

  const [applications, setApplications] = useState<ApplicationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(APP_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as ApplicationRecord[]) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  });

  useEffect(() => {
    localStorage.setItem(OPP_STORAGE_KEY, JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(applications));
  }, [applications]);

  const toggleAgentStatus = (): boolean => {
    const next = !isAgentActive;
    setIsAgentActive(next);
    return next;
  };

  const incrementScanStats = () => {
    setFoundCount((prev) => prev + 1);
    setCompatibleCount((prev) => prev + 1);
  };

  const hasAlreadyApplied = (companyName: string): boolean => {
    return applications.some(
      (item) => item.company.toLowerCase() === companyName.toLowerCase()
    );
  };

  const registerApplication = (opportunity: Opportunity): boolean => {
    if (hasAlreadyApplied(opportunity.company)) return false;

    const today = new Date().toLocaleDateString('pt-BR');
    const newRecord: ApplicationRecord = {
      id: `app-${Date.now()}`,
      company: opportunity.company,
      role: opportunity.title,
      appliedDate: today,
      status: 'Enviada',
    };

    setApplications((prev) => [newRecord, ...prev]);
    setApplicationsCount((prev) => prev + 1);
    return true;
  };

  const addOpportunity = (input: NewOpportunityInput) => {
    const today = new Date().toLocaleDateString('pt-BR');
    const cleanReqs =
      input.requirements.length > 0 ? input.requirements : ['TypeScript', 'Git', 'APIs REST'];

    const newOpp: Opportunity = {
      id: `opp-${Date.now()}`,
      title: input.title,
      company: input.company,
      location: input.location,
      foundDate: today,
      matchPercentage: input.matchPercentage,
      isNew: true,
      compatibilityNote:
        input.matchPercentage >= 90
          ? 'Compatibilidade técnica alta'
          : 'Boa aderência ao perfil',
      hasExpandableRequirements: true,
      requirements: cleanReqs,
      summary:
        input.summary.trim() ||
        `Oportunidade para atuar como ${input.title} na ${input.company} em regime ${input.location.toLowerCase()}.`,
      modalityDetails: `${input.location} · Horário flexível`,
      compensation: 'A combinar · Benefícios',
      activities: [
        'Desenvolver e manter funcionalidades com foco em qualidade e eficiência',
        'Participar de revisões técnicas e alinhamentos com o time de engenharia',
        'Documentar entregas e integrar soluções via Git',
      ],
    };

    setOpportunities((prev) => [newOpp, ...prev]);
    setFoundCount((prev) => prev + 1);
    setCompatibleCount((prev) => prev + 1);
  };

  const removeOpportunity = (id: string) => {
    setOpportunities((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <JobsContext.Provider
      value={{
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
        addOpportunity,
        removeOpportunity,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error('useJobs deve ser utilizado dentro de um JobsProvider');
  }
  return context;
}
