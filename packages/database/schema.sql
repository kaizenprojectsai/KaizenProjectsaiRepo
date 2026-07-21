-- ============================================================
-- KAIZEN PROJECT'S IA — Esquema Completo de Base de Datos
-- ============================================================
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. ORGANIZACIONES
-- ============================================================
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. PERFILES (extiende auth.users)
-- ============================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    organization_id UUID REFERENCES organizations(id),
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger: crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario'),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- 3. PROYECTOS
-- ============================================================
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    created_by UUID REFERENCES profiles(id) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed', 'submitted')),
    methodology TEXT,
    target_entity TEXT,
    country TEXT DEFAULT 'Colombia',
    metadata JSONB DEFAULT '{}',
    version INT DEFAULT 1,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. CONVERSACIONES (historial de chat)
-- ============================================================
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    tokens_used INT DEFAULT 0,
    embedding VECTOR(768),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. DOCUMENTOS
-- ============================================================
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('project_formulation', 'mgp', 'mga', 'pdf', 'docx', 'spreadsheet')),
    content TEXT,
    file_url TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'completed', 'error')),
    metadata JSONB DEFAULT '{}',
    version INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. BASE DE CONOCIMIENTO
-- ============================================================
CREATE TABLE knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    source TEXT,
    domain TEXT,
    confidence FLOAT DEFAULT 0.0,
    embedding VECTOR(768),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. AGENTES
-- ============================================================
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('strategic', 'financial', 'legal', 'commercial', 'research', 'calls', 'risks', 'orchestrator')),
    description TEXT,
    model TEXT DEFAULT 'gemini-1.5-flash',
    system_prompt TEXT,
    tools JSONB DEFAULT '[]',
    config JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 8. INDICADORES
-- ============================================================
CREATE TABLE indicators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    value NUMERIC,
    target NUMERIC,
    unit TEXT,
    formula TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 9. RIESGOS
-- ============================================================
CREATE TABLE risks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    probability TEXT CHECK (probability IN ('low', 'medium', 'high')),
    impact TEXT CHECK (impact IN ('low', 'medium', 'high')),
    mitigation TEXT,
    status TEXT DEFAULT 'identified' CHECK (status IN ('identified', 'mitigated', 'monitoring')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 10. CONVOCATORIAS
-- ============================================================
CREATE TABLE calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    entity TEXT NOT NULL,
    description TEXT,
    budget NUMERIC,
    deadline TIMESTAMPTZ,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closing_soon', 'closed')),
    requirements JSONB DEFAULT '[]',
    sectors JSONB DEFAULT '[]',
    regions JSONB DEFAULT '[]',
    url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX idx_projects_created_by ON projects(created_by);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_conversations_project ON conversations(project_id);
CREATE INDEX idx_documents_project ON documents(project_id);
CREATE INDEX idx_knowledge_base_domain ON knowledge_base(domain);
CREATE INDEX idx_calls_status ON calls(status);
CREATE INDEX idx_calls_deadline ON calls(deadline);

-- Índice vectorial para búsqueda semántica
CREATE INDEX idx_knowledge_base_embedding ON knowledge_base
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;

-- Políticas básicas
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (id = auth.uid());

CREATE POLICY "Users can view own projects"
    ON projects FOR SELECT
    USING (created_by = auth.uid());

CREATE POLICY "Users can insert own projects"
    ON projects FOR INSERT
    WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own projects"
    ON projects FOR UPDATE
    USING (created_by = auth.uid());

CREATE POLICY "Users can delete own projects"
    ON projects FOR DELETE
    USING (created_by = auth.uid());

CREATE POLICY "Users can view project conversations"
    ON conversations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = conversations.project_id
            AND projects.created_by = auth.uid()
        )
    );

CREATE POLICY "Users can insert conversations"
    ON conversations FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = conversations.project_id
            AND projects.created_by = auth.uid()
        )
    );

-- ============================================================
-- SEED DATA — Agentes predeterminados
-- ============================================================
INSERT INTO agents (name, role, description, system_prompt) VALUES
('Director Estratégico', 'strategic', 'Experto en estrategia y planificación de proyectos',
 'Eres un Director Estratégico experto en formulación de proyectos. Ayudas a definir la visión, misión, objetivos estratégicos y alcance del proyecto.'),
('Director Financiero', 'financial', 'Experto en presupuestos y viabilidad financiera',
 'Eres un Director Financiero. Ayudas a estructurar el presupuesto, flujo de caja, análisis de costos y viabilidad financiera del proyecto.'),
('Director Jurídico', 'legal', 'Experto en aspectos legales y regulatorios',
 'Eres un Director Jurídico. Ayudas a identificar requisitos legales, permisos, contratos y cumplimiento normativo del proyecto.'),
('Director Comercial', 'commercial', 'Experto en mercado y comercialización',
 'Eres un Director Comercial. Ayudas a analizar el mercado, competidores, estrategia de comercialización y modelo de negocio.'),
('Director Investigación', 'research', 'Experto en investigación e innovación',
 'Eres un Director de Investigación. Ayudas a estructurar el componente de innovación, I+D+i y propiedad intelectual del proyecto.'),
('Director Convocatorias', 'calls', 'Experto en identificación de convocatorias',
 'Eres un Director de Convocatorias. Ayudas a identificar las mejores convocatorias y fuentes de financiamiento para el proyecto.'),
('Director Riesgos', 'risks', 'Experto en gestión de riesgos',
 'Eres un Director de Riesgos. Ayudas a identificar, evaluar y mitigar los riesgos del proyecto.');
