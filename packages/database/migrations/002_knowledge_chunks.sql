-- ============================================================
-- KAIZEN KNOWLEDGE ENGINE — SQL Migration v2
-- ============================================================
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- 1. Tabla de chunks de conocimiento con embeddings
CREATE TABLE IF NOT EXISTS knowledge_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    document_id UUID,
    content TEXT NOT NULL,
    embedding VECTOR(768),
    metadata JSONB DEFAULT '{}',
    domain TEXT,
    confidence FLOAT DEFAULT 0.0,
    token_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Índice vectorial para búsqueda semántica
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_embedding 
    ON knowledge_chunks 
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);

-- 3. Índice para búsqueda por dominio
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_domain 
    ON knowledge_chunks(domain);

-- 4. Índice para búsqueda por organización
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_org 
    ON knowledge_chunks(organization_id);

-- 5. Full-Text Search en español
ALTER TABLE knowledge_chunks ADD COLUMN IF NOT EXISTS fts tsvector
    GENERATED ALWAYS AS (to_tsvector('spanish', coalesce(content, ''))) STORED;

CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_fts 
    ON knowledge_chunks USING gin(fts);

-- 6. Función de búsqueda híbrida (vectorial + texto completo)
CREATE OR REPLACE FUNCTION search_knowledge(
    query_embedding VECTOR(768),
    query_text TEXT DEFAULT NULL,
    match_threshold FLOAT DEFAULT 0.6,
    match_count INT DEFAULT 10,
    org_id UUID DEFAULT NULL,
    filter_domain TEXT DEFAULT NULL
)
RETURNS TABLE(
    id UUID,
    content TEXT,
    metadata JSONB,
    similarity FLOAT,
    domain TEXT,
    confidence FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        kc.id,
        kc.content,
        kc.metadata,
        1 - (kc.embedding <=> query_embedding) AS similarity,
        kc.domain,
        kc.confidence
    FROM knowledge_chunks kc
    WHERE 
        (org_id IS NULL OR kc.organization_id = org_id)
        AND (filter_domain IS NULL OR kc.domain = filter_domain)
        AND (1 - (kc.embedding <=> query_embedding) > match_threshold)
        AND (
            query_text IS NULL 
            OR query_text = ''
            OR kc.fts @@ plainto_tsquery('spanish', query_text)
            OR kc.content ILIKE '%' || query_text || '%'
        )
    ORDER BY similarity DESC
    LIMIT match_count;
END;
$$;

-- 7. Función de búsqueda solo full-text (para híbrido)
CREATE OR REPLACE FUNCTION search_knowledge_text(
    query_text TEXT,
    match_count INT DEFAULT 5,
    org_id UUID DEFAULT NULL,
    filter_domain TEXT DEFAULT NULL
)
RETURNS TABLE(
    id UUID,
    content TEXT,
    metadata JSONB,
    rank FLOAT,
    domain TEXT,
    confidence FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        kc.id,
        kc.content,
        kc.metadata,
        ts_rank(kc.fts, plainto_tsquery('spanish', query_text)) AS rank,
        kc.domain,
        kc.confidence
    FROM knowledge_chunks kc
    WHERE 
        (org_id IS NULL OR kc.organization_id = org_id)
        AND (filter_domain IS NULL OR kc.domain = filter_domain)
        AND kc.fts @@ plainto_tsquery('spanish', query_text)
    ORDER BY rank DESC
    LIMIT match_count;
END;
$$;

-- 8. RLS para knowledge_chunks
ALTER TABLE knowledge_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own org chunks"
    ON knowledge_chunks FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id FROM profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can insert chunks"
    ON knowledge_chunks FOR INSERT
    WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM profiles WHERE id = auth.uid()
        )
    );
