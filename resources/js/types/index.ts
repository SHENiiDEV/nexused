export interface User {
    id: number;
    name: string;
    email: string;
    role: 'student' | 'corporate' | 'admin';
    company_id?: number | null;
    avatar_url?: string | null;
    company?: Company;
}

export interface Company {
    id: number;
    name: string;
    vat_number?: string | null;
    billing_email: string;
    billing_address?: string | null;
    country_code: string;
    max_seats: number;
    used_seats: number;
}

export interface QuizOption {
    id: number;
    quiz_id: number;
    option_text: string;
    is_correct?: boolean;
    order: number;
}

export interface Quiz {
    id: number;
    lesson_id: number;
    question_text: string;
    explanation?: string | null;
    order: number;
    options: QuizOption[];
}

export interface Lesson {
    id: number;
    module_id: number;
    title: string;
    slug: string;
    content: string;
    type: 'text' | 'video' | 'interactive';
    order: number;
    duration_minutes: number;
    quizzes: Quiz[];
}

export interface Module {
    id: number;
    course_id: number;
    title: string;
    description?: string | null;
    order: number;
    lessons: Lesson[];
}

export interface Course {
    id: number;
    creator_id: number;
    title: string;
    slug: string;
    description: string;
    price: string | number;
    status: 'draft' | 'generating' | 'published';
    generation_step?: string | null;
    generation_progress: number;
    topic?: string | null;
    target_audience?: string | null;
    estimated_hours: number;
    thumbnail_url?: string | null;
    modules_count?: number;
    lessons_count?: number;
    modules?: Module[];
    creator?: {
        id: number;
        name: string;
    };
}

export interface Enrollment {
    id: number;
    user_id: number;
    course_id: number;
    company_id?: number | null;
    certificate_code?: string | null;
    completed_at?: string | null;
    created_at: string;
    course?: Course;
    user?: User;
}

export interface Transaction {
    id: number;
    user_id: number;
    course_id?: number | null;
    company_id?: number | null;
    amount: string | number;
    currency: string;
    payment_gateway: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    transaction_ref: string;
    signature?: string | null;
    metadata?: Record<string, any> | null;
    created_at: string;
    user?: User;
    course?: Course;
    company?: Company;
}

export interface Invoice {
    id: number;
    company_id?: number | null;
    user_id: number;
    transaction_id?: number | null;
    invoice_number: string;
    amount: string | number;
    tax_amount: string | number;
    currency: string;
    status: string;
    customer_name: string;
    customer_vat?: string | null;
    customer_address?: string | null;
    issued_at: string;
}

export interface AuditLog {
    id: number;
    user_id?: number | null;
    action: string;
    entity_type: string;
    entity_id?: number | null;
    payload?: Record<string, any> | null;
    ip_address?: string | null;
    created_at: string;
    user?: User;
}

export interface PageProps {
    auth: {
        user: User | null;
    };
    flash: {
        success?: string | null;
        error?: string | null;
    };
    appName: string;
    [key: string]: unknown;
}
