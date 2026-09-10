import React, { useState } from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface MegaMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SubItem {
    id: string;
    title: string;
    items?: string[];
}

interface CategoryItem {
    id: string;
    title: string;
    isFeatured?: boolean;
    hasDividerAfter?: boolean;
    subcategories: SubItem[];
}

const MEGA_MENU_DATA: CategoryItem[] = [
    {
        id: 'new-featured',
        title: 'Learn AI with NexusEd',
        isFeatured: true,
        hasDividerAfter: true,
        subcategories: [
            {
                id: 'gen-ai-tracks',
                title: 'Generative AI Career Tracks',
                items: [
                    'Production AI Engineering: Autonomous Agents & RAG',
                    'OpenAI API & Function Calling Masterclass',
                    'Prompt Engineering & Structured JSON Outputs',
                    'Vector Databases & Embeddings (Pinecone, Qdrant)',
                    'Fine-Tuning LLMs with LoRA & Unsloth',
                ],
            },
            {
                id: 'ai-tools',
                title: 'Industry AI Frameworks',
                items: [
                    'LangChain & LangGraph in Production',
                    'LlamaIndex for Enterprise Search',
                    'Local LLM Deployment with Ollama & vLLM',
                    'AI Guardrails & Security Auditing',
                ],
            },
        ],
    },
    {
        id: 'explore-by-goal',
        title: 'Explore by Goal',
        hasDividerAfter: true,
        subcategories: [
            {
                id: 'goal-cert',
                title: 'Prepare for a Certification',
                items: [
                    'AWS Certified Solutions Architect Associate',
                    'CKA: Certified Kubernetes Administrator',
                    'CompTIA Security+ (SY0-701)',
                    'HashiCorp Certified: Terraform Associate',
                    'Cisco CCNA (200-301)',
                    'Google Cloud Associate Cloud Engineer',
                ],
            },
            {
                id: 'goal-career',
                title: 'Launch a New Career Track',
                items: [
                    'Junior to Senior Backend Architect in Go',
                    'Cloud Platform & Site Reliability Engineer',
                    'AI Software Engineer Roadmap',
                    'Cybersecurity Defense & Incident Response',
                ],
            },
            {
                id: 'goal-enterprise',
                title: 'Corporate Team Upskilling',
                items: [
                    'Enterprise Microservices Transition',
                    'Zero-Trust Architecture & mTLS (Envoy)',
                    'High-Throughput Kafka & Distributed Systems',
                ],
            },
        ],
    },
    {
        id: 'development',
        title: 'Development & Engineering',
        subcategories: [
            {
                id: 'dev-backend',
                title: 'Backend & Systems Programming',
                items: [
                    'High-Throughput Distributed Systems in Go',
                    'Rust for Systems & Network Programming',
                    'Advanced Laravel 13 & High-Concurrency PHP',
                    'Modern Node.js & TypeScript Architectures',
                    'gRPC & Protocol Buffers in Distributed Systems',
                ],
            },
            {
                id: 'dev-databases',
                title: 'Database Architecture & Cache',
                items: [
                    'PostgreSQL Internals, Indexing & Query Tuning',
                    'Distributed SQL & CockroachDB',
                    'Redis Streams, Caching Patterns & Lua Scripting',
                    'Event Sourcing & CQRS Systems',
                ],
            },
        ],
    },
    {
        id: 'cloud-devops',
        title: 'Cloud & DevOps Infrastructure',
        subcategories: [
            {
                id: 'cloud-k8s',
                title: 'Containers & Orchestration',
                items: [
                    'Cloud-Native Microservices with Kubernetes & Envoy',
                    'Docker Deep Dive for Production Workloads',
                    'Helm Charts, ArgoCD & GitOps Workflows',
                    'Service Mesh with Istio & Cilium eBPF',
                ],
            },
            {
                id: 'cloud-iac',
                title: 'Infrastructure as Code & CI/CD',
                items: [
                    'Terraform Enterprise & Terragrunt Modular Design',
                    'Ansible for Automated Configuration Management',
                    'GitHub Actions & Secure CI/CD Pipelines',
                    'Cloud Cost Optimization & FinOps',
                ],
            },
        ],
    },
    {
        id: 'cybersecurity',
        title: 'Cybersecurity & Zero-Trust',
        subcategories: [
            {
                id: 'sec-foundations',
                title: 'Security Engineering',
                items: [
                    'HMAC Webhook & API Cryptographic Security',
                    'Zero-Trust Architecture & Identity Management',
                    'Application Security Testing (DAST / SAST)',
                    'Penetration Testing & Red Team Operations',
                ],
            },
            {
                id: 'sec-certs',
                title: 'Industry Certifications',
                items: [
                    'CompTIA Security+ Exam Prep',
                    'Certified Ethical Hacker (CEH) Practicals',
                    'CISSP Domain Mastery',
                ],
            },
        ],
    },
    {
        id: 'business-corporate',
        title: 'B2B & Business Management',
        subcategories: [
            {
                id: 'biz-leadership',
                title: 'Engineering Leadership',
                items: [
                    'VP of Engineering & CTO Handbook',
                    'Agile & Shape Up Product Execution',
                    'European B2B Invoicing Standards (Peppol / UBL)',
                    'Software Licensing & SaaS Financial Modeling',
                ],
            },
        ],
    },
];

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
    const [activeCategoryId, setActiveCategoryId] = useState<string>(MEGA_MENU_DATA[0].id);
    const [activeSubcategoryId, setActiveSubcategoryId] = useState<string>(
        MEGA_MENU_DATA[0].subcategories[0]?.id || ''
    );

    if (!isOpen) return null;

    const activeCategory = MEGA_MENU_DATA.find((c) => c.id === activeCategoryId) || MEGA_MENU_DATA[0];
    const activeSubcategory =
        activeCategory.subcategories.find((s) => s.id === activeSubcategoryId) ||
        activeCategory.subcategories[0];

    const handleCategoryHover = (cat: CategoryItem) => {
        setActiveCategoryId(cat.id);
        if (cat.subcategories.length > 0) {
            setActiveSubcategoryId(cat.subcategories[0].id);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]"
            onClick={onClose}
        >
            <div
                className="absolute top-16 left-0 sm:left-24 lg:left-44 w-[95vw] max-w-5xl bg-white rounded-b-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col md:flex-row text-slate-900 text-sm max-h-[80vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Column 1: Main Categories */}
                <div className="w-full md:w-72 bg-white border-r border-slate-100 overflow-y-auto py-2 shrink-0">
                    <div className="px-4 py-1.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        Categories
                    </div>
                    {MEGA_MENU_DATA.map((cat) => {
                        const isSelected = cat.id === activeCategoryId;
                        return (
                            <React.Fragment key={cat.id}>
                                <button
                                    type="button"
                                    onMouseEnter={() => handleCategoryHover(cat)}
                                    onClick={() => handleCategoryHover(cat)}
                                    className={`w-full text-left px-4 py-2.5 flex items-center justify-between transition-colors ${
                                        isSelected
                                            ? 'bg-slate-100 text-slate-950 font-semibold'
                                            : 'text-slate-700 hover:bg-slate-50'
                                    }`}
                                >
                                    <span className="flex items-center gap-2 truncate">
                                        {cat.isFeatured && (
                                            <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        )}
                                        <span className={cat.isFeatured ? 'text-emerald-700 font-semibold' : ''}>
                                            {cat.title}
                                        </span>
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                                </button>
                                {cat.hasDividerAfter && <hr className="my-1 border-slate-100" />}
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* Column 2: Subcategories / Issuers */}
                <div className="w-full md:w-80 bg-slate-50/50 border-r border-slate-100 overflow-y-auto py-2 shrink-0">
                    <div className="px-4 py-1.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        Tracks & Issuers
                    </div>
                    {activeCategory.subcategories.map((sub) => {
                        const isSelected = sub.id === activeSubcategory?.id;
                        return (
                            <button
                                key={sub.id}
                                type="button"
                                onMouseEnter={() => setActiveSubcategoryId(sub.id)}
                                onClick={() => setActiveSubcategoryId(sub.id)}
                                className={`w-full text-left px-4 py-2.5 flex items-center justify-between transition-colors ${
                                    isSelected
                                        ? 'bg-white text-slate-950 font-semibold shadow-sm border-y border-slate-100'
                                        : 'text-slate-700 hover:bg-slate-100/60'
                                }`}
                            >
                                <span className="truncate pr-2">{sub.title}</span>
                                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                            </button>
                        );
                    })}
                </div>

                {/* Column 3: Topics / Specializations / Courses */}
                <div className="flex-1 bg-white overflow-y-auto p-4 md:p-6 space-y-4">
                    <div>
                        <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                            Popular Subjects & Certifications
                        </div>
                        <h3 className="text-base font-bold text-slate-950">
                            {activeSubcategory?.title || 'Featured Courses'}
                        </h3>
                    </div>

                    <div className="space-y-2">
                        {activeSubcategory?.items?.map((item, idx) => (
                            <Link
                                key={idx}
                                href={`/courses?search=${encodeURIComponent(item)}`}
                                onClick={onClose}
                                className="block p-2.5 rounded-lg text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/50 transition-colors text-xs sm:text-sm font-medium border border-transparent hover:border-emerald-100"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <Link
                            href="/courses"
                            onClick={onClose}
                            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                        >
                            Browse All 40+ Courses in Catalog →
                        </Link>
                        <button
                            onClick={onClose}
                            className="text-xs text-slate-600 hover:text-slate-800"
                        >
                            Close Menu [ESC]
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
